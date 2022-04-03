<!-- markdownlint-disable-file MD041 -->

# View:legend
The purpose of this view is to show a legend of all calendars specified in the configuration to display. The legend is typically used on a large calendar view to denote different calendars being used. For example, you might have a Google calendar for work and another for home. The legend will allow you or a guest to quickly differentiate events on your calendar from home or work. This makes more sense when you add colors in a custom CSS file or add a class name to the calendar. The legend is a quick reference to see what colors or icons match to the calendar.

### Configuration Reference
```js
{
    name: "Legend",
    title: "Legend",
    mode: "legend",
    calendars: ["Garmin", "Work", "Home"],
    position: "top_left"
},
```

## Example

### Legend
![legend](legend.jpg)

### Legend with Calendar
![Full Legend Calendar Example](legend-full-example.png)

The outputted HTML is very simplistic and looks like the following:
```html
<div class="module fake_module MMM-CalendarExt2 CX2 shown">
  <header class="module-header">Legend</header>
  <div class="module-content">
    <div class="view legend">
      <div class="legendSlot event garmin" data-calendar-name="Garmin">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512" class="iconify eventIcon" data-icon="cil:running">
          <path fill="currentColor" d="m353.415 200l-30.981-57.855l-60.717-20.239l-.14.432L167.21 149.3A32.133 32.133 0 0 0 144 180.068V264h32v-83.931l73.6-21.028l-32.512 99.633l-.155-.056l-29.464 82.5a16.088 16.088 0 0 1-20.127 9.8l-66.282-22.097l-10.12 30.358l66.282 22.093a48 48 0 0 0 60.378-29.391l24.232-67.849l17.173 5.6l48.3 48.3A15.9 15.9 0 0 1 312 349.255V456h32V349.255a47.694 47.694 0 0 0-14.059-33.942l-48.265-48.264l26.783-82.077l19.269 34.683A24.011 24.011 0 0 0 348.707 232H432v-32Zm-66.587-90.293a36 36 0 1 0-12.916-27.619a35.851 35.851 0 0 0 12.916 27.619Z"></path>
        </svg>
        <div class="eventTitle">Garmin</div>
      </div>
      <div class="legendSlot event work" data-calendar-name="Work">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" class="iconify eventIcon" data-icon="gg:work-alt">
          <path fill="currentColor" fill-rule="evenodd" d="M17 7a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-8a3 3 0 0 0-3-3h-1Zm-3-1h-4a1 1 0 0 0-1 1h6a1 1 0 0 0-1-1ZM6 9h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" clip-rule="evenodd"></path>
        </svg>
        <div class="eventTitle">Work</div>
      </div>
      <div class="legendSlot event home" data-calendar-name="Home">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" width="1em" height="1em" style="vertical-align: -0.125em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024" class="iconify eventIcon" data-icon="ant-design:home-outlined">
          <path fill="currentColor" d="M946.5 505L560.1 118.8l-25.9-25.9a31.5 31.5 0 0 0-44.4 0L77.5 505a63.9 63.9 0 0 0-18.8 46c.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8a63.6 63.6 0 0 0 18.7-45.3c0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204zm217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7l23.1 23.1L882 542.3h-96.1z"></path>
        </svg>
        <div class="eventTitle">Home</div>
      </div>
    </div>
  </div>
</div>
```
