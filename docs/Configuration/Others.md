<!-- markdownlint-disable-file MD025 -->

# Other configurations

| field               | value type  | value example                                           | default value      | memo                                                                                                             |
| ------------------- | ----------- | ------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| locale              | String      | "de-DE"                                                 | Your system locale | Set your locale for this module.                                                                                 |
| rotateInterval      | Number (ms) | `1000*60`                                               | `0`                | If set, `Scene` will be rotated per this time. If set as `0`, auto-rotation among the scenes will be disabled.   |
| updateInterval      | Number (ms) | `1000* 60 *10`                                          | `1000*60`          | If not auto-rotated, this interval will be used for updating content.                                            |
| firstDrawingDelay   | Number (ms) | `1000*10`                                               | `1000`             | Sometimes, calendar parsing could be somewhat late. You can set delay for first drawing to wait calendar parsing |
| deduplicateEventsOn | Array       | `["startDate","endDate","duration","title","location"]` | `[]`               | define which attributes must be equal in order to remove duplicate events                                        |

# Event Deduplication

Please read [pull request #18](https://github.com/eouia/MMM-CalendarExt2/pull/18)
on the motivation for event deduplication.

Essentially you need to specify which of the [event attributes](../Event-Object.md)
need to be checked for equality before and event is marked as duplicate.

This process is quite CPU-intensive, so the example value above was carefully
chosen to use cheap number comparisons before making costlier string
comparisons.

How does this actually work? The events are first sorted by the attributes you
specified. Afterwards each event get's checked against the event that was
ordered before it. Then each event that is identical to it's predecessor gets
dropped.

Note: The implementors use case expects that events originate from different
calendars. So when a duplicate event gets removed, it's `calendarName` gets
appended to the `calendarName` of the kept event. So if you specify calendars
in a view you need to also specify the possible calendar combinations.

Imagine the following:

| field        | event 1     | event 2     | resulting event |
| ------------ | ----------- | ----------- | --------------- |
| startDate    | 1553891393  | 1553891393  | 1553891393      |
| endDate      | 1553894993  | 1553894993  | 1553894993      |
| duration     | 3600        | 3600        | 3600            |
| title        | `testEvent` | `testEvent` | `testEvent`     |
| location     | `Dresden`   | `Dresden`   | `Dresden`       |
| calendarName | `Anja`      | `Andre`     | _`Anja\|Andre`_ |

## Example of whole configuration for real usage

```javascript
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
