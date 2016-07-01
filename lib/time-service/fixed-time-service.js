'use strict';

class FixedTimeService {
  constructor(fixedDate) {
    this.fixedDate = fixedDate;
  }

  getNow() {
    return this.fixedDate;
  }

  static create(fixedDate) {
    return new FixedTimeService(fixedDate);
  }
}

module.exports = FixedTimeService;