#!/usr/bin/env node
'use strict';

const program = require('commander');
const ThirdPartyLicenseGenerator = require('./third-party-license-generator');
const LicenseFileHandler = require('./license-file-handler');

program
  .option('--config <value>', 'Use the config file.')
  .parse(process.argv);

let config = null;

LicenseFileHandler
  .getFile(program.config ? program.config : '.license-config')
  .then((content) => {
    return LicenseFileHandler.parseFile(content);
  })
  .then((json) => {
    config = json;
  })
  .catch((error) => {
    console.error(error.errorMessage);
    process.exit(1);
  });

ThirdPartyLicenseGenerator
  .getDependenciesDetails()
  .then((dependenciesDetails) => {
    return ThirdPartyLicenseGenerator.createThirdPartyLicense(dependenciesDetails, config);
  })
  .then((resultMessage) => {
    console.log(resultMessage);
    process.exit(0);
  })
  .catch((error) => {
    if (error instanceof Error) {
      console.log(error.stack);
    }

    if (error.error) { console.error(error.error); }

    if (error.stderr) { console.error(error.stderr); }

    if (error.stdout) { console.log(error.stdout); }

    console.error('Could not generate 3rd party licenses');
    process.exit(1);
  });
