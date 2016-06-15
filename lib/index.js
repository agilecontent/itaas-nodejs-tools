'use strict';

//tools
module.exports.createCallContext = require('./call-context').create;
module.exports.createLogger = require('./logger-factory').create;
module.exports.createServiceLocator = require('./service-locator').create;
module.exports.createFieldSelector = require('./field-selector').create;
module.exports.number = require('./number-helper');


//tools.express
module.exports.express = {};
module.exports.express.createCallContextMiddleware = require('./express/call-context-middleware');
module.exports.express.createMorganMiddleware = require('./express/morgan-middleware.js');
module.exports.express.errorMiddleware;



//tools.promise
module.exports.promise = {};
module.exports.promise.any = require('./promise-any');
