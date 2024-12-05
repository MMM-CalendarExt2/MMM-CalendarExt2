/* global ViewCell */
// eslint-disable-next-line no-unused-vars
class ViewMonth extends ViewCell {
  getSlotCount () {
    const startDay = this.getStartDay();
    const endDay = this.getEndWeek();
    const diff = endDay.diff(startDay, "week");
    return diff + 1;
  }

  getStartDay () {
    const {fromNow} = this.config;
    const now = moment().locale(this.locale);
    return now.add(fromNow, "month").startOf("month").startOf("week");
  }

  getEndWeek () {
    const {fromNow} = this.config;
    const now = moment().locale(this.locale);
    return now.add(fromNow, "month").endOf("month").startOf("week");
  }

  makeSlots () {
    super.makeSlots();
    if (this.config.monthFormat) {
      const {fromNow} = this.config;
      const now = moment().locale(this.locale);
      now.add(fromNow, "month").startOf("month");
      const mt = document.createElement("div");
      mt.innerHTML = now.format(this.config.monthFormat);
      mt.classList.add("monthViewTitle");
      this.contentDom.prepend(mt);
    }
  }
}
