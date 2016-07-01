'use strict';

const moment = require('moment');
const defaultValidFormats = [moment.ISO_8601];
// Default Format is ISO_8601

class DateHelper {
  static parseDate(dateAsString, formats) {
    let validFormats = formats || defaultValidFormats;

    if (!dateAsString || !this.isDate(dateAsString)) {
      throw new Error(`Invalid date. Date '${dateAsString}' is invalid to specified format.`);
    }

    return moment(dateAsString, validFormats, true).toDate();
  }

  static isDate(dateAsString, formats) {
    let validFormats = formats || defaultValidFormats;
    return moment(dateAsString, validFormats, true).isValid();
  }
}

module.exports = DateHelper;
