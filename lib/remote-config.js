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
      return request({
        url: this.url,
        json: true, 
        gzip: true 
      }, (error, response, body) => {
        if (error) {
          return reject(`Error calling url ${this.url}.`);
        }

        if (response.statusCode !== 200) {
          return reject(new Error(`Could not get a valid response from ${this.url}.`));
        }

        return resolve(body);
      });
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

module.exports = RemoteConfig;