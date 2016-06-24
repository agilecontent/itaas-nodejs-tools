'use strict';
/* global describe, it*/

const should = require('should');
const tools = require('../../lib/index');
const Uuid = require('cassandra-driver').types.Uuid;

describe('.converter.map', function () {
  describe('.mapToArray', function () {
    it('create correct array', function (done) {
      let MapConverter = tools.cassandra.converter.map;

      let map = {
        myId1: { myKey11: 'MyValue11', myKey12: 'MyValue12' },
        myId2: { myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
      };

      let array = [
        { myId: 'myId1', myKey11: 'MyValue11', myKey12: 'MyValue12' },
        { myId: 'myId2', myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
      ];

      let mapToArrayResult = MapConverter.mapToArray(map, 'myId');
      should.deepEqual(mapToArrayResult, array);

      done();
    });

    it('throws error because bad map', function (done) {
      let MapConverter = tools.cassandra.converter.map;

      should.throws(() => {
        let myMap = undefined;
        MapConverter.mapToArray(myMap, 'myId');
      }, 'myMap=undefined should generate exception');

      should.throws(() => {
        let myMap = null;
        MapConverter.mapToArray(myMap, 'myId');
      }, 'myMap=null should generate exception');

      should.throws(() => {
        let myMap = [];
        MapConverter.mapToArray(myMap, 'myId');
      }, 'myMap=[] should generate exception');

      should.throws(() => {
        let myMap = 'a';
        MapConverter.mapToArray(myMap, 'myId');
      }, 'myMap=string should generate exception');

      should.throws(() => {
        let myMap = 9;
        MapConverter.mapToArray(myMap, 'myId');
      }, 'myMap=number should generate exception');

      should.throws(() => {
        let myMap = true;
        MapConverter.mapToArray(myMap, 'myId');
      }, 'myMap=boolean should generate exception');

      done();
    });

    it('throws error because bad id', function (done) {
      let MapConverter = tools.cassandra.converter.map;
      let myMap = {
        myId1:
        {
          myKey11: 'MyValue11',
          myKey12: 'MyValue12',
          myKey13: 'MyValue13'
        }
      };

      should.throws(() => {
        let myKey = undefined;
        MapConverter.mapToArray(myMap, myKey);
      }, 'myKey=undefined should generate exception');

      should.throws(() => {
        let myKey = null;
        MapConverter.mapToArray(myMap, myKey);
      }, 'myKey=null should generate exception');

      should.throws(() => {
        let myKey = [];
        MapConverter.mapToArray(myMap, myKey);
      }, 'myKey=[] should generate exception');

      should.throws(() => {
        let myKey = {};
        MapConverter.mapToArray(myMap, myKey);
      }, 'myKey={} should generate exception');

      should.throws(() => {
        let myKey = '';
        MapConverter.mapToArray(myMap, myKey);
      }, 'myKey=empty should generate exception');

      should.throws(() => {
        let myKey = 9;
        MapConverter.mapToArray(myMap, myKey);
      }, 'myKey=number should generate exception');

      should.throws(() => {
        let myKey = true;
        MapConverter.mapToArray(myMap, myKey);
      }, 'myKey=true should generate exception');

      done();
    });
  });

  describe('.arrayToMap', function () {
    it('create correct map', function (done) {
      let MapConverter = tools.cassandra.converter.map;

      let map = {
        myId1: { myKey11: 'MyValue11', myKey12: 'MyValue12' },
        myId2: { myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
      };

      let array = [
        { myId: 'myId1', myKey11: 'MyValue11', myKey12: 'MyValue12' },
        { myId: 'myId2', myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
      ];

      let arrayToMapResult = MapConverter.arrayToMap(array, 'myId');
      should.deepEqual(arrayToMapResult, map);

      done();
    });

    it('throws error because bad array', function (done) {
      let MapConverter = tools.cassandra.converter.map;

      should.throws(() => {
        let myArray = undefined;
        MapConverter.arrayToMap(myArray, 'myId');
      }, 'myMap=undefined should generate exception');

      should.throws(() => {
        let myArray = null;
        MapConverter.arrayToMap(myArray, 'myId');
      }, 'myArray=null should generate exception');

      should.throws(() => {
        let myArray = {};
        MapConverter.arrayToMap(myArray, 'myId');
      }, 'myArray={} should generate exception');

      should.throws(() => {
        let myArray = 'a';
        MapConverter.arrayToMap(myArray, 'myId');
      }, 'myArray=string should generate exception');

      should.throws(() => {
        let myArray = 9;
        MapConverter.arrayToMap(myArray, 'myId');
      }, 'myArray=number should generate exception');

      should.throws(() => {
        let myArray = true;
        MapConverter.arrayToMap(myArray, 'myId');
      }, 'myArray=boolean should generate exception');

      done();
    });

    it('throws error because bad id', function (done) {
      let MapConverter = tools.cassandra.converter.map;

      let array = [
        { myId: 'myId1', myKey11: 'MyValue11', myKey12: 'MyValue12' },
        { myId: 'myId2', myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
      ];

      should.throws(() => {
        let myKey = undefined;
        MapConverter.arrayToMap(array, myKey);
      }, 'myKey=undefined should generate exception');

      should.throws(() => {
        let myKey = null;
        MapConverter.arrayToMap(array, myKey);
      }, 'myKey=null should generate exception');

      should.throws(() => {
        let myKey = [];
        MapConverter.arrayToMap(array, myKey);
      }, 'myKey=[] should generate exception');

      should.throws(() => {
        let myKey = {};
        MapConverter.arrayToMap(array, myKey);
      }, 'myKey={} should generate exception');

      should.throws(() => {
        let myKey = '';
        MapConverter.arrayToMap(array, myKey);
      }, 'myKey=empty should generate exception');

      should.throws(() => {
        let myKey = 9;
        MapConverter.arrayToMap(array, myKey);
      }, 'myKey=number should generate exception');

      should.throws(() => {
        let myKey = true;
        MapConverter.arrayToMap(array, myKey);
      }, 'myKey=true should generate exception');

      done();
    });
  });
});

describe('.converter.uuid', function () {
  describe('.uuidToString', function () {
    it('create correct string', function (done) {
      let UuidConverter = tools.cassandra.converter.uuid;

      let uuidAsString = '47c7630c-a54f-4893-abd0-e5fe5ce9eaac';
      let uuidAsUuid = Uuid.fromString(uuidAsString);

      let uuidResult = UuidConverter.uuidToString(uuidAsUuid);
      uuidResult.should.be.equal(uuidAsString);

      done();
    });

    it('throws error because bad uuid', function (done) {
      let UuidConverter = tools.cassandra.converter.uuid;

      should.throws(() => {
        let uuid = '47c7630c-a54f-4893-abd0-e5fe5ce9eaac';
        UuidConverter.uuidToString(uuid);
      }, 'String');

      should.throws(() => {
        let uuid = '';
        UuidConverter.uuidToString(uuid);
      }, 'empty');

      should.throws(() => {
        let uuid = undefined;
        UuidConverter.uuidToString(uuid);
      }, 'undefined ');

      should.throws(() => {
        let uuid = null;
        UuidConverter.uuidToString(uuid);
      }, 'null ');

      should.throws(() => {
        let uuid = {};
        UuidConverter.uuidToString(uuid);
      }, 'Object');

      should.throws(() => {
        let uuid = [];
        UuidConverter.uuidToString(uuid);
      }, 'Array');

      should.throws(() => {
        let uuid = true;
        UuidConverter.uuidToString(uuid);
      }, 'Boolean');

      should.throws(() => {
        let uuid = 1;
        UuidConverter.uuidToString(uuid);
      }, 'Number');

      done();
    });
  });

  describe('.stringToUuid', function () {
    it('create correct uuid', function (done) {
      let UuidConverter = tools.cassandra.converter.uuid;

      let uuidAsString = '47c7630c-a54f-4893-abd0-e5fe5ce9eaac';
      let uuidAsUuid = Uuid.fromString(uuidAsString);

      let uuidResult = UuidConverter.stringToUuid(uuidAsString);
      (uuidResult == uuidAsUuid).should.be.true;

      done();
    });

    it('throws error because bad string', function (done) {
      let UuidConverter = tools.cassandra.converter.uuid;

      should.throws(() => {
        let uuidAsString = '47c7630c-a54f-4893-abd0-e5fe5ce9eaac465465';
        UuidConverter.stringToUuid(uuidAsString);
      }, 'non-guid format');

      should.throws(() => {
        let uuidAsString = '';
        UuidConverter.stringToUuid(uuidAsString);
      }, 'empty');

      should.throws(() => {
        let uuidAsString = undefined;
        UuidConverter.stringToUuid(uuidAsString);
      }, 'undefined ');

      should.throws(() => {
        let uuidAsString = null;
        UuidConverter.stringToUuid(uuidAsString);
      }, 'null ');

      should.throws(() => {
        let uuidAsString = {};
        UuidConverter.stringToUuid(uuidAsString);
      }, 'Object');

      should.throws(() => {
        let uuidAsString = [];
        UuidConverter.stringToUuid(uuidAsString);
      }, 'Array');

      should.throws(() => {
        let uuidAsString = true;
        UuidConverter.stringToUuid(uuidAsString);
      }, 'Boolean');

      should.throws(() => {
        let uuidAsString = 1;
        UuidConverter.stringToUuid(uuidAsString);
      }, 'Number');

      done();
    });
  });
});