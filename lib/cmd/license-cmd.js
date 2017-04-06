#!/usr/bin/env node
'use strict';

const program = require('commander');
const ThirdPartyLicenseGenerator = require('./third-party-license-generator');
const fs = require('fs');

program
  .option('--config <value>', 'Use the config file.')
  .parse(process.argv);

let filename = program.config ? program.config : '.license-config';
let config = JSON.parse(fs.readFileSync(filename, 'utf8'));

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
