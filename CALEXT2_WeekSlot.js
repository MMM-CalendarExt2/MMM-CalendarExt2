/* global CellSlot Slot */
// eslint-disable-next-line no-unused-vars
class WeekSlot extends Slot {
  constructor (view, period, seq = 0) {
    super(view, period, seq);
    this.useEventTimeRelative = false;
    this.dom.appendChild(view.makeWeeksMark(period.start));
    const cellPeriods = view.getSubSlotPeriods(period.start);
    const swClass = view.config.showWeekends ? "showWeekends" : "hideWeekends";
    this.dom.classList.add(swClass);
    this.cellSlots = [];
    for (let i = 0; i < cellPeriods.length; i++) {
      const cellSlot = new CellSlot(view, cellPeriods[i], i, seq);
      this.cellSlots.push(cellSlot);
      this.contentDom.appendChild(cellSlot.dom);
    }
  }

  static factory (view, slotPeriods, events) {
    const slots = [];
    for (let i = 0; i < slotPeriods.length; i++) {
      const slot = new WeekSlot(view, slotPeriods[i], i);
      slot.assignEvents(events);
      slots.push(slot);
    }
    return slots;
  }

  makeDom () {
    super.makeDom();
    const timeline = document.createElement("div");
    timeline.classList.add("timeline");
    this.dom.appendChild(timeline);
    this.timelineDom = timeline;
  }

  getDayPeriods () {
    const periods = [];
    for (let i = 0; i < this.cellSlots.length; i++) {
      const c = this.cellSlots[i];
      const cR = c.dom.getBoundingClientRect();
      periods.push({
        start: c.start,
        end: c.end,
        startX: c.start.format("X"),
        endX: c.end.format("X"),
        eventCount: 0,
        left: cR.left
      });
    }
    return periods;
  }

  makeCellEvent (data) {
    const event = new Event(data, this);
    return event.dom;
  }

  drawEvents () {
    const fcs = this.contentDom.querySelectorAll(".cellSlot");
    const positions = [...fcs].map((dom) => {
      const t = dom.getBoundingClientRect();
      return t;
    });

    const fcc = this.contentDom
      .querySelector(".cellSlot .slotContent")
      .getBoundingClientRect();
    const fch = this.contentDom
      .querySelector(".cellSlot .slotHeader")
      .getBoundingClientRect();
    this.timelineDom.style.top = `${fch.height}px`;
    this.timelineDom.style.height = `${fcc.height}px`;
    const parentPosition = this.timelineDom.getBoundingClientRect();

    const getOccupyBin = (event, dayPeriods) => {
      const dayEnd = dayPeriods[dayPeriods.length - 1].endX;
      const dayStart = dayPeriods[0].startX;
      const stX = event.startDate < dayStart ? dayStart : event.startDate;
      const etX = event.endDate > dayEnd ? dayEnd : event.endDate;
      let ob = 0;
      for (let i = 0; i < dayPeriods.length; i++) {
        if (stX <= dayPeriods[i].endX && etX > dayPeriods[i].startX) {
          ob += 2 ** i;
        }
      }
      return ob;
    };

    const dayPeriods = this.getDayPeriods();
    const {timelineDom} = this;
    const timelines = [];
    let tlDom;
    for (let j = 0; j < this.events.length; j++) {
      const event = this.events[j];
      const occu = getOccupyBin(event, dayPeriods);

      if (occu > 0) {
        let inserted = false;
        const occuStr = (2 ** dayPeriods.length + occu)
          .toString(2)
          .slice(1)
          .split("")
          .reverse()
          .join("");
        for (let k = 0; k < dayPeriods.length; k++) {
          const dp = dayPeriods[k];
          if (
            moment.unix(event.startDate).isBefore(dp.end) &&
            moment.unix(event.endDate).isAfter(dp.start)
          ) {
            dayPeriods[k].eventCount += 1;
          }
        }
        // var eventDom = this.createEventDom(event, slot.startX, occuStr, dayPeriods.length)

        const eventDom = this.makeCellEvent(event);

        // eslint-disable-next-line no-unused-vars
        const isFullday = Boolean(event.isFullday);

        const pos = occuStr.search("1");
        const dayDuration = occuStr.split("1").length - 1;
        const endPos = pos + dayDuration - 1;

        const left = positions[pos].left - parentPosition.left;
        const width =
          positions[endPos].left -
          positions[pos].left +
          positions[endPos].width;
        eventDom.style.left = `${left}px`;
        eventDom.style.width = `${width - this.slotSpaceRight}px`;
        eventDom.style.boxSizing = "border-box";

        for (let k = 0; k < timelines.length; k++) {
          const tl = timelines[k];
          // eslint-disable-next-line no-bitwise
          if ((tl & occu) < 1) {
            const tlDoms = timelineDom.querySelectorAll(".timelineSleeve");
            tlDom = tlDoms[k];
            // eslint-disable-next-line no-bitwise, operator-assignment
            timelines[k] = timelines[k] | occu;
            tlDom.appendChild(eventDom);
            inserted = true;
            break;
          }
        }
        if (!inserted) {
          timelines.push(occu);
          tlDom = document.createElement("div");
          tlDom.classList.add("timelineSleeve");
          tlDom.appendChild(eventDom);
          timelineDom.appendChild(tlDom);
        }
        timelineDom.dataset.occupy = timelines;
      }
    }

    if (this.maxHeight === "auto") {
      const slots = this.contentDom.querySelectorAll(".cellSlot .slotContent");
      for (let l = 0; l < slots.length; l++) {
        slots[l].style = `height: ${timelineDom.scrollHeight}px`;
      }
    } else if (timelineDom.scrollHeight > timelineDom.clientHeight) {
      tlDom = timelineDom.querySelectorAll(".timelineSleeve");
      const tlRect = tlDom[0].getBoundingClientRect();
      const shown = Math.floor(timelineDom.clientHeight / tlRect.height);
      for (let l = shown; l < tlDom.length; l++) {
        tlDom[l].style.display = "none";
      }
      const td = this.contentDom.querySelectorAll(".cellSlot .slotFooter");
      for (let l = 0; l < dayPeriods.length; l++) {
        const he = dayPeriods[l].eventCount - shown;
        if (he > 0) {
          td[l].innerHTML = `+ ${he}`;
        }
      }
    }
    // return event.draw(this, this.contentDom)
  }
}
