/* global View */
// eslint-disable-next-line no-unused-vars, no-undef
class ViewLegend extends View {
  draw() {
    this.drawDom();
    this.drawLegend();
  }

  drawLegend() {
    this.moduleDom.classList.remove("MMM-CalendarExt2");
    this.moduleDom.classList.add("MMM-CalendarExt2-Legend");
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
    }
  }
}
