'use strict';

module.exports.cassandraEndpoint = process.env.TEST_CASSANDRA_ENDPOINT || '127.0.0.1';
module.exports.cassandraPort = parseInt(process.env.TEST_CASSANDRA_PORT) || 9042;
