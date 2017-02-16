#!/usr/bin/env node
'use strict';

const program = require('commander');
const fs = require('fs');
const exec = require('child_process').exec;
const getLicenseCommand = 'license-checker --production --json';

class LicenseBuilder {
  static prepareLicenseFile(file) {
    if (fs.existsSync(file)) { fs.unlinkSync(file); };
    fs.writeFileSync(file, '');
  }

  static writeLicenseHeader(file, header) {
    fs.appendFileSync(file, header);
  }

  static writeDepencency(file, opt) {

    let repositoryLine = opt.repository ? `Repository: ${opt.repository}\n` : '';
    let publisherLine = opt.publisher ? `Publisher: ${opt.publisher}\n` : '';
    let emailLine = opt.email ? `E-mail: ${opt.email}\n` : '';
    let urlLine = opt.url ? `URL: ${opt.url}\n` : '';
    let licensesLine = opt.licenses ? `Licenses: ${opt.licenses.join(', ')}\n` : '';
    let licenseText = opt.licenseText ? `\n${opt.licenseText}` : '';

    fs.appendFileSync(file, `----------------------------------------------------------------------

${opt.name}

${repositoryLine}${publisherLine}${emailLine}${urlLine}${licensesLine}
${licenseText}
`);
  }
  static readDepsDetails() {
    return new Promise((resolve, reject) => {
      return exec(getLicenseCommand, (error, stdout, stderr) => {
        if (error) {
          return reject({ error: error, stdout: stdout, stderr: stderr });
        }

        return resolve({ stdout: stdout, stderr: stderr });
      });
    });
  }

  static parseDepsDetails(cmdOutput) {
    if (!cmdOutput || !cmdOutput.stdout) {
      return Promise.reject({ error: 'Get nothing from license-checker' });
    };

    try {
      return JSON.parse(cmdOutput.stdout);
    } catch (err) {
      return Promise.reject({ error: 'Invalid JSON from license-checker: ' + err.toString() });
    }
  }

  static 

  static build(opt) {
    let header = opt.header;
    let allowedLicenseList = opt.allowedLicenseList;
    let file = opt.file;
    let skipPrefix = opt.skipPrefix;

    readDepsDetails
      .then(parseDepsDetails)
      .then((parsedJson) => {
        LicenseBuilder.prepareLicenseFile(file);
        LicenseBuilder.writeLicenseHeader(file, header);

        for (let depencenceName in parsedJson) {
          if (depencenceName.startsWith(skipPrefix)) {
            continue;
          }

          let licenseInfo = parsedJson[depencenceName];

          if (!(licenseInfo.licenses instanceof Array)) {
            licenseInfo.licenses = [licenseInfo.licenses];
          }

          for (let licenseName of licenseInfo.licenses) {
            if (allowedLicenseList.indexOf(licenseName) == -1) {
              console.error(`You need to allow this license: ${licenseName}, or remove this depencency: ${depencenceName}`);
              throw new Error(`There is a dependency with a not allowed license, details: ${JSON.stringify(licenseInfo)}`);
            }
          }

          let licenseText;

          if (fs.existsSync(licenseInfo.licenseFile)) {
            licenseText = fs.readFileSync(licenseInfo.licenseFile, 'UTF-8');
          }

          LicenseBuilder.writeDepencency(file, {
            name: depencenceName,
            repository: licenseInfo.repository,
            publisher: licenseInfo.publisher,
            email: licenseInfo.email,
            url: licenseInfo.url,
            licenses: licenseInfo.licenses,
            licenseText: licenseText
          });
        }

        return Promise.resolve(`3rd party licenses generated at ${file}`);
      });
  }
}

module.exports = LicenseBuilder;