class ViewUpcoming extends ViewAgenda {
  constructor(config, events) {
    super(config, events);
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("upcoming");
  }

  filterEvents(events) {
    const until = moment().add(this.config.maxDays, "day").endOf("day");
    let filtered = super.filterEvents(events);
    filtered = filtered.filter((e) => {
      if (moment.unix(e.startDate).isBetween(moment(), until)) return true;
    });
    return filtered;
  }
}

