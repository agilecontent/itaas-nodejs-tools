'use strict';

//Basic tools
module.exports.createCallContext = require('./call-context').create;
module.exports.createLogger = require('./logger-factory').create;
module.exports.createServiceLocator = require('./service-locator').create;
module.exports.createFieldSelector = require('./field-selector').create;
module.exports.createBaseResponse = require('./base-response').create;
module.exports.createCurrentTimeService = require('./current-time-service').create;

//Helpers
module.exports.number = require('./number-helper');
module.exports.uuid = require('./uuid-helper');

//Express tools
module.exports.express = {};
module.exports.express.createCallContextMiddleware = require('./express/call-context-middleware');
module.exports.express.createMorganMiddleware = require('./express/morgan-middleware');
module.exports.express.createLowercaseQueryMiddleware = require('./express/lowercase-query-middleware');
module.exports.express.errorMiddleware;

//Promise
module.exports.promise = {};
module.exports.promise.any = require('./promise-any');

//Cassandra
module.exports.cassandra = {};
module.exports.cassandra.createFacade = require('./cassandra/cassandra-facade').createFacade;
module.exports.cassandra.createBatchQueryBuilder = require('./cassandra/batch-query-builder').create;
