const assert = require("node:assert/strict");
const {describe, it, mock} = require("node:test");
const Module = require("module");

// ---------------------------------------------------------------------------
// Mock MagicMirror runtime dependencies that are not available outside the
// MagicMirror process. 'node_helper' is intercepted so that NodeHelper.create
// simply returns the plain method object, giving us direct access to parser().
// ---------------------------------------------------------------------------
const loggerMock = {
  log: mock.fn(),
  warn: mock.fn(),
  error: mock.fn(),
  debug: mock.fn(),
  info: mock.fn()
};

/* eslint-disable no-underscore-dangle */
const originalLoad = Module._load.bind(Module);
Module._load = (request, parent, isMain) => {
  if (request === "logger") return loggerMock;
  if (request === "node_helper") return {create: (obj) => obj};
  return originalLoad(request, parent, isMain);
};
/* eslint-enable no-underscore-dangle */

const helperMethods = require("../node_helper.js");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const joinIcs = (...lines) => `${lines.join("\n")}\n`;

// Build DTSTART/DTEND strings 30 days in the future so the events always fall
// inside the beforeDays:60 / afterDays:365 window regardless of when the tests run.
const futureDate = new Date(Date.now() + 30 * 86400000);
const dtDay = futureDate.toISOString().replaceAll(/[-:T.Z]/gu, "").slice(0, 8);
const ICS_TWO_EVENTS = joinIcs(
  "BEGIN:VCALENDAR",
  "VERSION:2.0",
  "BEGIN:VEVENT",
  "UID:evt-keep",
  "SUMMARY:Keep",
  `DTSTART:${dtDay}T100000Z`,
  `DTEND:${dtDay}T110000Z`,
  "END:VEVENT",
  "BEGIN:VEVENT",
  "UID:evt-drop",
  "SUMMARY:Drop",
  `DTSTART:${dtDay}T120000Z`,
  `DTEND:${dtDay}T130000Z`,
  "END:VEVENT",
  "END:VCALENDAR"
);

const makeCalendar = (overrides = {}) => ({
  uid: 0,
  name: "test-cal",
  beforeDays: 60,
  afterDays: 365,
  maxIterations: 100,
  maxItems: 1000,
  replaceTitle: [],
  className: "",
  icon: "",
  forceLocalTZ: false,
  filter: null,
  ...overrides
});

/**
 * Build a minimal execution context that mirrors the relevant state
 * the node_helper carries at runtime. Returns both the context and
 * the sendSocketNotification mock so callers can assert on it.
 */
const makeCtx = () => {
  const sendSocketNotification = mock.fn();
  const ctx = {
    ...helperMethods,
    config: {deduplicateEventsOn: []},
    calendarEvents: {},
    sendSocketNotification
  };
  return {ctx,
    sendSocketNotification};
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("node_helper – parser() event filtering", () => {
  it("includes all events when no filter is set", () => {
    const {ctx, sendSocketNotification} = makeCtx();
    ctx.parser(makeCalendar(), ICS_TWO_EVENTS);

    assert.equal(sendSocketNotification.mock.calls.length, 1);
    const [notification, events] = sendSocketNotification.mock.calls[0].arguments;
    assert.equal(notification, "EVENTS_REFRESHED");
    assert.equal(events.length, 2);
  });

  it("only includes events matching the filter", () => {
    const {ctx, sendSocketNotification} = makeCtx();
    const calendar = makeCalendar({
      // Mirrors what MMM-CalendarExt2.js#initBasicObjects produces when the
      // user writes:  filter: (event) => event.title === "Keep"
      filter: JSON.stringify({filter: "function(event) { return event.title === 'Keep'; }"})
    });

    ctx.parser(calendar, ICS_TWO_EVENTS);

    const [, events] = sendSocketNotification.mock.calls[0].arguments;
    assert.equal(events.length, 1);
    assert.equal(events[0].title, "Keep");
  });

  it("excludes all events when filter always returns false", () => {
    const {ctx, sendSocketNotification} = makeCtx();
    const calendar = makeCalendar({
      filter: JSON.stringify({filter: "function() { return false; }"})
    });

    ctx.parser(calendar, ICS_TWO_EVENTS);

    // mergeEvents only calls sendSocketNotification when events.length > 0
    assert.equal(sendSocketNotification.mock.calls.length, 0);
  });

  it("works with arrow function filters (the common user format)", () => {
    const {ctx, sendSocketNotification} = makeCtx();
    const calendar = makeCalendar({
      filter: JSON.stringify({filter: "(event) => event.title === 'Keep'"})
    });

    ctx.parser(calendar, ICS_TWO_EVENTS);

    const [, events] = sendSocketNotification.mock.calls[0].arguments;
    assert.equal(events.length, 1);
    assert.equal(events[0].title, "Keep");
  });

  it("respects maxItems after filtering", () => {
    const {ctx, sendSocketNotification} = makeCtx();
    ctx.parser(makeCalendar({maxItems: 1}), ICS_TWO_EVENTS);

    const [, events] = sendSocketNotification.mock.calls[0].arguments;
    assert.equal(events.length, 1);
  });
});
