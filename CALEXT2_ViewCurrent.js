class ViewCurrent extends ViewAgenda { // eslint-disable-line no-unused-vars, no-undef
  constructor(config, events) {
    super(config, events);
  }

  makeSlotDomClass(slot) {
    const slotDom = slot.dom;
    super.makeSlotDomClass(slot);
    slotDom.classList.add("current");
  }

  filterEvents(events) {
    let filtered = super.filterEvents(events);
    const now = moment();
    filtered = filtered.filter((e) => {
      if (now.isBetween(moment.unix(e.startDate), moment.unix(e.endDate)))
        return true;
    });
    return filtered;
  }
}

