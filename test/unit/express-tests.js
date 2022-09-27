'use strict';
/* global describe, it, beforeEach*/

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

function logList(log) {
  return log.split('\n')
    .filter(line => line.length > 0)
    .map(line => JSON.parse(line));
}

function morganGetLog(app, done, fn, route = '/') {
  let server = app.listen(3001);

  request(`http://127.0.0.1:3001${route}`, function (error, response, body) {
    server.close();

    let infoLog = fs.readFileSync('./logs/test-log-dir/info.log', 'utf-8');
    let infoLogList = logList(infoLog);
    let requestLog = infoLogList.find((log) => log.http);

    fn(requestLog);

    done();
  });
}

function morganPostLog(app, done, fn, route = '/') {
  let server = app.listen(3001);

  request({
    headers: { 'Content-Type': 'application/json' },
    uri: `http://127.0.0.1:3001${route}`,
    method: 'POST',
    body: '{ "batatinha": "cool" }'
  }, function (error, response, body) {
    server.close();

    let infoLog = fs.readFileSync('./logs/test-log-dir/info.log', 'utf-8');
    let infoLogList = logList(infoLog);
    let requestLog = infoLogList.find((log) => log.http);

    fn(requestLog);

    done();
  });
}

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
    let app;
    beforeEach(() => {
      //Clean the files
      if (fs.existsSync('./logs/test-log-dir/info.log')) {
        fs.truncateSync('./logs/test-log-dir/info.log', 0);
      }

      app = express();

      app.locals.config = config;
      app.locals.logger = logger;
      app.locals.serviceLocator = serviceLocator;

      //Middlewares
      app.use(tools.express.createCallContextMiddleware(
        app.locals.config,
        app.locals.logger,
        app.locals.serviceLocator,
        (req, res, context) => { res.locals.context = context; }));
    });

    it('should log request with the request logger', function (done) {
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger, 'common'));

      app.use('/', (req, res, next) => {
        res.send('OK');
      });

      morganGetLog(app, done, requestLog => {
        requestLog.http.should.containEql('GET / HTTP/1.1');
        requestLog.http.should.containEql(' 200 ');
      });
    });

    it('should use accept format', function (done) {
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger, ':method :url :status :http-version'));

      app.use('/', (req, res, next) => {
        res.send('OK');
      });

      morganGetLog(app, done, requestLog => {
        should.equal(requestLog.http, 'GET / 200 1.1');
      });
    });

    it('should log request with the request logger', function (done) {
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger));

      app.use('/', (req, res, next) => {
        res.send('OK');
      });

      morganGetLog(app, done, requestLog => {
        requestLog.http.should.containEql('GET / HTTP/1.1');
        requestLog.http.should.containEql(' 200 ');
      });
    });

    it('should log request-id with the request logger', function (done) {
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger));

      app.use('/', (req, res, next) => {
        res.header('request-id', 'vish');
        res.send('OK');
      });

      morganGetLog(app, done, requestLog => {
        requestLog.traceparent.should.equal('vish');
      });
    });

    it('should log traceparent with the request logger', function (done) {
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger));

      app.use('/', (req, res, next) => {
        res.header('traceparent', 'vish');
        res.send('OK');
      });

      morganGetLog(app, done, requestLog => {
        requestLog.traceparent.should.equal('vish');
      });
    });

    it('should log route parameters', (done) => {
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger));

      app.use('/:vish', (req, res, next) => {
        res.send('OK');
      });

      let reoss = 'reoss';
      morganGetLog(app, done, requestLog => {
        should.equal(requestLog.route.vish, reoss);
      }, `/${reoss}`);
    });

    it('should log query parameters', (done) => {
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger));

      app.use('/', (req, res, next) => {
        res.send('OK');
      });

      let reoss = 'reoss';
      morganGetLog(app, done, requestLog => {
        should.equal(requestLog.query.vish, reoss);
      }, `/?vish=${reoss}`);
    });

    it('should log request response time', function (done) {
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger));

      app.use('/', (req, res, next) => {
        res.send('OK');
      });

      morganGetLog(app, done, requestLog => {
        requestLog.http.should.match(/- [0-9]+\.[0-9]+ ms$/);
      });
    });

    it('should log request body', (done) => {
      app.use(express.json());
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger));

      app.post('/', (req, res, next) => {
        res.send('OK');
      });

      let value = 'cool';
      morganPostLog(app, done, requestLog => {
        should.equal(requestLog.body.batatinha, value);
      });
    });

    it('should log request body customized', (done) => {

      let functionCustomFormatBody = (a) => { return "******"; };

      app.use(express.json());
      app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger, undefined, functionCustomFormatBody));

      app.post('/', (req, res, next) => {
        res.send('OK');
      });

      morganPostLog(app, done, requestLog => {
        should.equal(requestLog.body, functionCustomFormatBody());
      });
    });

    it('should fail if customFormatBody parameter isn`t a function', (done) => {
      should(function () {
        tools.express.createMorganMiddleware((req, res) => { }, undefined, "functionCustomFormatBodyIsString")
      }).throw('Missing argument "customFormatBody" function')
      done();
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
