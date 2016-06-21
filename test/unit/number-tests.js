'use strict';
/* global describe, it*/

const should = require('should');
const tools = require('../../lib/index');

describe('.number', function () {
  describe('.parseInt32', function () {
    it('parse valid 32 bit integers', function (done) {
      should.equal(tools.number.parseInt32('-2147483648'), -2147483648);
      should.equal(tools.number.parseInt32('-981726354'), -981726354);
      should.equal(tools.number.parseInt32('-2'), -2);
      should.equal(tools.number.parseInt32('-1'), -1);
      should.equal(tools.number.parseInt32('0'), 0);
      should.equal(tools.number.parseInt32('1'), 1);
      should.equal(tools.number.parseInt32('2'), 2);
      should.equal(tools.number.parseInt32('17283546'), 17283546);
      should.equal(tools.number.parseInt32('2147483647'), 2147483647);

      done();
    });
    it('throws for invalid 32 bit integers', function (done) {
      should.throws(() => { tools.number.parseInt32('a'); });
      should.throws(() => { tools.number.parseInt32('1a'); });
      should.throws(() => { tools.number.parseInt32('a1'); });
      should.throws(() => { tools.number.parseInt32('-1a'); });
      should.throws(() => { tools.number.parseInt32('-a1'); });
      should.throws(() => { tools.number.parseInt32('1.2'); });
      should.throws(() => { tools.number.parseInt32('1,2'); });
      should.throws(() => { tools.number.parseInt32('1.2a'); });
      should.throws(() => { tools.number.parseInt32('-1.2'); });
      should.throws(() => { tools.number.parseInt32('-1,2'); });
      should.throws(() => { tools.number.parseInt32('-1.2a'); });
      should.throws(() => { tools.number.parseInt32('-1.2a'); });
      should.throws(() => { tools.number.parseInt32('-2147483649'); });
      should.throws(() => { tools.number.parseInt32('-2147483650'); });
      should.throws(() => { tools.number.parseInt32('2147483648'); });
      should.throws(() => { tools.number.parseInt32('2147483649'); });

      done();
    });
  });
  describe('.isInt32', function () {
    it('return true for valid 32 bit integers', function (done) {
      should.equal(tools.number.isInt32('-2147483648'), true);
      should.equal(tools.number.isInt32('-981726354'), true);
      should.equal(tools.number.isInt32('-2'), true);
      should.equal(tools.number.isInt32('-1'), true);
      should.equal(tools.number.isInt32('0'), true);
      should.equal(tools.number.isInt32('1'), true);
      should.equal(tools.number.isInt32('2'), true);
      should.equal(tools.number.isInt32('17283546'), true);
      should.equal(tools.number.isInt32('2147483647'), true);
      
      done();
    });
    it('return false for invalid 32 bit integers', function (done) {
      should.equal(tools.number.isInt32('a'), false);
      should.equal(tools.number.isInt32('1a'), false);
      should.equal(tools.number.isInt32('a1'), false);
      should.equal(tools.number.isInt32('-1a'), false);
      should.equal(tools.number.isInt32('-a1'), false);
      should.equal(tools.number.isInt32('1.2'), false);
      should.equal(tools.number.isInt32('1,2'), false);
      should.equal(tools.number.isInt32('1.2a'), false);
      should.equal(tools.number.isInt32('-1.2'), false);
      should.equal(tools.number.isInt32('-1,2'), false);
      should.equal(tools.number.isInt32('-1.2a'), false);
      should.equal(tools.number.isInt32('-1.2a'), false);
      should.equal(tools.number.isInt32('-2147483649'), false);
      should.equal(tools.number.isInt32('-2147483650'), false);
      should.equal(tools.number.isInt32('2147483648'), false);
      should.equal(tools.number.isInt32('2147483649'), false);

      done();
    });
  });
});
