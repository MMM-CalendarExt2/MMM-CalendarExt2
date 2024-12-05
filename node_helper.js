const Log = require("logger");
const moment = require("moment-timezone");
const IcalExpander = require("ical-expander");

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start () {
    this.config = {};
    this.calendars = {};
    this.calendarEvents = {};
  },

  // eslint-disable-next-line no-empty-function
  stop () {},

  socketNotificationReceived (noti, payload) {
    switch (noti) {
      case "START":
        this.work(payload);
        break;
    }
  },

  work (config) {
    this.config = config;
    this.calendars = this.config.calendars;
    if (this.config.locale) {
      moment.locale(this.config.locale);
    }
    this.startScanCalendars();
  },

  startScanCalendars () {
    for (let i = 0; i < this.calendars.length; i++) {
      this.scanCalendar(
        this.calendars[i],
        (calendar, icalData = null, error = null) => {
          this.parser(calendar, icalData, error);
        }
      );
    }
  },

  async scanCalendar (calendar) {
    let response;
    let data;
    Log.log(
      `[CALEXT2] calendar:${calendar.name} >> Scanning start with interval:${calendar.scanInterval}`
    );

    const nodeVersion = process.versions.node;
    const opts = {
      headers: {
        "User-Agent": `Mozilla/5.0 (Node.js ${nodeVersion}) MagicMirror/${global.version} (https://github.com/MagicMirrorOrg/MagicMirror/)`
      },
      gzip: true
    };

    if (calendar.auth && Object.keys(calendar.auth).length > 0) {
      if (calendar.auth.password) {
        // Just catch people who use password instead of pass
        calendar.auth.pass = calendar.auth.password;
      }

      if (calendar.auth.method === "bearer") {
        opts.auth = {
          bearer: calendar.auth.pass
        };
      } else if (calendar.auth.method === "basic") {
        const buff = Buffer.from(`${calendar.auth.user}:${calendar.auth.pass}`);
        opts.headers.Authorization = `Basic ${buff.toString("base64")}`;
      } else {
        opts.auth = {
          user: calendar.auth.user,
          pass: calendar.auth.pass
        };
        if (calendar.auth.method === "digest") {
          opts.auth.sendImmediately = 0;
        } else {
          opts.auth.sendImmediately = 1;
        }
      }
    }

    let {url} = calendar;
    url = url.replace("webcal://", "http://");
    try {
      response = await fetch(url, opts);
      data = await response.text();
    } catch (error) {
      // Probably a connection issue
      Log.log(
        `[CALEXT2] calendar:${calendar.name}: failed to fetch. Will try again. ${error}`
      );
    }

    try {
      this.parser(calendar, data, null);
      setTimeout(() => {
        this.scanCalendar(calendar);
      }, calendar.scanInterval);
    } catch (error) {
      this.parser(calendar, data, error);
      Log.error(`[CALEXT2] Error: ${error}`);

      const errorBody = await error.response.text();
      Log.error(`[CALEXT2] Error body: ${errorBody}`);
    }
  },

  parser (calendar, iCalData = null, error = null) {
    if (error) {
      Log.log(`[CALEXT2] calendar:${calendar.name} >> ${error.message}`);
      return;
    }
    if (!iCalData) {
      Log.log(`[CALEXT2] calendar:${calendar.name} >> No data to fetch`);
      return;
    }
    let icalExpander;
    try {
      icalExpander = new IcalExpander({
        ics: iCalData,
        maxIterations: calendar.maxIterations
      });
    } catch (e) {
      Log.log(`[CALEXT2] calendar:${calendar.name} >> ${e.message}`);
      return;
    }

    let events;
    try {
      events = icalExpander.between(
        moment().subtract(calendar.beforeDays, "days").startOf("day").toDate(),
        moment().add(calendar.afterDays, "days").endOf("day").toDate()
      );
    } catch (e) {
      Log.log(`[CALEXT2] calendar:${calendar.name} >> ${e.message}`);
      return;
    }

    const wholeEvents = [].concat(events.events, events.occurrences);
    const eventPool = [];

    wholeEvents.forEach((item) => {
      const ri = Object.hasOwn(item, "item") ? item.item : item;
      const ev = {};
      ev.calendarId = calendar.uid;
      ev.location = ri.location;
      ev.description = ri.description;
      ev.title = ri.summary;
      ev.isRecurring = ri.isRecurring();
      ev.isCancelled =
        Object.hasOwn(item, "component") &&
        // eslint-disable-next-line no-eq-null, eqeqeq
        item.component.getFirstPropertyValue("status") != null &&
        item.component.getFirstPropertyValue("status").toUpperCase() === "CANCELLED";
      if (
        Array.isArray(calendar.replaceTitle) &&
        calendar.replaceTitle.length > 0
      ) {
        for (let j = 0; j < calendar.replaceTitle.length; j++) {
          const rt = calendar.replaceTitle[j];
          const re = rt[0] instanceof RegExp ? rt[0] : new RegExp(rt[0], "gu");
          const rto = rt[1] ? rt[1] : "";
          ev.title = ev.title.replace(re, rto);
        }
      }

      let startDate;
      let endDate;
      if (calendar.forceLocalTZ) {
        const ts = item.startDate.toJSON();
        ts.month -= 1;
        const te = item.endDate.toJSON();
        te.month -= 1;
        startDate = moment(ts);
        endDate = moment(te);
      } else {
        startDate = moment(item.startDate.toJSDate());
        endDate = moment(item.endDate.toJSDate());
      }
      ev.startDate = startDate.format("X");
      ev.endDate = endDate.format("X");
      ev.startDateJ = startDate.toJSON();
      ev.endDateJ = endDate.toJSON();
      ev.duration = ri.duration.toSeconds();
      ev.isMoment = ev.duration === 0;
      ev.isPassed = Boolean(endDate.isBefore(moment()));
      if (ev.duration <= 86400) {
        if (startDate.format("YYMMDD") === endDate.format("YYMMDD")) {
          ev.isOneday = true;
        } else if (endDate.format("HHmmss") === "000000") {
          ev.isOneday = true;
        }
      }
      ev.className = calendar.className;
      ev.icon = calendar.icon;
      const isFullday = Boolean(
        startDate.format("HHmmss") === "000000" &&
        endDate.format("HHmmss") === "000000"
      );
      ev.isFullday = isFullday;

      // import the Microsoft property X-MICROSOFT-CDO-BUSYSTATUS, fall back to "BUSY" in case none was found
      // possible values are 'FREE'|'TENTATIVE'|'BUSY'|'OOF' acording to
      // https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcical/cd68eae7-ed65-4dd3-8ea7-ad585c76c736
      ev.ms_busystatus =
        ri.component.getFirstPropertyValue("x-microsoft-cdo-busystatus") ||
        "BUSY";

      ev.uid = ri.uid
        ? `${calendar.uid}:${ev.startDate}:${ev.endDate}:${ri.uid}`
        : `${calendar.uid}:${ev.startDate}:${ev.endDate}:${ev.title}`;
      ev.calendarName = calendar.name;
      if (calendar.filter) {
        const f = JSON.parse(calendar.filter).filter;
        // the calender.filter could be a string, so we have to upcycle it to a function (at least that's what klaernie thinks this does)
        const filter = Function(`return ${f.toString()}`); // eslint-disable-line no-new-func
        const r = filter(ev);
        if (r(ev)) {
          eventPool.push(ev);
        } else {
          // do nothing
        }
      } else {
        eventPool.push(ev);
      }
    });
    eventPool.slice(calendar.maxItems);
    Log.log(
      `[CALEXT2] calendar:${calendar.name} >> Scanned: ${wholeEvents.length}, Selected: ${eventPool.length}`
    );
    this.mergeEvents(eventPool, calendar.uid);
  },

  mergeEvents (eventPool, calendarId) {
    this.calendarEvents[calendarId] = eventPool;
    let events = [];
    Object.keys(this.calendarEvents).forEach((i) => {
      if (Object.hasOwn(this.calendarEvents, i)) {
        const cal = this.calendarEvents[i];
        events = events.concat(cal);
      }
    });

    // only run sorting and deduplication is the user actually wants it
    if (
      Array.isArray(this.config.deduplicateEventsOn) &&
      this.config.deduplicateEventsOn.length > 0
    ) {
      // copied from https://stackoverflow.com/a/34853778
      const spaceship = (val1, val2) => {
        if (val1 === null || val2 === null || typeof val1 !== typeof val2) {
          return null;
        }
        if (typeof val1 === "string") {
          return val1.localeCompare(val2);
        }

        if (val1 > val2) {
          return 1;
        }
        if (val1 < val2) {
          return -1;
        }
        return 0;
      };

      const compareThem = (a, b) => {

        for (const property of this.config.deduplicateEventsOn) {
          const comparisonResult = spaceship(a[property], b[property]);
          // if the comparison has found an order change
          // immediately return to not waste more cycles
          if (comparisonResult !== null && comparisonResult !== 0) {
            return comparisonResult;
          }
        }

        // if the order hasn't been changed, these two events must be identical
        return 0;
      };

      // first sort all events by the properties they should be deduplicated on
      events.sort(compareThem);

      // now do the actual deduplication
      events = events.filter((event, eventIndex) => {
        if (eventIndex === 0) {
          return true;
        }
        // use the comparison again, but now events where the immediate
        // predecessor is identical will be removed
        const oldEvent = events[eventIndex - 1];
        if (compareThem(oldEvent, event) === 0) {
          // as most typically the duplicate event comes from another calendar merge the two calendarNames
          if (!Object.hasOwn(oldEvent, "calendarNames")) {
            oldEvent.calendarNames = new Set([oldEvent.calendarName]);
          }
          oldEvent.calendarNames.add(event.calendarName);
          oldEvent.calendarName = [...oldEvent.calendarNames].sort().join("|");
          // now we can exclude this event
          return false;
        }
        // finally keep all other events
        return true;
      });
    }

    if (events.length > 0) {
      this.sendSocketNotification("EVENTS_REFRESHED", events);
    }
  }
});
