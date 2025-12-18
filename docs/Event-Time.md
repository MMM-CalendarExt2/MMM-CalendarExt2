# Event Time

`MMM-CalendarExt2` supports various looks of event time.

## 1. time / date / dateTime

You can define how to show the event time. `timeFormat`, `dateFormat` and `dateTimeFormat` would be different in different locales. So I make it re-definable.

> For all available formatters, read [the Day.js formatting documentation](https://day.js.org/docs/en/display/format)

- **timeFormat**
  - This format will be used for displaying time without date information.
  - For one-day events in agenda views (like `upcoming`, `current`), this formats the **end time** only.
  - e.g) `timeFormat:"HH:mm",` will be displayed as `13:05`. Or `timeFormat:"h:mm A",` will be displayed as `1:05 PM`.

- **dateFormat**
  - This format will be used for fullday events which don't need time information.
  - e.g) `dateFormat:"ddd MM/DD",` will be displayed as `Mon 12/17` in `en-US` locale.

- **dateTimeFormat**
  - This format will be used to show both date and time together.
  - For one-day events in agenda views (like `upcoming`, `current`), this formats the **start time**.
  - For multi-day events, it formats both start and end times.
  - e.g) `dateTimeFormat:"HH:mm M/D",` will be displayed as `01:23 1/3`.

### Important: Consistent Formatting

For one-day events in agenda views, the display shows: `startDateTime - endTime`

To ensure consistent time formatting, **both `dateTimeFormat` and `timeFormat` should use the same time format**:

```javascript
// Good - consistent formatting
{
  mode: "upcoming",
  dateTimeFormat: "h:mm A",  // "1:30 PM"
  timeFormat: "h:mm A",      // "3:00 PM"
}
// Result: "1:30 PM - 3:00 PM"

// Bad - inconsistent formatting
{
  mode: "upcoming",
  dateTimeFormat: "h:mm A",  // "1:30 PM"
  timeFormat: "HH:mm",       // "15:00"
}
// Result: "1:30 PM - 15:00" (mixed formats!)
```

For calendar-style formats, apply the same time format in all rules:

```javascript
{
  dateTimeFormat: {
    sameDay: "h:mm A",
    nextDay: "h:mm A",
    nextWeek: "dddd h:mm A",
    lastDay: "[Yesterday] h:mm A",
    lastWeek: "[Last] ddd h:mm A",
    sameElse: "M/D h:mm A"
  },
  timeFormat: "h:mm A"  // Must match the time format used in dateTimeFormat
}
```

- Or You can use more complex calendar-style formatter object to define more humanized time.
  e.g) for `dateTimeFormat`, below format will be displayed as `Yesterday 12:34` or `Last Sat 02:00`.

```javascript
dateTimeFormat: {
  sameDay: "[Today] HH:mm",
  nextDay: "[Tomorrow] HH:mm",
  nextWeek: "dddd HH:mm",
  lastDay: "[Yesterday] HH:mm",
  lastWeek: "[Last] ddd HH:mm",
  sameElse: "M/D HH:mm"
},
```

For more detailed calendar formatter, see [the Day.js calendar plugin documentation](https://day.js.org/docs/en/plugin/calendar)

## 2. relative

With `useEventTimeRelative` and `relativeFormat` you can display time from now and duration.

```javascript
useEventTimeRelative: true,
relativeFormat: {
  passed: "ended %ENDFROMNOW%",
  current: "ends %ENDFROMNOW%",
  future: "starts %STARTFROMNOW% (%DURATION%)"
},
```

This will be displayed like these;

- For past event : `ended 2 hours ago`
- For current event : `ends in 30 minutes`
- For upcoming event : `starts in 2 days (6 hours)`
  Of course you can redefine the format with your wish or locale.

## 3. Exception

In `view:week` and `view:month`, Only `timeFormat` and `dateFormat` will be valid and others will be ignored, because there might be not enough space to display event time. (But anyway, you can modify it with CSS by force)
