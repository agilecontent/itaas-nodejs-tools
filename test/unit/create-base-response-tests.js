'use strict';
/* global describe, it*/

const should = require('should');
const tools = require('../../lib/index');

describe('.createBaseResponse', function () {
  it('build an instance', function (done) {
    let response = tools.createBaseResponse('OK', 'The request is OK', { a: 1, b: 2 });

    should.equal(response.status, 'OK');
    should.equal(response.message, 'The request is OK');
    should.deepEqual(response.result, { a: 1, b: 2 });
    should.not.exist(response.error);

    let response2 = tools.createBaseResponse('OK', 'The request is OK', null, { a: 1, b: 2 });

    should.equal(response2.status, 'OK');
    should.equal(response2.message, 'The request is OK');
    should.deepEqual(response2.error, { a: 1, b: 2 });
    should.not.exist(response2.result);

    let response3 = tools.createBaseResponse('OK', 'The request is OK');
    should.equal(response3.message, 'The request is OK');

    done();
  });
  it('fail for empty status', function (done) {
    should.throws(() => {
      tools.createBaseResponse(null, 'The request is OK', { a: 1, b: 2 });
    });
    should.throws(() => {
      tools.createBaseResponse(undefined, 'The request is OK', { a: 1, b: 2 });
    });
    should.throws(() => {
      tools.createBaseResponse('OK');
    });

    done();
  });
});
