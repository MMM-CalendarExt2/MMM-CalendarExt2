class Slot {
  constructor(view, period, seq = 0) {
    this.start = period.start;
    this.end = period.end;
    this.seq = seq;
    this.locale = view.config.locale;
    this.useEventTimeRelative = view.config.useEventTimeRelative;
    this.hideOverflow = view.config.hideOverflow;
    this.hideFooter = view.config.hideFooter;
    this.slotSpaceRight = view.config.slotSpaceRight;
    this.maxHeight = view.config.slotMaxHeight;
    this.relativeFormat = view.config.relativeFormat;
    this.timeFormat = view.config.timeFormat;
    this.dateFormat = view.config.dateFormat;
    this.dateTimeFormat = view.config.dateTimeFormat;
    this.events = [];
    this.init(view);

    if (this.hideFooter) {
      this.dom.classList.add("hideFooter");
    }
  }

  init(view) {
    this.makeDom();
    this.makeSlotHeader(view);
    this.makeSlotDomClass(view, this.seq);
  }

  destroy() {
    this.dom.remove();
    for (const property in this) {
      if (this.hasOwnProperty(property)) {
        this[property] = null;
      }
    }
  }

  static factory(view, slotPeriods, events) {
    const slots = [];
    for (let i = 0; i < slotPeriods.length; i++) {
      const slot = new Slot(view, slotPeriods[i], i);
      slot.assignEvents(events);
      slots.push(slot);
    }
    return slots;
  }

  drawEvents() {
    let hiddenCount = 0;
    for (let i = 0; i < this.events.length; i++) {
      const event = new Event(this.events[i], this);
      hiddenCount += this.drawEvent(event);
    }
    if (hiddenCount > 0) {
      this.footerDom.querySelector(
        ".hiddenCount"
      ).innerHTML = `+ ${hiddenCount}`;
    }
  }

  drawEvent(event) {
    return event.draw(this, this.contentDom);
  }

  assignEvents(events) {
    for (i = 0; i < events.length; i++) {
      const event = { ...events[i] };
      const eS = moment.unix(event.startDate).locale(this.locale);
      const eE = moment.unix(event.endDate).locale(this.locale);
      if (eE.isSameOrBefore(this.start) || eS.isSameOrAfter(this.end)) {
        // do nothing
      } else {
        if (eS.isBetween(this.start, this.end, null, "[)"))
          event.startHere = true;
        if (eE.isBetween(this.start, this.end, null, "(])"))
          event.endHere = true;
        if (eE.format("HHmmss") == "000000")
          event.endDate = moment(eE).add(-1, "second").endOf("day").format("X");
        this.events.push(event);
      }
    }
    this.dom.classList.add(`eventCount_${this.events.length}`);
  }

  makeSlotHeader(view) {
    view.makeSlotHeader(this);
  }

  makeSlotDomClass(view, seq) {
    view.makeSlotDomClass(this, seq);
  }

  makeDom() {
    const dom = document.createElement("div");
    dom.classList.add("slot");

    if (this.start) dom.dataset.start = moment(this.start).format("X");
    if (this.end) dom.dataset.end = moment(this.end).format("X");

    const header = document.createElement("div");
    header.classList.add("slotHeader");
    const title = document.createElement("div");
    title.classList.add("slotTitle");
    const subTitle = document.createElement("div");
    subTitle.classList.add("slotSubTitle");
    const altTitle = document.createElement("div");
    altTitle.classList.add("slotAltTitle");
    header.appendChild(title);
    header.appendChild(altTitle);
    header.appendChild(subTitle);

    const content = document.createElement("div");
    content.classList.add("slotContent");

    const footer = document.createElement("div");
    footer.classList.add("slotFooter");
    const hiddenCount = document.createElement("div");
    hiddenCount.classList.add("hiddenCount");
    footer.appendChild(hiddenCount);

    dom.appendChild(header);
    dom.appendChild(content);
    dom.appendChild(footer);

    this.dom = dom;
    this.headerDom = header;
    this.contentDom = content;
    this.footerDom = footer;
  }
}

