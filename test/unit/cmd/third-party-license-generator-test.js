'use strict';
/* global describe, it, before, after */

const should = require('should'); // eslint-disable-line no-unused-vars
const ThirdPartyLicenseGenerator = require('../../../lib/cmd/third-party-license-generator');
const fs = require('fs');

let tempFile = 'temp-license-file.tmp';
let l1File = './l1.tmp';
let l1Content = 'My license text1';

let defaultDependenciesDetails = {
  'dep1': {
    'licenses': 'l1',
    'repository': 'https://github.com/UUX-Brasil/itaas-nodejs-tools',
    'publisher': 'Itaas team',
    'email': 'email@agilecontent.com',
    'url': 'http://awesomedep.com',
    'licenseFile': './l1.tmp'
  }
};
let defaultDependenciesFileContent = `my header----------------------------------------------------------------------

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


describe('ThirdPartyLicenseGenerator', function () {
  before(function () {
    if (fs.existsSync(tempFile)) { fs.unlinkSync(tempFile); }
    if (fs.existsSync(l1File)) { fs.unlinkSync(l1File); }

    fs.writeFileSync(l1File, l1Content);
  });

  after(function () {
    if (fs.existsSync(tempFile)) { fs.unlinkSync(tempFile); }
    if (fs.existsSync(l1File)) { fs.unlinkSync(l1File); }
  });

  describe('.build', function () {
    it('create a commom dependency file', function () {
      return ThirdPartyLicenseGenerator.createThirdPartyLicense(defaultDependenciesDetails, defaultOptions).then(() => {
        let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

        licenseFile.should.be.eql(defaultDependenciesFileContent);
      });
    });

    it('create dependency file when already exists', function () {
      if (fs.existsSync(tempFile)) { fs.unlinkSync(tempFile); }
      fs.writeFileSync(tempFile, 'my temp file content');

      return ThirdPartyLicenseGenerator.createThirdPartyLicense(defaultDependenciesDetails, defaultOptions).then(() => {
        let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

        licenseFile.should.be.eql(defaultDependenciesFileContent);
      });
    });

    it('fails when not allowed dependency', function () {
      let notAllowL1Options = {
        header: 'my header',
        allowedLicenseList: 'l2',
        file: tempFile,
        skipPrefix: 'skip'
      };

      return ThirdPartyLicenseGenerator.createThirdPartyLicense(
        defaultDependenciesDetails, notAllowL1Options).then(() => {
          let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

          licenseFile.should.be.eql(defaultDependenciesFileContent);
        }).should.be.rejected();
    });


    it('skip dependency in options', function () {
      let skipDep1Options = {
        header: 'my header',
        allowedLicenseList: 'l1',
        file: tempFile,
        skipPrefix: 'dep1'
      };

      return ThirdPartyLicenseGenerator.createThirdPartyLicense(
        defaultDependenciesDetails, skipDep1Options).then(() => {
          let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

          licenseFile.should.be.eql('my header');
        });
    });

    it('ignore not filled dependency fields', function () {

      let dependenceWithoutFields = {
        'dep1': {
          'licenses': 'l1'
        }
      };

      return ThirdPartyLicenseGenerator.createThirdPartyLicense(dependenceWithoutFields, defaultOptions).then(() => {
        let licenseFile = fs.readFileSync(tempFile, 'UTF-8');

        licenseFile.should.be.eql(`my header----------------------------------------------------------------------

dep1

Licenses: l1


`);
      });
    });
  });
});
