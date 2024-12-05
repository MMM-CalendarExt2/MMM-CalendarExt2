// eslint-disable-next-line no-unused-vars, no-undef
class ViewWeekly extends ViewPeriod {
  constructor (config, events) {
    super(config, events);
    this.slotUnit = "week";
  }

  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("weekly");

    const day = moment(slot.start).locale(this.locale);
    const dayEnd = moment(slot.end).locale(this.locale);
    const now = moment().locale(this.locale);
    if (now.format("YYYY") === day.format("YYYY"))
      slotDom.classList.add("thisyear");
    if (now.format("M") === day.format("M")) slotDom.classList.add("thismonth");
    if (now.format("w") === day.format("w")) slotDom.classList.add("thisweek");
    if (now.isBetween(day, dayEnd)) slotDom.classList.add("today");
    slotDom.classList.add(`year_${day.format("YYYY")}`);
    slotDom.classList.add(`month_${day.format("M")}`);
    slotDom.classList.add(`week_${day.format("w")}`);
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
}
