/* global dayjs */
/* global View WeekSlot */
// eslint-disable-next-line no-unused-vars
class ViewCell extends View {
  constructor (config, events) {
    super(config, events);
    this.slotUnit = "week";
  }

  makeSlots () {
    this.contentDom.innerHTML = "";
    this.slotPeriods = this.getSlotPeriods();
    this.slots = WeekSlot.factory(this, this.slotPeriods, this.events);
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      this.appendSlot(slot);
    }
    this.makeModuleTitle();
  }

  getSlotPeriods () {
    const {showWeekends} = this.config;
    const getSlotPeriod = (tDay, seq) => {
      let mtd = dayjs(tDay);
      if (this.locale) mtd = mtd.locale(this.locale);
      mtd = mtd.add(seq, "week");
      const start = showWeekends
        ? dayjs(mtd).startOf("week")
        : dayjs(mtd).startOf("week").day(1).startOf("day");
      const end = showWeekends
        ? dayjs(mtd).endOf("week")
        : dayjs(mtd).startOf("week").day(5).endOf("day");
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

  getSubSlotPeriods (start) {
    const {showWeekends} = this.config;
    const days = showWeekends ? 7 : 5;
    const periods = [];
    const t = start;
    let startDay = dayjs(t);
    if (this.locale) startDay = startDay.locale(this.locale);
    startDay = showWeekends
      ? startDay.startOf("week")
      : startDay.startOf("week").day(1).startOf("day");
    for (let i = 0; i < days; i++) {
      const p = {
        start: dayjs(startDay).startOf("day"),
        end: dayjs(startDay).endOf("day")
      };
      periods.push(p);
      startDay = startDay.add(1, "day");
    }
    return periods;
  }

  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("weekSlot");
  }

  // eslint-disable-next-line class-methods-use-this
  viewDomType (viewDom) {
    viewDom.classList.add("column");
  }

  adjustSlotHeight (slotDom) {
    slotDom.style.maxHeight = this.config.slotMaxHeight;
    slotDom.style.height = this.config.slotMaxHeight;
  }

  makeCellDomClass (slot, daySeq, weekSeq) {
    const slotDom = slot.dom;
    if (daySeq >= 0) slotDom.classList.add(`cellSeq_${daySeq}`);
    if (weekSeq === 0 && daySeq === 0) {
      slotDom.classList.add("firstCell");
    }
    const day = this.locale ? dayjs(slot.start).locale(this.locale) : dayjs(slot.start);
    const now = this.locale ? dayjs().locale(this.locale) : dayjs();
    if (now.format("YYYY") === day.format("YYYY"))
      slotDom.classList.add("thisyear");
    if (now.format("M") === day.format("M")) slotDom.classList.add("thismonth");
    if (now.format("w") === day.format("w")) slotDom.classList.add("thisweek");
    if (now.format("YYYYMMDD") === day.format("YYYYMMDD"))
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

  makeWeeksMark (start) {
    const weeks = document.createElement("div");
    weeks.classList.add("weeksmark");
    const startDay = this.locale ? dayjs(start).locale(this.locale) : dayjs(start);
    weeks.innerHTML = startDay.format(this.config.weeksFormat);
    return weeks;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  adjustSlotWidth (slotDom, count) {
    // if (this.config.type == "row") slotDom.style.width = ((100 / count) - 0.25) + "%"
  }

  makeSlotHeader (slot) {
    super.makeSlotHeader(slot);
    const header = slot.headerDom;
    const altTitle = header.querySelector(".slotAltTitle");
    if (this.config.slotAltTitle) {
      altTitle.innerHTML = this.config.slotTitle;
    } else if (this.config.slotAltTitleFormat) {
      const startDay = this.locale ? dayjs(slot.start).locale(this.locale) : dayjs(slot.start);
      altTitle.innerHTML = startDay.format(this.config.slotAltTitleFormat);
    }
  }
}
