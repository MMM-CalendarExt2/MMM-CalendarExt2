/* global moment */

class View {
  constructor(config, events) {
    this.config = config;
    this.locale = config.locale;
    this.slotUnit = null;
    this.slotPeriods = [];
    this.slots = [];
    this.contentDom = null;
    this.moduleDom = null;
    this.containerDom = null;
    this.calendars = config.calendars;
    this.createDom();
    this.calendars = this.assignEvents([].concat(events));
  }

  static makeByName(config, events) {
    switch (config.mode) {
      case "current":
        return new ViewCurrent(config, events);
      case "upcoming":
        return new ViewUpcoming(config, events);
      case "month":
        return new ViewMonth(config, events);
      case "daily":
        return new ViewDaily(config, events);
      case "weekly":
        return new ViewWeekly(config, events);
      case "monthly":
        return new ViewMonthly(config, events);
      case "week":
        return new ViewWeek(config, events);
      default:
        return new ViewWeek(config, events);
    }
  }

  assignEvents(events) {
    if (this.config.skipItems === undefined) {
      this.config.skipItems = 0;
    }

    this.events = this.filterEvents(this.transformEvents(events)).slice(
      this.config.skipItems,
      this.config.maxItems + this.config.skipItems
    );
  }

  transformEvents(events) {
    if (typeof this.config.transform === "function") {
      return events.map((e) => {
        const event = { ...e };
        return this.config.transform(event);
      });
    }

    return [].concat(events);
  }

  draw() {
    this.drawDom();
    this.makeSlots(this.events);
    this.drawEvents();
  }

  destroy() {
    this.hide();
    setTimeout(() => {
      if (this.slots) {
        for (let i = 0; i < this.slots.length; i++) {
          this.slots[i].destroy();
        }
        this.moduleDom.remove();
        this.containerDom = null;
        for (const property in this) {
          if (this.hasOwnProperty(property)) {
            this[property] = null;
          }
        }
      }
    }, 500);
  }

  filterEvents(events) {
    const calendars = this.calendars;
    const calendarFilter =
      Array.isArray(calendars) && calendars.length > 0
        ? (e) => calendars.indexOf(e.calendarName) >= 0
        : (e) => true;
    let filtered = events.filter(calendarFilter);
    if (this.config.filterPassedEvent) {
      const now = moment().format("X");
      filtered = filtered.filter((e) => e.endDate > now);
    }
    if (typeof this.config.filter === "function") {
      filtered = filtered.filter(this.config.filter);
    }
    if (typeof this.config.sort === "function") {
      filtered = filtered.sort(this.config.sort);
    }
    filtered = filtered.map((e) => {
      const seq = calendars.indexOf(e.calendarName);
      e.calendarSeq = seq >= 0 ? seq : e.calendarId;
      return e;
    });
    return filtered;
  }

  getRegionDom(position) {
    let className = position.replace("_", " ");
    className = `region ${className}`;
    const nodes = document.getElementsByClassName(className);
    if (nodes.length !== 1) {
      console.error("[CALEXT2] Invalid position : ", position);
      return null;
    }
    return nodes[0].querySelector(".container");
  }

  drawDom() {
    const container = this.getRegionDom(this.config.position);
    const children = container.children;
    const order = this.config.positionOrder;
    if (order == -1) {
      container.appendChild(this.moduleDom);
    } else if (order >= 0 && order < children.length) {
      container.insertBefore(this.moduleDom, children[order]);
    } else {
      container.appendChild(this.moduleDom);
    }

    if (container.style.display == "none") {
      container.style.display = "block";
    }
    this.containerDom = container;
    this.show();
  }

