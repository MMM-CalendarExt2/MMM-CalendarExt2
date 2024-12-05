/* global ViewPeriod */
// eslint-disable-next-line no-unused-vars
class ViewDaily extends ViewPeriod {
  constructor (config, events) {
    super(config, events);
    this.slotUnit = "day";
  }

  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("daily");

    const day = moment(slot.start).locale(this.locale);
    const now = moment().locale(this.locale);
    if (now.format("YYYY") === day.format("YYYY"))
      slotDom.classList.add("thisyear");
    if (now.format("M") === day.format("M")) slotDom.classList.add("thismonth");
    if (now.format("w") === day.format("w")) slotDom.classList.add("thisweek");
    if (now.format("YYYYMMDD") === day.format("YYYYMMDD"))
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
