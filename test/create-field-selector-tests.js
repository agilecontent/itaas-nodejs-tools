'use strict';
/* global describe,it */

const tools = require('../lib/index');
const should = require('should'); // eslint-disable-line no-unused-vars

describe('.createFieldSelector', function () {
  it('should create correctly based on a single field input', function () {
    let description;
    let selector;

    description = 'id';
    selector = tools.createFieldSelector(description);
    selector.should.have.property('id');
    Object.keys(selector).length.should.equal(1);

    description = 'series.seasons.episodes';
    selector = tools.createFieldSelector(description);

    selector.should.have.property('series');
    Object.keys(selector).length.should.equal(1);

    selector.series.should.have.property('seasons');
    Object.keys(selector.series).length.should.equal(1);

    selector.series.seasons.should.have.property('episodes');
    Object.keys(selector.series.seasons).length.should.equal(1);
  });
  it('should create correctly based on a multiple field input', function () {
    let description = 'name,age,address.city,address.state,address.street.postalCode,address.street.name';
    let selector = tools.createFieldSelector(description);

    selector.should.have.property('name');
    selector.should.have.property('age');
    selector.should.have.property('address');
    Object.keys(selector).length.should.equal(3);

    selector.address.should.have.property('city');
    selector.address.should.have.property('state');
    selector.address.should.have.property('street');
    Object.keys(selector.address).length.should.equal(3);

    selector.address.street.should.have.property('postalCode');
    selector.address.street.should.have.property('name');
    Object.keys(selector.address.street).length.should.equal(2);
  });
  it('should ignore conflicting paths', function () {
    let description;
    let selector;

    description = 'name,address,address.city';
    selector = tools.createFieldSelector(description);

    selector.should.have.property('name');
    selector.should.have.property('address');
    selector.should.not.have.property('city');
    selector.should.not.have.property('address.city');
    Object.keys(selector).length.should.equal(2);

    selector.address.should.have.property('city');
    Object.keys(selector.address).length.should.equal(1);

    description = 'name,address.city,address';
    selector = tools.createFieldSelector(description);

    selector.should.have.property('name');
    selector.should.have.property('address');
    selector.should.not.have.property('city');
    selector.should.not.have.property('address.city');
    Object.keys(selector).length.should.equal(2);

    selector.address.should.have.property('city');
    Object.keys(selector.address).length.should.equal(1);
  });
  it('should ignore duplicate paths', function () {
    let description = 'name,name,age';
    let selector = tools.createFieldSelector(description);

    selector.should.have.property('name');
    selector.should.have.property('age');
    Object.keys(selector).length.should.equal(2);
  });
  it('should throw if the field description has an invalid format', function () {
    let description;
    let createViewAttempt = function () {
      tools.createFieldSelector(description);
    };

    let invalidInputs = [
      ' ',
      'seven7',
      'pro-perty',
      'pr@perty',
      'name,,age',
      'name, ,age',
      'name, age',
      'name ,age',
      'address..street',
      'address. .street',
      'address. street',
      'address .street'
    ];

    for (let invalidInput of invalidInputs) {
      description = invalidInput;
      createViewAttempt.should.throw('Invalid field description format');
    }
  });
  describe('.select', function () {
    it('should select only requested fields from source', function () {
      let selector = tools.createFieldSelector('fieldTwo');

      let source = {
        fieldOne: 123,
        fieldTwo: 456
      };
      let selection = selector.select(source);

      selection.should.have.property('fieldTwo', 456);
      selection.should.not.have.property('fieldOne');
      Object.keys(selection).length.should.equal(1);
    });
    it('should recursively select requested fields', function () {
      let source = {
        name: 'Don Vito Corleone',
        age: 53,
        address: {
          city: 'His City',
          state: 'HC',
          street: { name: 'His Street', postalCode: '57230489' }
        },
        actors: [
          { name: 'Robert De Niro', startAge: 25, endAge: 31 },
          { name: 'Marlon Brando', startAge: 53, endAge: 63 }
        ]
      };

      let selector = tools.createFieldSelector(
        'name,address.city,address.street.postalCode,actors.name,actors.endAge');

      let selection = selector.select(source);

      selection.should.have.property('name', 'Don Vito Corleone');
      selection.should.not.have.property('age');
      selection.should.have.property('address');
      selection.should.have.property('actors');
      Object.keys(selection).length.should.equal(3);

      selection.address.should.have.property('city', 'His City');
      selection.address.should.not.have.property('state');
      selection.address.should.have.property('street');
      selection.address.street.should.not.have.property('name');
      selection.address.street.should.have.property('postalCode', '57230489');
      Object.keys(selection.address).length.should.equal(2);

      selection.actors.length.should.equal(2);

      selection.actors[0].should.have.property('name', 'Robert De Niro');
      selection.actors[0].should.have.property('endAge', 31);
      Object.keys(selection.actors[0]).length.should.equal(2);

      selection.actors[1].should.have.property('name', 'Marlon Brando');
      selection.actors[1].should.have.property('endAge', 63);
      Object.keys(selection.actors[1]).length.should.equal(2);
    });
    it('should not include fields that do not exist in the source', function () {
      let selector = tools.createFieldSelector('fieldTwo,fieldThree');

      let source = {
        fieldOne: 123,
        fieldTwo: 456
      };
      let selection = selector.select(source);

      selection.should.have.property('fieldTwo', 456);
      selection.should.not.have.property('fieldOne');
      selection.should.not.have.property('fieldThree');
      Object.keys(selection).length.should.equal(1);
    });
    it('should be case insensitive', function () {
      let selector = tools.createFieldSelector('FIELDTWO');

      let source = {
        fieldOne: 123,
        fieldTwo: 456
      };
      let selection = selector.select(source);

      selection.should.have.property('fieldTwo', 456);
      selection.should.not.have.property('fieldOne');
      Object.keys(selection).length.should.equal(1);
    });
    it('should return full objects and full arrays when requested', function () {
      let source = {
        name: 'Don Vito Corleone',
        age: 53,
        address: {
          city: 'His City',
          state: 'HC',
          street: { name: 'His Street', postalCode: '57230489' }
        },
        actors: [
          { name: 'Robert De Niro', startAge: 25, endAge: 31 },
          { name: 'Marlon Brando', startAge: 53, endAge: 63 }
        ]
      };

      let selector = tools.createFieldSelector('address,actors');

      let selection = selector.select(source);

      selection.should.have.property('address');
      selection.address.should.have.property('city', 'His City');
      selection.address.should.have.property('state', 'HC');
      selection.address.should.have.property('street');
      selection.address.street.should.have.property('name', 'His Street');
      selection.address.street.should.have.property('postalCode', '57230489');
      Object.keys(selection.address.street).length.should.equal(2);
      Object.keys(selection.address).length.should.equal(3);

      selection.actors.length.should.equal(2);

      selection.actors[0].should.have.property('name', 'Robert De Niro');
      selection.actors[0].should.have.property('startAge', 25);
      selection.actors[0].should.have.property('endAge', 31);
      Object.keys(selection.actors[0]).length.should.equal(3);

      selection.actors[1].should.have.property('name', 'Marlon Brando');
      selection.actors[1].should.have.property('startAge', 53);
      selection.actors[1].should.have.property('endAge', 63);
      Object.keys(selection.actors[0]).length.should.equal(3);

      Object.keys(selection).length.should.equal(2);
    });
    it('should copy empty object property in different case', function () {
      let source = {
        customData: {}
      };
      let selector = tools.createFieldSelector('CUSTOMDATA');

      let selection = selector.select(source);
      selection.should.have.property('customData', {});
      Object.keys(selection).length.should.equal(1);
    });
  });
});