'use strict';
/* global describe, it*/

const should = require('should');
const tools = require('../lib/index');

describe('.uuid', function () {
  describe('.isUuid', function () {
    it('return true for valid UUIDs', function (done) {
      should.equal(tools.uuid.isUuid('6423df02-340c-11e6-ac61-9e71128cae77'), true); //v1
      should.equal(tools.uuid.isUuid('a2a8c440-340c-11e6-bdf4-0800200c9a66'), true); //v1
      should.equal(tools.uuid.isUuid('50e65cab-5229-11e6-957b-4ea59851ecba'), true); //v1

      should.equal(tools.uuid.isUuid('47c7630c-a54f-4893-abd0-e5fe5ce9eaac'), true); //v4
      should.equal(tools.uuid.isUuid('234f0008-4f9f-4940-86a6-2f81b0b30861'), true); //v4
      should.equal(tools.uuid.isUuid('09877a0e-6141-46fe-a052-b675b8e92062'), true); //v4
      
      done();
    });

    it('return false for invalid UUIDs', function (done) {
      should.equal(tools.uuid.isUuid(), false);
      should.equal(tools.uuid.isUuid(undefined), false);
      should.equal(tools.uuid.isUuid(null), false);
      should.equal(tools.uuid.isUuid(false), false);
      should.equal(tools.uuid.isUuid(true), false);
      should.equal(tools.uuid.isUuid(0), false);
      should.equal(tools.uuid.isUuid(1), false);
      should.equal(tools.uuid.isUuid(-1), false);
      should.equal(tools.uuid.isUuid({}), false);
      should.equal(tools.uuid.isUuid('50e65cab-5229-4612-957b-4ea59851ecbaaaaaaaasdasdasdsa'), false);
      should.equal(tools.uuid.isUuid('50e65cab-5229-4612-957ba-ea59851ecba'), false);
      should.equal(tools.uuid.isUuid('50e65cab52294612957b4ea59851ecba'), false);

      done();
    });
  });
});
