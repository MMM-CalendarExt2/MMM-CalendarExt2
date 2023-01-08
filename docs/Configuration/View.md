# VIEW

- **View** is a specific look and definition to display events. Each view could have several calendars which are defined in `calendars` section. And each view instance can be reusable in multi-scenes.
- There are several view modes;
  - [upcoming](Views/current,-upcoming.md)
  - [current](Views/current,-upcoming.md)
  - [daily](Views/daily.md)
  - [weekly](Views/weekly,-monthly.md)
  - [monthly](Views/weekly,-monthly.md)
  - [week](Views/week,-month.md)
  - [month](Views/week,-month.md)
  - [legend](Views/legend.md)
- `views:[]` should have at least one or more `view` as its items.

```js
views: [
  {
    name: "Upcoming Hotspurs",
    mode: "upcoming",
    position: "top_right",
    calendars: ["Hotspurs calendar"],
  },
  {
    name: "My family affairs",
    mode: "month",
    position: "bottom_bar",
    calendars: ["holidays", "ScheduleOfWife", "KID SCHOOL PLAN"],
  },
  {
    name: "Legend",
    title: "Legend",
    mode: "legend",
    calendars: ["Garmin", "Work", "Home"],
    position: "top_left"
  },
],
```

This example shows 2 views.

- **Upcoming Hotspurs** is `upcoming` view and will be displayed in `top_right` with "Hotspurs calendar".
- **My family affairs** is `month` view and will be displayed in `bottom_bar` with 3 calendars. (calendars should be already defined in [calendars section](Calendar.md) of configuration)

Your Scene could have those as its views.

## Detailed configuration

Each view can be configured with many properties. (Yes, Too many. :D)

### Common

These fields could be used in all views. (But some fields might work differently in views)

| field                | value type              | value example                           | default value  | memo                                                                                                                                                                                                                                          |
| -------------------- | ----------------------- | --------------------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                 | String                  | "My weekly schedule"                    | -              | **NOT REQUIRED BUT RECOMMENDED**<br/> You can specify specific view with this name. It will be used in `scene`.                                                                                                                               |
| mode                 | String                  | "month"                                 | "daily"        | `"upcoming"`, `"current"`, `"daily"`, `"weekly"`, `"monthly"`, `"week"`, `"month"`, `"legend"` are available.                                                                                                                                 |
| className            | String                  | "myViewClass"                           | ""             | You can adjust CSS class to this view.                                                                                                                                                                                                        |
| position             | String                  | "bottom_bar"                            | "top_left"     | Where to display this view.                                                                                                                                                                                                                   |
| positionOrder        | Integer                 | 2                                       | -1             | view order in position region. `-1`: last of region, `0`: first of region, Any positive integer like `2`: `n`th in region                                                                                                                     |
| calendars            | Array of calendar names | ["My Football calendar", "US Holidays"] | []             | Which calendar events will be shown in this view. For all calendars, just set to `[]`                                                                                                                                                         |
| title                | String or callback      | "SCHEDULE"                              | ""             | It will be used as module header title.                                                                                                                                                                                                       |
| locale               | String                  | "de-DE"                                 | default locale | You can apply specific locale to only this view instead default locale.                                                                                                                                                                       |
| fromNow              | Integer                 | -1                                      | 0              | When this view calendar will be start. <br> By example; in `view:monthly`, `-1` will be last month, `0` will be this month, `1` will be next month.<br/><br/>In view of `upcoming`, `current`, this value will be ignored.                    |
| slotCount            | Integer                 | 4                                       | 3              | How many periodic calendar slot will be shown. <br> By example; in `view:monthly`, `3` will show 3 `monthly` view slot. <br><br/>`mode:daily`, `fromNow:-1`, `slotCount:3` will be show three daily calendar slots from yesterday to tomorrow |
| hideOverflow         | Boolean                 | false                                   | true           | If events in slot are too many, you can hide some of events by this. Use with `slotMaxHeight`                                                                                                                                                 |
| hideFooter           | Boolean                 | false                                   | true           | If you want to hide the footer bar (e.g. week view, where it shows week number and count of overflowing items), set this to true                                                                                                              |
| slotMaxHeight        | String                  | "200px"                                 | "150px"        | Set your slot height to display events. It is affected when you set `hideOverflow`. If you want the height of the calendar to be adjusted automatically to the height needed (e.g. in week view), set this value to "auto".                   |
| slotTitle            | String                  | "My Upcoming Schedule"                  | -              | Set slot title with static text. This is prior than `slotTitleFormat`. If you want to display dynamic slot title by date, leave this to null or empty(`""`). <br/>**RECOMMENDED** only to `view:current` and `view:upcoming`.                 |
| slotTitleFormat      | String Or Object        | "MM/DD"                                 | -              | Set slot title by date. formatter of `.format()` of `moment.js` or object of `.calendar()` of `moment.js`                                                                                                                                     |
| slotSpaceRight       | Integer                 | 3                                       | 0              | How much space should be left on the right side of entries in week or month view                                                                                                                                                              |
| slotSubTitle         | String                  | ""                                      | -              | subtitle of slot. See `slotTitle` also.                                                                                                                                                                                                       |
| slotSubTitleFormat   | String Or Object        | ""                                      | -              | subtitle format of slot. See `slotTitleFormat` also.                                                                                                                                                                                          |
| filterPassedEvent    | Boolean                 | true                                    | false          | If event is passed, filter it.                                                                                                                                                                                                                |
| maxItems             | Integer                 | 30                                      | 100            | How many items will be targeted for this view.                                                                                                                                                                                                |
| skipItems            | Integer                 | 30                                      | -              | How many items should be skipt (e.g. cause they allready displays in another column).                                                                                                                                                         |
| dateFormat           | Object                  | {...}                                   | {...}          | See [Event Time](../Event-Time.md).                                                                                                                                                                                                           |
| timeFormat           | Object                  | {...}                                   | {...}          | See [Event Time](../Event-Time.md).                                                                                                                                                                                                           |
| dateTimeFormat       | Object                  | {...}                                   | {...}          | See [Event Time](../Event-Time.md).                                                                                                                                                                                                           |
| relativeFormat       | Object                  | {...}                                   | {...}          | See [Event Time](../Event-Time.md).                                                                                                                                                                                                           |
| useEventTimeRelative | Boolean                 | true                                    | false          | If true, relativeFormat will be used instead time/date/dateTimeFormat. See [Event Time](../Event-Time.md)                                                                                                                                     |
| filter               | Function                | (e)=>{}                                 | (e)=>{...}     | See [Filtering and Sorting](../Filtering-and-Sorting.md)                                                                                                                                                                                      |
| sort                 | Function                | (a,b)=>{}                               | (a,b)=>{...}   | See [Filtering and Sorting](../Filtering-and-Sorting.md)                                                                                                                                                                                      |
| transform            | Function                | (e)=>{}                                 | (e)=>{...}     | See [Filtering and Sorting](../Filtering-and-Sorting.md)                                                                                                                                                                                      |

#### title callback

If you can set `title` as a callback function, the result of function will be used as module title.

```js
title: (mObj) => {
  return mObj.format("[My Weekly:] Wo")
},
```

This example will return "My Weekly: 49th" or similar.

callback function get `moment Object` of first slot start time for arguments. So you can handle it in callback function.
