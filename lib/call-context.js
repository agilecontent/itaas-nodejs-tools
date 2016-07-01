'use strict';

class CallContext {
  constructor(callId, config, logger, serviceLocator) {
    if (!callId) {
      throw new Error('Missing parameter "callId"');
    }

    if (!config) {
      throw new Error('Missing parameter "config"');
    }

    if (!logger) {
      throw new Error('Missing parameter "logger"');
    }

    if (!serviceLocator) {
      throw new Error('Missing parameter "serviceLocator"');
    }

    this.callId = callId;
    this.config = config;
    this.logger = logger;
    this.serviceLocator = serviceLocator;
  }

  static create(callId, config, logger, serviceLocator) {
    return new CallContext(callId, config, logger, serviceLocator);
  }
}

module.exports = CallContext;
