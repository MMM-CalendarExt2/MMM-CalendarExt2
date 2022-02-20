# the `Event` object

Each event has this structure.

```javascript
calendarId: 1;
calendarName: "Tottenham";
className: "mySoccerClass";
description: "FA Cup, round 3";
duration: 7200;
endDate: "1546638300";
endDateJ: "2019-01-04T21:45:00.000Z";
icon: "noto-soccer-ball";
isFullday: false;
isMoment: false;
isOneday: true;
isPassed: false;
isRecurring: false;
isCancelled: false;
location: "";
startDate: "1546631100";
startDateJ: "2019-01-04T19:45:00.000Z";
title: "Team T.B.A. - Tottenham Hotspur";
uid: "1:1546631100:1546638300:op54vk5s1r0ivl8i165ampip88@google.com";
ms_busystatus: "BUSY"; // Only for calendar from MS Outlook. Available : "BUSY", "FREE", "TENTATIVE", "OOF"
```

You can use these properties for filtering, sorting, or external usage by notification.

Additionally, in `sort` callback function of each view configuration, you can use this also.

```javascript
calendarSeq: 1;
```

`calendarSeq` is the order of calendar in your view configuration.
By example;

```js
{ //example view
  name: "MYVIEW1",
  mode: "daily",
  calendars: ["Holiday", "Office Schedule", "Wife"],
}
```

In this example, `Holiday` will have `calendarSeq:0`, then, `Office Schdule` will have `calendarSeq:1`, ...
