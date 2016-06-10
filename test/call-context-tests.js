'use strict';
/* global describe, it*/

let should = require('should');
let CallContext = require('../lib/call-context');
let uuid = require('uuid').v4;
let LoggerFactory = require('../lib/logger-factory');
let ServiceLocator = require('../lib/service-locator');

let callId = uuid();
let config = { key: 'value' };
let logger = new LoggerFactory();
let serviceLocator = new ServiceLocator();

describe('CallContext', function () {
  describe('#ctor', function () {
    it('should build an instance', function (done) {
      let context = new CallContext(callId, config, logger, serviceLocator);

      should.deepEqual(context.callId, callId);
      should.deepEqual(context.config, config);
      should.deepEqual(context.logger, logger);
      should.deepEqual(context.serviceLocator, serviceLocator);

      done();
    });
    it('should fail for empty parameters', function (done) {
      //null
      should.throws(function () {
        new CallContext(null, config, logger, serviceLocator);
      });
      should.throws(function () {
        new CallContext(callId, null, logger, serviceLocator);
      });
      should.throws(function () {
        new CallContext(callId, config, null, serviceLocator);
      });
      should.throws(function () {
        new CallContext(callId, config, logger, null);
      });
      
      //undefined
      should.throws(function () {
        new CallContext(undefined, config, logger, serviceLocator);
      });
      should.throws(function () {
        new CallContext(callId, undefined, logger, serviceLocator);
      });
      should.throws(function () {
        new CallContext(callId, config, undefined, serviceLocator);
      });
      should.throws(function () {
        new CallContext(callId, config, logger, undefined);
      });
      done();
    });
  });
  describe('#create', function () {
    it('should build an instance', function (done) {
      let context = CallContext.create(callId, config, logger, serviceLocator);

      should.deepEqual(context.callId, callId);
      should.deepEqual(context.config, config);
      should.deepEqual(context.logger, logger);
      should.deepEqual(context.serviceLocator, serviceLocator);

      done();
    });
  });
});
