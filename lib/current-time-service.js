'use strict';

class TimeService {
  getNow() {
    return new Date();
  }
  static create() {
    return new TimeService();
  }
}

module.exports = TimeService;
