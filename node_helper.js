const fs = require("fs")
const path = require("path")
const validUrl = require("valid-url")
const request = require("request")
const moment = require("moment-timezone")
const ICAL = require("ical.js")
const IcalExpander = require('ical-expander')

var NodeHelper = require('node_helper')

module.exports = NodeHelper.create({
  start: function() {
    this.config = {}
    this.calendars = {}
    this.calendarEvents = {}
  },

  stop: function() {
  },

  socketNotificationReceived: function (noti, payload) {
    switch(noti) {
      case "START":
        this.work(payload)
        break
    }
  },

  work: function(config) {
    this.config = config
    this.calendars = this.config.calendars
    if (this.config.locale) {
      moment.locale(this.config.locale)
    }
    this.startScanCalendars()
  },

  startScanCalendars: function() {
    for(i = 0; i < this.calendars.length; i++) {
      this.scanCalendar(
        this.calendars[i],
        (calendar, icalData=null, error=null)=>{
          this.parser(calendar, icalData, error)
        }
      )
    }
  },

  scanCalendar: function(calendar, cb) {
    console.log(`[CALEXT2] calendar:${calendar.name} >> Scanning start with interval:${calendar.scanInterval}`)

    var opts = null
    var nodeVersion = Number(process.version.match(/^v(\d+\.\d+)/)[1])
    opts = {
      "headers" : {
        "User-Agent":
          "Mozilla/5.0 (Node.js "
          + nodeVersion + ") MagicMirror/"
          + global.version
          + " (https://github.com/MichMich/MagicMirror/)",
      },
      "gzip": true
    }

    if (calendar.auth && Object.keys(calendar.auth).length > 0) {
      if(calendar.auth.method === "bearer"){
        opts.auth = {
          bearer: calendar.auth.pass
        }
      } else {
        opts.auth = {
          user: calendar.auth.user,
          pass: calendar.auth.pass
        }
        if(calendar.auth.method === "digest"){
          opts.auth.sendImmediately = 0
        }else{
          opts.auth.sendImmediately = 1
        }
      }
    }

    var url = calendar.url
    url = url.replace("webcal://", "http://")
    request(url, opts, (e, r, data)=>{
      if (e) {
        cb(calendar, null, e)
      } else {
        cb(calendar, data, e)
      }
      setTimeout(()=>{
        this.scanCalendar(calendar, cb)
      }, calendar.scanInterval)
    })
  },

  parser: function(calendar, iCalData=null, error=null) {
    if (error) {
      console.log(`[CALEXT2] calendar:${calendar.name} >> ${error.message}`)
      return
    }
    if (!iCalData) {
      console.log(`[CALEXT2] calendar:${calendar.name} >> No data to fetch`)
      return
    }
    var icalExpander
    try {
      icalExpander = new IcalExpander({ics:iCalData, maxIterations: calendar.maxIterations})
    } catch (e) {
      console.log(`[CALEXT2] calendar:${calendar.name} >> ${e.message}`)
      return
    }

    var events
    try {
      events = icalExpander.between(
        moment().subtract(calendar.beforeDays, "days").startOf('day').toDate(),
        moment().add(calendar.afterDays, "days").endOf('day').toDate()
      )
    } catch (e) {
      console.log(`[CALEXT2] calendar:${calendar.name} >> ${e.message}`)
      return
    }

    var wholeEvents = [].concat(events.events, events.occurrences)
    var eventPool = []
    for (i in wholeEvents) {
      var item = wholeEvents[i]

      var ri = (item.hasOwnProperty("item")) ? item.item : item
      var ev = {}
      ev.calendarId = calendar.uid
      ev.location = ri.location
      ev.description = ri.description
      ev.title = ri.summary
      ev.isRecurring = ri.isRecurring()
      ev.isCancelled = (item.hasOwnProperty("component") ? item.component.getFirstPropertyValue("status") != null 
          ? item.component.getFirstPropertyValue("status").toUpperCase() == "CANCELLED" : false : false);
      if (Array.isArray(calendar.replaceTitle) && calendar.replaceTitle.length > 0) {
        for (let j = 0; j < calendar.replaceTitle.length; j++) {
          var rt = calendar.replaceTitle[j]
          var re = (rt[0] instanceof RegExp) ? rt[0] : new RegExp(rt[0], "g")
          var rto = (rt[1]) ? rt[1] : ""
          ev.title = ev.title.replace(re, rto)
        }
      }

      var startDate, endDate
      if (calendar.forceLocalTZ) {
        var ts = item.startDate.toJSON()
        ts.month -= 1
        var te = item.endDate.toJSON()
        te.month -= 1
        startDate = moment(ts)
        endDate = moment(te)
      } else {
        startDate = moment(item.startDate.toJSDate())
        endDate = moment(item.endDate.toJSDate())
      }
      ev.startDate = startDate.format("X")
      ev.endDate = endDate.format("X")
      ev.startDateJ = startDate.toJSON()
      ev.endDateJ = endDate.toJSON()
      ev.duration = ri.duration.toSeconds()
      ev.isMoment = (ev.duration == 0) ? true : false
      ev.isPassed = (endDate.isBefore(moment())) ? true : false
      if (ev.duration <= 86400) {
        if (startDate.format("YYMMDD") == endDate.format("YYMMDD")) {
          ev.isOneday = true
        } else {
          if (endDate.format("HHmmss") == "000000") {
            ev.isOneday = true
          }
        }
      }
      ev.className = calendar.className
      ev.icon = calendar.icon
      var isFullday = (startDate.format('HHmmss') == "000000" && endDate.format('HHmmss') == "000000") ? true : false
      ev.isFullday = isFullday
      if (isFullday) {
      }

      // import the Microsoft property X-MICROSOFT-CDO-BUSYSTATUS, fall back to "BUSY" in case none was found
      // possible values are 'FREE'|'TENTATIVE'|'BUSY'|'OOF' acording to
      // https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcical/cd68eae7-ed65-4dd3-8ea7-ad585c76c736
      ev.ms_busystatus = ri.component.getFirstPropertyValue('x-microsoft-cdo-busystatus') || 'BUSY'

      ev.uid = (ri.uid)
        ? calendar.uid + ":" + ev.startDate + ":" + ev.endDate + ":" + ri.uid
        : calendar.uid + ":" + ev.startDate + ":" + ev.endDate + ":" + ev.title
      ev.calendarName = calendar.name
      if (calendar.filter) {
        var f = JSON.parse(calendar.filter).filter
        var filter = Function("return " + f.toString())
        var r = filter(ev)
        if (r(ev)) {
          eventPool.push(ev)
        } else {
          // do nothing
        }
      } else {
        eventPool.push(ev)
      }
    }
    eventPool.slice(calendar.maxItems)
    console.log(`[CALEXT2] calendar:${calendar.name} >> Scanned: ${wholeEvents.length}, Selected: ${eventPool.length}`)
    this.mergeEvents(eventPool, calendar.uid)
  },

  mergeEvents: function(eventPool, calendarId) {
    this.calendarEvents[calendarId] = eventPool
    var events = []
    for (i in Object.keys(this.calendarEvents)) {
      if (this.calendarEvents.hasOwnProperty(i)) {
        var cal = this.calendarEvents[i]
        events = events.concat(cal)
      }
    }

    // only run sorting and deduplication is the user actually wants it
    if(Array.isArray(this.config.deduplicateEventsOn) && this.config.deduplicateEventsOn.length > 0){

      // copied from https://stackoverflow.com/a/34853778
      var spaceship = (val1, val2) => {
        if ((val1 === null || val2 === null) || (typeof val1 != typeof val2)) {
          return null;
        }
        if (typeof val1 === 'string') {
          return (val1).localeCompare(val2)
        }
        else {
          if (val1 > val2) { return 1 }
          else if (val1 < val2) { return -1 }
          return 0
        }
      }

      var compare_them = (a,b) => {
        for (let property of this.config.deduplicateEventsOn) {
          var comparison_result = spaceship(
            a[property], b[property]
          )
          // if the comparison has found an order change
          // immediately return to not waste more cycles
          if( comparison_result !== null && comparison_result !== 0 ){
            return comparison_result
          }
        }
        // if the order hasn't been changed, these two events must be identical
        return 0
      }

      // first sort all events by the properties they should be deduplicated on
      events.sort(compare_them)

      // now do the actual deduplication
      events = events.filter((event,eventIndex) => {
        if( eventIndex === 0 ){
          return true
        }
        // use the comparison again, but now events where the immediate
        // predecessor is identical will be removed
        var old_event = events[eventIndex-1]
        if( compare_them(old_event, event) === 0 ){
          // as most typically the duplicate event comes from another calendar merge the two calendarNames
          if( ! old_event.hasOwnProperty('calendarNames') ){
            old_event.calendarNames = new Set([old_event.calendarName]);
          }
          old_event.calendarNames.add( event.calendarName );
          old_event.calendarName = [...old_event.calendarNames].sort().join('|');
          // now we can exclude this event
          return false
        }
        // finally keep all other events
        return true
      })
    }

    if (events.length > 0) {
      this.sendSocketNotification("EVENTS_REFRESHED", events)
    }
  }
})
