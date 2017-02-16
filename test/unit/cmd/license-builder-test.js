'use strict';
/* global describe,it */

const should = require('should'); // eslint-disable-line no-unused-vars
const LicenseBuilder = require('../../../lib/cmd/license-builder');
const fs = require('fs');

let tempFile = 'temp-license-file.tmp';
let l1File = './l1.tmp';
let l1Content = 'My license text1';

let defaultDepsDetails = {
  'dep1': {
    'licenses': 'l1',
    'repository': 'https://github.com/UUX-Brasil/itaas-nodejs-tools',
    'publisher': 'Itaas team',
    'email': 'email@agilecontent.com',
    'url': 'http://awesomedep.com',
    'licenseFile': './l1.tmp'
  }
};
let defaultDepsFileContent = `my header----------------------------------------------------------------------

dep1

Repository: https://github.com/UUX-Brasil/itaas-nodejs-tools
Publisher: Itaas team
E-mail: email@agilecontent.com
URL: http://awesomedep.com
Licenses: l1


My license text1
`;

let defaultOptions = {
  header: 'my header',
  allowedLicenseList: 'l1', //allow and not allow
  file: tempFile, //exists and not
  skipPrefix: 'skip' //todo variate
};


describe('LicenseBuilder', function () {
  before(function () {
    if (fs.existsSync(tempFile)) { fs.unlinkSync(tempFile); };
    if (fs.existsSync(l1File)) { fs.unlinkSync(l1File); };

    fs.writeFileSync(l1File, l1Content);
  });

  after(function () {
    if (fs.existsSync(tempFile)) { fs.unlinkSync(tempFile); };
    if (fs.existsSync(l1File)) { fs.unlinkSync(l1File); };
  });

  describe('.build', function () {
    it('create a commom dependency file', function () {
      return LicenseBuilder.create3tdPartyLicense(defaultDepsDetails, defaultOptions).then(() => {
        let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

        licenseFile.should.be.eql(defaultDepsFileContent);
      });
    });

    it('create dependency file when already exists', function () {
      if (fs.existsSync(tempFile)) { fs.unlinkSync(tempFile); };
      fs.writeFileSync(tempFile, 'my temp file content');

      return LicenseBuilder.create3tdPartyLicense(defaultDepsDetails, defaultOptions).then(() => {
        let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

        licenseFile.should.be.eql(defaultDepsFileContent);
      });
    });

    it('fails when not allowed dependency', function () {
      let notAllowL1Options = {
        header: 'my header',
        allowedLicenseList: 'l2',
        file: tempFile,
        skipPrefix: 'skip'
      };

      return LicenseBuilder.create3tdPartyLicense(defaultDepsDetails, notAllowL1Options).then(() => {
        let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

        licenseFile.should.be.eql(defaultDepsFileContent);
      }).should.be.rejected();
    });


    it('skip dependency in options', function () {
      let skipDep1Options = {
        header: 'my header',
        allowedLicenseList: 'l1',
        file: tempFile,
        skipPrefix: 'dep1'
      };

      return LicenseBuilder.create3tdPartyLicense(defaultDepsDetails, skipDep1Options).then(() => {
        let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

        licenseFile.should.be.eql(`my header`);
      });
    });

    it('ignore not filled dependency fields', function () {

      let dependenceWithoutFields = {
        'dep1': {
          'licenses': 'l1',
        }
      };

      return LicenseBuilder.create3tdPartyLicense(dependenceWithoutFields, defaultOptions).then(() => {
        let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

        licenseFile.should.be.eql(`my header----------------------------------------------------------------------

dep1

Licenses: l1


`);
      });
    });
  });
});
