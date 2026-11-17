'use strict';

const { getText } = require('./http-text-request');

class RemoteConfig {

  static create(url, refreshTimeSeconds) {
    return new RemoteConfig(url, refreshTimeSeconds);
  }

  constructor(url, refreshTimeSeconds) {
    this.url = url;
    this.refreshable = (refreshTimeSeconds) ? true : false;
    this.refreshTimeSeconds = (refreshTimeSeconds) ? refreshTimeSeconds : 0;
    this.isRefreshing = false;
    this.nextRefresh = null;
    this.configObject = null;
  }

  getConfigObject(context) {
    return this.refreshCache(context);
  }

  getConfigObjectFromSource(context) {
    return new Promise((resolve, reject) => {
      if (!this.url) {
        return reject(new Error('Missing remote config URL.'));
      }
      return getText(this.url, { Accept: 'application/json' })
        .then(({ statusCode, text }) => {
          if (statusCode !== 200) {
            return reject(new Error(`Could not get a valid response from ${this.url}.`));
          }

          return resolve(parseJsonBody(text));
        }, () => reject(`Error calling url ${this.url}.`));
    });
  }

  isCacheExpired() {
    return this.configObject === null || (this.refreshable && this.nextRefresh < (new Date()).getTime());
  }

  refreshCache(context) {
    if (this.isRefreshing || !this.isCacheExpired()) {
      return Promise.resolve(this.configObject);
    }

    this.isRefreshing = true;

    return this.getConfigObjectFromSource(context)
      .then((result) => {
        this.configObject = result;
        this.nextRefresh = new Date().getTime() + (1000 * this.refreshTimeSeconds);
        this.isRefreshing = false;

        return this.configObject;
      })
      .catch((err) => {
        this.isRefreshing = false;
        context.logger.error({ err: err }, 'Failed to refresh cache config from source.');

        return Promise.reject(err);
      });
  }
}

/**
 * Same body returned before by the request library with json: true. The body is parsed as JSON when possible,
 * otherwise the text is kept, and an empty body is undefined.
 */
function parseJsonBody(text) {
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return text;
  }
}

module.exports = RemoteConfig;
