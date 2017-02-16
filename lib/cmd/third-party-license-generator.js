#!/usr/bin/env node
'use strict';

const fs = require('fs');
const exec = require('child_process').exec;
const getLicenseCommand = 'license-checker --production --json';

class ThirdPartyLicenseGenerator {
  static prepareLicenseFile(file) {
    if (fs.existsSync(file)) { fs.unlinkSync(file); }
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
    let licensesLine = `Licenses: ${opt.licenses.join(', ')}\n`;
    let licenseText = opt.licenseText ? `\n${opt.licenseText}` : '';

    fs.appendFileSync(file, `----------------------------------------------------------------------

${opt.name}

${repositoryLine}${publisherLine}${emailLine}${urlLine}${licensesLine}
${licenseText}
`);
  }
  static readDependenciesDetails() {
    return new Promise((resolve, reject) => {
      return exec(getLicenseCommand, (error, stdout, stderr) => {
        if (error) {
          return reject({ error: error, stdout: stdout, stderr: stderr });
        }

        return resolve({ stdout: stdout, stderr: stderr });
      });
    });
  }

  static parseDependenciesDetails(cmdOutput) {
    if (!cmdOutput || !cmdOutput.stdout) {
      return Promise.reject({ error: 'Get nothing from license-checker' });
    }

    try {
      return JSON.parse(cmdOutput.stdout);
    } catch (err) {
      return Promise.reject({ error: 'Invalid JSON from license-checker: ' + err.toString() });
    }
  }

  static getDependenciesDetails() {
    return ThirdPartyLicenseGenerator.readDependenciesDetails()
      .then(ThirdPartyLicenseGenerator.parseDependenciesDetails);
  }

  static createThirdPartyLicense(dependenciesDetails, opt) {
    let header = opt.header;
    let allowedLicenseList = opt.allowedLicenseList;
    let file = opt.file;
    let skipPrefix = opt.skipPrefix;

    return Promise.resolve(dependenciesDetails)
      .then((dependenciesDetails) => {
        ThirdPartyLicenseGenerator.prepareLicenseFile(file);
        ThirdPartyLicenseGenerator.writeLicenseHeader(file, header);

        for (let depencenceName in dependenciesDetails) {
          if (depencenceName.startsWith(skipPrefix)) {
            continue;
          }

          let licenseInfo = dependenciesDetails[depencenceName];

          if (!(licenseInfo.licenses instanceof Array)) {
            licenseInfo.licenses = [licenseInfo.licenses];
          }

          for (let licenseName of licenseInfo.licenses) {
            if (allowedLicenseList.indexOf(licenseName) == -1) {
              console.error(
                `You need to allow this license: ${licenseName}, or remove this depencency: ${depencenceName}`);
              throw new Error(
                `There is a dependency with a not allowed license, details: ${JSON.stringify(licenseInfo)}`);
            }
          }

          let licenseText;

          if (fs.existsSync(licenseInfo.licenseFile)) {
            licenseText = fs.readFileSync(licenseInfo.licenseFile, 'UTF-8');
          }

          ThirdPartyLicenseGenerator.writeDepencency(file, {
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

module.exports = ThirdPartyLicenseGenerator;