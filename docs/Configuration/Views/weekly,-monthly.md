<!-- markdownlint-disable-file MD041 -->

You can use all of common fields of [View](../View.md) in these views also.

# View:weekly

| field              | value type       | value example | default value | memo                                                                                                                                                |
| ------------------ | ---------------- | ------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| type               | String           | "row"         | "column"      | You can arrange event slots by row or column. This field will be ignored in other views. In `bar` or `fullscreen` region, `"row"` could look nicer. |
| slotSubTitleFormat | String           | ""            | "gggg"        | predefined extra information of slots of this weekly view.                                                                                          |
| slotTitleFormat    | String Or Object | ""            | "[Week: ]wo"  | predefined slot title.                                                                                                                              |

# View:monthly

| field              | value type       | value example | default value | memo                                                                                                                                                |
| ------------------ | ---------------- | ------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| type               | String           | "row"         | "column"      | You can arrange event slots by row or column. This field will be ignored in other views. In `bar` or `fullscreen` region, `"row"` could look nicer. |
| slotSubTitleFormat | String           | ""            | "YYYY"        | predefined extra information of slots of this monthly view.                                                                                         |
| slotTitleFormat    | String Or Object | ""            | "MMMM"        | predefined slot title.                                                                                                                              |

## Examples

- Basic Sample

```js
{
  name: "VIEW1",
  mode: "weekly",
  title: "My Schedule",
  position: "top_left",
},
```

![view3](view3.png)

- modification Sample.

```js
{
  name: "VIEW1",
  mode: "weekly",
  title: "Mein Terminplan",
  position: "top_left",
  slotMaxHeight:"180px",
  hideOverflow:true,
  locale:"de-DE",
  slotTitleFormat: "wo [Wochen]",
  dateFormat: "MMM Do",
  dateTimeFormat: "MMM Do HH:mm"
},
```

![view4](view4.png)