  createDom() {
    const module = document.createElement("div");
    module.classList.add("module", "fake_module", "MMM-CalendarExt2", "CX2");
    if (this.config.sceneClassName)
      module.classList.add(this.config.sceneClassName);
    if (this.config.title) {
      const header = document.createElement("header");
      header.classList.add("module-header");
      module.appendChild(header);
    }
    const content = document.createElement("div");
    content.classList.add("module-content");
    const viewDom = document.createElement("div");
    viewDom.classList.add("view");
    if (this.config.className) viewDom.classList.add(this.config.className);
    viewDom.classList.add(this.config.mode);
    this.viewDomType(viewDom);
    content.appendChild(viewDom);
    module.appendChild(content);
    module.classList.add("hidden");
    this.contentDom = viewDom;
    this.moduleDom = module;
  }

  hide() {
    if (this.moduleDom) {
      if (this.moduleDom.classList.contains("shown")) {
        this.moduleDom.classList.remove("shown");
        this.moduleDom.classList.add("hidden");
        setTimeout(() => {
          if (this.moduleDom) this.moduleDom.style.display = "none";
        }, 1000);
      }
    }
  }

  show() {
    if (this.moduleDom) {
      if (this.moduleDom.classList.contains("hidden")) {
        this.moduleDom.classList.remove("hidden");
        this.moduleDom.classList.add("shown");
      }
    }
  }

  makeSlots() {
    this.contentDom.innerHTML = "";
    this.slotPeriods = this.getSlotPeriods();
    this.slots = Slot.factory(this, this.slotPeriods, this.events);
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      this.adjustSlotWidth(slot.dom, this.slots.length);
      this.appendSlot(slot);
    }
    this.makeModuleTitle();
  }

  makeModuleTitle() {
    if (!this.config.title) return;
    const headerTitle = this.moduleDom.getElementsByClassName("module-header");
    const slotStart = { ...this.slots[0].start };
    let title;
    if (typeof this.config.title === "function") {
      title = this.config.title(moment(slotStart));
    } else {
      title = this.config.title;
    }

    headerTitle[0].innerHTML = title;
  }

  appendSlot(slot) {
    this.contentDom.appendChild(slot.dom);
  }

  drawSlots(targetDom) {
    /* to deprecate */
    targetDom.innerHTML = "";
    const slotPeriods = this.getSlotPeriods();
    const slots = Slot.factory(slotPeriods);
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      slot.draw(this, i);
    }
  }

  makeSlotHeader(slot) {
    const header = slot.headerDom;
    const title = header.querySelector(".slotTitle");
    const subTitle = header.querySelector(".slotSubTitle");
    if (this.config.slotTitle) {
      title.innerHTML = this.config.slotTitle;
    } else if (
      this.config.slotTitleFormat &&
      typeof this.config.slotTitleFormat !== "object"
    ) {
      title.innerHTML = moment(slot.start)
        .locale(this.locale)
        .format(this.config.slotTitleFormat);
    } else {
      title.innerHTML = moment(slot.start)
        .locale(this.locale)
        .calendar(null, this.config.slotTitleFormat);
    }
    if (this.config.slotSubTitle) {
      subTitle.innerHTML = this.config.slotSubTitle;
    } else if (
      this.config.slotSubTitleFormat &&
      typeof this.config.slotSubTitleFormat !== "object"
    ) {
      subTitle.innerHTML = moment(slot.start)
        .locale(this.locale)
        .format(this.config.slotSubTitleFormat);
    } else {
      subTitle.innerHTML = moment(slot.start)
        .locale(this.locale)
        .calendar(null, this.config.slotSubTitleFormat);
    }
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    slotDom.classList.add(this.config.mode);
    if (slot.seq >= 0) slotDom.classList.add(`seq_${slot.seq}`);
  }

  getSlotPeriods() {
    const getSlotPeriod = (tDay, seq) => {
      const mtd = moment(tDay).locale(this.locale).add(seq, this.slotUnit);
      const start = moment(mtd).startOf(this.slotUnit);
      const end = moment(mtd).endOf(this.slotUnit);
      return {
        start,
        end
      };
    };
    const periods = [];
    const now = moment().locale(this.locale);
    const targetDay = this.getStartDay();
    const count = this.getSlotCount();
    for (let i = 0; i < count; i++) {
      const period = getSlotPeriod(targetDay, i);
      periods.push(period);
    }
    return periods;
  }

  viewDomType(viewDom) {
    // do nothing;
  }

  adjustSlotWidth(slotDom, count) {
    // do nothing;
  }

  adjustSlotHeight(dom) {
    dom.style.maxHeight = this.config.slotMaxHeight;
  }

  getSlotCount() {
    return this.config.slotCount;
  }

  getStartDay() {
    const fromNow = this.config.fromNow;
    const now = moment().locale(this.locale);
    return now.add(fromNow, this.slotUnit).startOf("day");
  }

  drawEvents() {
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      slot.drawEvents();
    }
  }
}

