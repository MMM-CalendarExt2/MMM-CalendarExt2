# Klaernie's Config

This config is intended to be used by the three people in our household. My
girlfriend and me both have a private and business calendar each, and our kid
also has a calendar with important events (think doctor visits) and private
events.

Style-wise we like a clean and largely monochrome look, with some color
sprinkled in to remove ambiguity.

The actual calendar data is synced with vdirsyncer into the
`~/MagicMirror/modules/calendars` folder, as vdirsyncer can reduce the overall
amount of events to a suitable set while being able to easily integrate iCloud,
Google Calendar and Outlook 365 calendars at the same time.

## How does the result look?

![screenshot](klaernie.png)

## config.js

The config actually is nothing too complex. To keep the information amount
manageable in the `daily` view at the bottom the `Private` and `Work` calendars
alternate. Only the `upcoming` view stays present all the time.

Calendars are all loaded from the location vdirsyncer writes to. Anja's work
calendar also hides events where Anja isn't yet sure, if the will go, but I
like to see my maybe-events. Finally Tobi's personal calendar includes a
usually daily event `Schule` (`school`) which doesn't need to be listed on the
Mirror, as he knows pretty well that he needs to go to school.

```javascript
{
    module: 'MMM-CalendarExt2',
    config: {
        rotateInterval: 60*1000,
        deduplicateEventsOn: [
          "startDate", "endDate", "title",
        ],
        scenes:[
            {
                name: "DEFAULT",
                views: ["current","upcoming","Overview Private"],
            },
            {
                name: "WorkMode",
                views: ["current","upcoming","Overview Work"],
            },
        ],
        views:[
            {
                    name: "current",
                    mode: "current",
                    position: "top_left",
                    maxDays: 1,
                    locale: "en",
                    hideOverflow: false,
                    filterPassedEvent: true,
            },
            {
                name: "upcoming",
                mode: "upcoming",
                position: "top_left",
                maxDays: 1,
                locale: "en",
                hideOverflow: false,
                filterPassedEvent: true,
                useEventTimeRelative: false,
            },
            {
                name: "Overview Private",
                title: "Private Calendars",
                mode: "daily",
                type: "row",
                position: "bottom_bar",
                slotCount: 7,
                locale: "en",
                hideOverflow: false,
                filterPassedEvent: true,
                calendars: [
                  "Andre",
                  "Anja",
                  "Tobi Shared",
                  "Tobi",
                  "Andre|Anja",
                  "Andre|Anja|Tobi Shared",
                  "Andre|Anja|Tobi Shared|Tobi",
                  "Andre|Anja|Tobi",
                  "Andre|Tobi Shared",
                  "Andre|Tobi Shared|Tobi",
                  "Andre|Tobi",
                  "Anja|Tobi Shared",
                  "Anja|Tobi Shared|Tobi",
                  "Anja|Tobi",
                  "Tobi|Tobi Shared",
                ],
            },
            {
                name: "Overview Work",
                title: "Work Calendars",
                mode: "daily",
                type: "row",
                position: "bottom_bar",
                slotCount: 7,
                locale: "en",
                hideOverflow: false,
                filterPassedEvent: true,
                calendars: ["Anja Work","Andre Work","Andre Work|Anja Work","Tobi Lernsax"],
            },
        ],
        calendars: [
            {
                name: "Anja",
                url: "http://calserv/AnjaPrivate.ics",
            },
            {
                name: "Anja Work",
                url: "http://calserv/O365_Anja.ics",
                filter: (event) => {
                  if (event.ms_busystatus == "TENTATIVE") {
                    return false
                  }
                  if (event.title == "Blocker") {
                    return false
                  }
                  if (event.title == "Need to be home") {
                    return false
                  }
                  if (event.title == "Vacation") {
                    return false
                  }
                  if (event.title == "OoO") {
                    return false
                  }
                  if (event.title.startsWith("Canceled:")) {
                    return false
                  }
                  return true
                },
            },
            {
                name: "Andre",
                url: "http://calserv/AndrePrivate.ics",
            },
            {
                name: "Andre Work",
                url: "http://calserv/O365_Andre.ics",
                filter: (event) => {
                  if (event.title == "Blocker") {
                    return false
                  }
                  if (event.title == "Need to be home") {
                    return false
                  }
                  if (event.title == "Vacation") {
                    return false
                  }
                  if (event.title == "OoO") {
                    return false
                  }
                  if (event.title.startsWith("Canceled:")) {
                    return false
                  }
                  return true
                },
            },
            {
                name: "Tobi",
                url: "http://calserv/TobiPrivate.ics",
                filter: (event) => {
                    if (event.title == "Schule") {
                        return false
                    }
                    return true
                },
            },
            {
                name: "Tobi Shared",
                url: "http://calserv/TobiShared.ics",
            },
            {
                name: "Tobi Lernsax",
                url: "http://calserv/Lernsax.ics",
            },
        ],
    },
},
```

