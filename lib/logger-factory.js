'use strict';

const winston = require('winston');
const path = require('path');
const mkdirp = require('mkdirp');

const levels = { fatal: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 };

function itaasFormat(info, opts) {
  if (typeof (opts.labels) === 'object') {
    for (let label of Object.keys(opts.labels)) {
      info[label] = opts.labels[label];
    }
  }
  return info;
}

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
    const allLevels = Object.keys(levels);
    const notSupportedList = opt.logLevels.filter(x => allLevels.indexOf(x) === -1);

    if (notSupportedList.length > 0) {
      throw new Error(`Not supported log levels: ${notSupportedList}`);
    }
  }

  createLogger() {
    let transports = this.createTransports();

    let logger = winston.createLogger({
      name: this.opt.name,
      component: this.opt.name,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format(itaasFormat)({
          labels: {
            name: this.opt.name,
            component: this.opt.name,
          }
        }),
        winston.format.json()
      ),
      levels,
      transports
    });

    return logger;
  }

  createTransports() {
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

    return this.opt.logLevels.map(level => new winston.transports.File({
      level,
      filename: path.join(this.opt.logDirectory, `${level}.log`),
    }));
  }

  createStandandStreams() {
    let stderrLevels = ['fatal', 'error', 'warn'];
    return this.opt.logLevels.map(level =>
      new winston.transports.Console({ level, stderrLevels }));
  }
}

module.exports = LoggerFactory;
