# Integrating with other modules

## With `MMM-TelegramBot`

You can command to change scene via `MMM-TelegramBot`

- `/scene` : change to first scene of `scenes` list.
- `/scene n` : change to next scene
- `/scene p` : change to previous scene
- `/scene [number]` : change to nth scene
- `/scene [name]`: change to scene which has `name`

## With `notification`

Other MM module can order to change scene with notification.

### Predefined notifications

#### CALEXT2_SCENE_NEXT

- `.sendNotification("CALEXT2_SCENE_NEXT", null)`

#### CALEXT2_SCENE_PREVIOUS

- `.sendNotification("CALEXT2_SCENE_PREVIOUS", null)`

#### CALEXT2_SCENE_CHANGE

- `.sendNotification("CALEXT2_SCENE_CHANGE", {type:"id", key:0})`
- `.sendNotification("CALEXT2_SCENE_CHANGE", {type:"name", key:"DEFAULT"})`
  - `type` could be `"name"` or `"id"`
  - `key` should be `id(order in scenes)` or `name` of SCENE

### Get events

You can get events by calling this notification for other modules job.
**CALEXT_EVENT_QUERY**
Usage example:

```js
var filterFn = (event) => {
  if (event.startDate > Date.now()) return true;
};
var callbackFn = (events) => {
  this.doMyJob(events);
};
this.sendNotification("CALEXT2_EVENT_QUERY", {
  filter: filterFn,
  callback: callbackFn
});
```

You can filter events by `filterFn`. And you can do your job with filtered events by `callbackFn`

- `filter` and `callback` should be **Function**

### User-defined notification trigger

You can add your custom notification trigger to control this module.

By example, if you want to sync scene to the page of `MMM-Page-Selector`, Scenes need to be changed by `PAGE_CHANGED` notification from `MMM-Page-Selector`.

```js
notifications: {
  "PAGE_CHANGED" : {
    exec: "changeSceneById",
    payload: (payload) => {return payload}
  }
},
```

By this configuration, `PAGE_CHANGED` notification could activate `changeSceneById` method of this module.

- `exec` : As this value, you can set `string` or `function`.
  - string : member function name of this module (Only below functions are available).
  - callback function: Or you can describe callback function which would return function name.

```js
exec: "FUNCTION NAME",

or

exec: (payload, sender) => {
  ...
  return "FUNCTION NAME"
},
```

- `payload` : As this value, you can set `null` or `function`.
  - null : When there is no need to use payload.
  - callback function: Or you can describe callback function which would manipulate and convert payload.

```js
payload: null,

or

payload: (payload, sender) => {
  ...
  return CONVERTED_PAYLOAD
},
```

## Available executable functions

- `sceneNext()`
- `scenePrevious()`
- `changeSceneById(seq)`
- `chageSceneByName(name)`
- `eventQuery({filter:fn(event), callback:fn(events)})`
