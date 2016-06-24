'use strict';
/* global describe, it*/

const should = require('should');
const tools = require('../../lib/index');

describe('.createBatchQueryBuilder', function () {
  it('create correct objects array', function (done) {
    let builder = tools.cassandra.createBatchQueryBuilder();

    let arrayResult = [
      {
        query: 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value3\');',
        params: { id: '3' }
      },
      {
        query: 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value4\');',
        params: { id: '4' }
      }
    ];

    builder.add(arrayResult[0].query, arrayResult[0].params);
    builder.add(arrayResult[1].query, arrayResult[1].params);

    let queriesResult = builder.getQueries();

    should.deepEqual(queriesResult, arrayResult);

    done();
  });
});