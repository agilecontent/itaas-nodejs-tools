'use strict';

class ServiceLocator {
  constructor() {
    this.services = {};
  }

  getService(type) {
    return this.services[type];
  }

  addService(type, concreteType) {
    this.services[type] = concreteType;
  }
}

module.exports = ServiceLocator;
