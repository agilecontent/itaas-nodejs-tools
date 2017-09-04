'use strict';
/* global describe, it*/

const should = require('should'); // eslint-disable-line no-unused-vars

const tools = require('../../lib/index');

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

    let invalidTests = [{ input: invalidHttpStatusValues, expected: Error }];

    for (let test of validTests) {
      it(`returns ${test.expected} for ${test.expected}xx args`, function () {
        for (let input of test.input) {
          tools.httpStatus.getClass(input).should.be.equal(test.expected);
        }
      });
    }

    for (let test of invalidTests) {
      it('throw Error for invalid status', function () {
        for (let input of test.input) {
          tools.httpStatus.getClass.bind(null, input).should.throw(test.expected);
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
    not4xxValues = not4xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 500 + d; })); // 500..599

    let testCases = [
      { input: all4xxValues, expected: true },
      { input: not4xxValues, expected: false }
    ];

    let invalidTestCases = [{ input: invalidHttpStatusValues, expected: Error }];

    for (let test of testCases) {
      it(`returns ${test.expected} for ${test.expected ? '4xx' : 'not 4xx'} args`, function () {
        for (let input of test.input) {
          tools.httpStatus.isClientError(input).should.be.equal(test.expected);
        }
      });
    }

    for (let test of invalidTestCases) {
      it('throw Error for invalid status', function () {
        for (let input of test.input) {
          tools.httpStatus.isClientError.bind(null, input).should.throw(test.expected);
        }
      });
    }
  });

  describe('isServerError', function () {
    let all5xxValues = Array.from(Array(100).keys()).map((d) => { return 500 + d; }); // 500..599
    let not5xxValues = [];
    not5xxValues = not5xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 100 + d; })); // 100..199
    not5xxValues = not5xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 200 + d; })); // 200..299
    not5xxValues = not5xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 300 + d; })); // 300..399
    not5xxValues = not5xxValues.concat(Array.from(Array(100).keys()).map((d) => { return 400 + d; })); // 400..499

    let testCases = [
      { input: all5xxValues, expected: true },
      { input: not5xxValues, expected: false }
    ];

    let invalidTestCases = [{ input: invalidHttpStatusValues, expected: Error }];

    for (let test of testCases) {
      it(`returns ${test.expected} for ${test.expected ? '5xx' : 'not 5xx'} args`, function () {
        for (let input of test.input) {
          tools.httpStatus.isServerError(input).should.be.equal(test.expected);
        }
      });
    }

    for (let test of invalidTestCases) {
      it('throw Error for invalid status', function () {
        for (let input of test.input) {
          tools.httpStatus.isServerError.bind(null, input).should.throw(test.expected);
        }
      });
    }
  });

  describe('isHttpError', function () {
    let allErrorValues = [];
    allErrorValues = allErrorValues.concat(Array.from(Array(100).keys()).map((d) => { return 400 + d; })); // 400..499
    allErrorValues = allErrorValues.concat(Array.from(Array(100).keys()).map((d) => { return 500 + d; })); // 500..599
    let notErrorValues = [];
    notErrorValues = notErrorValues.concat(Array.from(Array(100).keys()).map((d) => { return 100 + d; })); // 100..199
    notErrorValues = notErrorValues.concat(Array.from(Array(100).keys()).map((d) => { return 200 + d; })); // 200..299
    notErrorValues = notErrorValues.concat(Array.from(Array(100).keys()).map((d) => { return 300 + d; })); // 300..399

    let testCases = [
      { input: allErrorValues, expected: true },
      { input: notErrorValues, expected: false }
    ];

    let invalidTestCases = [{ input: invalidHttpStatusValues, expected: Error }];

    for (let test of testCases) {
      it(`returns ${test.expected} for ${test.expected ? 'error' : 'not error'} args`, function () {
        for (let input of test.input) {
          tools.httpStatus.isHttpError(input).should.be.equal(test.expected);
        }
      });
    }

    for (let test of invalidTestCases) {
      it('throw Error for invalid status', function () {
        for (let input of test.input) {
          tools.httpStatus.isHttpError.bind(null, input).should.throw(test.expected);
        }
      });
    }
  });
  
  describe('isHttpStatus', function () {
    let validHttpStatus = [
      100, 101, 149, 150, 151, 199,
      200, 201, 249, 250, 251, 299,
      300, 301, 349, 350, 351, 399,
      400, 401, 449, 450, 451, 499,
      500, 501, 549, 550, 551, 599
    ];

    let notHttpStatus = [invalidHttpStatusValues];

    let testCases = [
      { input: validHttpStatus, expected: true },
      { input: notHttpStatus, expected: false }
    ];

    for (let test of testCases) {
      it(`returns ${test.expected} for ${test.expected ? 'valid httpStatus' : 'not valid httpStatus'} args`, 
      function () {
        for (let input of test.input) {
          tools.httpStatus.isHttpStatus(input).should.be.equal(test.expected);
        }
      });
    }
  });
});
