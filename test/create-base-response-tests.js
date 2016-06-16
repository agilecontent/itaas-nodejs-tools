'use strict';
/* global describe, it*/

const should = require('should');
const tools = require('../lib/index');

describe('.createBaseResponse', function () {
  it('build an instance', function (done) {
    let response = tools.createBaseResponse('OK', 'The request is OK', { a: 1, b: 2 });

    should.equal(response.status, 'OK');
    should.equal(response.message, 'The request is OK');
    should.deepEqual(response.result, { a: 1, b: 2 });
    should.not.exist(response.error);

    done();
  });
  it('fail for empty status', function (done) {
    should.throws(function () {
      tools.createBaseResponse(null, 'The request is OK', { a: 1, b: 2 });
    });
    should.throws(function () {
      tools.createBaseResponse(undefined, 'The request is OK', { a: 1, b: 2 });
    });

    done();
  });
});
