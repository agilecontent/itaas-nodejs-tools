'use strict';

//Basic tools
module.exports.createCallContext = require('./call-context').create;
module.exports.createLogger = require('./logger-factory').create;
module.exports.createServiceLocator = require('./service-locator').create;
module.exports.createFieldSelector = require('./field-selector').create;
module.exports.createBaseResponse = require('./base-response').create;

//Express tools
module.exports.express = {};
module.exports.express.createCallContextMiddleware = require('./express/call-context-middleware');
module.exports.express.createMorganMiddleware = require('./express/morgan-middleware.js');
module.exports.express.createLowercaseQueryMiddleware = require('./express/lowercase-query-middleware.js');
module.exports.express.errorMiddleware;

//Helpers
module.exports.number = require('./number-helper');
module.exports.uuid = require('./uuid-helper');

//Promise
module.exports.promise = {};
module.exports.promise.any = require('./promise-any');
