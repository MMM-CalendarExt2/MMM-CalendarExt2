/* global dayjs */
// eslint-disable-next-line no-unused-vars, no-undef
class ViewAgenda extends View {
  constructor (config, events) {
    super(config, events);
    this.slotUnit = "day";
  }

  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("agenda", "period");
  }

  // eslint-disable-next-line class-methods-use-this
  getSlotCount () {
    return 1;
  }

  getStartDay () {
    const now = this.locale ? dayjs().locale(this.locale) : dayjs();
    return now;
  }

  getSlotPeriods () {
    return [
      {
        start: this.locale ? dayjs().locale(this.locale) : dayjs(),
        end: null
      }
    ];
  }

  makeSlotHeader (slot) {
    const header = slot.headerDom;
    const title = header.querySelector(".slotTitle");
    title.innerHTML = this.config.slotTitle;
  }
}
