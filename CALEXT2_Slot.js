// eslint-disable-next-line no-unused-vars
class Slot {
  constructor (view, period, seq = 0) {
    this.start = period.start;
    this.end = period.end;
    this.seq = seq;
    this.locale = view.config.locale;
    this.useEventTimeRelative = view.config.useEventTimeRelative;
    this.hideOverflow = view.config.hideOverflow;
    this.hideFooter = view.config.hideFooter;
    this.slotSpaceRight = view.config.slotSpaceRight;
    this.maxHeight = view.config.slotMaxHeight;
    this.relativeFormat = view.config.relativeFormat;
    this.timeFormat = view.config.timeFormat;
    this.dateFormat = view.config.dateFormat;
    this.dateTimeFormat = view.config.dateTimeFormat;
    this.events = [];
    this.init(view);

    if (this.hideFooter) {
      this.dom.classList.add("hideFooter");
    }
  }

  init (view) {
    this.makeDom();
    this.makeSlotHeader(view);
    this.makeSlotDomClass(view, this.seq);
  }

  destroy () {
    this.dom.remove();

    for (const property in this) {
      if (Object.hasOwn(this, property)) {
        this[property] = null;
      }
    }
  }

  static factory (view, slotPeriods, events) {
    const slots = [];
    for (let i = 0; i < slotPeriods.length; i++) {
      const slot = new Slot(view, slotPeriods[i], i);
      slot.assignEvents(events);
      slots.push(slot);
    }
    return slots;
  }

  drawEvents () {
    let hiddenCount = 0;
    for (let i = 0; i < this.events.length; i++) {
      const event = new Event(this.events[i], this);
      hiddenCount += this.drawEvent(event);
    }
    if (hiddenCount > 0) {
      this.footerDom.querySelector(".hiddenCount").innerHTML =
        `+ ${hiddenCount}`;
    }
  }

  drawEvent (event) {
    return event.draw(this, this.contentDom);
  }

  assignEvents (events) {
    for (let i = 0; i < events.length; i++) {
      const event = {...events[i]};
      const eS = moment.unix(event.startDate).locale(this.locale);
      const eE = moment.unix(event.endDate).locale(this.locale);
      if (eE.isSameOrBefore(this.start) || eS.isSameOrAfter(this.end)) {
        // do nothing
      } else {
        if (eS.isBetween(this.start, this.end, null, "[)"))
          event.startHere = true;
        if (eE.isBetween(this.start, this.end, null, "(])"))
          event.endHere = true;
        if (eE.format("HHmmss") === "000000")
          event.endDate = moment(eE).add(-1, "second").endOf("day").format("X");
        this.events.push(event);
      }
    }
    this.dom.classList.add(`eventCount_${this.events.length}`);
  }

  makeSlotHeader (view) {
    view.makeSlotHeader(this);
  }

  makeSlotDomClass (view, seq) {
    view.makeSlotDomClass(this, seq);
  }

  makeDom () {
    const dom = document.createElement("div");
    dom.classList.add("slot");

    if (this.start) dom.dataset.start = moment(this.start).format("X");
    if (this.end) dom.dataset.end = moment(this.end).format("X");

    const header = document.createElement("div");
    header.classList.add("slotHeader");
    const title = document.createElement("div");
    title.classList.add("slotTitle");
    const subTitle = document.createElement("div");
    subTitle.classList.add("slotSubTitle");
    const altTitle = document.createElement("div");
    altTitle.classList.add("slotAltTitle");
    header.appendChild(title);
    header.appendChild(altTitle);
    header.appendChild(subTitle);

    const content = document.createElement("div");
    content.classList.add("slotContent");

    const footer = document.createElement("div");
    footer.classList.add("slotFooter");
    const hiddenCount = document.createElement("div");
    hiddenCount.classList.add("hiddenCount");
    footer.appendChild(hiddenCount);

    dom.appendChild(header);
    dom.appendChild(content);
    dom.appendChild(footer);

    this.dom = dom;
    this.headerDom = header;
    this.contentDom = content;
    this.footerDom = footer;
  }
}
