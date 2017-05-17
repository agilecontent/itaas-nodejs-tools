'use strict';
/* global describe, it, before, after*/

const should = require('should');
const tools = require('../../lib/index');
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
const cassandra = tools.cassandra;

describe('.cassandra', function () {
  describe('.cql', function () {
    before(function () {
      let cassandraClient = new cassandra.client(
        {
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

      let queryRunner = tools.cassandra.cql;

      return queryRunner.executeNonQuery(callContext, cassandraClient, cql1)
        .then((result) => queryRunner.executeNonQuery(callContext, cassandraClient, cql2))
        .then((result) => queryRunner.executeNonQuery(callContext, cassandraClient, cql3))
        .then((result) => queryRunner.executeNonQuery(callContext, cassandraClient, cql4))
        .then((result) => {
          should(result).be.true();
        })
        .catch((err) => {

          throw err;
        });
    });
    after(function () {
      let cassandraClient = new cassandra.client(
        {
          contactPoints: [config.cassandraEndpoint]
        });

      let cql = 'drop KEYSPACE test;';

      let queryRunner = tools.cassandra.cql;

      return queryRunner.executeNonQuery(callContext, cassandraClient, cql)
        .then((result) => {
          should(result).be.true();
        });
    });

    describe('.executeNonQuery', function () {
      let cassandraClient;
      before(function () {
        cassandraClient = new cassandra.client({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });
      });
      it('insert values to a row', function () {
        let cql = 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value5\');';
        let param = { id: '5' };
        let cql2 = 'SELECT * FROM testtable where testid = :id;';

        let queryRunner = tools.cassandra.cql;
        return queryRunner.executeNonQuery(callContext, cassandraClient, cql, param)
          .then((result) => {
            return queryRunner.executeQuery(callContext, cassandraClient, cql2, { id: '5' });
          })
          .then((result) => {
            result[0].should.have.property('testid', '5');
            result[0].should.have.property('value', 'my-value5');
          });
      });
      it('insert values to a row - validate EXISTS clause (using applied)', function () {
        let cassandraClient = new cassandra.client({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value5\') IF NOT EXISTS;';
        let param = { id: '6' };

        let queryRunner = tools.cassandra.cql;
        return queryRunner.executeNonQuery(callContext, cassandraClient, cql, param)
          .then((result) => {
            result.should.be.equal(true);

            return queryRunner.executeNonQuery(callContext, cassandraClient, cql, param);
          })
          .then((result) => {
            result.should.be.equal(false);
          });
      });

      it('fails for invalid queries', function () {
        let cassandraClient = new cassandra.client({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });

        let cql = 'SELECT * FROM )testtable where testid = \'1\'';

        let queryRunner = tools.cassandra.cql;
        return queryRunner.executeNonQuery(callContext, cassandraClient, cql).should.be.rejected();
      });
    });

    describe('.executeQuery', function () {
      let cassandraClient;
      before(function () {
        cassandraClient = new cassandra.client({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });
      });
      it('returns the values from a row', function () {
        let cql = 'SELECT * FROM testtable where testid = :id;';
        let param = { id: '2' };

        let queryRunner = tools.cassandra.cql;
        return queryRunner.executeQuery(callContext, cassandraClient, cql, param)
          .then((result) => {
            result[0].should.have.property('testid', '2');
            result[0].should.have.property('value', 'my-value2');
          });
      });
      it('fails for invalid queries', function () {
        let cql = 'SELECT * FROM )testtable where testid = \'1\'';

        let queryRunner = tools.cassandra.cql;

        return queryRunner.executeQuery(callContext, cassandraClient, cql).should.be.rejected();
      });
    });

    describe('.executeBatch', function () {
      let cassandraClient;
      before(function () {
        cassandraClient = new cassandra.client({
          contactPoints: [config.cassandraEndpoint],
          keyspace: 'test'
        });
      });
      it('execute two queries', function () {
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

        let queryRunner = tools.cassandra.cql;

        return queryRunner.executeBatch(callContext, cassandraClient, builder.getQueries())
          .then((result) => {
            return queryRunner.executeQuery(callContext, cassandraClient, cql2, { id: '3' });
          })
          .then((result) => {
            result[0].should.have.property('testid', '3');
            result[0].should.have.property('value', 'my-value3');
          })
          .then((result) => {
            return queryRunner.executeQuery(callContext, cassandraClient, cql2, { id: '4' });
          })
          .then((result) => {
            result[0].should.have.property('testid', '4');
            result[0].should.have.property('value', 'my-value4');
          });
      });
      it('fails for invalid queries', function () {
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

        let queryRunner = tools.cassandra.cql;

        return queryRunner.executeBatch(callContext, cassandraClient, cql).should.be.rejected();
      });
    });

    describe('.canConnect', function () {
      it('returns false when cannot connect', function () {
        let cassandraClient = new cassandra.client({
          contactPoints: ['www.google.com'],
          socketOptions: {
            connectTimeout: 500
          }
        });

        let queryRunner = tools.cassandra.cql;

        return queryRunner.canConnect(callContext, cassandraClient)
          .then((result) => {
            should(result).be.false();
          });
      });
      it('returns true when can connect', function () {
        let cassandraClient = new cassandra.client({
          contactPoints: [config.cassandraEndpoint]
        });

        let queryRunner = tools.cassandra.cql;

        return queryRunner.canConnect(callContext, cassandraClient)
          .then((result) => {
            should(result).be.true();
          });
      });
    });
  });
});
