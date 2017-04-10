'use strict';
/* global describe, it */

const should = require('should'); // eslint-disable-line no-unused-vars
const LicenseFileHandler = require('../../../lib/cmd/license-file-handler');

const default_config = '{\n\
  \"header\": \"THIRD-PARTY SOFTWARE NOTICES AND INFORMATION\\n\\n\
Note:  OTTN is not the author of the files below.\\n\\n\
The notices below are provided for informational purposes only and are not\\n\
the license terms under which OTTN distributes these files.\\n\\n\",\n\
  \"file\": \"LICENSE-3RD-PARTY.txt\",\n\
  \"skipPrefix\": \"spotlight@\",\n\
  \"allowedLicenseList\":\n\
    [\n\
      \"MIT\", \"MIT*\", \"Apache-2.0\", \"Apache-2.0*\", \"BSD-3-Clause\", \"BSD-3-Clause*\",\n\
      \"BSD\", \"BSD*\", \"ISC\", \"ISC*\", \"AFLv2.1\", \"Unlicense\", \"WTFPL\", \"BSD-2-Clause\",\n\
      \"(MIT AND CC-BY-3.0)\", \"Public Domain\", "Apache License, Version 2.0"\n\
    ]\n\
}\n';

const custom_config = '{\n\
  \"header\": \"MY SUPER DUPER LICENSE 3000\",\n\
  \"file\": \"ULTRA-LICENSE-DO-MILHAO.txt\",\n\
  \"skipPrefix\": \"prefix@\",\n\
  \"allowedLicenseList\":\n\
    [\n\
      \"MIT\", \"MIT*\", \"Apache-2.0\", \"Apache-2.0*\", \"BSD-3-Clause\", \"BSD-3-Clause*\",\n\
      \"BSD\", \"BSD*\", \"ISC\", \"ISC*\", \"AFLv2.1\", \"Unlicense\", \"WTFPL\", \"BSD-2-Clause\",\n\
      \"(MIT AND CC-BY-3.0)\", \"Public Domain\"\n\
    ]\n\
}\n';


describe('LicenseFileHandler', function() {
  describe('.getFile', function() {
    it('get default license file (/.license-config)', function() {
      return LicenseFileHandler
        .getFile('.license-config')
        .then((content) => {
          content.should.be.eql(default_config);
        });
    });

    it('get custom license file (/mylicense.json)', function() {
      return LicenseFileHandler
        .getFile('mylicense.json')
        .then((content) => {
          content.should.be.eql(custom_config);
        });
    });

    it('get and parse default license file (/.license-config)', function() {
      let test = null;
      return LicenseFileHandler
        .getFile('.license-config')
        .then((content) => {
          return LicenseFileHandler.parseFile(content);
        })
        .then((obj) => {
          test = obj;
          return LicenseFileHandler.parseFile(default_config);
        })
        .then((comparison) => {
          test.should.be.eql(comparison);
        });
    });

    it('get and parse custom license file (/mylicense.json)', function() {
      return LicenseFileHandler
        .getFile('mylicense.json')
        .then((content) => {
          let test = LicenseFileHandler.parseFile(content);
          let comparison = LicenseFileHandler.parseFile(custom_config);

          test.should.be.eql(comparison);
        });
    });

    it('fails when given an invalid file path', function() {
      return LicenseFileHandler
        .getFile('aaaaaaaa')
        .should.be.rejected();
    });

    it('fails when given an invalid JSON object', function() {
      return LicenseFileHandler
        .parseFile('aaaaaaaa')
        .should.be.rejected();
    });

    it('fails when given a valid JSON object without the needed parameters', function() {
      return LicenseFileHandler
        .parseFile('{\"header\":\"asas\"}')
        .should.be.rejected();
    });
  });
});
