## VIEW
- **View** is a specific look and definition to display events. Each view could have several calendars which is defined in `calendars` section. And each view instance can be reusable in multi-scenes.
- There are several view mode; `upcoming`, `current`, `daily`, `weekly`, `monthly`, `week`, `month`. 

```

views: [
  { // view example
    name: "Upcoming Hotspurs",
    mode: "upcoming",
    position: "top_right",
    calendars: ["Hotspurs calendar"],
  },
  {
    name: "My family affairs",
    mode: "month",
    position: "bottom_bar",
    calendars: ["holidays", "scheduleofwife", "KID SCHOOL PLAN"],
  },
],

```