/* eslint-disable no-eval */
/* global Module Scene */

Module.register("MMM-CalendarExt2", {
  predefined: {
    notifications: {
      CALEXT2_SHOW_CALENDAR: {
        exec: "showCalendar",
        payload: null
      },
      CALEXT2_HIDE_CALENDAR: {
        exec: "hideCalendar",
        payload: null
      },
      CALEXT2_SCENE_NEXT: {
        exec: "sceneNext",
        payload: null
      },
      CALEXT2_SCENE_PREVIOUS: {
        exec: "scenePrevious",
        payload: null
      },
      CALEXT2_SCENE_CHANGE: {
        // eslint-disable-next-line no-unused-vars
        exec: (payload, sender) => {
          if (payload.type && payload.type === "id") {
            return "changeSceneById";
          }
          if (payload.type && payload.type === "name") {
            return "changeSceneByName";
          }
          return null;
        },
        // eslint-disable-next-line no-unused-vars
        payload: (payload, sender) => (payload.key ? payload.key : null)
      },
      CALEXT2_EVENT_QUERY: {
        exec: "eventQuery",
        // eslint-disable-next-line no-unused-vars
        payload: (payload, sender) => payload
      }
    },
    defaultSet: {
      calendar: {},
      scene: {},
      view: {}
    },
    views: {
      daily: {
        slotSubTitleFormat: "MMMM Do",
        slotTitleFormat: {
          sameDay: "[Today]",
          nextDay: "[Tomorrow]",
          nextWeek: "dddd",
          lastDay: "[Yesterday]",
          lastWeek: "[Last] ddd",
          sameElse: "ddd, M/D"
        },
        type: "column"
      },
      weekly: {
        slotTitleFormat: "[Week: ]wo",
        slotSubTitleFormat: "gggg",
        type: "column"
      },
      monthly: {
        slotTitleFormat: "MMMM",
        slotSubTitleFormat: "YYYY",
        type: "column"
      },
      week: {
        slotTitleFormat: "D",
        slotSubTitleFormat: "ddd",
        slotAltTitleFormat: "M/D",
        showWeekends: true,
        slotMaxHeight: "240px",
        weeksFormat: "wo"
      },
      month: {
        slotTitleFormat: "D",
        slotSubTitleFormat: "ddd",
        slotAltTitleFormat: "M/D",
        showWeekends: true,
        slotMaxHeight: "150px",
        weeksFormat: "wo",
        monthFormat: "MMMM"
      },
      upcoming: {
        slotTitle: "upcoming",
        maxItems: 10,
        maxDays: 30,
        useEventTimeRelative: true
      },
      current: {
        slotTitle: "Current",
        maxItems: 10,
        useEventTimeRelative: true
      }
    },
    calendar: {
      maxItems: 1000,
      scanInterval: 1000 * 60 * 30,
      beforeDays: 60,
      afterDays: 365,
      maxIterations: 100,
      forceLocalTZ: false,
      replaceTitle: [],
      icon: "",
      className: "",
      auth: {},
      // eslint-disable-next-line no-unused-vars
      filter: (event) => true // you can make a filter to include/exclude specific events per calendar
    },
    scene: {
      name: "",
      uid: 0,
      views: [],
      className: ""
    },
    view: {
      mode: "daily",
      className: "",
      position: "top_left",
      positionOrder: -1,
      title: "", // ???
      calendars: [],
      // eslint-disable-next-line no-unused-vars
      filter: (event) => true,
      sort: (a, b) => a.startDate - b.startDate,
      transform: (event) => event,
      locale: "",
      fromNow: 0,
      slotCount: 3,
      slotMaxHeight: "150px",
      slotSpaceRight: 3,
      hideOverflow: true,
      hideFooter: false,
      slotTitleFormat: "",
      slotSubTitleFormat: "",
      slotTitle: "",
      slotSubTitle: "",
      filterPassedEvent: false,
      maxItems: 1000,
      dateFormat: {
        sameDay: "[Today]", // Or "MM/DD" format available
        nextDay: "[Tomorrow]",
        nextWeek: "dddd",
        lastDay: "[Yesterday]",
        lastWeek: "[Last] ddd",
        sameElse: "M/D"
      },
      dateTimeFormat: {
        sameDay: "[Today] HH:mm",
        nextDay: "[Tomorrow] HH:mm",
        nextWeek: "dddd HH:mm",
        lastDay: "[Yesterday] HH:mm",
        lastWeek: "[Last] ddd HH:mm",
        sameElse: "M/D HH:mm"
      },
      timeFormat: {
        sameDay: "HH:mm",
        nextDay: "HH:mm",
        nextWeek: "HH:mm",
        lastDay: "HH:mm",
        lastWeek: "HH:mm",
        sameElse: "HH:mm"
      },
      relativeFormat: {
        // %ENDFROMNOW%, %STARTFROMNOW%, %DURATION%
        passed: "ended %ENDFROMNOW%",
        current: "ends %ENDFROMNOW%",
        future: "starts %STARTFROMNOW% (%DURATION%)"
      },
      useEventTimeRelative: false // If true, relativeFormat will be used instead time/date/dateTimeFormat.
    }
  },

  defaults: {
    locale: "",

    rotateInterval: 0, // when 0, autoRotate will be disabled.
    updateInterval: 1000 * 60, // If not rotated, this interval will be used for update content
    deduplicateEventsOn: [],
    defaultSet: {
      calendar: {},
      scene: {},
      view: {}
    },
    calendars: [],
    scenes: [],
    views: [],

    iconify: "//code.iconify.design/1/1.0.0-rc3/iconify.min.js",
    firstDrawingDelay: 1000 // wait for other calendar parsing.
  },

  getCommands (register) {
    if (register.constructor.name === "TelegramBotCommandRegister") {
      register.add({
        command: "scene",
        description:
          "Show specific scene. You can use `n`, `p`, number and scene name after `/scene`",
        callback: "CMD_changeScene"
      });

      /*
      register.add({
        command: 'whennext',
        description : 'Show next event has title. You can try like this; `/whennext birthday`',
        callback : 'TLGBOT_skd',
        args_pattern : [/[^\s]+/i],
        args_mapping : ["title"]
      })
      register.add({
        command: 'skd',
        description : 'Find upcoming schedules with specific date, calendar name and profile.\nSee more help with `/skd`',
        callback : 'TLGBOT_skd',
        args_pattern: [/d:[^ ,]+/i, /c:[^ ,]+/, /p:[^ ,]+/, /n:[0-9]+/],
        args_mapping: ["date", "calendar", "profile", "count"]
      })
      */
    }
  },

  getScripts () {
    const r = [
      "moment.js",
      "CALEXT2_Scene.js",
      "CALEXT2_View.js",
      "CALEXT2_Event.js",
      "CALEXT2_Slot.js",
      "CALEXT2_CellSlot.js",
      "CALEXT2_WeekSlot.js",
      "CALEXT2_ViewAgenda.js",
      "CALEXT2_ViewCell.js",
      "CALEXT2_ViewCurrent.js",
      "CALEXT2_ViewPeriod.js",
      "CALEXT2_ViewDaily.js",
      "CALEXT2_ViewMonth.js",
      "CALEXT2_ViewMonthly.js",
      "CALEXT2_ViewUpcoming.js",
      "CALEXT2_ViewWeek.js",
      "CALEXT2_ViewWeekly.js",
      "CALEXT2_Legend.js"
    ];
    if (this.config.iconify) r.push(this.config.iconify);
    return r;
  },

  getStyles () {
    return ["MMM-CalendarExt2.css"];
  },

  start () {
    this.rotateTimer = null;
    this.updateTimer = null;
    this.currentSceneUid = 0;
    this.currentScene = null;
    this.events = [];
    this.showing = true;
    this.initConfig();
    this.executable = [
      "sceneNext",
      "scenePrevious",
      "changeSceneById",
      "changeSceneByName",
      "eventQuery",
      "showCalendar",
      "hideCalendar"
    ];

    this.first = true;
  },

  suspend () {
    if (this.showing) {
      this.showing = false;
      if (this.currentScene) {
        this.currentScene.clearViews();
      }
    }
  },

  resume () {
    if (!this.showing) {
      this.showing = true;
      if (this.currentScene) {
        this.work(this.currentSceneUid);
      } else {
        this.work();
      }
    }
  },

  initConfig () {
    this.config.defaultSet = {
      ...this.predefined.defaultSet,
      ...this.config.defaultSet
    };
    this.config.notifications = {
      ...this.predefined.notifications,
      ...this.config.notifications
    };

    if (typeof this.config.firstDrawingDelay === "string") {
      this.config.firstDrawingDelay = eval(this.config.firstDrawingDelay);
    }

    if (typeof this.config.updateInterval === "string") {
      this.config.updateInterval = eval(this.config.updateInterval);
    }

    if (typeof this.config.rotateInterval === "string") {
      this.config.rotateInterval = eval(this.config.rotateInterval);
    }

    this.initBasicObjects(this.config.calendars, "calendar");
    this.initBasicObjects(this.config.views, "view", this.predefined.views);
    this.initBasicObjects(this.config.scenes, "scene");
  },

  initBasicObjects (arrs, type, predefinedMode = null) {
    for (let i = 0; i < arrs.length; i++) {
      arrs[i].name = Object.hasOwn(arrs[i], "name") ? arrs[i].name : i;
      arrs[i].uid = i;
      let option = {};
      if (predefinedMode) {
        option = predefinedMode[arrs[i].mode];
      }
      if (Object.hasOwn(arrs[i], "name")) {
        arrs[i] = {
          ...this.predefined[type],
          ...option,
          ...this.config.defaultSet[type],
          ...arrs[i]
        };
      }
      if (!arrs[i].locale && type === "view")
        arrs[i].locale = this.config.locale;
      if (arrs[i].filter && type === "calendar") {
        arrs[i].filter = JSON.stringify({filter: arrs[i].filter.toString()});
      }
      if (typeof arrs[i].scanInterval === "string") {
        arrs[i].scanInterval = eval(arrs[i].scanInterval);
      }
    }
  },

  socketNotificationReceived (noti, payload) {
    switch (noti) {
      case "EVENTS_REFRESHED":
        this.events = payload;
        if (this.first) {
          setTimeout(() => {
            this.work();
          }, this.config.firstDrawingDelay);
        }
        this.first = false;
        this.sendNotification("CALEXT2_CALENDAR_MODIFIED");
        break;
    }
  },

  notificationReceived (noti, payload, sender) {
    if (noti === "DOM_OBJECTS_CREATED") {
      this.sendSocketNotification("START", this.config);
      return;
    }
    if (this.config.notifications) {
      if (Object.keys(this.config.notifications).indexOf(noti) >= 0) {
        const command = this.config.notifications[noti];
        const exec =
          typeof command.exec === "function"
            ? command.exec(payload, sender)
            : command.exec;
        const payloadFunction =
          typeof command.payload === "function"
            ? command.payload(payload, sender)
            : command.payload;
        if (this.executable.indexOf(exec) >= 0) {
          const ret = this[exec](payloadFunction);
          this.sendNotification(`${noti}_RESULT`, ret);
        } else {
          this.sendNotification(`${noti}_RESULT`, null);
        }
      }
    }
  },

  work (sceneUid = null) {
    const uid = sceneUid || this.currentSceneUid;
    this.currentSceneUid = uid;
    if (!this.showing) {
      return false;
    }

    clearTimeout(this.rotateTimer);
    this.rotateTimer = null;

    if (this.currentScene) this.currentScene.clearViews();
    this.currentScene = new Scene(uid, this.config);
    setTimeout(() => {
      this.currentScene.draw(this.events);
    }, 500);

    if (this.config.rotateInterval > 0) {
      this.rotateTimer = setTimeout(() => {
        this.work(this.currentScene.nextUid);
      }, this.config.rotateInterval);
    } else {
      this.rotateTimer = setTimeout(() => {
        this.work(uid);
      }, this.config.updateInterval);
    }
    return true;
  },

  CMD_changeScene (handler = null) {
    let reply;
    let changed = null;
    const args = handler.args ? handler.args : null;
    if (args === "n") {
      changed = this.sceneNext();
    } else if (args === "p") {
      changed = this.scenePrevious();
    } else if (Number(args) !== "NaN") {
      changed = this.changeSceneById(args);
    } else if (typeof args === "string") {
      changed = this.changeSceneByName(args);
    } else {
      reply = `Current Scene is ${this.currentScene.name}`;
      handler.reply("TEXT", reply);
    }
    if (changed) {
      if (handler) {
        reply = "Yes, Sir!";
        handler.reply("TEXT", reply);
      }
    } else if (handler) {
      reply = "Sorry, I can't do it.";
      handler.reply("TEXT", reply);
    }
  },

  sceneNext () {
    const {nextUid} = this.currentScene;
    this.work(nextUid);
    return true;
  },

  scenePrevious () {
    const prevUid = this.currentScene.previousUid;
    this.work(prevUid);
    return true;
  },

  changeSceneByName (key) {
    for (let i = 0; i < this.config.scenes.length; i++) {
      if (this.config.scenes[i].name === key) {
        this.work(i);
        return true;
      }
    }
    return false;
  },

  changeSceneById (key) {
    if (key >= 0 && this.config.scenes.length > key) {
      this.work(key);
      return true;
    }
    return false;
  },

  eventQuery (payload) {
    let events = this.events.map((e) => ({...e}));
    if (typeof payload.filter === "function") {
      events = events.filter(payload.filter);
    }
    if (typeof payload.callback === "function") {
      payload.callback(events);
      return null;
    }
    return events;
  },

  showCalendar () {
    this.resume();
    return true;
  },

  hideCalendar () {
    this.suspend();
    return true;
  }
});
