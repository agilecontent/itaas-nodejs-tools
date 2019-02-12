'use strict';

const bunyan = require('bunyan');
const path = require('path');
const mkdirp = require('mkdirp');

class LoggerFactory {
  constructor(opt) {
    let fixedOpt = LoggerFactory.fillMissingOptions(opt);
    LoggerFactory.validateOptions(fixedOpt);

    this.opt = fixedOpt;
  }

  static create(opt) {
    return new LoggerFactory(opt).createLogger();
  }

  static fillMissingOptions(opt) {
    let fixedOpt = opt || {};

    fixedOpt.name = fixedOpt.name || 'app log name';
    fixedOpt.logLevels = fixedOpt.logLevels || ['fatal', 'error', 'warn', 'info'];
    fixedOpt.logOutput = fixedOpt.logOutput || 'standard-streams';
    fixedOpt.logDirectory = fixedOpt.logDirectory || './logs';

    return fixedOpt;
  }

  static validateOptions(opt) {
    const allLevels = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'];
    const notSupportedList = opt.logLevels.filter(x => allLevels.indexOf(x) === -1);

    if (notSupportedList.length > 0) {
      throw new Error(`Not supported log levels: ${notSupportedList}`);
    }
  }

  createLogger() {
    let streamList = this.createStreams();
    let serializers = this.createSerializers();

    let logger = bunyan.createLogger({
      name: this.opt.name,
      streams: streamList,
      serializers: serializers,
      component: this.opt.name
    });

    return logger;
  }

  createStreams() {
    switch (this.opt.logOutput) {
      case 'rotating-file':
        return this.createRotatingFileStreams();
      case 'standard-streams':
        return this.createStandandStreams();
      default:
        throw new Error(`Log output type "${this.opt.logOutput}" is not supported`);
    }
  }

  createRotatingFileStreams() {
    mkdirp.sync(this.opt.logDirectory);

    let streamList = new Array();

    for (let level of this.opt.logLevels) {
      streamList.push({
        level: level,
        type: 'rotating-file',
        path: path.join(this.opt.logDirectory, `${level}.log`),
        period: '1d',
        count: 10
      });
    }

    return streamList;
  }

  createStandandStreams() {
    let stderrLevels = ['fatal', 'error', 'warn'];
    let streamList = new Array();

    for (let level of this.opt.logLevels) {
      streamList.push({
        level: level,
        type: 'stream',
        stream: stderrLevels.indexOf(level) > -1 ? process.stderr : process.stdout
      });
    }

    return streamList;
  }

  createSerializers() {
    let serializers = {
      err: bunyan.stdSerializers.err // serializer to display error message, type and stack
    };

    return serializers;
  }
}

module.exports = LoggerFactory;
