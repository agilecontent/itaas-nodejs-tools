'use strict';
/* global describe, it*/

const should = require('should');
const tools = require('../../lib/index');

describe('.cassandra', function () {
  describe('.createBatchQueryBuilder', function () {
    it('creates a cassandra batch query builder', function () {
      let builder = tools.cassandra.createBatchQueryBuilder();
      should.exist(builder);
      should.exist(builder.add);
      should.exist(builder.getQueries);
    });
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
