'use strict';

const uuid = require('uuid').v4;
const CallContext = require('../call-context');

module.exports = function (getConfig, getLogger, getServiceLocator, setContext) {
  return function (req, res, next) {
    let callId = req.get('uux-call-context-id') || uuid();
    
    let config = getConfig();
    let logger = getLogger().child({ callId: callId });
    
    let serviceLocator = getServiceLocator();
    setContext(req, res, next, new CallContext(callId, config, logger, serviceLocator));
    
    next();
  };
};
