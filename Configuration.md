# Simple Example & Basic Concept
```javascript
{
  module: 'MMM-CalendarExt2',
  config: {
    calendars : [
      {
        url: "https://www.google.com/calendar/ical/ovb564thnod82u5c4njut98728%40group.calendar.google.com/public/basic.ics",
      },
    ],
    views: [
      {
        mode: "daily",
      },
    ],
    scenes: [
      {
        name: "DEFAULT",
      },
    ],
  },
},
```
This is the simplest configuration. I'll explain step by step.

There should be AT LEAST one **scene**, one **view** and one **calendar**.

**Concept**
![Concept](/eouia/MMM-CalendarExt2/blob/master/screenshot/scene-view-calendar.png)
- You should have at least ONE Scene for display your events.
- Each Scene could have at least ONE View. You can assume each scene as a profile or page.
- Each View decide how to show events. It can could have at least ONE calendar or more. You can choose to show which calendar events, how to show and more.
- A Calendar is your .ics file or URL. You can filter events by configuration.
- To point specific Scene/View/Calendar, It could have `name`. and almost everything will be configurable.

> In below guides, all fields except **REQUIRED** could be omitted. When omitted, `default value` will be used.

1. [[Configuration:Scene]]



## 2. VIEW
- **View** is a specific look and definition to display events. Each view could have several calendars which is defined in `calendars` section. And each view instance can be reusable in multi-scenes.
- There are several view mode; `upcoming`, `current`, `daily`, `weekly`, `monthly`, `week`, `month`. 

```

views: [
  { //default values
    name: "", 
    mode: "daily",
    className: "",
    position: "top_left",
    ...
  },
  { // view example
    name: "Upcoming Hotspurs",
    mode: "upcoming",
    position: "top_right",
    ...
  }
],

```
### 2-1. common values of all views
- These fields are common fields of every view modes. You can use these fields in any view.
- You can also describe these fields in `defaultSet.view`.

|field |value type |value example |default value |memo |
|---|---|---|---|---|
|name |String | "My weekly schedule" | - |**NOT REQUIRED BUT RECOMMENDED**<br/> You can specify specific view with this name. It will be used in `scene`.
|mode | String |"month" |"daily" | `"upcoming"`, `"current"`, `"daily"`, `"weekly"`, `"monthly"`, `"week"`, `"month"` are available.
|className |String | "myViewClass" | "" | You can adjust CSS class to this view.
|position |String | "bottom_bar" | "top_left" | Where to display this view.
|calendars |Array of calendar names | ["My Football calendar", "US Holidays"] | [] | Which calendar events will be shown in this view. For all calendars, just set to `[]`
|title |String | "SCHEDULE" | "" | It will be used as module header title.
|locale |String | "de-DE" | default locale | You can apply specific locale to only this view instead default locale.
|fromNow |Integer | -1 | 0 | When this view calendar will be start. <br> By example; in `view:monthly`, `-1` will be last month, `0` will be this month, `1` will be next month.<br/><br/>In view of `upcoming`, `current`, this value will be ignored.
|slotCount |Integer |4 | 3 | How many periodic calendar slot will be shown. <br> By example; in `view:monthly`, `3` will show 3 `monthly` view slot. <br><br/>`mode:daily`, `fromNow:-1`, `slotCount:3` will be show *3 daily calendar slots from yesterday to tomorrow* <br/>Only in `daily`, `weekly`, `monthly`, this field will be valid. In other view modes, this will be ignored.
|hideOverflow |Boolean |false | true | If events in slot are too many, you can hide some of events by this. Use with `slotMaxHeight`
|slotMaxHeight |String | "200px" | "150px" | Set your slot height to display events. It is affected when you set `hideOverflow`.
|slotTitle | String | "My Upcoming Schedule" | - | Set slot title with static text. This is prior than `slotTitleFormat`. If you want to display dynamic slot title by date, leave this to null or empty(`""`). <br/>**RECOMMENDED** only to `view:current` and `view:upcoming`.
|slotTitleFormat | String Or Object | "MM/DD" | - | Set slot title by date. formatter of `.format()` of `moment.js` or object of `.calendar()` of `moment.js`   
|slotSubTitle | String | "" | - | subtitle of slot. See `slotTitle` also.
|slotSubTitleFormat | String Or Object | "" | - | subtitle format of slot. See `slotTitleFormat` also.
|filterPassedEvent |Boolean | true | false | If event is passed, filter it.
|maxItems |Integer | 30 | 100 | How many items will be targeted for this view.
|dateFormat|Object | {...} | {...} | See `details about event time`.
|timeFormat|Object | {...} | {...} | See `details about event time`.
|dateTimeFormat|Object | {...} | {...} | See `details about event time`.
|relativeFormat|Object | {...} | {...} | See `details about event time`.
|useEventTimeRelative |Boolean |true |false | If true, relativeFormat will be used instead time/date/dateTimeFormat. See `details about event time`|

### 2-2. `view:daily`, `view:weekly`, `view:monthly`
|field |value type |value example |default value |memo |
|---|---|---|---|---|
|type |String |"row" |"column" | You can arrange event slots by row or column. This field will be ignored in other views. In `bar` or `fullscreen` region, `"row"` could look nicer.

#### 2-2-1. `view:daily`
|field |value type |value example |default value |memo |
|---|---|---|---|---|
|slotSubTitleFormat |String |"" |"MMMM Do" |pre-defined extra information of slots of this daily view.
|slotTitleFormat |String Or Object |"" | {...} |pre-defined slot title.
- You can use calendar-type humanized format for slot Title in this daily view. (In other views, this will be meaningless). Default values are below;
```
slotTitleFormat: {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] ddd',
  sameElse: 'ddd, M/D'
},
```

#### 2-2-2. `view:weekly`
|field |value type |value example |default value |memo |
|---|---|---|---|---|
|slotSubTitleFormat |String |"" |"[Week: ]wo" |pre-defined extra information of slots of this weekly view.
|slotTitleFormat |String Or Object |"" | "YYYY" |pre-defined slot title.

#### 2-2-3. `view:monthly`
|field |value type |value example |default value |memo |
|---|---|---|---|---|
|slotSubTitleFormat |String |"" |"MMMM" |pre-defined extra information of slots of this weekly view.
|slotTitleFormat |String Or Object |"" | "YYYY" |pre-defined slot title.

### 2-3. `view:upcoming`

