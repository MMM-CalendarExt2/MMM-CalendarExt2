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
  				+ " (https://github.com/MichMich/MagicMirror/)"
  		}
  	}
  	if (this.config.auth) {
  		if(this.config.auth.method === "bearer"){
  			opts.auth = {
  				bearer: this.config.auth.pass
  			}
  		} else {
  			opts.auth = {
  				user: this.config.auth.user,
  				pass: this.config.auth.pass
  			}
  			if(this.config.auth.method === "digest"){
  				opts.auth.sendImmediately = 0
  			}else{
  				opts.auth.sendImmediately = 1
  			}
  		}
  	}


    request(calendar.url, opts, (e, r, data)=>{
      if (e) {
        cb(calendar, null, e)
      } else {
        cb(calendar, data, e)
        setTimeout(()=>{
          this.scanCalendar(calendar, cb)
        }, calendar.scanInterval)
      }
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
      ev.uid = (ri.uid)
        ? calendar.uid + ":" + ev.startDate + ":" + ev.endDate + ":" + ri.uid
        : calendar.uid + ":" + ev.startDate + ":" + ev.endDate + ":" + ev.title
      ev.calendarName = calendar.name
      eventPool.push(ev)
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
    if (events.length > 0) {
      this.sendSocketNotification("EVENTS_REFRESHED", events)
    }
  }
})
