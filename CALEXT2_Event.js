// eslint-disable-next-line no-unused-vars
class Event {
  constructor (data, slot) {
    this.data = data;
    this.locale = slot.locale;
    this.mStart = moment.unix(data.startDate).locale(this.locale);
    this.mEnd = moment.unix(data.endDate).locale(this.locale);
    this.sStart = moment(slot.start).locale(this.locale);
    this.sEnd = moment(slot.end).locale(this.locale);
    this.useEventTimeRelative = slot.useEventTimeRelative;
    this.relativeFormat = slot.relativeFormat;
    this.timeFormat = slot.timeFormat;
    this.dateFormat = slot.dateFormat;
    this.dateTimeFormat = slot.dateTimeFormat;
    this.dom = this.makeEventDom();
  }

  destroy () {
    this.dom.remove();

    for (const property in this) {
      if (Object.hasOwn(this, property)) {
        this[property] = null;
      }
    }
  }

  draw (slot, targetDom) {
    const {hideOverflow} = slot;
    const eventDom = this.dom;
    eventDom.style.opacity = 0;
    targetDom.appendChild(eventDom);
    if (hideOverflow) {
      targetDom.classList.add("hideOverflow");
      targetDom.style.maxHeight = slot.maxHeight;
      targetDom.style.height = slot.maxHeight;
      const contentRect = targetDom.getBoundingClientRect();
      const eventRect = eventDom.getBoundingClientRect();
      if (
        eventRect.bottom > contentRect.bottom ||
        eventRect.right > contentRect.right
      ) {
        eventDom.classList.add("hiddenEvent");
        return 1;
      }
    }
    eventDom.style.opacity = 1;
    return 0;
  }

  /*
   * TODO: To implement

      DrawSleeve(slot, sleeve) {
      ...
      }

   */

  makeEventDom () {
    const {locale} = this;
    const now = moment().locale(locale);

    const isEventMultiSlots = (event, mESX, mEEX, mSSX, mSEX) => {
      let isMulti = false;
      if (event.duration > 86400) {
        isMulti = true;
      } else if (mESX.isBefore(mSSX) || mEEX.isAfter(mSEX)) {
        isMulti = true;
      }
      return isMulti;
    };

    const event = this.data;
    const eventDom = document.createElement("div");
    eventDom.classList.add("event");

    const isPassed = Boolean(moment.unix(event.endDate).isBefore(now));
    const isFullday = Boolean(event.isFullday);
    const isMultiSlots = isEventMultiSlots(
      event,
      this.mStart,
      this.mEnd,
      this.sStart,
      this.sEnd
    );
    const isTargetDay = Boolean(
      this.mStart.isBefore(moment(now).endOf("day")) ||
      this.mEnd.isAfter(moment(now).startOf("day"))
    );
    const isNow = Boolean(now.isBetween(this.mStart, this.mEnd, null, "[)"));
    if (isFullday) {
      eventDom.classList.add("fullday");
    } else {
      eventDom.classList.add("notfullday");
    }
    if (isMultiSlots) eventDom.classList.add("overslot");
    if (isTargetDay) eventDom.classList.add("targetday");
    if (isNow) eventDom.classList.add("now");
    if (isPassed) {
      eventDom.classList.add("passed");
    }
    if (event.isMoment) eventDom.classList.add("moment");
    if (event.isOneday) {
      eventDom.classList.add("oneday");
    } else {
      eventDom.classList.add("overday");
    }
    if (event.isRecurring) {
      eventDom.classList.add("recurred");
    }
    if (event.startHere) eventDom.classList.add("starthere");
    if (event.endHere) eventDom.classList.add("endhere");
    if (event.className) eventDom.classList.add(event.className);

    eventDom.dataset.calendarName = event.calendarName;
    eventDom.dataset.calendarSeq = event.calendarSeq;
    eventDom.dataset.startDate = event.startDate;
    eventDom.dataset.endDate = event.endDate;
    eventDom.dataset.duration = event.duration;
    eventDom.dataset.title = event.title;
    eventDom.dataset.location = event.location;
    eventDom.dataset.busystatus = event.ms_busystatus;

    const mainDom = document.createElement("div");
    mainDom.classList.add("eventMain");
    if (event.icon) {
      const iconDom = document.createElement("div");
      iconDom.classList.add("iconify", "eventIcon");
      iconDom.dataset.icon = event.icon;
      mainDom.appendChild(iconDom);
    }
    const title = document.createElement("div");
    title.innerHTML = event.title;
    title.classList.add("eventTitle");
    mainDom.appendChild(title);
    const time = this.createEventTime();
    mainDom.appendChild(time);
    eventDom.appendChild(mainDom);

    const subDom = document.createElement("div");
    subDom.classList.add("eventSub");
    const description = document.createElement("div");
    description.classList.add("eventDescription");
    description.innerHTML = event.description;
    subDom.appendChild(description);
    const location = document.createElement("div");
    location.classList.add("eventLocation");
    location.innerHTML = event.location;
    subDom.appendChild(location);
    eventDom.appendChild(subDom);
    return eventDom;
  }

