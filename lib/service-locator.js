'use strict';

class ServiceLocator {
  constructor() {
    this.services = {};
  }

  addService(type, concreteType) {
    this.services[type] = concreteType;
  }

  getService(type) {
    return this.services[type];
  }

  static create() {
    return new ServiceLocator();
  }
}

module.exports = ServiceLocator;
