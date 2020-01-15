# MMM-CalendarExt2
Whole new build-up for MMM-CalendarExt

## Screenshot
![screenshot](screenshot.png)

## Install & Configuration

```
cd ~/MagicMirror/modules
git clone --depth=1 https://github.com/eouia/MMM-CalendarExt2
cd MMM-CalendarExt2
npm install
```

Afterwards read how to configure everything in [the configuration documentation](doc/Configuration.md).
If you like adjust [to your language](doc/Localization.md) or [adapt the styling](doc/Styling.md).

Finally if you like a shortcut browse through [the examples of other peoples config](doc/examples).

Note: If you want to start developing and miss the entire history run `git fetch --unshallow`.

## New Updates
**[1.0.6]**
- ADDED: `title` of view can have callback function as a value. Now you can make view title contextually
```js
title: "My Weekly",

or

title: (mObj) => { // moment object for first slot of view.
  return mObj.format("[My Weekly:] Wo")
},
// This will show "My Weekly: 49TH" as module title.
```




## Major feature
- Multiple views at same time in a scene
- Scenes could be rotated by time or notification or other trigger (e.g: Scene per `PAGE`)
- `MMM-CalendarExtTimeline`, `MMM-TelegramBot` supported.
- Over 5000 icons; (iconify)
- custom class for beautifying
- month/week timeline view.


## What's different with `MMM-CalendarExt`
But if you have no dissatisfaction with `MMM-CalendarExt`, leave it.
- New parser. New look.
- `profile` is deprecated. `scene` is more than that.
- Beautiful timeline view (month/week)
- dynamic scene changeable.


## Plugins
- [MMM-CalendarExtTimeline](https://github.com/eouia/MMM-CalendarExtTimeline)
- [MMM-CalendarExtMinimonth](https://github.com/eouia/MMM-CalendarExtMinimonth)
- [MMM-CalendarExtPlan](https://github.com/eouia/MMM-CalendarExtPlan)

## Updates
**[1.0.5]**
- ADDED: can display name of Month (e.g: August) in `month` view (`monthFormat:"MMMM"`)

**[1.0.4]**
- ADDED: event property `ms_busystatus` is added. (Thanks to @klaernie for the PR)

**[1.0.3]**
- FIXED: calendar filter is implemented (Sorry, I've totally forgotten it).

**[1.0.2]**
- FIXED: not visible in second or followed pages of MMM-pages.

**[1.0.1]**
- `view:transform()` is added, now you can modify event value as your wish.


## MEMO
### Bug with MMM-Carousel.
- When you are using it with `MMM-Carousel`, `MMM-CalendarExt2` should be in main page or all pages.
