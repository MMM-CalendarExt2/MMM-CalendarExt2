const Log = require("logger");
const moment = require("moment-timezone");
const ICAL = require("ical.js");

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

  /**
   * Scans all configured calendars and processes their events sequentially.
   */
  startScanCalendars () {
    // Process calendars sequentially to avoid concurrent fetches
    (async () => {
      for (const calendar of this.calendars) {
        // eslint-disable-next-line no-await-in-loop
        await this.scanCalendar(calendar);
      }
    })().catch((err) => {
      Log.error(`[CALEXT2] Error in startScanCalendars: ${err}`);
    });
  },

  /**
   * Scans a single calendar, fetches its data, and processes its events.
   * @param {Object} calendar - The calendar configuration object.
   */
  async scanCalendar (calendar) {
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

    let data;
    let {url} = calendar;
    url = url.replace("webcal://", "http://");
    try {
      const response = await fetch(url, opts);
      data = await response.text();
    } catch (error) {
      // Probably a connection issue
      Log.error(
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

      if (error.response && typeof error.response.text === "function") {
        const errorBody = await error.response.text();
        Log.error(`[CALEXT2] Error body: ${errorBody}`);
      }
    }
  },

  /**
   * Parse iCal data and expand recurring events using ical.js
   * @param {string} iCalData - The iCal data string
   * @param {Date} startDate - Start date for event range
   * @param {Date} endDate - End date for event range
   * @param {number} maxIterations - Maximum iterations for recurring events
   * @returns {Object} Object containing events and occurrences arrays
   */
  parseAndExpandEvents (iCalData, startDate, endDate, maxIterations = 1000) {
    let jcalData;
    try {
      jcalData = ICAL.parse(iCalData);
    } catch (error) {
      throw new Error(`Failed to parse iCal data: ${error.message}`);
    }

    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");

    const events = [];
    const occurrences = [];

    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent);

      if (event.isRecurring()) {
        // Handle recurring events
        const iterator = event.iterator();
        let count = 0;
        let occurrence;

        while ((occurrence = iterator.next()) && count < maxIterations) {
          const occurrenceStartDate = occurrence.toJSDate();
          const occurrenceEndDate = new Date(occurrenceStartDate.getTime() + event.duration.toSeconds() * 1000);

          // Check if this occurrence falls within our date range
          if (occurrenceEndDate >= startDate && occurrenceStartDate <= endDate) {
            occurrences.push({
              startDate: {
                toJSDate: () => occurrenceStartDate
              },
              endDate: {
                toJSDate: () => occurrenceEndDate
              },
              item: {
                summary: event.summary,
                location: event.location,
                description: event.description,
                uid: event.uid,
                isRecurring: () => true,
                duration: event.duration
              },
              component: vevent
            });
          }

          count += 1;

          // Stop if we've gone past our end date
          if (occurrenceStartDate > endDate) {
            break;
          }
        }
      } else {
        // Handle single events
        const eventStartDate = event.startDate.toJSDate();
        const eventEndDate = event.endDate.toJSDate();

        // Check if this event falls within our date range
        if (eventEndDate >= startDate && eventStartDate <= endDate) {
          events.push({
            startDate: {
              toJSDate: () => eventStartDate
            },
            endDate: {
              toJSDate: () => eventEndDate
            },
            summary: event.summary,
            location: event.location,
            description: event.description,
            uid: event.uid,
            isRecurring: () => false,
            duration: event.duration,
            component: vevent
          });
        }
      }
    }

    return {
      events,
      occurrences
    };
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
      const startDate = moment().subtract(calendar.beforeDays, "days").startOf("day").toDate();
      const endDate = moment().add(calendar.afterDays, "days").endOf("day").toDate();

      events = this.parseAndExpandEvents(
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
        startDate = moment(item.startDate.toJSDate()).subtract(1, "months");
        endDate = moment(item.endDate.toJSDate()).subtract(1, "months");
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
      // possible values are 'FREE'|'TENTATIVE'|'BUSY'|'OOF' according to
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
