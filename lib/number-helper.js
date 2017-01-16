'use strict';

const MAX_INT_32 = 2147483647;
const MIN_INT_32 = -2147483648;

const MAX_FLOAT = 3.40282e38;
const MIN_FLOAT = -3.40282e38;

class NumberHelper {
  static parseInt32(text) {
    let number = Number(text);

    if (!NumberHelper.isInt32(text)) {
      throw new Error('Parse Int32 has failed.');
    }

    return number;
  }

  static isInt32(text) {
    let number = Number(text);

    return Number.isInteger(number) && number <= MAX_INT_32 && number >= MIN_INT_32;
  }

  static parseFloat(text) {
    let number = Number(text);

    if (!NumberHelper.isFloat(text)) {
      throw new Error('Parse Float has failed.');
    }

    return number;
  }

  static isFloat(text) {
    let number = Number(text);

    return number <= MAX_FLOAT && number >= MIN_FLOAT;
  }
}

module.exports = NumberHelper;
