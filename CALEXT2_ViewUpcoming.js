// eslint-disable-next-line no-unused-vars, no-undef
class ViewUpcoming extends ViewAgenda {
  makeSlotDomClass (slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("upcoming");
  }

  filterEvents (events) {
    const until = moment().add(this.config.maxDays, "day").endOf("day");
    let filtered = super.filterEvents(events);
    filtered = filtered.filter((e) =>
      moment.unix(e.startDate).isBetween(moment(), until)
    );
    return filtered;
  }
}
