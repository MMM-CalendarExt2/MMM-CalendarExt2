// eslint-disable-next-line no-unused-vars, no-undef
class ViewCurrent extends ViewAgenda {
  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("current");
  }

  filterEvents (events) {
    let filtered = super.filterEvents(events);
    const now = moment();
    filtered = filtered.filter((e) =>
      now.isBetween(moment.unix(e.startDate), moment.unix(e.endDate))
    );
    return filtered;
  }
}
