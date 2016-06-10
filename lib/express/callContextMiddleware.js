'use strict';

const uuid = require('uuid').v4;
const CallContext = require('../call-context');

class CallContextMiddlewareFactory {
  constructor(config, logger, serviceLocator) {
    this.config = config;
    this.logger = logger;
    this.serviceLocator = serviceLocator;
  }

  middleware(req, res, next) {
    let callId = req.get('uux-call-context-id') || uuid();
    res.locals.context = new CallContext(callId, this.config, this.logger, this.serviceLocator);
    next();
  }

  static createMiddleware() {
    return new CallContextMiddlewareFactory(arguments).middleware;
  }
}

module.exports = CallContextMiddlewareFactory;

// module.exports = function (getConfig, getLogger, getServiceLocator) {
//   return function (req, res, next) {
//     let callId = req.get('uux-call-context-id') || uuid();
//     res.locals.context = new CallContext(callId, getConfig(), getLogger(), getServiceLocator());
//     next();
//   };
// };


