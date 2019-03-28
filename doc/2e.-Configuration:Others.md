# Other configurations.

|field |value type |value example |default value |memo |
|---|---|---|---|---|
|locale |String |"de-DE" |Your system locale |Set your locale for this module.
|rotateInterval |Number (ms) |1000*60 |0 |If set, `Scene` will be rotated per this time. If set as `0`, auto-rotation among the scenes will be disabled.
|updateInterval |Number (ms) |1000* 60 *10 |1000*60 |If not auto-rotated, this interval will be used for updating content.
|firstDrawingDelay |Number (ms) |1000*10 |1000 |Sometimes, calendar parsing could be somewhat late. You can set delay for first drawing to wait calendar parsing


## Example of whole configuration for real usage
```
{
  module: 'MMM-CalendarExt2',
  config: {
    rotateInterval: 1000*60,
    defaultSet: {
      view: {
        hideOverflow:true,
      }
    },
    calendars : [
      {
        name: "US holiday",
        icon: "noto-beach-with-umbrella",
        className: "holiday",
        url: "http://www.calendarlabs.com/templates/ical/US-Holidays.ics",
      },

      {
        name : "Tottenham",
        icon: "noto-soccer-ball",
        url: "https://www.google.com/calendar/ical/ovb564thnod82u5c4njut98728%40group.calendar.google.com/public/basic.ics",
      },

      {
        url: "https://www.kriftel.de/pdf-pool-formulare-etc/abfall-abfallkalender/icalendar-abfallkalender-2018-2.ics?cid=m6",
        name: "Abfall",
        icon: "whh-recycle",
      },
    ],
    views: [
      {
        name: "VIEW1",
        mode: "daily",
        title: "My Tottenham",
        calendars: ["Tottenham", "US holiday"],
        slotCount: 4,
      },
      {
        name: "VIEW2",
        mode: "month",
        title: "All ",
        calendars: [],
        position: "fullscreen_below",
      },

    ],
    scenes: [
      {
        name: "DEFAULT",
        views:[],
      },
      {
        name: "ONLY_VIEW2",
        views:["VIEW2"]
      },
      {
        name: "ONLY_VIEW1",
        views:["VIEW1"]
      }
    ],
  },
},
```

