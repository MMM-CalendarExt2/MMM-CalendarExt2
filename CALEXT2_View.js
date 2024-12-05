/* global Log Slot ViewCurrent ViewUpcoming ViewMonth ViewDaily ViewWeekly ViewMonthly ViewWeek ViewLegend */
// eslint-disable-next-line no-unused-vars
class View {
  constructor (config, events) {
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

  static makeByName (config, events) {
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
      case "legend":
        return new ViewLegend(config, events);
      default:
        return new ViewWeek(config, events);
    }
  }

  assignEvents (events) {
    if (!this.config.skipItems) {
      this.config.skipItems = 0;
    }

    this.events = this.filterEvents(this.transformEvents(events)).slice(
      this.config.skipItems,
      this.config.maxItems + this.config.skipItems
    );
  }

  transformEvents (events) {
    if (typeof this.config.transform === "function") {
      return events.map((e) => {
        const event = {...e};
        return this.config.transform(event);
      });
    }

    return [].concat(events);
  }

  draw () {
    this.drawDom();
    this.makeSlots(this.events);
    this.drawEvents();
  }

  destroy () {
    this.hide();
    setTimeout(() => {
      if (this.slots) {
        for (let i = 0; i < this.slots.length; i++) {
          this.slots[i].destroy();
        }
        this.moduleDom.remove();
        this.containerDom = null;

        for (const property in this) {
          if (Object.hasOwn(this, property)) {
            this[property] = null;
          }
        }
      }
    }, 500);
  }

  filterEvents (events) {
    const {calendars} = this;
    const calendarFilter =
      Array.isArray(calendars) && calendars.length > 0
        ? (e) => calendars.indexOf(e.calendarName) >= 0
        : () => true;
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

  static getRegionDom (position) {
    let className = position.replace("_", " ");
    className = `region ${className}`;
    const nodes = document.getElementsByClassName(className);
    if (nodes.length !== 1) {
      Log.error("[CALEXT2] Invalid position : ", position);
      return null;
    }
    return nodes[0].querySelector(".container");
  }

  drawDom () {
    const container = View.getRegionDom(this.config.position);
    const {children} = container;
    const order = this.config.positionOrder;
    if (order === -1) {
      container.appendChild(this.moduleDom);
    } else if (order >= 0 && order < children.length) {
      container.insertBefore(this.moduleDom, children[order]);
    } else {
      container.appendChild(this.moduleDom);
    }

    if (container.style.display === "none") {
      container.style.display = "block";
    }
    this.containerDom = container;
    this.show();
  }

  createDom () {
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

  hide () {
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

  show () {
    if (this.moduleDom) {
      if (this.moduleDom.classList.contains("hidden")) {
        this.moduleDom.classList.remove("hidden");
        this.moduleDom.classList.add("shown");
      }
    }
  }

  makeSlots () {
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

  makeModuleTitle () {
    if (!this.config.title) return;
    const headerTitle = this.moduleDom.getElementsByClassName("module-header");
    const slotStart = {...this.slots[0].start};
    let title;
    if (typeof this.config.title === "function") {
      title = this.config.title(moment(slotStart));
    } else {
      title = this.config.title;
    }

    headerTitle[0].innerHTML = title;
  }

  appendSlot (slot) {
    this.contentDom.appendChild(slot.dom);
  }

  drawSlots (targetDom) {

    /* to deprecate */
    targetDom.innerHTML = "";
    const slotPeriods = this.getSlotPeriods();
    const slots = Slot.factory(slotPeriods);
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      slot.draw(this, i);
    }
  }

  makeSlotHeader (slot) {
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

  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    slotDom.classList.add(this.config.mode);
    if (slot.seq >= 0) slotDom.classList.add(`seq_${slot.seq}`);
  }

  getSlotPeriods () {
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
    const targetDay = this.getStartDay();
    const count = this.getSlotCount();
    for (let i = 0; i < count; i++) {
      const period = getSlotPeriod(targetDay, i);
      periods.push(period);
    }
    return periods;
  }

  // eslint-disable-next-line class-methods-use-this
  viewDomType () {
    // do nothing;
  }

  // eslint-disable-next-line class-methods-use-this
  adjustSlotWidth () {
    // do nothing;
  }

  adjustSlotHeight (dom) {
    dom.style.maxHeight = this.config.slotMaxHeight;
  }

  getSlotCount () {
    return this.config.slotCount;
  }

  getStartDay () {
    const {fromNow} = this.config;
    const now = moment().locale(this.locale);
    return now.add(fromNow, this.slotUnit).startOf("day");
  }

  drawEvents () {
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      slot.drawEvents();
    }
  }
}
