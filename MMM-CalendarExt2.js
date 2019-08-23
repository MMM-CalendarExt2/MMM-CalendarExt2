Module.register("MMM-CalendarExt2", {
  predefined: {
    notifications: {
      "CALEXT2_SHOW_CALENDAR": {
        exec: "showCalendar",
        payload:null,
      },
      "CALEXT2_HIDE_CALENDAR": {
        exec: "hideCalendar",
        payload:null,
      },
      "CALEXT2_SCENE_NEXT": {
        exec: "sceneNext",
        payload: null,
      },
      "CALEXT2_SCENE_PREVIOUS": {
        exec: "scenePrevious",
        payload: null,
      },
      "CALEXT2_SCENE_CHANGE" : {
        exec: (payload, sender) => {
          if (payload.type && payload.type == "id") {
            return "changeSceneById"
          } else if (payload.type && payload.type == "name") {
            return "changeSceneByName"
          } else {
            return null
          }
        },
        payload: (payload, sender) => {
          return (payload.key) ? payload.key : null
        },
      },
      "CALEXT2_EVENT_QUERY" : {
        exec: "eventQuery",
        payload: (payload, sender) => {
          return payload
        }
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
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          lastDay: '[Yesterday]',
          lastWeek: '[Last] ddd',
          sameElse: 'ddd, M/D'
        },
        type: "column",
      },
      weekly: {
        slotTitleFormat: "[Week: ]wo",
        slotSubTitleFormat: "gggg",
        type: "column",

      },
      monthly: {
        slotTitleFormat: "MMMM",
        slotSubTitleFormat: "YYYY",
        type: "column",
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
        slotMaxHeight:"150px",
        weeksFormat: "wo",
        monthFormat: "MMMM"
      },
      upcoming: {
        slotTitle: "upcoming",
        maxItems: 10,
        maxDays: 30,
        useEventTimeRelative:true,
      },
      current: {
        slotTitle:"Current",
        maxItems:10,
        useEventTimeRelative:true,
      }
    },
    calendar: {
      maxItems: 100,
      scanInterval: 1000*60*30,
      beforeDays: 60,
      afterDays: 365,
      maxIterations: 100,
      forceLocalTZ: false,
      replaceTitle:[],
      icon: "",
      className: "",
      auth:{},
      filter: (event)=>{return true}, // you can make a filter to include/exclude specific events per calendar
    },
    scene: {
      name: "",
      uid: 0,
      views: [],
      className: "",
    },
    view: {
      mode: "daily",
      className: "",
      position: "top_left",
      title: "", //???
      calendars: [],
      filter: (event) => {return true},
      sort: (a,b) => {return a.startDate - b.startDate},
      transform: (event) => {return event},
      locale: "",
      fromNow: 0,
      slotCount: 3,
      slotMaxHeight: "150px",
      hideOverflow: true,
      slotTitleFormat: "",
      slotSubTitleFormat: "",
      slotTitle: "",
      slotSubTitle: "",
      filterPassedEvent: false,
      maxItems:100,
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
      relativeFormat: { //%ENDFROMNOW%, %STARTFROMNOW%, %DURATION%
        passed: "ended %ENDFROMNOW%",
        current: "ends %ENDFROMNOW%",
        future: "starts %STARTFROMNOW% (%DURATION%)"
      },
      useEventTimeRelative:false, //If true, relativeFormat will be used instead time/date/dateTimeFormat.
    },
  },

  defaults: {
    locale: "",

    rotateInterval: 0, //when 0, autoRotate will be disabled.
    updateInterval: 1000 * 60, //If not rotated, this interval will be used for update content
    deduplicateEventsOn: [],
    defaultSet: {
      calendar:{},
      scene:{},
      view:{}
    },
    calendars:[],
    scenes:[],
    views:[],

    iconify: "//code.iconify.design/1/1.0.0-rc3/iconify.min.js",
    firstDrawingDelay: 1000, //wait for other calendar parsing.


  },

  getCommands: function(register) {
    if (register.constructor.name == 'TelegramBotCommandRegister') {
      register.add({
        command: "scene",
        description: "Show specific scene. You can use `n`, `p`, number and scene name after `/scene`",
        callback: "CMD_changeScene",
      })
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

  getScripts: function() {
    var r = ["moment.js", "CALEXT2_Scene.js", "CALEXT2_View.js", "CALEXT2_Event.js", "CALEXT2_Slot.js"]
    if (this.config.iconify) r.push(this.config.iconify)
    return r
  },

  getStyles: function() {
    return ["MMM-CalendarExt2.css"]
  },

  start: function() {
    this.rotateTimer = null
    this.updateTimer = null
    this.currentSceneUid = 0
    this.currentScene = null
    this.events = []
    this.showing = true
    this.initConfig()
    this.executable = [
      "sceneNext", "scenePrevious", "changeSceneById", "changeSceneByName",
      "eventQuery", "showCalendar", "hideCalendar"
    ]

    this.first = true
  },

  suspend: function() {
    this.showing = false
    if (this.currentScene) {
      this.currentScene.clearViews()
    }
  },

  resume: function() {
    this.showing = true
    if (this.currentScene) {
      this.work(this.currentScene.uid)
    } else {
      this.work()
    }
  },

  initConfig: function() {
    this.config.defaultSet = Object.assign({}, this.predefined.defaultSet, this.config.defaultSet)
    this.config.notifications = Object.assign({}, this.predefined.notifications, this.config.notifications)
    this.initBasicObjects(this.config.calendars, "calendar")
    this.initBasicObjects(this.config.views, "view", this.predefined.views)
    this.initBasicObjects(this.config.scenes, "scene")
    console.log(this.config.calendars)
  },

  initBasicObjects: function(arrs, type, predefinedMode = null) {
    for (i = 0; i < arrs.length; i++) {
      arrs[i].name = (arrs[i].hasOwnProperty("name")) ? arrs[i].name : i
      arrs[i].uid = i
      var option = {}
      if (predefinedMode) {
        option = predefinedMode[arrs[i].mode]
      }
      if (arrs[i].hasOwnProperty("name")) {
        arrs[i] = Object.assign(
          {},
          this.predefined[type],
          option,
          this.config.defaultSet[type],
          arrs[i],
        )
      }
      if (!arrs[i].locale && type == "view") arrs[i].locale = this.config.locale
      if (arrs[i].filter && type == "calendar") {
        arrs[i].filter = JSON.stringify({"filter": arrs[i].filter.toString()})
      }
    }
  },

  socketNotificationReceived: function(noti, payload) {
    switch(noti) {
      case "EVENTS_REFRESHED":
        this.events = payload
        if (this.first) {
          setTimeout(()=>{this.work()}, this.config.firstDrawingDelay)
        }
        this.first = false
        this.sendNotification("CALEXT2_CALENDAR_MODIFIED")
        break
    }
  },

  notificationReceived: function(noti, payload, sender) {
    if (noti == "DOM_OBJECTS_CREATED") {
      this.sendSocketNotification("START", this.config)
      return
    }
    if (this.config.notifications) {
      if (Object.keys(this.config.notifications).indexOf(noti) >= 0) {
        var command = this.config.notifications[noti]
        var exec = (typeof command.exec == "function") ? command.exec(payload, sender) : command.exec
        var payload = (typeof command.payload == "function") ? command.payload(payload, sender) : command.payload
        if (this.executable.indexOf(exec) >= 0) {
          var ret = this[exec](payload)
          this.sendNotification(noti + "_RESULT", ret)
        } else {
          this.sendNotification(noti + "_RESULT", null)
        }
      }
    }

  },

  work: function(sceneUid = null) {
    if (!this.showing) return false
    clearTimeout(this.rotateTimer)
    rotateTimer = null

    var uid = (sceneUid) ? sceneUid : this.currentSceneUid
    if (this.currentScene) this.currentScene.clearViews()
    setTimeout(()=>{
      this.currentScene = new Scene(uid, this.config)
      this.currentScene.draw(this.events)
    }, 500)

    if (this.config.rotateInterval > 0) {
      this.rotateTimer = setTimeout(()=>{
        this.work(this.currentScene.nextUid)
      }, this.config.rotateInterval)
    } else {
      this.rotateTimer = setTimeout(()=> {
        this.work(this.currentScene.uid)
      }, this.config.updateInterval)
    }
  },

  CMD_changeScene: function(command=null, handler=null) {
    var reply, changed = null
    var args = (handler.args) ? handler.args : null
    if (args == "n") {
      changed = this.sceneNext()
    } else if (args == "p") {
      changed = this.scenePrevious()
    } else if (Number(args) !== "NaN") {
      changed = this.changeSceneById(args)
    } else if (typeof args == "string") {
      changed = this.changeSceneByName(args)
    } else {
      reply = "Current Scene is " + this.currentScene.name
      handler.reply("TEXT", reply)
    }
    if (changed) {
      if (handler) {
        reply = "Yes, Sir!"
        handler.reply("TEXT", reply)
      }
    } else {
      if (handler) {
        reply = "Sorry, I can't do it."
        handler.reply("TEXT", reply)
      }
    }
  },

  sceneNext: function() {
    var nextUid = this.currentScene.nextUid
    this.work(nextUid)
    return true
  },

  scenePrevious: function() {
    var prevUid = this.currentScene.previousUid
    this.work(prevUid)
    return true
  },

  changeSceneByName: function(key) {
    for(let i = 0; i < this.config.scenes.length; i++) {
      if (this.config.scenes[i].name == key) {
        this.work(i)
        return true
      }
    }
    return false
  },

  changeSceneById: function(key) {
    if (key >= 0 && this.config.scenes.length > key) {
      this.work(key)
      return true
    }
    return false
  },

  eventQuery: function(payload) {
    var events = this.events.map((e) => {
      return Object.assign({}, e)
    })
    if (typeof payload.filter == "function") {
      events = events.filter(payload.filter)
    }
    if (typeof payload.callback == "function") {
      payload.callback(events)
      return null
    }
    return events
  },

  showCalendar: function() {
    this.resume()
    return true
  },

  hideCalendar: function() {
    this.suspend()
    return true
  }
})
