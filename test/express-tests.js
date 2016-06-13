'use strict';
/* global describe, it*/

const should = require('should');
const express = require('express');
const request = require('request');
const uuid = require('uuid').v4;

const tools = require('../lib/index');

let config = { key: 'value' };
let logger = tools.createLogger();
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
        () => app.locals.config,
        () => app.locals.logger,
        () => app.locals.serviceLocator,
        (req, res, next, context) => { res.locals.context = context; }));
      
      //Route
      let exposed = {};
      app.use('/', (req, res, next) =>{
        exposed.context = res.locals.context;
        res.send('OK');
      });
      
      let server = app.listen(3001);
      
      request('http://127.0.0.1:3001', function(error, response, body){
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
        () => app.locals.config,
        () => app.locals.logger,
        () => app.locals.serviceLocator,
        (req, res, next, context) => { res.locals.context = context; }));
      
      //Route
      let exposed = {};
      app.use('/', (req, res, next) =>{
        exposed.context = res.locals.context;
        res.send('OK');
      });
      
      let server = app.listen(3001);
      
      let callContextId = uuid();
      let option = {
        url:'http://127.0.0.1:3001',
        headers: {
          'uux-call-context-id': callContextId 
        } 
      };

      request(option, function(error, response, body){
        server.close();

        should.equal(exposed.context.callId, callContextId);
        
        done();
      });
    });
  });
});
