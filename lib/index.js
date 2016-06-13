'use strict';

// const fs = require('fs');
// const path = require('path');
// const detector = require('./detector');
// const handlers = {};
// const types = require('./types');

module.exports.createCallContext = require('./call-context').create;
module.exports.createLogger = require('./logger-factory').create;
module.exports.createServiceLocator = require('./service-locator').create;

module.exports.number = require('./number-helper');

module.exports.express = {};
module.exports.express.createCallContextMiddleware = require('./express/call-context-middleware');
module.exports.express.errorMiddleware;
module.exports.express.morganMiddleware;

module.exports.promise = {};
module.exports.promise.any = require('./promise-any');
