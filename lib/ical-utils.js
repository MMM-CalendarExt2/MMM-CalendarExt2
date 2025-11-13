const ICAL = require("ical.js");

/**
 * Extract attendees from an iCal component
 * @param {Object} vevent - The iCal vevent component
 * @returns {Array} Array of attendee objects with name, email, and status
 */
const extractAttendees = (vevent) => {
  const attendeeProperties = vevent.getAllProperties("attendee");
  return attendeeProperties.map((att) => {
    const email = att.getFirstValue().replace("mailto:", "");
    const name = att.getParameter("cn");
    const status = att.getParameter("partstat") || "NEEDS-ACTION";
    const role = att.getParameter("role") || "REQ-PARTICIPANT";

    // Obfuscate email domain for privacy (user@example.com -> user@***.com)
    let displayEmail = email;
    if (email.includes("@")) {
      const [localPart, domain] = email.split("@");
      const topLevel = domain.includes(".") ? domain.slice(domain.lastIndexOf(".")) : "";
      displayEmail = `${localPart}@***${topLevel}`;
    }

    return {
      name: name || displayEmail,
      email: displayEmail,
      status,
      role
    };
  });
};

/**
 * Parse iCal data and expand recurring events using ical.js
 * @param {string} iCalData - The iCal data string
 * @param {Date} startDate - Start date for event range
 * @param {Date} endDate - End date for event range
 * @param {number} maxIterations - Maximum iterations for recurring events
 * @returns {Object} Object containing events and occurrences arrays
 */
const parseAndExpandEvents = (iCalData, startDate, endDate, maxIterations = 1000) => {
  let jcalData;
  try {
    jcalData = ICAL.parse(iCalData);
  } catch (error) {
    throw new Error("Failed to parse iCal data", {
      cause: error
    });
  }

  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents("vevent");

  const events = [];
  const occurrences = [];

  for (const vevent of vevents) {
    const event = new ICAL.Event(vevent);

    if (event.isRecurring()) {
      const iterator = event.iterator();
      let count = 0;
      let occurrence;

      while ((occurrence = iterator.next()) && count < maxIterations) {
        const occurrenceStartDate = occurrence.toJSDate();
        const occurrenceEndDate = new Date(occurrenceStartDate.getTime() + event.duration.toSeconds() * 1000);

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
              duration: event.duration,
              component: vevent,
              attendees: extractAttendees(vevent)
            },
            component: vevent
          });
        }

        count += 1;

        if (occurrenceStartDate > endDate) {
          break;
        }
      }
    } else {
      const eventStartDate = event.startDate.toJSDate();
      const eventEndDate = event.endDate.toJSDate();

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
          component: vevent,
          attendees: extractAttendees(vevent)
        });
      }
    }
  }

  return {
    events,
    occurrences
  };
};

module.exports = {
  parseAndExpandEvents
};
