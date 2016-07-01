'use strict';

class MapConverter {
  static mapToArray(map, keyPropertyName) {
    if (!map || !(map instanceof Object) || map instanceof Array) {
      throw new Error(`"map" must be a valid instance of Object. Value: "${map}", typeof: "${typeof (map)}"`);
    }
    if (!keyPropertyName || (typeof keyPropertyName !== 'string')) {
      throw new Error(
        '"keyPropertyName" must be a valid instance of String. ' +
        `Value: "${keyPropertyName}", typeof: "${typeof (keyPropertyName)}"`);
    }

    let array = [];

    for (let key in map) {
      let item = Object.assign({}, map[key]);
      item[keyPropertyName] = key;
      array.push(item);
    }

    return array;
  }

  static arrayToMap(array, keyPropertyName) {
    if (!array || !(array instanceof Array)) {
      throw new Error(`"array" must be a valid instance of Array. Value: "${array}", typeof: "${typeof (array)}"`);
    }

    if (!keyPropertyName || (typeof keyPropertyName !== 'string')) {
      throw new Error(
        `"keyPropertyName" must be a valid instance of String. 
Value: "${keyPropertyName}", typeof: "${typeof (keyPropertyName)}"`);
    }

    let map = {};

    for (let item of array) {
      if (item[keyPropertyName] == undefined) {
        throw new Error(
          `There is at least one item without key "${keyPropertyName}" on array. Item: "${item}"`);
      }
      let value = Object.assign({}, item);
      map[value[keyPropertyName]] = value;
      delete value[keyPropertyName];
    }

    return map;
  }
}

module.exports = MapConverter;