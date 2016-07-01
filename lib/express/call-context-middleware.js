'use strict';

const uuid = require('uuid').v4;
const CallContext = require('../call-context');

module.exports = function (config, logger, serviceLocator, setContext) {
  return function (req, res, next) {
    let callId = req.get('uux-call-context-id') || uuid();
    let loggerChild = logger.child({ callId: callId });
    
    setContext(req, res, new CallContext(callId, config, loggerChild, serviceLocator));
    
    next();
  };
};
