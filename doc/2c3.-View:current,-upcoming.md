You can use all of common fields of [[2c. Configuration:View]] in this view also.

# View:current
|field |value type |value example |default value |memo |
|---|---|---|---|---|
|slotTitle |String |"My current" |"Current" |In view:current and view:upcoming, there is no need of dynamic slot title. You can set fixed slot title with this field.
|maxItems |Integer |5 |10 |How many items shall be shown.
|useEventTimeRelative |Boolean |false |true |Personally, I like relative format in current & upcoming view. You can modify it.

# View:upcoming
|field |value type |value example |default value |memo |
|---|---|---|---|---|
|slotTitle |String |"My current" |"Current" |In view:current and view:upcoming, there is no need of dynamic slot title. You can set fixed slot title with this field.
|maxItems |Integer |5 |10 |How many items shall be shown.
|maxDays |Integer |7 |30 |...until this.
|useEventTimeRelative |Boolean |false |true |Personally, I like relative format in current & upcoming view. You can modify it.

## Example:
- Basic Sample
```js
{
  name: "VIEW1",
  mode: "current",
  position: "top_left",
  slotTitle: "MY CURRENT"
},
```
![view5](https://github.com/eouia/MMM-CalendarExt2/blob/master/screenshot/view5.png)
- modification Sample.
```js
{
  name: "VIEW1",
  mode: "upcoming",
  position: "top_left",
  slotTitle: "Upcoming Events",
  maxItems:5,
  maxDays:7,
  slotMaxHeight:"180px",
  hideOverflow:true,
},
```
![view6](https://github.com/eouia/MMM-CalendarExt2/blob/master/screenshot/view6.png)