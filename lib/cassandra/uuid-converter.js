'use strict';

const Uuid = require('cassandra-driver').types.Uuid;
const UuidHelper = require('../uuid-helper');

class UuidConverter {
  static uuidToString(uuid) {
    if (!uuid || !(uuid instanceof Uuid)) {
      throw new Error(`"uuid" must be a valid instance of Uuid. Value: "${uuid}", typeof: "${typeof (uuid)}"`);
    }

    return uuid.toString();
  }

  static stringToUuid(str) {
    if (!UuidHelper.isUuid(str)) {
      throw new Error(`"str" must be a a string in UUID format. Value: "${str}""`);
    }

    return Uuid.fromString(str);
  }
}

module.exports = UuidConverter;