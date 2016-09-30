'use strict';
/* global describe, it*/

const _ = require('lodash');
const fs = require('fs');
const should = require('should');
const express = require('express');
const request = require('request');
const uuid = require('uuid').v4;

const tools = require('../../lib/index');

let config = { key: 'value' };
let logger = tools.createLogger({
  name: 'app log name',
  logLevels: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
  logOutput: 'rotating-file',
  logDirectory: './logs/test-log-dir'
});

let serviceLocator = tools.createServiceLocator();

describe('.express', function () {
  describe('.createCallContextMiddleware', function () {
    it('should build the CallContext', function (done) {
      let app = express();

      app.locals.config = config;
      app.locals.logger = logger;
      app.locals.serviceLocator = serviceLocator;

      //Middleware
      app.use(tools.express.createCallContextMiddleware(
        app.locals.config,
        app.locals.logger,
        app.locals.serviceLocator,
        (req, res, context) => { res.locals.context = context; }));

      //Route
      let exposed = {};
      app.use('/', (req, res, next) => {
        exposed.context = res.locals.context;
        res.send('OK');
      });

      let server = app.listen(3001);

      request('http://127.0.0.1:3001', function (error, response, body) {
        server.close();

        should.not.exist(error);
        should.exist(exposed.context.callId);
        should.exist(exposed.context.logger);
        should.deepEqual(exposed.context.config, config);
        should.deepEqual(exposed.context.serviceLocator, serviceLocator);

        done();
      });
    });
    it('should use uux-call-context-id from HTTP header', function (done) {
      let app = express();

      app.locals.config = config;
      app.locals.logger = logger;
      app.locals.serviceLocator = serviceLocator;

      //Middleware
      app.use(tools.express.createCallContextMiddleware(
        app.locals.config,
        app.locals.logger,
        app.locals.serviceLocator,
        (req, res, context) => { res.locals.context = context; }));

      //Route
      let exposed = {};
      app.use('/', (req, res, next) => {
        exposed.context = res.locals.context;
        res.send('OK');
      });

      let server = app.listen(3001);

      let callContextId = uuid();
      let option = {
        url: 'http://127.0.0.1:3001',
        headers: {
          'uux-call-context-id': callContextId
        }
      };

      request(option, function (error, response, body) {
        server.close();

        should.equal(exposed.context.callId, callContextId);

        done();
      });
    });
  });
  describe('.createMorganMiddleware', function () {
    it('should log request with the request logger', function (done) {
      //Clean the files
      if (fs.existsSync('./logs/test-log-dir/info.log'))
        fs.truncateSync('./logs/test-log-dir/info.log', 0);

      let app = express();

      app.locals.config = config;
      app.locals.logger = logger;
      app.locals.serviceLocator = serviceLocator;

      //Middlewares
      app.use(tools.express.createCallContextMiddleware(
        app.locals.config,
        app.locals.logger,
        app.locals.serviceLocator,
        (req, res, context) => { res.locals.context = context; }));

      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger, 'common'));

      app.use('/', (req, res, next) => {
        res.send('OK');
      });

      let server = app.listen(3001);

      request('http://127.0.0.1:3001', function (error, response, body) {
        server.close();

        should.not.exist(error);
        should.equal(body, 'OK');

        let infoLog = fs.readFileSync('./logs/test-log-dir/info.log', 'utf-8');
        let infoLogList = _.map(_.trim(infoLog, '\n').split('\n'), JSON.parse);
        let requestLog = infoLogList.find((log) => log.httpLogRequest);

        should.exist(requestLog);
        should.exist(requestLog.httpLogRequest);

        requestLog.httpLogRequest.should.containEql('GET / HTTP/1.1');
        requestLog.httpLogRequest.should.containEql(' 200 ');

        done();
      });
    });
    it('should use accept format', function (done) {
      //Clean the files
      if (fs.existsSync('./logs/test-log-dir/info.log'))
        fs.truncateSync('./logs/test-log-dir/info.log', 0);

      let app = express();

      app.locals.config = config;
      app.locals.logger = logger;
      app.locals.serviceLocator = serviceLocator;

      //Middlewares
      app.use(tools.express.createCallContextMiddleware(
        app.locals.config,
        app.locals.logger,
        app.locals.serviceLocator,
        (req, res, context) => { res.locals.context = context; }));

      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger, ':method :url :status :http-version'));

      app.use('/', (req, res, next) => {
        res.send('OK');
      });

      let server = app.listen(3001);

      request('http://127.0.0.1:3001', function (error, response, body) {
        server.close();

        should.not.exist(error);
        should.equal(body, 'OK');

        let infoLog = fs.readFileSync('./logs/test-log-dir/info.log', 'utf-8');
        let infoLogList = _.map(_.trim(infoLog, '\n').split('\n'), JSON.parse);
        let requestLog = infoLogList.find((log) => log.httpLogRequest);

        should.exist(requestLog);
        should.exist(requestLog.httpLogRequest);

        should.equal(requestLog.httpLogRequest, 'GET / 200 1.1');

        done();
      });
    });
    it('should log request with the request logger', function (done) {
      //Clean the files
      if (fs.existsSync('./logs/test-log-dir/info.log'))
        fs.truncateSync('./logs/test-log-dir/info.log', 0);

      let app = express();

      app.locals.config = config;
      app.locals.logger = logger;
      app.locals.serviceLocator = serviceLocator;

      //Middlewares
      app.use(tools.express.createCallContextMiddleware(
        app.locals.config,
        app.locals.logger,
        app.locals.serviceLocator,
        (req, res, context) => { res.locals.context = context; }));

      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger));

      app.use('/', (req, res, next) => {
        res.send('OK');
      });

      let server = app.listen(3001);

      request('http://127.0.0.1:3001', function (error, response, body) {
        server.close();

        should.not.exist(error);
        should.equal(body, 'OK');

        let infoLog = fs.readFileSync('./logs/test-log-dir/info.log', 'utf-8');
        let infoLogList = _.map(_.trim(infoLog, '\n').split('\n'), JSON.parse);
        let requestLog = infoLogList.find((log) => log.httpLogRequest);

        should.exist(requestLog);
        should.exist(requestLog.httpLogRequest);

        requestLog.httpLogRequest.should.containEql('GET / HTTP/1.1');
        requestLog.httpLogRequest.should.containEql(' 200 ');

        done();
      });
    });
    it('fail for invalid arguments', function (done) {
      (function createLogger() {
        tools.express.createMorganMiddleware();
      }).should.throw();

      (function createLogger() {
        tools.express.createMorganMiddleware('commom');
      }).should.throw();

      done();
    });
  });
  describe('.createLowercaseQueryMiddleware', function () {
    it('should log request with the request logger', function (done) {
      let app = express();

      app.use(tools.express.createLowercaseQueryMiddleware());

      let exposed = {};
      app.use('/', (req, res, next) => {
        exposed.query = req.query;
        res.send('OK');
      });

      let server = app.listen(3001);

      request('http://127.0.0.1:3001?q1=Test1&Q2=Test2', (error, response, body) => {
        server.close();

        should.not.exist(error);
        should.equal(body, 'OK');

        exposed.query.should.keys('q1', 'q2');

        should.deepEqual(exposed.query.q1, 'Test1');
        should.deepEqual(exposed.query.q2, 'Test2');
        should.deepEqual(exposed.query.Q2, undefined);

        done();
      });
    });
  });

  describe('.createTrimQueryValueMiddleware', function () {
    it('should remove spaces from start and end of query parameters', function (done) {
      let app = express();

      app.use(tools.express.createTrimQueryValueMiddleware());

      let exposed = {};
      app.use('/', (req, res, next) => {
        exposed.query = req.query;
        res.send('OK');
      });

      let server = app.listen(3001);

      request('http://127.0.0.1:3001?q1=%20Test1%20&q2=Test2%20&q3=%20Test3', (error, response, body) => {
        server.close();

        should.not.exist(error);
        should.equal(body, 'OK');

        exposed.query.should.keys('q1', 'q2', 'q3');

        should.deepEqual(exposed.query.q1, 'Test1');
        should.deepEqual(exposed.query.q2, 'Test2');
        should.deepEqual(exposed.query.q3, 'Test3');

        done();
      });
    });
  });  
});