class ViewPeriod extends View {
  constructor(config, events) {
    super(config, events);
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("period");
  }

  viewDomType(viewDom) {
    viewDom.classList.add(this.config.type);
  }

  adjustSlotWidth(slotDom, count) {
    if (this.config.type == "row") slotDom.style.width = `${100 / count - 3}%`;
  }
}

class ViewAgenda extends View {
  constructor(config, events) {
    super(config, events);
    this.slotUnit = "day";
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("agenda", "period");
  }

  getSlotCount() {
    return 1;
  }

  getStartDay() {
    const now = moment().locale(this.locale);
    return now;
  }

  getSlotPeriods() {
    return [
      {
        start: moment().locale(this.locale),
        end: null
      }
    ];
  }

  makeSlotHeader(slot) {
    const header = slot.headerDom;
    const title = header.querySelector(".slotTitle");
    title.innerHTML = this.config.slotTitle;
  }
}

class ViewCell extends View {
  constructor(config, events) {
    super(config, events);
    this.slotUnit = "week";
  }

  makeSlots() {
    this.contentDom.innerHTML = "";
    this.slotPeriods = this.getSlotPeriods();
    this.slots = WeekSlot.factory(this, this.slotPeriods, this.events);
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      this.appendSlot(slot);
    }
    this.makeModuleTitle();
  }

  getSlotPeriods() {
    const showWeekends = this.config.showWeekends;
    const getSlotPeriod = (tDay, seq) => {
      const mtd = moment(tDay).locale(this.locale).add(seq, "week");
      const start = showWeekends
        ? moment(mtd).startOf("week")
        : moment(mtd).startOf("week").day(1).startOf("day");
      const end = showWeekends
        ? moment(mtd).endOf("week")
        : moment(mtd).startOf("week").day(5).endOf("day");
      return {
        start,
        end
      };
    };
    const periods = [];
    const now = moment().locale(this.locale);
    const targetDay = this.getStartDay();
    const count = this.getSlotCount();
    for (let i = 0; i < count; i++) {
      const period = getSlotPeriod(targetDay, i);
      periods.push(period);
    }
    return periods;
  }

  getSubSlotPeriods(start) {
    const showWeekends = this.config.showWeekends;
    const days = showWeekends ? 7 : 5;
    const periods = [];
    const t = start;
    const startDay = showWeekends
      ? moment(t).locale(this.locale).startOf("week")
      : moment(t).locale(this.locale).startOf("week").day(1).startOf("day");
    for (let i = 0; i < days; i++) {
      const p = {
        start: moment(startDay).startOf("day"),
        end: moment(startDay).endOf("day")
      };
      periods.push(p);
      startDay.add(1, "day");
    }
    return periods;
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("weekSlot");
  }

  viewDomType(viewDom) {
    viewDom.classList.add("column");
  }

  adjustSlotHeight(slotDom) {
    slotDom.style.maxHeight = this.config.slotMaxHeight;
    slotDom.style.height = this.config.slotMaxHeight;
  }

  makeCellDomClass(slot, daySeq, weekSeq) {
    const slotDom = slot.dom;
    if (daySeq >= 0) slotDom.classList.add(`cellSeq_${daySeq}`);
    if (weekSeq === 0 && daySeq === 0) {
      slotDom.classList.add("firstCell");
    }
    const day = moment(slot.start).locale(this.locale);
    const now = moment().locale(this.locale);
    if (now.format("YYYY") == day.format("YYYY"))
      slotDom.classList.add("thisyear");
    if (now.format("M") == day.format("M")) slotDom.classList.add("thismonth");
    if (now.format("w") == day.format("w")) slotDom.classList.add("thisweek");
    if (now.format("YYYYMMDD") == day.format("YYYYMMDD"))
      slotDom.classList.add("today");
    if (now.format("YYYYMMDD") > day.format("YYYYMMDD"))
      slotDom.classList.add("passedday");
    slotDom.classList.add(`weekday_${day.format("E")}`);
    slotDom.classList.add(`year_${day.format("YYYY")}`);
    slotDom.classList.add(`month_${day.format("M")}`);
    slotDom.classList.add(`day_${day.format("D")}`);
    slotDom.classList.add(`week_${day.format("w")}`);
    slotDom.classList.add(`dayofyear_${day.format("DDD")}`);
  }

  makeWeeksMark(start) {
    const weeks = document.createElement("div");
    weeks.classList.add("weeksmark");
    weeks.innerHTML = moment(start)
      .locale(this.locale)
      .format(this.config.weeksFormat);
    return weeks;
  }

  adjustSlotWidth(slotDom, count) {
    // if (this.config.type == "row") slotDom.style.width = ((100 / count) - 0.25) + "%"
  }

  makeSlotHeader(slot) {
    super.makeSlotHeader(slot);
    const header = slot.headerDom;
    const start = slot.start;
    const altTitle = header.querySelector(".slotAltTitle");
    if (this.config.slotAltTitle) {
      altTitle.innerHTML = this.config.slotTitle;
    } else if (this.config.slotAltTitleFormat) {
      altTitle.innerHTML = moment(slot.start)
        .locale(this.locale)
        .format(this.config.slotAltTitleFormat);
    }
  }
}

