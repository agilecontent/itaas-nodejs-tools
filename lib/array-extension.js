'use strict';

const _ = require('lodash');

module.exports = () => {
  Array.prototype.containsByProperty = function (propName, propValue) {
    let findIndex = _.findIndex(this, (item) => itemHasProperty(item, propName, propValue));
    return findIndex > -1;
  };

  Array.prototype.getByProperty = function (propName, propValue) {
    return this.getAllByProperty(propName, propValue)[0];
  };

  Array.prototype.getAllByProperty = function (propName, propValue) {
    return _.filter(this, (item) => itemHasProperty(item, propName, propValue));
  };

  Array.prototype.removeByProperty = function (propName, propValue) {
    _.remove(this, (item) => itemHasProperty(item, propName, propValue));
  };

  Array.prototype.changeByProperty = function (propName, propValue, newValue) {
    for (let i = 0; i < this.length; i++) {
      if (itemHasProperty(this[i], propName, propValue))
        this[i][propName] = newValue;
    }
  };
};

function itemHasProperty(item, propName, propValue) {
  return item && item[propName] && item[propName] == propValue;
}