'use strict';
/* global describe, before, it, beforeEach*/

const nock = require('nock');
const should = require('should');
const CacheRemoteObject = require('../../lib/cache-remote-object');
const uuid = require('uuid').v4;
const tools = require('../../lib/index');

const objectServerUrl = 'http://remote.object';
const objectUrl = 'http://remote.object/remoteobject.json';
const notFoundObjectUrl = 'http://remote.object/notfound.json';
const invalidObjectUrl = 'http://object.invalid/invalid.json';
const objectRefreshTime = 2;

let callId = uuid();
let config = { key: 'value' };
let logger = tools.createLogger();
let serviceLocator = tools.createServiceLocator();
let context = tools.createCallContext(callId, config, logger, serviceLocator);

const remoteObjectValue = {
  result: {
    key1: 'value1',
    key2: 'value2',
    key3: 3,
    key4: true
  }
};

describe('Cache Remote Object', function () {
  describe('.create', function () {
    it('return an CacheRemoteObject object', () => {
      let remoteObject = CacheRemoteObject.create(objectUrl, objectRefreshTime);
      remoteObject.should.be.an.instanceOf(CacheRemoteObject);
    });
  });
  describe('.nextRefresh', function () {
    it('return correct time for next refresh', () => {
      let remoteObject = new CacheRemoteObject(objectUrl, objectRefreshTime);

      remoteObject.lastRefresh = new Date().getTime();
      should.equal(remoteObject.nextRefresh(context), remoteObject.lastRefresh + (1000 * objectRefreshTime));
    });
  });

  describe('.isCacheStale', function () {
    beforeEach(function () {
      nock(objectServerUrl)
        .get('/remoteobject.json')
        .reply(200, remoteObjectValue);
    });

    it('should return true on first call', () => {
      let remoteObject = new CacheRemoteObject(objectUrl, objectRefreshTime);

      should.equal(remoteObject.isCacheStale(context), true);
    });

    it('should return false if cache previously refreshed', (done) => {
      let remoteObject = new CacheRemoteObject(objectUrl, objectRefreshTime);

      remoteObject.getFresh(context)
        .then((result) => {
          should.deepEqual(result, remoteObjectValue);
          should.equal(remoteObject.isCacheStale(context), false);
          done();
        }).catch((err) => {
          done(err);
        });
    });

    it('should return true if cache previously outdated', async () => {
      let remoteObject = new CacheRemoteObject(objectUrl, objectRefreshTime);

      const result = await remoteObject.getFresh(context);       
      should.deepEqual(result, remoteObjectValue);
      await sleep(objectRefreshTime + 1);
      should.ok(remoteObject.isCacheStale(context));
    });
  });

  describe('.getCached', function () {
    before(function () {
      nock(objectServerUrl)
        .get('/remoteobject.json')
        .reply(200, remoteObjectValue);
    });

    it('First call should return null.', async () => {
      let remoteObject = new CacheRemoteObject(objectUrl, objectRefreshTime);

      let cached = remoteObject.getCached(context);
      should.equal(cached, null);
      await sleep(objectRefreshTime + 2);
    });
  });

  describe('.getFresh', function () {
    before(function () {
      nock(objectServerUrl)
        .get('/remoteobject.json')
        .times(1)
        .reply(200, remoteObjectValue);

      nock(objectServerUrl)
        .get('/notfound.json')
        .reply(404, 'Not Found');
    });

    it('should get error for empty url', function (done) {
      let remoteObject = new CacheRemoteObject(null, objectRefreshTime);

      remoteObject.getFresh(context)
        .then((result) => {
          done(new Error('Missing Remote Object URL.'));
        })
        .catch((err) => {
          should.equal(err.message, 'Missing Remote Object URL.');
          done();
        })
        .catch(done);
    });

    it('should get error for not found url', function (done) {
      let remoteObject = new CacheRemoteObject(notFoundObjectUrl, objectRefreshTime);

      remoteObject.getFresh(context)
        .then((result) => {
          done(new Error('Should not resolve when url not found.'));
        })
        .catch((err) => {
          should.equal(err.message, `Could not get a valid response from ${notFoundObjectUrl}.`);
          done();
        })
        .catch(done);
    });

    it('should get error for invalid url', function (done) {
      let remoteObject = new CacheRemoteObject(invalidObjectUrl, objectRefreshTime);

      remoteObject.getFresh(context)
        .then((result) => {
          done(new Error('Should not resolve when url is invalid.'));
        })
        .catch((err) => {
          should.equal(err, `Error calling url ${invalidObjectUrl}.`);
          done();
        })
        .catch(done);
    });

    it('should return object : cached and not cached.', function (done) {
      let remoteObject = new CacheRemoteObject(objectUrl, objectRefreshTime);

      remoteObject.getFresh(context)
        .then((result) => {
          should.deepEqual(result, remoteObjectValue);
          remoteObjectValue.result.key5 = 'newvalue';

          let cached = () => {
            return remoteObject.getCached(context);
          };

          let notCached = () => {
            nock.cleanAll();
            sleep((objectRefreshTime + 1));
            nock(objectServerUrl)
              .get('/remoteobject.json')
              .reply(200, remoteObjectValue);

            return remoteObject.getFresh(context);
          };

          return Promise.all([cached(), notCached()]);
        })
        .then((results) => {
          should.equal(remoteObjectValue.result.key5, 'newvalue');
          should.notDeepEqual(results[0], remoteObjectValue);
          should.deepEqual(results[1], remoteObjectValue);
          done();
        })
        .catch(done);
    });
  });
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 