class ViewDaily extends ViewPeriod {
  constructor(config, events) {
    super(config, events);
    this.slotUnit = "day";
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("daily");

    const day = moment(slot.start).locale(this.locale);
    const now = moment().locale(this.locale);
    if (now.format("YYYY") == day.format("YYYY"))
      slotDom.classList.add("thisyear");
    if (now.format("M") == day.format("M")) slotDom.classList.add("thismonth");
    if (now.format("w") == day.format("w")) slotDom.classList.add("thisweek");
    if (now.format("YYYYMMDD") == day.format("YYYYMMDD"))
      slotDom.classList.add("today");
    if (now.format("YYYYMMDD") > day.format("YYYYMMDD"))
      slotDom.classList.add("passed");
    slotDom.classList.add(`weekday_${day.format("E")}`);
    slotDom.classList.add(`year_${day.format("YYYY")}`);
    slotDom.classList.add(`month_${day.format("M")}`);
    slotDom.classList.add(`day_${day.format("D")}`);
    slotDom.classList.add(`week_${day.format("w")}`);
    slotDom.classList.add(`dayofyear_${day.format("DDD")}`);
  }
}

class ViewWeekly extends ViewPeriod {
  constructor(config, events) {
    super(config, events);
    this.slotUnit = "week";
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("weekly");

    const day = moment(slot.start).locale(this.locale);
    const dayEnd = moment(slot.end).locale(this.locale);
    const now = moment().locale(this.locale);
    if (now.format("YYYY") == day.format("YYYY"))
      slotDom.classList.add("thisyear");
    if (now.format("M") == day.format("M")) slotDom.classList.add("thismonth");
    if (now.format("w") == day.format("w")) slotDom.classList.add("thisweek");
    if (now.isBetween(day, dayEnd)) slotDom.classList.add("today");
    slotDom.classList.add(`year_${day.format("YYYY")}`);
    slotDom.classList.add(`month_${day.format("M")}`);
    slotDom.classList.add(`week_${day.format("w")}`);
  }

