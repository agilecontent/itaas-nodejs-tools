'use strict';
/* global describe, it*/

const should = require('should'); // eslint-disable-line no-unused-vars
const tools = require('../../lib/index');

describe('.createFixedTimeService', function () {
  it('returns fixed date', function (done) {
    let fixedDate = new Date('2016-06-27 04:54:32Z');
    let fixedTimeService = tools.createFixedTimeService(fixedDate);

    let getNow1 = fixedTimeService.getNow();
    getNow1.should.be.Date();
    getNow1.getTime().should.be.equal(fixedDate.getTime());

    let getNow2 = fixedTimeService.getNow();
    getNow2.should.be.Date();
    getNow2.getTime().should.be.equal(fixedDate.getTime());

    done();
  });
});
