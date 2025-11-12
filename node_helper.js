const Log = require("logger");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
const isBetween = require("dayjs/plugin/isBetween");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);

const NodeHelper = require("node_helper");
const {parseAndExpandEvents} = require("./lib/ical-utils");
const CalendarFetcher = require("./lib/calendar-fetcher");

module.exports = NodeHelper.create({
  start () {
    this.config = {};
    this.calendars = {};
    this.calendarEvents = {};
    this.calendarFetchers = {};
  },

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
      dayjs.locale(this.config.locale);
    }
    this.startScanCalendars();
  },

  /**
   * Starts all configured calendar fetchers.
   */
  startScanCalendars () {
    for (const calendar of this.calendars) {
      this.scanCalendar(calendar);
    }
  },

  /**
   * Scans a single calendar, fetches its data, and processes its events.
   * @param {Object} calendar - The calendar configuration object.
   */
  scanCalendar (calendar) {
    Log.log(
      `[CALEXT2] calendar:${calendar.name} >> Scanning start with interval:${calendar.scanInterval}`
    );

    const key = calendar.uid || calendar.url || calendar.name;

    // Create fetcher if it doesn't exist
    if (!this.calendarFetchers[key]) {
      let {url} = calendar;
      url = url.replace("webcal://", "http://");

      // Prepare auth object
      let auth = null;
      if (calendar.auth && Object.keys(calendar.auth).length > 0) {
        if (calendar.auth.password) {
          calendar.auth.pass = calendar.auth.password;
        }
        auth = {
          method: calendar.auth.method || "basic",
          user: calendar.auth.user,
          pass: calendar.auth.pass
        };
      }

      // Prepare options
      const nodeVersion = process.versions.node;
      const options = {
        userAgent: `Mozilla/5.0 (Node.js ${nodeVersion}) MagicMirror/${global.version} (https://github.com/MagicMirrorOrg/MagicMirror/)`,
        authFailureCooldown: calendar.authFailureCooldown || this.config.authFailureCooldown,
        rateLimitCooldown: calendar.rateLimitCooldown || this.config.rateLimitCooldown,
        clientErrorCooldown: calendar.clientErrorCooldown || this.config.clientErrorCooldown,
        onSuccess: (data) => this.parser(calendar, data, null),
        onError: (error) => this.parser(calendar, null, error)
      };

      // Create fetcher instance
      this.calendarFetchers[key] = new CalendarFetcher(
        url,
        calendar.scanInterval,
        auth,
        options
      );
    }

    // Start fetching
    this.calendarFetchers[key].start();
  },

  parser (calendar, iCalData = null, error = null) {
    if (error) {
      Log.error(`[CALEXT2] calendar:${calendar.name} >> Error: ${error.message || error}`);
      return;
    }
    if (!iCalData) {
      Log.log(`[CALEXT2] calendar:${calendar.name} >> No data to fetch`);
      return;
    }

    let events;
    try {
      const startDate = dayjs().subtract(calendar.beforeDays, "days").startOf("day").toDate();
      const endDate = dayjs().add(calendar.afterDays, "days").endOf("day").toDate();

      events = parseAndExpandEvents(
        iCalData,
        startDate,
        endDate,
        calendar.maxIterations
      );
    } catch (e) {
      Log.log(`[CALEXT2] calendar:${calendar.name} >> ${e.message}`);
      return;
    }

    const wholeEvents = [...events.events, ...events.occurrences];
    let eventPool = [];

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
        item.component &&
        typeof item.component.getFirstPropertyValue === "function" &&
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
        startDate = dayjs(item.startDate.toJSDate()).subtract(1, "months");
        endDate = dayjs(item.endDate.toJSDate()).subtract(1, "months");
      } else {
        startDate = dayjs(item.startDate.toJSDate());
        endDate = dayjs(item.endDate.toJSDate());
      }
      ev.startDate = startDate.unix();
      ev.endDate = endDate.unix();
      ev.startDateJ = startDate.toJSON();
      ev.endDateJ = endDate.toJSON();
      ev.duration = ri.duration.toSeconds();
      ev.isMoment = ev.duration === 0;
      ev.isPassed = Boolean(endDate.isBefore(dayjs()));
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
      // possible values are 'FREE'|'TENTATIVE'|'BUSY'|'OOF' according to
      // https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxcical/cd68eae7-ed65-4dd3-8ea7-ad585c76c736
      ev.ms_busystatus = "BUSY";
      if (ri.component && typeof ri.component.getFirstPropertyValue === "function") {
        ev.ms_busystatus =
          ri.component.getFirstPropertyValue("x-microsoft-cdo-busystatus") ||
          "BUSY";
      }

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
    eventPool = eventPool.slice(0, calendar.maxItems);
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
