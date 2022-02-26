<!-- markdownlint-disable-file MD041 -->

You can use all of common fields of [View](../View.md) in this view also.

# View:daily

| field              | value type       | value example | default value | memo                                                                                                                                                |
| ------------------ | ---------------- | ------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| type               | String           | "row"         | "column"      | You can arrange event slots by row or column. This field will be ignored in other views. In `bar` or `fullscreen` region, `"row"` could look nicer. |
| slotSubTitleFormat | String           | ""            | "MMMM Do"     | predefined extra information of slots of this daily view.                                                                                           |
| slotTitleFormat    | String Or Object | ""            | {...}         | predefined slot title.                                                                                                                              |

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

## Examples

- Basic Sample

```js
{
  name: "VIEW1",
  mode: "daily",
  title: "My Schedule",
  position: "top_left",
},
```

![view1](view1.png)

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

![view2](view2.png)