class WeekSlot extends Slot {
  constructor(view, period, seq = 0) {
    super(view, period, seq);
    this.useEventTimeRelative = false;
    this.dom.appendChild(view.makeWeeksMark(period.start));
    const cellPeriods = view.getSubSlotPeriods(period.start);
    const swClass = view.config.showWeekends ? "showWeekends" : "hideWeekends";
    this.dom.classList.add(swClass);
    this.cellSlots = [];
    for (let i = 0; i < cellPeriods.length; i++) {
      const cellSlot = new CellSlot(view, cellPeriods[i], i, seq);
      this.cellSlots.push(cellSlot);
      this.contentDom.appendChild(cellSlot.dom);
    }
  }

  static factory(view, slotPeriods, events) {
    const slots = [];
    for (let i = 0; i < slotPeriods.length; i++) {
      const slot = new WeekSlot(view, slotPeriods[i], i);
      slot.assignEvents(events);
      slots.push(slot);
    }
    return slots;
  }

  makeDom() {
    super.makeDom();
    const timeline = document.createElement("div");
    timeline.classList.add("timeline");
    this.dom.appendChild(timeline);
    this.timelineDom = timeline;
  }

  getDayPeriods() {
    const periods = [];
    for (let i = 0; i < this.cellSlots.length; i++) {
      const c = this.cellSlots[i];
      const cR = c.dom.getBoundingClientRect();
      periods.push({
        start: c.start,
        end: c.end,
        startX: c.start.format("X"),
        endX: c.end.format("X"),
        eventCount: 0,
        left: cR.left
      });
    }
    return periods;
  }

  makeCellEvent(data) {
    const event = new Event(data, this);
    return event.dom;
  }

