const https = require("node:https");
const Log = require("logger");

/**
 * CalendarFetcher - Fetches calendar data with HTTP error handling and cooldowns
 */
class CalendarFetcher {
  constructor (url, reloadInterval, auth, options) {
    this.url = url;
    this.reloadInterval = reloadInterval;
    this.auth = auth;
    this.options = options;
    this.onSuccess = options.onSuccess;
    this.onError = options.onError;
    this.timer = null;
    this.suspendUntil = null;
    this.suspendReason = null;
  }

  handleHttpError (response) {
    const {status, statusText = "unknown"} = response;
    const opts = this.options;
    let cooldown;

    if (status === 401 || status === 403) {
      cooldown = opts.authFailureCooldown || 3600000;
      this.suspendUntil = Date.now() + cooldown;
      this.suspendReason = `auth error (${status})`;
      Log.error(`[CalendarFetcher] ${this.url} >> Auth failed (${status}). Pausing ${Math.round(cooldown / 60000)}min.`);
    } else if (status === 429) {
      const retryAfter = response.headers.get("retry-after");
      cooldown = opts.rateLimitCooldown || 900000;
      if (retryAfter) {
        const seconds = Number(retryAfter);
        const retryDate = Date.parse(retryAfter);
        if (!Number.isNaN(seconds) && seconds >= 0) {
          cooldown = seconds * 1000;
        } else if (!Number.isNaN(retryDate)) {
          cooldown = Math.max(0, retryDate - Date.now());
        }
      }
      this.suspendUntil = Date.now() + cooldown;
      this.suspendReason = "rate limit";
      Log.warn(`[CalendarFetcher] ${this.url} >> Rate limited. Retry in ${Math.round(cooldown / 60000)}min.`);
    } else if (status >= 400 && status < 500) {
      cooldown = opts.clientErrorCooldown || 3600000;
      this.suspendUntil = Date.now() + cooldown;
      this.suspendReason = `client error (${status})`;
      Log.error(`[CalendarFetcher] ${this.url} >> Client error (${status}). Pausing ${Math.round(cooldown / 60000)}min.`);
    } else if (status >= 500) {
      Log.error(`[CalendarFetcher] ${this.url} >> Server error (${status}). Retry after ${Math.round(this.reloadInterval / 60000) || 1}min.`);
    } else {
      Log.error(`[CalendarFetcher] ${this.url} >> Unexpected status ${status}.`);
    }

    return {
      error: new Error(`HTTP ${status} ${statusText}`),
      delay: cooldown ? Math.max(cooldown, this.reloadInterval) : this.reloadInterval
    };
  }

  async fetch () {
    clearTimeout(this.timer);

    if (this.suspendUntil && this.suspendUntil > Date.now()) {
      const delay = Math.max(this.suspendUntil - Date.now(), this.reloadInterval);
      Log.warn(`[CalendarFetcher] ${this.url} >> Suspended (${this.suspendReason}). Retry in ${Math.ceil(delay / 60000)}min.`);
      this.timer = setTimeout(() => this.fetch(), delay);
      return;
    }

    if (this.suspendUntil) {
      this.suspendUntil = null;
      this.suspendReason = null;
    }

    const headers = {"User-Agent": this.options.userAgent};
    const agent = this.options.selfSignedCert
      ? new https.Agent({rejectUnauthorized: false})
      : null;

    if (this.auth) {
      if (this.auth.method === "bearer") {
        headers.Authorization = `Bearer ${this.auth.pass}`;
      } else {
        headers.Authorization = `Basic ${Buffer.from(`${this.auth.user}:${this.auth.pass}`).toString("base64")}`;
      }
    }

    let delay = this.reloadInterval;
    try {
      const response = await fetch(this.url, {
        headers,
        agent
      });
      if (response.ok) {
        this.suspendUntil = null;
        this.suspendReason = null;
        this.onSuccess(await response.text());
      } else {
        const err = this.handleHttpError(response);
        delay = err.delay;
        this.onError(err.error);
      }
    } catch (error) {
      Log.error(`[CalendarFetcher] ${this.url} >> Fetch failed: ${error.message}`);
      this.onError(error);
    }

    this.timer = setTimeout(() => this.fetch(), delay);
  }

  start () {
    this.fetch();
  }

  stop () {
    clearTimeout(this.timer);
  }
}

module.exports = CalendarFetcher;
