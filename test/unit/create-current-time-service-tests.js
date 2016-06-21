'use strict';
/* global describe, it*/

const should = require('should');
const tools = require('../../lib/index');

describe('.createCurrentTimeService', function () {
  it('build an instance', function (done) {
    let currentTimeService = tools.createCurrentTimeService();

    should.exists(currentTimeService);

    done();
  });
  describe('.createCurrentTimeService', function () {
    it('build an instance', function (done) {
      let currentTimeService = tools.createCurrentTimeService();

      let date = currentTimeService.getNow();

      date.should.be.Date();
      (currentTimeService.getNow() - new Date()).should.below(50);

      done();
    });
  });
});
