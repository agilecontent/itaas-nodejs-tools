#!/usr/bin/env node
'use strict';

const program = require('commander');
const ThirdPartyLicenseGenerator = require('./third-party-license-generator');
const LicenseFileHandler = require('./license-file-handler');

program
  .option('--config <value>', 'Use the config file.')
  .parse(process.argv);

let config = null;

let licensePromise = LicenseFileHandler
  .getConfig(program.config)
  .then((content) => {
    return LicenseFileHandler.parseFile(content);
  });

let dependPromise = ThirdPartyLicenseGenerator
  .getDependenciesDetails();

Promise
  .all([licensePromise,dependPromise])
  .then((arr) => {
    return ThirdPartyLicenseGenerator.createThirdPartyLicense(arr[1], arr[0]);
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
    if (error.errorMessage) { console.error(error.errorMessage); }

    console.error('Could not generate 3rd party licenses');
    process.exit(1);
  });
