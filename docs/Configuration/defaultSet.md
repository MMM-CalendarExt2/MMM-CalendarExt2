# defaultSet

You might have so many views, calendars, scenes. It could be annoyingly tiresome to describe all the values of each section.
You can set your default values for each views, calendars and scenes.

```js
defaultSet: {
  view:{},
  scene:{},
  calendar:{}
},
```

By Example,

```js
defaultSet: {
  view: {
    slotCount: 4,
    dateFormat: "MM/DD",
  }
},
```

will be same with

```js
views: [
  {
    ...
    slotCount: 4,
    dateFormat: "MM/DD",
  },
  {
    ...
    slotCount:4,
    dateFormat: "MM/DD",
  }
],
```
