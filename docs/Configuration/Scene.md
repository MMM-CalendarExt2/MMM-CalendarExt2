# SCENE

**Scene** is a set of Calendar **View**s. You can define several scenes for your purpose. MM will display one scene at a time. You can rotate scenes by time or notification.

- Scenes Example : `My Calendar`, `Wife's Calendar`, `Tom's Calendar`
- Another Scenes Example : `Last Month`, `This Month`, `Next Month`, ...

Here is an example of `scenes` fields

```javascript
scenes: [ // `scenes` could have several scenes as elements of array
  {
    name: "My Soccer",
    views: ["Upcoming Hotspurs Games", "Monthly Champion's League Schedule"],
  },
  {
    name: "All",
    views: [],
  },
],
```

In above example, we have 2 scenes - **My Soccer** and **All**.

- **My Soccer** has 2 views - "Upcoming Hotspurs Games", "Monthly Champion's League Schedule".
- **All** has all views([] means all. whichever they are.)

These 2 Scenes will be displayed in turn by time, or be changed by notification.

## Options

| field     | value type           | value example                    | default value | memo                                                                                                                                                                                                                                                                                  |
| --------- | -------------------- | -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name      | String               | "DEFAULT"                        | -             | **REQUIRED**<br/>Scene name, this value will be used to distinguish specific scene. If not set, auto-generated `uid` will be used instead, but to assign name is recommended. <br/> At least one of scene should have name "DEFAULT", unless you set different name as `defaultScene` |
| views     | Array of `view name` | ["Holidays", "Business Meeting"] | []            | To specify views in this scene. If set as `[]`, all views will be included in this scene.                                                                                                                                                                                             |
| className | String               | "myScene1"                       | ""            | If you want to assign specific CSS class to this scene, use this.                                                                                                                                                                                                                     |
