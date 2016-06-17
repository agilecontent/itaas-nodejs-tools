'use strict';

const MAX_INT_32 = 2147483647;
const MIN_INT_32 = -2147483648;

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
}

module.exports = NumberHelper;
