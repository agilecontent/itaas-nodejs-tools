'use strict';

const tools = require('itaas-nodejs-tools');

class HttpStatusHelper {
  static isClientError(status) {
    let errorClass = HttpStatusHelper.getClass(status);

    return errorClass === 4;
  }

  static getClass(status) {
    if (!tools.number.isInt32(status)) {
      throw new Error(`Status should be an integer, got: ${status}`);
    }
    
    let statusInt = tools.number.parseInt32(status);
    
    if (statusInt < 100 || statusInt > 599) {
      throw new Error(`Status should be between 100 and 599, got: ${status}`);
    }

    return Math.floor(statusInt / 100);
  }
}

module.exports = HttpStatusHelper;