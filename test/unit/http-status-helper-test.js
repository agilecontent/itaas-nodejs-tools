'use strict';
/* global describe, it*/

const should = require('should'); // eslint-disable-line no-unused-vars

const HttpStatusHelper = require('../../../app/crosscutting/http-status-helper');

require('mocha');

describe('HttpStatusHelper', function () {
  let invalidHttpStatusValues = [
    -500, -400, -300, -200, -100, -2, -1, 0, 1, 2,
    50, 99, 600, 601, 602, 4004, 9999, 999999,
    Number.MAX_SAFE_INTEGER, Number.MAX_VALUE, Number.MIN_SAFE_INTEGER, Number.MIN_VALUE
  ];
  describe('getClass', function () {
    let validTests = [
      { input: [100, 101, 149, 150, 151, 199], expected: 1 },
      { input: [200, 201, 249, 250, 251, 299], expected: 2 },
      { input: [300, 301, 349, 350, 351, 399], expected: 3 },
      { input: [400, 401, 449, 450, 451, 499], expected: 4 },
      { input: [500, 501, 549, 550, 551, 599], expected: 5 }
    ];

    let invalidTests = [
      {
        input: invalidHttpStatusValues, expected: Error
      }
    ];

    for (let test of validTests) {
      it(`returns ${test.expected} for ${test.expected}xx args`, function () {
        for (let input of test.input) {
          HttpStatusHelper.getClass(input).should.be.equal(test.expected);
        }
      });
    }

    for (let test of invalidTests) {
      it('throw Error for invalid status', function () {
        for (let input of test.input) {
          HttpStatusHelper.getClass.bind(null, input).should.throw(test.expected);
        }
      });
    }
  });

  describe('isClientError', function () {
    let all4xxValues = Array.from(Array(100).keys()).map((d) => { return 400 + d; }); // 400..499
    let not4xxValues = [];
    not4xxValues = not4xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 100 + d; })); // 100..199
    not4xxValues = not4xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 200 + d; })); // 200..299
    not4xxValues = not4xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 300 + d; })); // 300..399
    not4xxValues = not4xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 500 + d; })); // 400..499

    let testCases = [
      { input: all4xxValues, expected: true },
      { input: not4xxValues, expected: false }
    ];

    let invalidTestCases = [{ input: invalidHttpStatusValues, expected: Error }];

    for (let test of testCases) {
      it(`returns ${test.expected} for ${test.expected ? '4xx' : 'not 4xx'} args`, function () {
        for (let input of test.input) {
          HttpStatusHelper.isClientError(input).should.be.equal(test.expected);
        }
      });
    }

    for (let test of invalidTestCases) {
      it('throw Error for invalid status', function () {
        for (let input of test.input) {
          HttpStatusHelper.getClass.bind(null, input).should.throw(test.expected);
        }
      });
    }

  });
});
