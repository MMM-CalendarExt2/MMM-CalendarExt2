// eslint-disable-next-line no-unused-vars, no-undef
class ViewMonthly extends ViewPeriod {
  constructor (config, events) {
    super(config, events);
    this.slotUnit = "month";
  }

  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("monthly");
    const day = moment(slot.start).locale(this.locale);
    const dayEnd = moment(slot.end).locale(this.locale);
    const now = moment().locale(this.locale);
    if (now.format("YYYY") === day.format("YYYY"))
      slotDom.classList.add("thisyear");
    if (now.format("M") === day.format("M")) slotDom.classList.add("thismonth");
    if (now.isBetween(day, dayEnd)) slotDom.classList.add("today");
    slotDom.classList.add(`year_${day.format("YYYY")}`);
    slotDom.classList.add(`month_${day.format("M")}`);
  }
}
