'use strict';
/* global describe, it*/

const should = require('should');
const uuid = require('uuid').v4;
const tools = require('../lib/index');

let callId = uuid();
let config = { key: 'value' };
let logger = tools.createLogger();
let serviceLocator = tools.createServiceLocator();

describe('.createCallContext', function () {
  it('should build an instance', function (done) {
    let context = tools.createCallContext(callId, config, logger, serviceLocator);

    should.deepEqual(context.callId, callId);
    should.deepEqual(context.config, config);
    should.deepEqual(context.logger, logger);
    should.deepEqual(context.serviceLocator, serviceLocator);

    done();
  });
  it('should fail for empty parameters', function (done) {
    //null
    should.throws(function () {
      tools.createCallContext(null, config, logger, serviceLocator);
    });
    should.throws(function () {
      tools.createCallContext(callId, null, logger, serviceLocator);
    });
    should.throws(function () {
      tools.createCallContext(callId, config, null, serviceLocator);
    });
    should.throws(function () {
      tools.createCallContext(callId, config, logger, null);
    });
    
    //undefined
    should.throws(function () {
      tools.createCallContext(undefined, config, logger, serviceLocator);
    });
    should.throws(function () {
      tools.createCallContext(callId, undefined, logger, serviceLocator);
    });
    should.throws(function () {
      tools.createCallContext(callId, config, undefined, serviceLocator);
    });
    should.throws(function () {
      tools.createCallContext(callId, config, logger, undefined);
    });
    done();
  });
});
