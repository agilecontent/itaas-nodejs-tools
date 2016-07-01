'use strict';

class CurrentTimeService {
  getNow() {
    return new Date();
  }
  
  static create() {
    return new CurrentTimeService();
  }
}

module.exports = CurrentTimeService;
