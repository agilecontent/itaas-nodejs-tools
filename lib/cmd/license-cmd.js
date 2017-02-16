#!/usr/bin/env node
'use strict';

const program = require('commander');
const fs = require('fs');
const exec = require('child_process').exec;
const licenseBuilder = require('./license-builder');

program
  .option('--header <value>', 'Add a header to license file.')
  .option('--allow <value>', 'Comma separated list of allowed license names to be verified.')
  .option('--file <value>', 'File to write the license list.')
  .option('--skipPrefix <value>', 'Skip licenses of dependencies that start with this')
  .parse(process.argv);

let header = program.header;
let allowedLicenseList = program.allow.split(',');
let file = program.file;
let skipPrefix = program.skipPrefix;

licenseBuilder
  .build({
    header: header,
    allowedLicenseList: allowedLicenseList,
    file: file,
    skipPrefix: skipPrefix
  })
  .then((resultMessage) => {
    console.log(resultMessage);
    process.exit(0);
  }).catch((error) => {
    if (error instanceof Error) {
      console.log(error.stack);
    }

    if (error.error) { console.error(error.error) };

    if (error.stderr) { console.error(error.stderr) };

    if (error.stdout) { console.log(error.stdout) };

    console.error("Could not generate 3rd party licenses");
    process.exit(1);
  });
