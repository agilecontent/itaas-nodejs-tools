'use strict';

const request = require('request');

class RemoteConfig {
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
      return request(this.url, (error, response, body) => {
        if (error) {
          context.logger.error({ err: error }, `Error calling url ${this.url}.`);
          return reject(`Error calling url ${this.url}.`);
        }

        if (response.statusCode !== 200) {
          context.logger.error(`Error calling ${this.url}. HTTP status code: ${response.statusCode}`);
          context.logger.info(`HTTP Body: ${body}`);

          return reject(new Error(`Could not get a valid response from ${this.url}.`));
        }

        return resolve(JSON.parse(body));
      });
    });
  }

  isCacheExpired() {
    return this.nextRefresh === null || (this.refreshable && this.nextRefresh < (new Date()).getTime());
  }
	
  refreshCache(context) {
    if (this.isRefreshing) {
      return Promise.resolve(this.configObject);
    }

    if (!this.isCacheExpired()) {
      return Promise.resolve(this.configObject);
    }

    this.refreshing = true;

    return this.getConfigObjectFromSource(context)
      .then((result) => {
        this.configObject = result;
        this.nextRefresh = new Date().getTime() + (1000 * this.refreshTimeSeconds);
        this.refreshing = false;

        return this.configObject;
      })
     .catch((err) => {
       this.refreshing = false;
       context.logger.error({ err: err }, 'Failed to refresh cache config from source.');
			
       return Promise.reject(err);
     });
  }
}

module.exports = RemoteConfig;