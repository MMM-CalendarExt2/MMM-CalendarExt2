/* global View */
// eslint-disable-next-line no-unused-vars
class ViewLegend extends View {
  draw () {
    this.drawDom();
    this.drawLegend();
  }

  drawLegend () {
    for (let i = 0; i < this.config.calendarLegends.length; i++) {
      const calendar = this.config.calendarLegends[i];
      const tlDom = document.createElement("div");
      tlDom.classList.add("legendSlot", "event");
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
    }
    this.makeModuleTitle();
  }

  makeModuleTitle () {
    if (!this.config.title) return;
    const headerTitle = this.moduleDom.getElementsByClassName("module-header");
    headerTitle[0].innerHTML = this.config.title;
  }
}
