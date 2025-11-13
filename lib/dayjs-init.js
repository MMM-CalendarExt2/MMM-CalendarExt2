/* global dayjs dayjs_plugin_utc dayjs_plugin_timezone dayjs_plugin_isBetween dayjs_plugin_isSameOrBefore dayjs_plugin_isSameOrAfter dayjs_plugin_relativeTime dayjs_plugin_calendar dayjs_plugin_duration dayjs_plugin_localeData dayjs_plugin_weekOfYear dayjs_plugin_weekYear dayjs_plugin_advancedFormat config */
/* eslint-disable no-console, camelcase */
// Initialize Day.js plugins for browser environment
(function initDayjs () {
  if (typeof dayjs === "undefined") {
    console.error("[CALEXT2] Day.js is not loaded!");
    return;
  }

  // Plugins are loaded as UMD modules
  if (typeof dayjs_plugin_utc !== "undefined") {
    dayjs.extend(dayjs_plugin_utc);
  }
  if (typeof dayjs_plugin_timezone !== "undefined") {
    dayjs.extend(dayjs_plugin_timezone);
  }
  if (typeof dayjs_plugin_isBetween !== "undefined") {
    dayjs.extend(dayjs_plugin_isBetween);
  }
  if (typeof dayjs_plugin_isSameOrBefore !== "undefined") {
    dayjs.extend(dayjs_plugin_isSameOrBefore);
  }
  if (typeof dayjs_plugin_isSameOrAfter !== "undefined") {
    dayjs.extend(dayjs_plugin_isSameOrAfter);
  }
  if (typeof dayjs_plugin_relativeTime !== "undefined") {
    dayjs.extend(dayjs_plugin_relativeTime);
  }
  if (typeof dayjs_plugin_calendar !== "undefined") {
    dayjs.extend(dayjs_plugin_calendar);
  }
  if (typeof dayjs_plugin_duration !== "undefined") {
    dayjs.extend(dayjs_plugin_duration);
  }
  if (typeof dayjs_plugin_localeData !== "undefined") {
    dayjs.extend(dayjs_plugin_localeData);
  }
  if (typeof dayjs_plugin_weekOfYear !== "undefined") {
    dayjs.extend(dayjs_plugin_weekOfYear);
  }
  if (typeof dayjs_plugin_weekYear !== "undefined") {
    dayjs.extend(dayjs_plugin_weekYear);
  }
  if (typeof dayjs_plugin_advancedFormat !== "undefined") {
    dayjs.extend(dayjs_plugin_advancedFormat);
  }

  // Set global locale from MagicMirror config
  if (typeof config !== "undefined" && config.language) {
    const locale = config.language.toLowerCase();
    dayjs.locale(locale);
    console.log(`[CALEXT2] Day.js initialized with plugins and locale: ${locale}`);
  } else {
    console.log("[CALEXT2] Day.js initialized with plugins");
  }
}());
