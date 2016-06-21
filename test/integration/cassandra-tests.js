'use strict';
/* global describe, it, afterEach, beforeEach, before, after*/

const should = require('should');
const tools = require('../../lib/index');
const cassandraFacade = require('../../lib/cassandra/cassandra-facade');

const config = require('./config');

const uuid = require('uuid').v4;
const callId = uuid();

const logger = tools.createLogger({
  name: 'cassandra-tests.js',
  logLevels: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
  logOutput: 'rotating-file',
  logDirectory: './logs/test-log-dir'
});

const serviceLocator = tools.createServiceLocator();
const callContext = tools.createCallContext(callId, config, logger, serviceLocator);

describe('.cassandra', function () {
  describe('.createFacade', function () {
    before(function () {
      cassandraFacade.killClient();
      let cassandra = tools.cassandra.createFacade({
        contactPoints: [config.cassandraEndpoint]
      });

      let cql1 =
        'CREATE KEYSPACE test WITH REPLICATION = { \'class\' : \'SimpleStrategy\', \'replication_factor\' : 1 };';
      let cql2 =
        `CREATE TABLE test.testtable
        (
        testid TEXT,
        value TEXT,
        PRIMARY KEY (testid, value)
        );`;
      let cql3 =
        'INSERT INTO test.testtable (testid, value) VALUES (\'1\', \'my-value1\');';
      let cql4 =
        'INSERT INTO test.testtable (testid, value) VALUES (\'2\', \'my-value2\');';

      return cassandra.executeNonQuery(callContext, cql1)
        .then((result) => cassandra.executeNonQuery(callContext, cql2))
        .then((result) => cassandra.executeNonQuery(callContext, cql3))
        .then((result) => cassandra.executeNonQuery(callContext, cql4))
        .then((result) => {
          should(result).be.true();
          cassandraFacade.killClient();
        })
        .catch((err) => {
          cassandraFacade.killClient();
          throw err;
        });
    });
    after(function () {
      let cassandra = tools.cassandra.createFacade({
        contactPoints: [config.cassandraEndpoint]
      });

      let cql = 'drop KEYSPACE test;';

      return cassandra.executeNonQuery(callContext, cql)
        .then((result) => {
          cassandraFacade.killClient();
          should(result).be.true();
        });
    });
    describe('.executeNonQuery', function () {
      it('get values from a row', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value5\');';
        let param = { id: '5' };
        let cql2 = 'SELECT * FROM testtable where testid = :id;';

        return cassandra.executeNonQuery(callContext, cql, param)
          .then((result) => {
            return cassandra.executeQuery(callContext, cql2, { id: '5' });
          })
          .then((result) => {
            result[0].should.have.property('testid', '5');
            result[0].should.have.property('value', 'my-value5');
          });
      });
      it('fails for invalid queries', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = 'SELECT * FROM )testtable where testid = \'1\'';

        return cassandra.executeNonQuery(callContext, cql).should.be.rejected();
      });
    });
    describe('.executeQuery', function () {
      it('returns the values from a row', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = 'SELECT * FROM testtable where testid = :id;';
        let param = { id: '2' };

        return cassandra.executeQuery(callContext, cql, param)
          .then((result) => {
            result[0].should.have.property('testid', '2');
            result[0].should.have.property('value', 'my-value2');
          });
      });
      it('fails for invalid queries', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = 'SELECT * FROM )testtable where testid = \'1\'';

        return cassandra.executeQuery(callContext, cql).should.be.rejected();
      });
    });
    describe('.executeBatch', function () {
      it('execute two queries', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });
        let builder = tools.cassandra.createBatchQueryBuilder();

        builder.add(
          'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value3\');',
          { id: '3' }
        );
        builder.add(
          'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value4\');',
          { id: '4' }
        );

        let cql2 = 'SELECT * FROM testtable where testid = :id;';

        return cassandra.executeBatch(callContext, builder.getQueries())
          .then((result) => {
            return cassandra.executeQuery(callContext, cql2, { id: '3' });
          })
          .then((result) => {
            result[0].should.have.property('testid', '3');
            result[0].should.have.property('value', 'my-value3');
          })
          .then((result) => {
            return cassandra.executeQuery(callContext, cql2, { id: '4' });
          })
          .then((result) => {
            result[0].should.have.property('testid', '4');
            result[0].should.have.property('value', 'my-value4');
          });
      });
      it('fails for invalid queries', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = [
          {
            query: 'UPDATE testtable SET value = \'33\' WHERE id = 3;',
            params: { id: '3' }
          },
          {
            query: 'UPDATE testtable SET value = 44 WHERE id = 3;',
            params: { id: '4' }
          }
        ];

        return cassandra.executeBatch(callContext, cql).should.be.rejected();
      });
    });
    describe('.canConnect', function () {
      beforeEach(function () {
        cassandraFacade.killClient();
      });
      afterEach(function () {
        cassandraFacade.killClient();
      });
      it('returns false when cannot connect', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: ['www.google.com'],
          timeout: 500
        });

        return cassandra.canConnect(callContext)
          .then((result) => {
            should(result).be.false();
          });
      });
      it('returns true when can connect', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint]
        });

        return cassandra.canConnect(callContext)
          .then((result) => {
            should(result).be.true();
          });
      });
    });
    describe('.executeScalar', function () {
      it('returns the first row', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = 'SELECT * FROM testtable where testid = :id;';
        let param = { id: '1' };

        return cassandra.executeScalar(callContext, cql, param)
          .then((result) => {
            result.should.have.property('testid', '1');
            result.should.have.property('value', 'my-value1');
          });
      });
      it('fails for invalid queries', function () {
        let cassandra = tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = 'SELECT * FROM )testtable where testid = :id;';
        let param = { id: '1' };

        return cassandra.executeScalar(callContext, cql, param).should.be.rejected();
      });
    });
    it('uses the log function', function () {
      let logUsed = false;

      cassandraFacade.killClient();
      let cassandra = tools.cassandra.createFacade({
        contactPoints: [config.cassandraEndpoint],
        keyspace: 'test',
        log: (message) => {
          logUsed = true;
        }
      });

      let cql = 'SELECT * FROM testtable where testid = :id;';
      let param = { id: '1' };

      logUsed.should.be.false();
      return cassandra.executeScalar(callContext, cql, param)
        .then((result) => {
          logUsed.should.be.true();
        });
    });
    it('fail when log is not a function', function () {
      cassandraFacade.killClient();
      should.throws(() => {
        tools.cassandra.createFacade({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test',
          log: 'should fail'
        });
      });
      cassandraFacade.killClient();
    });
  });
  describe('.createBatchQueryBuilder', function () {
    it('creates a cassandra batch query builder', function () {
      let builder = tools.cassandra.createBatchQueryBuilder();
      should.exist(builder);
      should.exist(builder.add);
      should.exist(builder.getQueries);
    });
    describe('.add', function () {
      it('add new query with parameters', function () {
        let builder = tools.cassandra.createBatchQueryBuilder();

        builder.add('query1', { p1: 'param1' });
        builder.add('query2', [{ p2: 'param2' }]);

        builder.queries[0].should.deepEqual({ query: 'query1', params: { p1: 'param1' } });
        builder.queries[1].should.deepEqual({ query: 'query2', params: [{ p2: 'param2' }] });
      });
    });
    describe('.getQueries', function () {
      it('get queries after add them', function () {
        let builder = tools.cassandra.createBatchQueryBuilder();

        builder.add('query1', { p1: 'param1' });
        builder.add('query2', [{ p2: 'param2' }]);

        builder.getQueries()[0].should.deepEqual({ query: 'query1', params: { p1: 'param1' } });
        builder.getQueries()[1].should.deepEqual({ query: 'query2', params: [{ p2: 'param2' }] });
      });
    });
  });
});
