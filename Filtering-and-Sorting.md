## Filtering
You can filter the events in `calendar` and `view`.
There could be many cases to use filter, I make it as callback function. Sorry for all non-developers. But it's not so difficult.
The basic concept is here.
```js
filter: (event) => {
  IF THIS EVENT SHOULD BE INCLUDED, return true
  IF NOT, return false
}
```

By Example
```
filter: (event) => {
  if (event.isFullday == true) {
    return true
  } else {
    return false
  }
}
```
This code says **If this event is fullday event, use it. But if not so, drop it from event list**. When you need only `fullday` events, this could be useful.

## Sorting
You can also use sorting in `view`. (`calendar` doesn't support sorting, because displaying sort depends on view.)
Concept is similar.
```js
sort: (eventA, eventB) => {
  IF eventA SHOULD BE PRIOR TO eventB, return NEGATIVE VALUE 
  IF NOT, return POSITIVE VALUE
}
```

By Example;
```js
sort: (a, b) => {
  return a.duration - b.duration
}
```
This code says, **If duration of event A is smaller than that of event B, event A is prior to event B - sort by smaller duration**

Example 2;
```js
sort: (a, b) => {
  if (a.calendarSeq == b.calendarSeq) {
    return a.startDate - b.startDate
  } else {
    return a.calendarSeq - b.calendarSeq
  }
}
```
This means ** Sort by calendar Sequence first. when sequence of two events are same, compare startDate and earlier is prior.)