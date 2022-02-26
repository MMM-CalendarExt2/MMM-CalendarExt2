# Calendar

## Example

```javascript
calendars : [
  {
    name: "US holiday",
    icon: "noto-beach-with-umbrella",
    className: "holiday",
    url: "http://www.calendarlabs.com/templates/ical/US-Holidays.ics",
  },
  {
    name : "Tottenham",
    icon: "noto-soccer-ball",
    replaceTitle:[
      ["Tottenham Hotspur", ""],
      [" - ", ""]
    ],
    className: "Tottenham",
    url: "https://www.google.com/calendar/ical/ovb564thnod82u5c4njut98728%40group.calendar.google.com/public/basic.ics",
  },
],
```

`calendars:[]` could have at least ONE (and more) calendar to get events. Each calendar should have `url`. If you want to use local `.ics` file, put into MM directory and can contact it with `"https://localhost:8080/YOUR.ics"`.

## Default values of calendar

Below fields are predefined values. Unless overriding it, this will be used by default.

```javascript
{
  url: "",
  name: "",
  maxItems: 100,
  scanInterval: 1000*60*30,
  beforeDays: 60,
  afterDays: 365,
  maxIterations: 100,
  forceLocalTZ: false,
  replaceTitle:[],
  icon: "",
  className: "",
  auth: {},
  filter: (event)=>{return true}
}
```

- **`url`** : **REQUIRED** URL of `.ics`
- **`name`** : **OPTIONAL BUT RECOMMENDED** name of this calendar. This value will be used in `view` to pick up specific calendar.
- **`maxItems`** : how much events should be parsed.
- **`scanInterval`** : (milliseconds) how often calendar should be rescanned.
- **`beforeDays`**, **afterDays** : Events between these days will be got.
- **`maxIterations`**: If event is recurrent type, how many recurrence will be parsed.
- **`forceLocalTZ`** : Some iCal has wrong time zone information. When the iCal has that kind of problem, this option could be a simple fix.
- **`replaceTitle`** : Array of [`pattern`, `replace`].
  - e.g)

```js
replaceTitle:[
  ["Tottenham Hotspurs", "SPURS"],
  [" - ", " vs "]
],
```

With this configuration, event title `"Totten Hotspurs - FC. Arsenal"` will be changed to `"SPURS vs FC. Arsenal"`.

`pattern` could be the regular expression and `replace` could be the replacement used instead of `pattern` in the title. In below example, event title `"Thanks God Its Friday"` will be replaced as `"TGIF"`

```js
replaceTitle:[
  [/([A-Z])([a-z]+ ?)/g, "$1"]
],
```

- **`icon`** : You can use any icon of [`iconify`](https://iconify.design/icon-sets/)
  - For example: [`mdi-access-point`](https://iconify.design/icon-sets/mdi/access-point.html) will show as icon of event of this calendar
- **`className`** : You can assign your custom CSS class to events of this calendar.
  - You can add these codes into your `css/custom.css` to beautify when you set `className:"myClass"`.

```css
.CX2 .event.myClass {
  color: #ff0;
  background-color: #333;
}
```

- **`auth`** : If your calendar needs additional authenication, use it here. It currently supports `bearer`, `digest` and `basic`. Make sure to use the exact spelling or else it won't work. Nextcloud for example uses basic auth in most cases.

```javascript
auth: {
  method: "bearer",
  pass: "yourpassword",
}

or

auth: {
  method: "digest",
  user: "yourusername",
  pass: "yourpasword"
}

or

auth: {
  method: "basic",
  user: "yourusername",
  pass: "yourpasword"
}
```

- **`filter`** : You can filter events with this callback function.
  - By Example, below code makes only to include events which title is "WORK".

```js
filter: (event) => {
  if (event.title == "WORK") return true;
};
```

Available Event properties, See [Event Object](../Event-Object.md).
