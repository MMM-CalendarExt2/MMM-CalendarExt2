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


> In below guides, all fields except **REQUIRED** could be omitted. When omitted, `default value` will be used.
## 1. SCENE
**Scene** is a set of Calendar **View**s. You can define several scenes for your purpose. MM will display one scene at a time. You can rotate scenes by time or notification.
- Scenes Example : `My Calendar`, `Wife's Calendar`, `Tom's Calendar`
- Another Scenes Example : `Last Month`, `This Month`, `Next Month`, ...


Here is default and detailed `scenes` fields 
```javascript
scenes: [ // `scenes` could have several scenes as elements of array
  { // default values
    name: "",
    views: [],
    className: "",
  },
  { // scene example
    name: "My Soccer",
    views: ["Upcoming Hotspurs Games", "Monthly Champion's League Schedule"],
  },
],
```

**SCENE**

|field |value type |value example |default value |memo |
|---|---|---|---|---|
|name |String |"DEFAULT" |- |**REQUIRED**<br/>Scene name, this value will be used to distinguish specific scene. If not set, auto-generated `uid` will be used instead, but to assign name is recommended. <br/> At least one of scene should have name "DEFAULT", unless you set different name as `defaultScene`|
|views|Array of `view name`|["Holidays", "Business Meeting"] |[] |To specify views in this scene. If set as `[]`, all views will be included in this scene. |
|className |String |"myScene1" |"" | If you want to assign specific CSS class to this scene, use this. |

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
