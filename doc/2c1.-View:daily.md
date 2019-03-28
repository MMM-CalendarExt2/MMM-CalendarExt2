You can use all of common fields of [[2c. Configuration:View]] in this view also.

# View:daily
|field |value type |value example |default value |memo |
|---|---|---|---|---|
|type |String |"row" |"column" | You can arrange event slots by row or column. This field will be ignored in other views. In `bar` or `fullscreen` region, `"row"` could look nicer.
|slotSubTitleFormat |String |"" |"MMMM Do" |pre-defined extra information of slots of this daily view.
|slotTitleFormat |String Or Object |"" | {...} |pre-defined slot title.
- You can use calendar-type humanized format for slot Title in this daily view. (In other views, this will be meaningless). Default values are below;
```js
slotTitleFormat: {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] ddd',
  sameElse: 'ddd, M/D'
},
```

## Example:
- Basic Sample
```js
{
  name: "VIEW1",
  mode: "daily",
  title: "My Schedule",
  position: "top_left",
},
```
![view1](https://github.com/eouia/MMM-CalendarExt2/blob/master/screenshot/view1.png)
- modification Sample.
```js
{
  name: "VIEW1",
  mode: "daily",
  title: "My Schedule",
  position: "bottom_bar",
  type: "row",
  slotCount: 5,
  fromNow: -2,
  useEventTimeRelative: true,
},
```
![view2](https://github.com/eouia/MMM-CalendarExt2/blob/master/screenshot/view2.png)