  drawEvents() {
    const fcs = this.contentDom.querySelectorAll(".cellSlot");
    const positions = [...fcs].map((dom) => {
      const t = dom.getBoundingClientRect();
      return t;
    });

    const fcc = this.contentDom
      .querySelector(".cellSlot .slotContent")
      .getBoundingClientRect();
    const fch = this.contentDom
      .querySelector(".cellSlot .slotHeader")
      .getBoundingClientRect();
    this.timelineDom.style.top = `${fch.height}px`;
    this.timelineDom.style.height = `${fcc.height}px`;
    const parentPosition = this.timelineDom.getBoundingClientRect();
    var dayPeriods = this.getDayPeriods();

    const getOccupyBin = (event, dayPeriods) => {
      const dayEnd = dayPeriods[dayPeriods.length - 1].endX;
      const dayStart = dayPeriods[0].startX;
      const stX = event.startDate < dayStart ? dayStart : event.startDate;
      const etX = event.endDate > dayEnd ? dayEnd : event.endDate;
      let ob = 0;
      for (i = 0; i < dayPeriods.length; i++) {
        if (stX <= dayPeriods[i].endX && etX > dayPeriods[i].startX) {
          ob += 2 ** i;
        }
      }
      return ob;
    };

    const assignEventToDay = (event, dayPeriods) => {
      for (i = 0; i < dayPeriods.length; i++) {
        const day = dayPeriods[i];
        const es = moment.unix(event.startDate).locale(this.locale);
        const ee = moment.unix(event.endDate).locale(this.locale);
        const ds = day.start.locale(this.locale);
        const de = day.end.locale(this.locale);
        if (!(es.isAfter(de) || ee.isBefore(ds))) {
          dayPeriods[i].eventCount++;
        }
      }
    };
    var dayPeriods = this.getDayPeriods();
    const timelineDom = this.timelineDom;
    const timelines = [];
    for (let j = 0; j < this.events.length; j++) {
      const event = this.events[j];
      const occu = getOccupyBin(event, dayPeriods);
      if (occu > 0) {
        let inserted = false;
        const occuStr = (2 ** dayPeriods.length + occu)
          .toString(2)
          .slice(1)
          .split("")
          .reverse()
          .join("");
        for (let k = 0; k < dayPeriods.length; k++) {
          const dp = dayPeriods[k];
          if (
            moment.unix(event.startDate).isBefore(dp.end) &&
            moment.unix(event.endDate).isAfter(dp.start)
          ) {
            dayPeriods[k].eventCount++;
          }
        }
        // var eventDom = this.createEventDom(event, slot.startX, occuStr, dayPeriods.length)

        const eventDom = this.makeCellEvent(event);

        const isFullday = !!event.isFullday;

        const pos = occuStr.search("1");
        const dayDuration = occuStr.split("1").length - 1;
        const endPos = pos + dayDuration - 1;

        const left = positions[pos].left - parentPosition.left;
        const width =
          positions[endPos].left -
          positions[pos].left +
          positions[endPos].width;
        eventDom.style.left = `${left}px`;
        eventDom.style.width = `${width - this.slotSpaceRight}px`;
        eventDom.style.boxSizing = "border-box";

        for (let k = 0; k < timelines.length; k++) {
          const tl = timelines[k];
          if ((tl & occu) > 0) {
            continue;
          } else {
            const tlDoms = timelineDom.querySelectorAll(".timelineSleeve");
            var tlDom = tlDoms[k];
            timelines[k] = timelines[k] | occu;
            tlDom.appendChild(eventDom);
            inserted = true;
            break;
          }
        }
        if (!inserted) {
          timelines.push(occu);
          var tlDom = document.createElement("div");
          tlDom.classList.add("timelineSleeve");
          tlDom.appendChild(eventDom);
          timelineDom.appendChild(tlDom);
        }
        timelineDom.dataset.occupy = timelines;
      }
    }

    if (this.maxHeight == "auto") {
      const slots = this.contentDom.querySelectorAll(".cellSlot .slotContent");
      for (let l = 0; l < slots.length; l++) {
        slots[l].style = `height: ${timelineDom.scrollHeight}px`;
      }
    } else if (timelineDom.scrollHeight > timelineDom.clientHeight) {
      var tlDom = timelineDom.querySelectorAll(".timelineSleeve");
      const tlRect = tlDom[0].getBoundingClientRect();
      const shown = Math.floor(timelineDom.clientHeight / tlRect.height);
      for (let l = shown; l < tlDom.length; l++) {
        tlDom[l].style.display = "none";
      }
      const td = this.contentDom.querySelectorAll(".cellSlot .slotFooter");
      for (let l = 0; l < dayPeriods.length; l++) {
        const he = dayPeriods[l].eventCount - shown;
        if (he > 0) {
          td[l].innerHTML = `+ ${he}`;
        }
      }
    }
    // return event.draw(this, this.contentDom)
  }
}

class CellSlot extends Slot {
  constructor(view, period, daySeq = 0, weekSeq = 0) {
    super(view, period, daySeq);
    this.start = period.start;
    this.end = period.end;
    this.seq = daySeq;
    this.daySeq = daySeq;
    this.weekSeq = weekSeq;
    this.makeSlotDomClass(view, daySeq, weekSeq);
  }

  static factory(view, slotPeriods, weekSeq = 0, events) {
    const slots = [];
    for (let i = 0; i < slotPeriods.length; i++) {
      const slot = new CellSlot(view, slotPeriods[i], i, weekSeq);
      // slot.assign(events)
      slots.push(slot);
    }
    return slots;
  }

  init(view) {
    this.makeDom();
    this.makeSlotHeader(view);
    this.adjustSlotHeight(view, this.contentDom);
  }

  adjustSlotHeight(view, dom) {
    view.adjustSlotHeight(dom);
  }

  makeSlotHeader(view) {
    view.makeSlotHeader(this);
  }

  makeSlotDomClass(view, daySeq, weekSeq) {
    view.makeCellDomClass(this, daySeq, weekSeq);
    this.dom.classList.add("cellSlot");
  }
}
