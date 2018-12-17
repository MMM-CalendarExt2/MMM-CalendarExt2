## VIEW
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