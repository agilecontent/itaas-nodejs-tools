'use strict';
/* global describe, before, it*/

const nock = require('nock');
const should = require('should');
const RemoteConfig = require('../../lib/remote-config');
const uuid = require('uuid').v4;
const tools = require('../../lib/index');
const sleep = require('sleep');

let callId = uuid();
let config = { key: 'value' };
let logger = tools.createLogger();
let serviceLocator = tools.createServiceLocator();
let context = tools.createCallContext(callId, config, logger, serviceLocator);

const configServerUrl = 'http://remote.config';
const configUrl = 'http://remote.config/remoteconfig.json';
const notFoundConfigUrl = 'http://remote.config/notfound.json';
const invalidConfigUrl = 'http://config.invalid/invalid.json';
const configRefreshTime = 2;

const configObject = {
  result : {
    key1 : 'value1',
    key2 : 'value2',
    key3 : 3,
    key4 : true
  }
};

describe('Remote Config', function () {
  describe('.getConfigObject', function () {

    before(function() {
      nock(configServerUrl)
        .get('/remoteconfig.json')
        .delay(200)
        .reply(200, configObject);

      nock(configServerUrl)
        .get('/notfound.json')
        .delay(200)
        .reply(404, 'Not Found');        
    });

    it('should return config object', function (done) {
      this.timeout(10000);
      let remoteConfig = new RemoteConfig(configUrl, configRefreshTime);

      remoteConfig.getConfigObject(context)
      .then((result)=> {
        should.deepEqual(result, configObject);
        configObject.result.key5 = 'newvalue';

        let chached = () => { 
          return remoteConfig.getConfigObject(context); 
        };  

        let notChached = () => { 
          sleep.sleep((configRefreshTime + 1));

          nock(configServerUrl)
           .get('/remoteconfig.json')
           .delay(200)
           .reply(200, configObject);

          return remoteConfig.getConfigObject(context); 
        };  
        
        return Promise.all([chached(), notChached()]);
      })
      .then((results)=>{
        should.equal(configObject.result.key5,'newvalue');
        should.notDeepEqual(results[0], configObject);
        should.deepEqual(results[1], configObject);
        done();          
      })
      .catch(done);
    });

    it('should get error for not found url', function (done) {
      let remoteConfig = new RemoteConfig(notFoundConfigUrl, configRefreshTime);

      remoteConfig.getConfigObject(context)
      .then((result)=>{
        done(new Error('Should not resolve when url not found.')); 
      })
      .catch((err)=>{
        should.equal(err.message, `Could not get a valid response from ${notFoundConfigUrl}.`);
        done();
      })
      .catch(done);
    });

    it('should get error for invalid url', function (done) {
      let remoteConfig = new RemoteConfig(invalidConfigUrl, configRefreshTime);

      remoteConfig.getConfigObject(context)
      .then((result)=>{
        done(new Error('Should not resolve when url is invalid.')); 
      })
      .catch((err)=>{
        should.equal(err, `Error calling url ${invalidConfigUrl}.`);
        done();
      })
      .catch(done);
    });    
  });
});
