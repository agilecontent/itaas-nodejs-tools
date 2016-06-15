'use strict';

class FieldSelector {
  constructor(fieldDescription) {
    if (!fieldDescription) {
      throw new Error('Parameter \'fieldDescription\' is required');
    }
    if (!(fieldDescription instanceof String) &&
      typeof fieldDescription !== 'string') {
      throw new Error('Parameter \'fieldDescription\' must be a string');
    }

    // http://tinyurl.com/jb3k3k9
    const regex = /^([a-zA-Z]+(\.[a-zA-Z]+)*)(,([a-zA-Z]+(\.[a-zA-Z]+)*))*$/;

    if (!regex.test(fieldDescription)) {
      throw new Error('Invalid field description format');
    }

    let fields = fieldDescription.split(',');

    for (let field of fields) {
      let path = field.split('.');
      let scope = this;
      for (let property of path) {
        if (!scope[property]) {
          scope[property] = {};
        }
        scope = scope[property];
      }
    }
  }

  select(source) {
    if (!source) {
      throw new Error('Parameter "source" is required');
    }
    if (!(source instanceof Object)) {
      throw new Error('Parameter "source" must be an Object');
    }
    return selectProperties(source, this);
  }

  static create(fieldDescription) {
    return new FieldSelector(fieldDescription);
  }
}

function findProperty(instance, property) {
  let properties = Object.keys(instance);
  let equalProperties = properties.filter(
    p => p.toLowerCase() === property.toLowerCase());

  return (equalProperties.length == 0)
    ? null
    : equalProperties[0];
}

function selectProperties(source, selector) {
  if (source instanceof Array) {
    let selection = [];
    for (let item of source) {
      selection.push(selectProperties(item, selector));
    }
    return selection;
  }
  if (source instanceof Object) {
    // return full object if no subproperties were requested
    if (Object.keys(selector) == 0) {
      return source;
    }
    let selection = {};
    for (let propertyToSelect in selector) {
      let property = findProperty(source, propertyToSelect);
      if (property) {
        selection[property] = selectProperties(source[property], selector[propertyToSelect]);
      }
    }
    return selection;
  }
  // if source is Boolean, Number or String
  return source;
}

module.exports = FieldSelector;
