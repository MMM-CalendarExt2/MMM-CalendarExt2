const CalendarProcessor= require("./calendarProcessor");

var NodeHelper = require('node_helper')

module.exports = NodeHelper.create({
  start: function() {
  },

  stop: function() {
  },

  socketNotificationReceived: function (noti, payload) {
    switch(noti) {
      case "START":
        this.work(payload)
        break
    }
  },

  work: function(config) {
    this.calendarProcessor= new CalendarProcessor(config, (events) => {
      this.sendSocketNotification("EVENTS_REFRESHED", events)
    });
    this.calendarProcessor.startScanCalendars()
  }
})
