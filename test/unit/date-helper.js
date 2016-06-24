'use strict';
/* global describe,it */

const tools = require('../../lib/index');
const should = require('should'); // eslint-disable-line no-unused-vars
const moment = require('moment');

describe('.tools.date', function () {

  describe('.isDate', function () {
    it('should validate correctly', function () {
      tools.date.isDate('2016-06-24 23:56').should.be.equal(true);
      tools.date.isDate('2016-06-24 23:56Z').should.be.equal(true);
      tools.date.isDate('2016-06-24 23:56+1000').should.be.equal(true);
      tools.date.isDate('2016-06-24 23:56:10Z').should.be.equal(true);
      tools.date.isDate('2016-06-24 23:56:10+1000').should.be.equal(true);
      tools.date.isDate('2016-06-24T23:56').should.be.equal(true);
      tools.date.isDate('2016-06-24T23:56Z').should.be.equal(true);
      tools.date.isDate('2016-06-24T23:56+1000').should.be.equal(true);
      tools.date.isDate('2016-06-24T23:56:10').should.be.equal(true);
      tools.date.isDate('2016-06-24T23:56:10Z').should.be.equal(true);
      tools.date.isDate('2016-06-24T23:56:10+1000').should.be.equal(true);
      tools.date.isDate('2016-06-24').should.be.equal(true);
    });

    it('should not validate', function () {
      tools.date.isDate(undefined).should.be.equal(false);
      tools.date.isDate(null).should.be.equal(false);
      tools.date.isDate(123).should.be.equal(false);
      tools.date.isDate('123').should.be.equal(false);
      tools.date.isDate('2016-24-06').should.be.equal(false);
      tools.date.isDate('24-06-2016').should.be.equal(false);
      tools.date.isDate('06-24-2016').should.be.equal(false);
    });
  });

  describe('.parseDate', function () {
    it('should not convert undefined value', function () {
      (() => tools.date.parseDate(undefined)).should.throw();
      (() => tools.date.parseDate(null)).should.throw();
      (() => tools.date.parseDate(123)).should.throw();
      (() => tools.date.parseDate('123')).should.throw();
    });

    it('should convert correctly', function () {
      let date;
      let dateAsTimestamp;

      date = '2016-06-24 23:56';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24 23:56Z';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24 23:56+1000';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24 23:56:10Z';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24 23:56:10+1000';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24T23:56';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24T23:56Z';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24T23:56+1000';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24T23:56:10';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24T23:56:10Z';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24T23:56:10+1000';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

      date = '2016-06-24';
      dateAsTimestamp = moment(date, moment.ISO_8601).toDate().getTime();
      tools.date.parseDate(date).getTime().should.be.equal(dateAsTimestamp);

    });
  });
});