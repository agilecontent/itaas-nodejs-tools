'use strict';

/**
 * This class should be used to return all responses.
 * Please does not change/add any attribute from it. 
 * This will allow the build from typed languages clients easier
 * the response always should be:
 * ************************************************************
 * {
 *   'status' : 'MNEMONIC_MESSAGE (Mandatory)',
 *   'message' : 'Descritive message from result',
 *   'result' : 'A OK result object or array',
 *   'error' : 'A error result object or array'
 * } 
 * ************************************************************
 */
class BaseResponse {
  constructor(status, message, result, error) {
    if (!status) {
      throw new Error('"status" must be filled on response');
    }
    this.status = status;

    if (!message) {
      message = '';
    }
    this.message = message;

    this.result = result;

    this.error = error;
  }

  static create(status, message, result, error) {
    return new BaseResponse(status, message, result, error);
  }
}

module.exports = BaseResponse;
