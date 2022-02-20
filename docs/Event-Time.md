# Event Time

`MMM-CalendarExt2` supports various looks of event time.

## 1. time / date / dateTime

You can define how to show the event time. `timeFormat`, `dateFormat` and `dateTimeFormat` would be different in different locales. So I make it re-definable.

> For all available formatters, read [the momentjs formatting documentation](https://momentjs.com/docs/#/displaying/format/)

- **timeFormat**

  - This format will be used for oneday event which doesn't need date information by default.
  - e.g) `timeFormat:"HH:mm",` will be displayed as `13:05`. Or `timeFormat:"h:mm A",` will be displayed as `1:05 PM`.

- **dateFormat**
  - This format will be used for fullday event which doesn't need time information by default.
  - e.g) `dateFormat:"ddd MM/DD",` will be displayed as `Mon 12/17` in `en-US` locale.
- **dateTimeFormat**

  - This format will be used for all other event.
  - e.g) `dateTimeFormat:"HH:mm M/D",` will be displayed as `01:23 1/3`.

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

For more detailed calendar formatter, see [the momentjs calender-time documentation](https://momentjs.com/docs/#/displaying/calendar-time/)

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
