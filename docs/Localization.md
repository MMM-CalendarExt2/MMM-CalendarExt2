# Localization

## default locale

```js
config: {
  locale: "de-DE",
  ...
}
```

## change locale in specific view

```js
views: [
  ...
  {
    name: "MY German Schedule View",
    locale: "de-DE",
    ...
  },
],
```

## change date and dateTime Format

```js
views: [
  ...
  {
    name: "MY German Schedule View",
    locale: "de-DE",
    dateFormat: "MM/Do",
    ...
  },
],
```

## change date and dateTime Format to relative humanized

```js
views: [
  ...
  {
    name: "MY German Schedule View",
    locale: "de-DE",
    dateTimeFormat: {
      sameDay: "[Heute] HH:mm",
      nextDay: "[Morgen] HH:mm",
      nextWeek: "dddd HH:mm",
      lastDay: "[Gestern] HH:mm",
      lastWeek: "[Letzen] ddd HH:mm",
      sameElse: "MM/Do HH:mm"
    },
    ...
  },
],
```

## change relativeFormat

```js
views: [
  ...
  {
    name: "MY German Schedule View",
    locale: "de-DE",
    relativeFormat: {
      passed: "Es endete %ENDFROMNOW%",
      current: "Es endet %ENDFROMNOW%",
      future: "Es beginnt %STARTFROMNOW% (%DURATION%)"
    },
    ...
  },
],
```