  makeSlotHeader(slot) {
    const header = slot.headerDom;
    const title = header.querySelector(".slotTitle");
    const subTitle = header.querySelector(".slotSubTitle");
    if (this.config.slotTitle) {
      title.innerHTML = this.config.slotTitle;
    } else if (
      this.config.slotTitleFormat &&
      typeof this.config.slotTitleFormat !== "object"
    ) {
      title.innerHTML = moment(slot.start)
        .locale(this.locale)
        .format(this.config.slotTitleFormat);
    } else {
      title.innerHTML = moment(slot.start)
        .locale(this.locale)
        .calendar(null, this.config.slotTitleFormat);
    }
    if (this.config.slotSubTitle) {
      subTitle.innerHTML = this.config.slotSubTitle;
    } else if (
      this.config.slotSubTitleFormat &&
      typeof this.config.slotSubTitleFormat !== "object"
    ) {
      subTitle.innerHTML = moment(slot.start)
        .locale(this.locale)
        .format(this.config.slotSubTitleFormat);
    } else {
      subTitle.innerHTML = moment(slot.start)
        .locale(this.locale)
        .calendar(null, this.config.slotSubTitleFormat);
    }
  }
}

class ViewMonthly extends ViewPeriod {
  constructor(config, events) {
    super(config, events);
    this.slotUnit = "month";
  }

  makeSlotDomClass(slot, seq = null) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("monthly");
    const day = moment(slot.start).locale(this.locale);
    const dayEnd = moment(slot.end).locale(this.locale);
    const now = moment().locale(this.locale);
    if (now.format("YYYY") == day.format("YYYY"))
      slotDom.classList.add("thisyear");
    if (now.format("M") == day.format("M")) slotDom.classList.add("thismonth");
    if (now.isBetween(day, dayEnd)) slotDom.classList.add("today");
    slotDom.classList.add(`year_${day.format("YYYY")}`);
    slotDom.classList.add(`month_${day.format("M")}`);
  }
}

class ViewCurrent extends ViewAgenda {
  constructor(config, events) {
    super(config, events);
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("current");
  }

  filterEvents(events) {
    let filtered = super.filterEvents(events);
    const now = moment();
    filtered = filtered.filter((e) => {
      if (now.isBetween(moment.unix(e.startDate), moment.unix(e.endDate)))
        return true;
    });
    return filtered;
  }
}

class ViewUpcoming extends ViewAgenda {
  constructor(config, events) {
    super(config, events);
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("upcoming");
  }

  filterEvents(events) {
    const until = moment().add(this.config.maxDays, "day").endOf("day");
    let filtered = super.filterEvents(events);
    filtered = filtered.filter((e) => {
      if (moment.unix(e.startDate).isBetween(moment(), until)) return true;
    });
    return filtered;
  }
}

class ViewWeek extends ViewCell {
  constructor(config, events) {
    super(config, events);
  }
}

class ViewMonth extends ViewCell {
  constructor(config, events) {
    super(config, events);
  }

  getSlotCount() {
    const startDay = this.getStartDay();
    const endDay = this.getEndWeek();
    const diff = endDay.diff(startDay, "week");
    return diff + 1;
  }

  getStartDay() {
    const fromNow = this.config.fromNow;
    const now = moment().locale(this.locale);
    return now.add(fromNow, "month").startOf("month").startOf("week");
  }

  getEndWeek() {
    const fromNow = this.config.fromNow;
    const now = moment().locale(this.locale);
    return now.add(fromNow, "month").endOf("month").startOf("week");
  }

  makeSlots() {
    super.makeSlots();
    if (this.config.monthFormat) {
      const fromNow = this.config.fromNow;
      const now = moment().locale(this.locale);
      now.add(fromNow, "month").startOf("month");
      const mt = document.createElement("div");
      mt.innerHTML = now.format(this.config.monthFormat);
      mt.classList.add("monthViewTitle");
      this.contentDom.prepend(mt);
    }
  }
}
