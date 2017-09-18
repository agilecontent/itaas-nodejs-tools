'use strict';

const request = require('request');

class CacheRemoteObject {

  static create(url, refreshTimeSeconds) {
    return new CacheRemoteObject(url, refreshTimeSeconds);
  }

  constructor(url, refreshTimeSeconds) {
    this.url = url;
    this.refreshTimeSeconds = (refreshTimeSeconds) ? refreshTimeSeconds : 0;
    this.isRefreshing = false;
    this.lastRefresh = null;
    this.remoteObject = null;
  }

  nextRefresh(context) {
    return this.lastRefresh + (1000 * this.refreshTimeSeconds);
  }

  isCacheStale(context) {
    return this.lastRefresh === null ||
      this.nextRefresh(context) < new Date().getTime();
  }

  getRemoteObject(context) {
    return new Promise((resolve, reject) => {
      if (!this.url) {
        return reject(new Error('Missing Remote Object URL.'));
      }
      return request(this.url, (error, response, body) => {
        if (error) {
          context.logger.error({ err: error }, 'Error calling the remote object service');
          return reject(`Error calling url ${this.url}.`);
        }

        if (response.statusCode !== 200) {
          context.logger.error(`Error calling the remote object service. HTTP status code: ${response.statusCode}`);
          context.logger.info(`HTTP Body: ${body}`);

          return reject(new Error(`Could not get a valid response from ${this.url}.`));
        }

        return resolve(JSON.parse(body));
      });
    });
  }

  refreshCache(context, forceRefresh) {
    if (forceRefresh == undefined) {
      forceRefresh = false;
    }

    // Already refreshing
    if (!forceRefresh && this.isRefreshing) {
      return Promise.resolve();
    }

    // It is not the time
    if (!forceRefresh && !this.isCacheStale(context)) {
      return Promise.resolve();
    }

    // Ok, lets refresh
    this.isRefreshing = true;
    
    return this.getRemoteObject(context)
      .then((result) => {
        this.remoteObject = result;
        this.lastRefresh = new Date().getTime();

        this.isRefreshing = false;
        return Promise.resolve(result);
      })
      .catch((err) => {
        this.isRefreshing = false;
        context.logger.error({ err: err }, 'Failed to refresh the remote object');
        return Promise.reject(err);
      });
  }

  getCached(context) {
    this.refreshCache(context); //async call

    return this.remoteObject;
  }

  getFresh(context) {
    return this.refreshCache(context, true);
  }

}

module.exports = CacheRemoteObject;