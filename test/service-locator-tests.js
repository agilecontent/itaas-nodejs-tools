'use strict';
/* global describe, it*/

let should = require('should');
let ServiceLocator = require('../lib/service-locator');


describe('ServiceLocator', function () {
  describe('#ctor', function () {
    it('should build an instance', function (done) {
      let serviceLocator = new ServiceLocator();

      should.deepEqual(serviceLocator.services, {});

      done();
    });
  });
  describe('#getService', function () {
    it('should get an added service', function (done) {
      let serviceLocator = new ServiceLocator();

      serviceLocator.addService('my-service-type', 'my-service');
      serviceLocator.addService(ServiceLocator, serviceLocator);

      should.deepEqual(serviceLocator.getService('my-service-type'), 'my-service');
      should.deepEqual(serviceLocator.getService(ServiceLocator), serviceLocator);

      done();
    });
    it('should do not get a not added service', function (done) {
      let serviceLocator = new ServiceLocator();

      should.not.exists(serviceLocator.getService('my-service-type'));
      should.not.exists(serviceLocator.getService(ServiceLocator));

      done();
    });
  });
  describe('#create', function () {
    it('should build an instance', function (done) {
      let serviceLocator = ServiceLocator.create();

      should.deepEqual(serviceLocator.services, {});

      done();
    });
  });
});
