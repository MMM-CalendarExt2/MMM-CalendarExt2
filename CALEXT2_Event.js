class Event {
  constructor(data, slot) {
    this.data = data
    this.locale = slot.locale
    this.mStart = moment.unix(data.startDate).locale(this.locale)
    this.mEnd = moment.unix(data.endDate).locale(this.locale)
    this.sStart = moment(slot.start).locale(this.locale)
    this.sEnd = moment(slot.end).locale(this.locale)
    this.useEventTimeRelative = slot.useEventTimeRelative
    this.relativeFormat = slot.relativeFormat
    this.timeFormat = slot.timeFormat
    this.dateFormat = slot.dateFormat
    this.dateTimeFormat = slot.dateTimeFormat
    this.dom = this.makeEventDom()
  }

  destroy() {
    this.dom.remove()
    for (var property in this) {
      if (this.hasOwnProperty(property)) {
        this[property] = null
      }
    }
  }

  draw(slot, targetDom) {
    var useEventTimeRelative = slot.useEventTimeRelative
    var hideOverflow = slot.hideOverflow
    var eventDom = this.dom
    eventDom.style.opacity = 0
    targetDom.appendChild(eventDom)
    if (hideOverflow) {
      targetDom.classList.add("hideOverflow")
      targetDom.style.maxHeight = slot.maxHeight
      targetDom.style.height = slot.maxHeight
      var contentRect = targetDom.getBoundingClientRect()
      var eventRect = eventDom.getBoundingClientRect()
      if (eventRect.bottom > contentRect.bottom || eventRect.right > contentRect.right) {
        eventDom.classList.add("hiddenEvent")
        return 1
      }
    }
    eventDom.style.opacity = 1
    return 0
  }

  drawSleeve(slot, sleeve) {
    // to implement
  }

  makeEventDom() {
    var event = this.data
    var locale = this.locale
    var now = moment().locale(locale)

    var isEventMultiSlots = (event, mESX, mEEX, mSSX, mSEX) => {
      var isMulti = false
      if (event.duration > 86400) {
        isMulti = true
      } else {
        if (mESX.isBefore(mSSX) || mEEX.isAfter(mSEX)) {
          isMulti = true
        }
      }
      return isMulti
    }

    var eventDom = document.createElement("div")
    eventDom.classList.add("event")

    var isPassed = (moment.unix(event.endDate).isBefore(now)) ? true : false
    var isFullday = (event.isFullday) ? true : false
    var isMultiSlots = isEventMultiSlots(event, this.mStart, this.mEnd, this.sStart, this.sEnd)
    var isTargetDay = (this.mStart.isBefore(moment(now).endOf("day")) || this.mEnd.isAfter(moment(now).startOf("day"))) ? true : false
    var isNow = (now.isBetween(this.mStart, this.mEnd, null, "[)")) ? true : false
    if (isFullday) {
      eventDom.classList.add("fullday")
    } else {
      eventDom.classList.add("notfullday")
    }
    if (isMultiSlots) eventDom.classList.add("overslot")
    if (isTargetDay) eventDom.classList.add("targetday")
    if (isNow) eventDom.classList.add("now")
    if (isPassed) {
      eventDom.classList.add("passed")
    }
    if (event.isMoment) eventDom.classList.add("moment")
    if (event.isOneday) {
      eventDom.classList.add("oneday")
    } else {
      eventDom.classList.add("overday")
    }
    if (event.isRecurring) {
      eventDom.classList.add("recurred")
    }
    if (event.startHere) eventDom.classList.add("starthere")
    if (event.endHere) eventDom.classList.add("endhere")
    if (event.className) eventDom.classList.add(event.className)

    eventDom.dataset.calendarName = event.calendarName
    eventDom.dataset.calendarSeq = event.calendarSeq
    eventDom.dataset.startDate = event.startDate
    eventDom.dataset.endDate = event.endDate
    eventDom.dataset.duration = event.duration
    eventDom.dataset.title = event.title
    eventDom.dataset.location = event.location
    eventDom.dataset.busystatus = event.ms_busystatus

    var mainDom = document.createElement("div")
    mainDom.classList.add("eventMain")
    if(event.icon) {
      var iconDom = document.createElement("div")
      iconDom.classList.add("iconify", "eventIcon")
      iconDom.dataset.icon = event.icon
      mainDom.appendChild(iconDom)
    }
    var title = document.createElement("div")
    title.innerHTML = event.title
    title.classList.add("eventTitle")
    mainDom.appendChild(title)
    var time = this.createEventTime()
    mainDom.appendChild(time)
    eventDom.appendChild(mainDom)

    var subDom = document.createElement("div")
    subDom.classList.add("eventSub")
    var description = document.createElement("div")
    description.classList.add("eventDescription")
    description.innerHTML = event.description
    subDom.appendChild(description)
    var location = document.createElement("div")
    location.classList.add("eventLocation")
    location.innerHTML = event.location
    subDom.appendChild(location)
    eventDom.appendChild(subDom)
    return eventDom
  }

  createEventTime() {
    var locale = this.locale
    var event = this.data
    var makeEventTime = (innerHTML, classNameString) => {
      var div = document.createElement("div")
      var arr = classNameString.split(" ")
      arr.forEach((className)=> {
        div.classList.add(className)
      })
      div.innerHTML = innerHTML
      return div
    }

    var dur = moment.duration(event.duration, "seconds").locale(locale)
    var time = document.createElement("div")
    time.classList.add("eventTime")

    var now = moment().locale(locale)
    if (this.useEventTimeRelative) {
      var status = "current"
      if (this.mEnd.isBefore(now)) status = "passed"
      if (this.mStart.isAfter(now)) status = "future"
      var timeDom = document.createElement("div")
      timeDom.classList.add("relative")
      timeDom.classList.add(status)
      timeDom.innerHTML
        = this.relativeFormat[status]
        .replace("%ENDFROMNOW%", this.mEnd.fromNow())
        .replace("%STARTFROMNOW%", this.mStart.fromNow())
        .replace("%DURATION%", dur.humanize())
      time.appendChild(timeDom)
    } else {
      var sd, ed, st, et, sdt, edt = null
      if (typeof this.dateFormat == "object") {
        sd = this.mStart.calendar(null, this.dateFormat)
        ed = this.mEnd.calendar(null, this.dateFormat)
      } else {
        sd = this.mStart.format(this.dateFormat)
        ed = this.mEnd.format(this.dateFormat)
      }
      if (typeof this.timeFormat == "object") {
        st = this.mStart.calendar(null, this.timeFormat)
        et = this.mEnd.calendar(null, this.timeFormat)
      } else {
        st = this.mStart.format(this.timeFormat)
        et = this.mEnd.format(this.timeFormat)
      }
      if (typeof this.dateTimeFormat == "object") {
        sdt = this.mStart.calendar(null, this.dateTimeFormat)
        edt = this.mEnd.calendar(null, this.dateTimeFormat)
      } else {
        sdt = this.mStart.format(this.dateTimeFormat)
        edt = this.mEnd.format(this.dateTimeFormat)
      }
      time.appendChild(makeEventTime(sd, "startDate start date"))
      time.appendChild(makeEventTime(st, "startTime start time"))
      time.appendChild(makeEventTime(sdt, "startDateTime start dateTime"))
      time.appendChild(makeEventTime(ed, "endDate end date"))
      time.appendChild(makeEventTime(et, "endTime end time"))
      time.appendChild(makeEventTime(edt, "endDateTime end dateTime"))
    }
    return time
  }
}
