# CSS

Sorry. CSS of this module is not simple. But, you'd better to look inside `MMM-CalendarExt2.css` if you have an interest.

> You SHOULD NOT modify `MMM-CalendarExt2.css` directly. Use `css/custom.css` for overwriting or adding your CSS rules.

Here are a few simple CSS styling for this module.

## custom class for Event

```css
.CX2 .holiday {
  background-color: #333;
  color: #f00;
}

.CX2 .holiday.fullday {
  background-color: #f00;
  color: #fff;
}
```

If you set `className` of calendar to `holiday`, this CSS rules will be applied to events of that calendar.

You can control more with this calendar-specific className. By example you can show eventLocation of specific calendar like this;

```css
.CX2 .holiday .eventLocation {
  display: block;
}
```

## some default sizes

```css
.CX2 {
  /* default values which are used frequently or dependently */
  --row-min-width: 100px;
  --row-max-width: 300px;
  --column-min-width: 300px;
  --column-max-width: 400px;
  --font-size: 16px;
}
```

By example, when you want bigger font size, adjust `--font-size`.

## view classes

Each view could have parts of these classes by condition. You can overwrite CSS rules with this class names.

- view : all views have `view` as its class name.
- daily, weekly, monthly, week, month, current, upcoming
- row, column
- VIEWCLASSNAME : defined in your configuration

## slot components

A view has one or more slots. slot is divided area by time(day or week or month) where events are located. Each slot has these HTML DOM as it's component.

- `.slotHeader` : slot tile is displayed here.
- `.slotContent` : events are located here.
- `.slotFooter` : hidden event counts are displayed here.

## slot classes

Each slot could have parts of these as its class by condition. You can overwrite CSS rules with this class names.

- slot : all slots have `slot` as its class name.
- daily, weekly, monthly, week, month, current, upcoming : mode of view
- period, agenda, weekSlot, cellSlot, timelineSlot... : types of slot.
- seq_0, seq_1, ... : slot sequence in view
- thisyear, thismonth, thisweek, today : slot relation with today.
- year_2018, month_12, week_51, day_25, weekday_6, dayofyear_361, ... : You can specify slot with this class names.

## event components

A event has these DOMs as its component.

- eventMain
  - eventIcon
  - eventTitle
  - eventTime
- eventSub
  - eventDescription
  - eventLocation

## event classes

Each slot could have parts of these as its class by condition. You can overwrite CSS rules with this class names.

- event : all events have `event` as its class name.
- oneday, overday, fullday, notfullday, overslot, targetday, now, passed, moment, starthere, endhere : result of calculation of relation between this event and slot.
- CALENDARCLASSNAME : defined in your configuration

## event dataSet

Each event could have these values as dataset.

- data-calendar-name
- data-calendar-seq
- data-start-date
- data-end-date
- data-duration
- data-title
- data-location
