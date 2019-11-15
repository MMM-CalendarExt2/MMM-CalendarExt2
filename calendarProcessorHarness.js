const CalendarProcessor= require("./CalendarProcessor");

var config= {
    updateInterval:1000* 60*6,
    firstDrawingDelay: 1000*10,
    calendars : [

    ]
  };
const calendarProcessor= new CalendarProcessor(config, (events) => {
  console.log(events[0]);
});
calendarProcessor.startScanCalendars();
    