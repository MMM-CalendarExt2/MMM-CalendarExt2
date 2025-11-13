/* global dayjs */
// eslint-disable-next-line no-unused-vars, no-undef
class ViewCurrent extends ViewAgenda {
  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("current");
  }

  filterEvents (events) {
    let filtered = super.filterEvents(events);
    const now = dayjs();
    filtered = filtered.filter((e) =>
      now.isBetween(dayjs.unix(e.startDate), dayjs.unix(e.endDate), null, "[)"));
    return filtered;
  }
}
