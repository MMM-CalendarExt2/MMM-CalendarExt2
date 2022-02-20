class ViewAgenda extends View { // eslint-disable-line no-unused-vars, no-undef
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