  createEventTime () {
    const {locale} = this;
    const event = this.data;
    const makeEventTime = (innerHTML, classNameString) => {
      const div = document.createElement("div");
      const arr = classNameString.split(" ");
      arr.forEach((className) => {
        div.classList.add(className);
      });
      div.innerHTML = innerHTML;
      return div;
    };

    const dur = moment.duration(event.duration, "seconds").locale(locale);
    const time = document.createElement("div");
    time.classList.add("eventTime");

    const now = moment().locale(locale);
    if (this.useEventTimeRelative) {
      let status = "current";
      if (this.mEnd.isBefore(now)) status = "passed";
      if (this.mStart.isAfter(now)) status = "future";
      const timeDom = document.createElement("div");
      timeDom.classList.add("relative");
      timeDom.classList.add(status);
      timeDom.innerHTML = this.relativeFormat[status]
        .replace("%ENDFROMNOW%", this.mEnd.fromNow())
        .replace("%STARTFROMNOW%", this.mStart.fromNow())
        .replace("%DURATION%", dur.humanize());
      if (typeof this.dateFormat === "string") {
        timeDom.innerHTML
          .replace("%STARTDATE%", this.mStart.format(this.dateFormat))
          .replace("%ENDDATE%", this.mEnd.format(this.dateFormat));
      }
      time.appendChild(timeDom);
    } else {
      let sd;
      let ed;
      let st;
      let et;
      let sdt;
      let edt;
      if (typeof this.dateFormat === "object") {
        sd = this.mStart.calendar(null, this.dateFormat);
        ed = this.mEnd.calendar(null, this.dateFormat);
      } else {
        sd = this.mStart.format(this.dateFormat);
        ed = this.mEnd.format(this.dateFormat);
      }
      if (typeof this.timeFormat === "object") {
        st = this.mStart.calendar(null, this.timeFormat);
        et = this.mEnd.calendar(null, this.timeFormat);
      } else {
        st = this.mStart.format(this.timeFormat);
        et = this.mEnd.format(this.timeFormat);
      }
      if (typeof this.dateTimeFormat === "object") {
        sdt = this.mStart.calendar(null, this.dateTimeFormat);
        edt = this.mEnd.calendar(null, this.dateTimeFormat);
      } else {
        sdt = this.mStart.format(this.dateTimeFormat);
        edt = this.mEnd.format(this.dateTimeFormat);
      }
      time.appendChild(makeEventTime(sd, "startDate start date"));
      time.appendChild(makeEventTime(st, "startTime start time"));
      time.appendChild(makeEventTime(sdt, "startDateTime start dateTime"));
      time.appendChild(makeEventTime(ed, "endDate end date"));
      time.appendChild(makeEventTime(et, "endTime end time"));
      time.appendChild(makeEventTime(edt, "endDateTime end dateTime"));
    }
    return time;
  }
}
