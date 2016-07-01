'use strict';
/* global describe, it*/

const should = require('should'); // eslint-disable-line no-unused-vars
const tools = require('../../lib/index');

describe('.createCurrentTimeService', function () {
  it('returns current date', function (done) {
    let currentTimeService = tools.createCurrentTimeService();

    let date = currentTimeService.getNow();

    date.should.be.Date();
    (currentTimeService.getNow() - new Date()).should.below(50);

    done();
  });
  it('returns date between before and after new Date()', function () {
    let timeService = tools.createCurrentTimeService();

    let beforeAsTimestamp = new Date().getTime();

    let now = timeService.getNow();
    now.should.be.Date();
    let nowAsTimestamp = now.getTime();

    let afterAsTimestamp = new Date().getTime();

    nowAsTimestamp.should.be.aboveOrEqual(beforeAsTimestamp).and.belowOrEqual(afterAsTimestamp);
  });
});
