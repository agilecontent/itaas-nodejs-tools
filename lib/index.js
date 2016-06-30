'use strict';

//Basic tools
module.exports.createCallContext = require('./call-context').create;
module.exports.createLogger = require('./logger-factory').create;
module.exports.createServiceLocator = require('./service-locator').create;
module.exports.createFieldSelector = require('./field-selector').create;
module.exports.createBaseResponse = require('./base-response').create;
module.exports.createFixedTimeService = require('./time-service/fixed-time-service').create;
module.exports.createCurrentTimeService = require('./time-service/current-time-service').create;

//Helpers
module.exports.number = require('./number-helper');
module.exports.uuid = require('./uuid-helper');
module.exports.date = require('./date-helper');

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
module.exports.cassandra.cql = require('./cassandra/cassandra-cql-tools');
module.exports.cassandra.createBatchQueryBuilder = require('./cassandra/batch-query-builder').create;
module.exports.cassandra.converter = {};
module.exports.cassandra.converter.map = require('./cassandra/map-converter');
module.exports.cassandra.converter.uuid = require('./cassandra/uuid-converter');
