'use strict';
/* global describe, it*/

let should = require('should');
let tools = require('../../lib/index');


describe('.createServiceLocator', function () {
  describe('.getService', function () {
    it('should get an added service', function (done) {
      let serviceLocator = tools.createServiceLocator();

      serviceLocator.addService('my-service-type', 'my-service');
      serviceLocator.addService(Number, serviceLocator);

      should.deepEqual(serviceLocator.getService('my-service-type'), 'my-service');
      should.deepEqual(serviceLocator.getService(Number), serviceLocator);

      done();
    });
    it('should do not get a not added service', function (done) {
      let serviceLocator = tools.createServiceLocator();

      should.not.exists(serviceLocator.getService('my-service-type'));
      should.not.exists(serviceLocator.getService(Number));

      done();
    });
  });
});
