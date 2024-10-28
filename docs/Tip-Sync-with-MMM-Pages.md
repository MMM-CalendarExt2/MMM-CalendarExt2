# Synchronizing page changes with MMM-Pages

Many people are asking me How to use this module with [MMM-Pages](https://github.com/edward-shen/MMM-pages).

Like this;

PAGE1
![example page 1](https://raw.githubusercontent.com/MMM-CalendarExt2/MMM-CalendarExt2/main/docs/Page_1.png)

PAGE2
![example page 2](https://raw.githubusercontent.com/MMM-CalendarExt2/MMM-CalendarExt2/main/docs/Page_2.png)

PAGE3
![example page 3](https://raw.githubusercontent.com/MMM-CalendarExt2/MMM-CalendarExt2/main/docs/Page_3.png)

Let's configure.

**`MMM-Pages`**

```js
{
  module: 'MMM-pages',
  config: {
    modules: [
      ["clock", ],
      ["MMM-COVID-19", ],
      ["MMM-News", ],
    ],
    fixed: ["MMM-page-indicator", "MMM-CalendarExt2"],
    rotationTime: 1000 * 5,
  }
},
```

I've set 3 pages (page:0, page:1, page:2). Each has some other modules like `clock`. Now I'll show a different view of MMM-CalendarExt2 in each page.

**`MMM-CalendarExt2`**

```js
{
  module: 'MMM-CalendarExt2',
  position: "top_left", // meaningless.
  config: {
    rotateInterval: 0,
    updateInterval: 1000 * 60 * 60,
    calendars : [
      {
        name: "bundesliga",
        url: "webcal://www.google.com/calendar/ical/spielplan.1.bundesliga%40gmail.com/public/basic.ics",
        icon: "emojione-flag-for-flag-germany",
      },
    ],
    views: [
      {
        name: "VIEW1",
        mode: "daily",
        position:"top_right",
        slotCount: 1,
        calendars: ["bundesliga"],
      },
      {
        name: "VIEW2",
        mode: "weekly",
        position:"top_right",
        slotCount: 1,
        calendars: ["bundesliga"],
      },
      {
        name: "VIEW3",
        mode: "monthly",
        position:"top_right",
        slotCount: 1,
        calendars: ["bundesliga"],
      },
    ],
    scenes: [
      {
        name: "PAGE1",
        views:["VIEW1"],
      },
      {
        name: "PAGE2",
        views:["VIEW1", "VIEW2"],
      },
      {
        name: "PAGE3",
        views:["VIEW1", "VIEW2", "VIEW3"],
        className: "fakeScene"
      },
    ],
    notifications: {
      "PAGE_INCREMENT" : {
        exec: "sceneNext",
      },
      "PAGE_DECREMENT" : {
        exec: "scenePrevious",
      }
    },
  },
},

```

I made 3 views and put them into 3 scenes.
Then, see `notifications` section. When `PAGE_INCREMENT` is coming, **`sceneNext`** command is executed. easy.
The results are above pictures.
And, this is already explained in wiki of GitHub.

## One More Thing

_Hey, I want page 3 empty. How to remove view or scene in that page?_

I wrote `className:fakeScene,` in 3rd scene config. Let's add this into your `css/custom.css`

```css
.CX2.fakeScene {
  display: none;
}
```

Now, the 3rd scene will be displayed like this.

![a page that has no calendar shown](https://raw.githubusercontent.com/eouia/MMM-CalendarExt2/master/doc/Page_4.png)
