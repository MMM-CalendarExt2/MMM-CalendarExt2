/* global Slot */
// eslint-disable-next-line no-unused-vars
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
    CellSlot.adjustSlotHeight(view, this.contentDom);
  }

  static adjustSlotHeight(view, dom) {
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
