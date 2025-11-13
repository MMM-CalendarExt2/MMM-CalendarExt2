/* global dayjs config */
/* eslint-disable no-console */
// Initialize Day.js plugins for browser environment

(function initDayjs () {
  if (typeof dayjs === "undefined") {
    console.error("[CALEXT2] Day.js is not loaded!");
    return;
  }

  // Extend dayjs with all loaded plugins
  const plugins = [
    window.dayjs_plugin_utc,
    window.dayjs_plugin_timezone,
    window.dayjs_plugin_isBetween,
    window.dayjs_plugin_isSameOrBefore,
    window.dayjs_plugin_isSameOrAfter,
    window.dayjs_plugin_relativeTime,
    window.dayjs_plugin_calendar,
    window.dayjs_plugin_duration,
    window.dayjs_plugin_localeData,
    window.dayjs_plugin_weekOfYear,
    window.dayjs_plugin_weekYear,
    window.dayjs_plugin_advancedFormat
  ];

  plugins.forEach((plugin) => {
    if (plugin) {
      dayjs.extend(plugin);
    }
  });

  // Set locale if configured
  if (typeof config !== "undefined" && config.language) {
    dayjs.locale(config.language.toLowerCase());
  }

  console.log("[CALEXT2] Day.js initialized with plugins");
}());
