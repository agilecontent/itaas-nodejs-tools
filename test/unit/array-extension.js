'use strict';
/* global describe, it*/

const should = require('should'); // eslint-disable-line no-unused-vars
const tools = require('../../lib/index');

describe('.extension.array', function () {
  describe('.containsByProperty', function () {
    it('contains just one, multiple and none match', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        property1: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let obj3 = {
        property1: 'multiple',
        property2: 'value3'
      };

      let objUndefined = {
        undefined: 'multiple',
        property2: 'value2'
      };

      let array = [obj1, obj2, obj3, objUndefined];
      //one
      array.containsByProperty('property1', 'one').should.be.equal(true);
      array.containsByProperty(undefined, 'multiple').should.be.equal(true);
      //multiple
      array.containsByProperty('property1', 'multiple').should.be.equal(true);
      //none
      array.containsByProperty('property1', 'does not contain').should.be.equal(false);

      done();
    });

    it('contains but not all objects has property', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        AnotherProperty: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let array = [obj1, obj2];
      //validValue
      array.containsByProperty('property1', 'multiple').should.be.equal(true);
      //all does not have
      array.containsByProperty('badProperty', 'multiple').should.be.equal(false);
      //undefined
      array.containsByProperty(undefined, 'multiple').should.be.equal(false);

      done();
    });
  });

  describe('.getByProperty', function () {
    it('get just one, first and none match', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        property1: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let obj3 = {
        property1: 'multiple',
        property2: 'value3'
      };

      let array = [obj1, obj2, obj3];
      //one
      should.deepEqual(array.getByProperty('property1', 'one'), obj1);
      //multiple - first
      should.deepEqual(array.getByProperty('property1', 'multiple'), obj2);
      //none
      should.deepEqual(array.getByProperty('property1', 'does not contain'), undefined);

      done();
    });

    it('get but not all objects has property', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        AnotherProperty: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let objUndefined = {
        undefined: 'multiple',
        property2: 'value2'
      };

      let array = [obj1, obj2, objUndefined];
      //validValue
      should.deepEqual(array.getByProperty('property1', 'multiple'), obj2);
      should.deepEqual(array.getByProperty(undefined, 'multiple'), objUndefined);

      //all does not have
      should.deepEqual(array.getByProperty('badProperty', 'multiple'), undefined);
      done();
    });

  });

  describe('.getAllByProperty', function () {
    it('get just one, all and none match', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        property1: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let obj3 = {
        property1: 'multiple',
        property2: 'value3'
      };

      let array = [obj1, obj2, obj3];
      //one
      should.deepEqual(array.getAllByProperty('property1', 'one'), [obj1]);
      //multiple - first
      should.deepEqual(array.getAllByProperty('property1', 'multiple'), [obj2, obj3]);
      //none
      should.deepEqual(array.getAllByProperty('property1', 'does not contain'), []);

      done();
    });

    it('get but not all objects has property', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        AnotherProperty: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let objUndefined = {
        undefined: 'multiple',
        property2: 'value2'
      };

      let array = [obj1, obj2, objUndefined];
      //validValue
      should.deepEqual(array.getAllByProperty('property1', 'multiple'), [obj2]);
      should.deepEqual(array.getAllByProperty(undefined, 'multiple'), [objUndefined]);

      //all does not have
      should.deepEqual(array.getAllByProperty('badProperty', 'multiple'), []);
      done();
    });

  });

  describe('.removeByProperty', function () {
    it('remove just one, all and none', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        property1: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let obj3 = {
        property1: 'multiple',
        property2: 'value3'
      };

      let obj4 = {
        anotherProperty: 'multiple',
        property2: 'value3'
      };

      let array = [obj1, obj2, obj3, obj4];

      //one
      should.deepEqual(array, [obj1, obj2, obj3, obj4]);
      array.removeByProperty('property1', 'one');
      should.deepEqual(array, [obj2, obj3, obj4]);

      //multiple - first
      array.removeByProperty('property1', 'multiple');
      should.deepEqual(array, [obj4]);

      //none
      array.removeByProperty('property1', 'does not contain');
      should.deepEqual(array, [obj4]);

      done();
    });

    it('remove but not all objects has property', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        AnotherProperty: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let objUndefined = {
        undefined: 'multiple',
        property2: 'value2'
      };

      let array = [obj1, obj2, objUndefined];
      //valid key
      should.deepEqual(array, [obj1, obj2, objUndefined]);
      array.removeByProperty('property1', 'multiple');
      should.deepEqual(array, [obj1, objUndefined]);

      //undefined key
      array.removeByProperty(undefined, 'multiple');
      should.deepEqual(array, [obj1]);

      //all does not have
      array.getAllByProperty('badProperty', 'multiple');
      should.deepEqual(array, [obj1]);

      done();
    });

  });

  describe('.changeByProperty', function () {
    it('update just one, all and none', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        property1: 'one',
        property2: 'value2'
      };
      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };
      let obj3 = {
        property1: 'multiple',
        property2: 'value3'
      };
      let obj4 = {
        anotherProperty: 'multiple',
        property2: 'value3'
      };

      let obj1AfterChange = {
        property1: 'new one',
        property2: 'value2'
      };
      let obj2AfterChange = {
        property1: 'new multiple',
        property2: 'value2'
      };
      let obj3AfterChange = {
        property1: 'new multiple',
        property2: 'value3'
      };

      let array = [obj1, obj2, obj3, obj4];

      //one
      should.deepEqual(array.getAllByProperty('property1', 'one'), [obj1]);
      array.changeByProperty('property1', 'one', 'new one');
      should.deepEqual(array.getAllByProperty('property1', 'one'), []);
      should.deepEqual(array.getAllByProperty('property1', 'new one'), [obj1AfterChange]);

      //multiple - first
      should.deepEqual(array.getAllByProperty('property1', 'multiple'), [obj2, obj3]);
      array.changeByProperty('property1', 'multiple', 'new multiple');
      should.deepEqual(array.getAllByProperty('property1', 'multiple'), []);
      should.deepEqual(array.getAllByProperty('property1', 'new multiple'), [obj2AfterChange, obj3AfterChange]);

      //none
      let arrayAfterChange = [obj1AfterChange, obj2AfterChange, obj3AfterChange, obj4];
      should.deepEqual(array, arrayAfterChange);
      array.changeByProperty('property1', 'does not contain', 'should not change');
      should.deepEqual(array, arrayAfterChange);

      done();
    });

    it('update but not all objects has property', function (done) {
      tools.extension.extendArray();
      let obj1 = {
        AnotherProperty: 'one',
        property2: 'value2'
      };

      let obj2 = {
        property1: 'multiple',
        property2: 'value2'
      };

      let objUndefined = {
        undefined: 'multiple',
        property2: 'value2'
      };

      let obj2AfterChange = {
        property1: 'new multiple',
        property2: 'value2'
      };

      let objUndefinedAfterChange = {
        undefined: 'new multiple',
        property2: 'value2'
      };

      let array = [obj1, obj2, objUndefined];

      //one
      should.deepEqual(array.getAllByProperty('property1', 'multiple'), [obj2]);
      array.changeByProperty('property1', 'multiple', 'new multiple');
      should.deepEqual(array.getAllByProperty('property1', 'multiple'), []);
      should.deepEqual(array.getAllByProperty('property1', 'new multiple'), [obj2AfterChange]);

      //undefined key
      should.deepEqual(array.getAllByProperty(undefined, 'multiple'), [objUndefined]);
      array.changeByProperty(undefined, 'multiple', 'new multiple');
      should.deepEqual(array.getAllByProperty(undefined, 'multiple'), []);
      should.deepEqual(array.getAllByProperty(undefined, 'new multiple'), [objUndefinedAfterChange]);

      //all does not have
      should.deepEqual(array, [obj1, obj2AfterChange, objUndefinedAfterChange]);
      array.changeByProperty('badProperty', 'multiple');
      should.deepEqual(array, [obj1, obj2AfterChange, objUndefinedAfterChange]);

      done();
    });

  });
});