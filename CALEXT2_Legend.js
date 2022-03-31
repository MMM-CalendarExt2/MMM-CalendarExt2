class ViewLegend {
  constructor(config, events) {
    this.config = config;
    this.locale = config.locale;
    this.slotUnit = null;
    this.slotPeriods = [];
    this.slots = [];
    this.contentDom = null;
    this.moduleDom = null;
    this.containerDom = null;
    this.calendars = config.calendars;
    this.createDom();
  }

  createDom() {
    const module = document.createElement("div");
    module.classList.add("module", "fake_module", "MMM-CalendarExt2-Legend", "CX2");
    if (this.config.sceneClassName)
      module.classList.add(this.config.sceneClassName);
    if (this.config.title) {
      const header = document.createElement("header");
      header.classList.add("module-header");
      module.appendChild(header);
    }
    const content = document.createElement("div");
    content.classList.add("module-content");
    const viewDom = document.createElement("div");
    viewDom.classList.add("view");
    if (this.config.className) viewDom.classList.add(this.config.className);
    viewDom.classList.add(this.config.mode);
    this.viewDomType(viewDom);
    content.appendChild(viewDom);
    module.appendChild(content);
    module.classList.add("hidden");
    this.contentDom = viewDom;
    this.moduleDom = module;
  }

  // eslint-disable-next-line class-methods-use-this
  viewDomType() {
    // do nothing;
  }

  draw() {
    this.drawDom();
    this.drawLegend();
  }

  drawLegend() {
    for (let i = 0; i < this.config.calendarLegends.length; i++) {
      const calendar = this.config.calendarLegends[i];
      const tlDom = document.createElement("div");
      tlDom.classList.add("legend-slot");
      tlDom.dataset.calendarName = calendar.name;
      if (calendar.className) {
        tlDom.classList.add(calendar.className);
      }
      if (calendar.icon) {
        const iconDom = document.createElement("div");
        iconDom.classList.add("iconify", "eventIcon");
        iconDom.dataset.icon = calendar.icon;
        tlDom.appendChild(iconDom);
      }
      const title = document.createElement("div");
      title.innerHTML = calendar.name;
      title.classList.add("eventTitle");
      tlDom.appendChild(title);

      this.contentDom.append(tlDom);
      console.log(calendar, this);
    }
  }

  drawDom() {
    const container = View.getRegionDom(this.config.position);
    const children = container.children;
    const order = this.config.positionOrder;
    if (order === -1) {
      container.appendChild(this.moduleDom);
    } else if (order >= 0 && order < children.length) {
      container.insertBefore(this.moduleDom, children[order]);
    } else {
      container.appendChild(this.moduleDom);
    }

    if (container.style.display === "none") {
      container.style.display = "block";
    }
    this.containerDom = container;
    this.show();
  }

  show() {
    if (this.moduleDom) {
      if (this.moduleDom.classList.contains("hidden")) {
        this.moduleDom.classList.remove("hidden");
        this.moduleDom.classList.add("shown");
      }
    }
  }
}