## `css/custom.css`

As our Mirror display only has a resolution of 1280x800 I decided to reduce the
margins on the entire mirror and remove the `+1` space marking omitted events
(no events are ever omitted, see `hideOverflow: false` in `config.js`).

The styling for MMM-CalendarExt2 is largely based on the default MagicMirror²
look.
I also removed the background colors on all events (which means I also need to
use the text color from outside in fullday events, as they would be
black-on-black instead).

To save a few more pixels the entire `eventTime` for fullday events get's
hidden as well.

Finally the events are color-coded per-person, so that Anja and I can
differentiate who has which meeting. This is done with a 3px border on the left
side, a style found in some mobile calendar apps' schedule view.

```css
body {
  margin: 10px;
  height: calc(100% - 20px);
  width: calc(100% - 30px);
  background: inherit;
}

.region.top.right,
.region.top.left,
.region.top.center {
  min-width: 700px;
}

.region.top.left .CX2 {
  --column-max-width: 700px;
}

.region.top.left .CX2 .period .eventTitle {
}

.CX2 .period .eventTitle {
  float: left;
  max-width: var(--column-max-width);
}

.CX2 .period .eventTime {
  float: right;
}

.CX2 .current .eventCount_0 {
  display: none;
}
.CX2 .agenda .eventSub {
  display: none;
}
.CX2 .daily .fullday .eventTime {
  display: none;
}
.CX2 .slot > .slotContent {
  background: none;
}
.CX2 .slot .event {
  background: none;
}
.CX2 .slot .slotHeader {
  background-color: inherit;
  text-transform: uppercase;
  font-size: 15px;
  font-family: "Roboto Condensed", Arial, Helvetica, sans-serif;
  font-weight: 400;
  border-bottom: 1px solid #666;
  line-height: 15px;
  padding-bottom: 5px;
  margin-bottom: 10px;
  color: #999;
}
.CX2 .today .slotHeader * {
  color: inherit;
}
.CX2 .event.fullday {
  color: inherit;
}
.CX2 .slot .slotFooter {
  display: none;
}
.CX2 .event {
  border-left: #000000 solid;
}
.CX2 .event[data-calendar-name="Andre"],
.CX2 .event[data-calendar-name="Andre Work"] {
  /*color: #ce4138;*/
  border-left: #ce4138 solid;
}
.CX2 .event[data-calendar-name="Anja"],
.CX2 .event[data-calendar-name="Anja Work"] {
  /*color: #c632ff;*/
  border-left: #2cb825 solid;
}
.CX2 .event[data-calendar-name="Tobi"],
.CX2 .event[data-calendar-name="Tobi Lernsax"],
.CX2 .event[data-calendar-name="Tobi Shared"] {
  /*color: #d2cf2a;*/
  border-left: #d2cf2a solid;
}

.CX2 .event[data-busystatus="BUSY"] .eventTitle {
  /* color: #c632ff; */
}

.CX2 .event[data-busystatus="OOF"] .eventTitle {
  color: #400c54;
}

.CX2 .event[data-busystatus="FREE"] .eventTitle {
  /* color: #444444; */
}

.CX2 .event[data-busystatus="TENTATIVE"] .eventTitle {
  color: #444444;
}
```
