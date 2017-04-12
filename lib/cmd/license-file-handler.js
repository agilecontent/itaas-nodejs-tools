'use strict';

const fs = require('fs');

class LicenseFileHandler
{	
  static getMissingFields(obj)
  {
    let missingFields = [];

    if(!obj.header) missingFields.push('header');
    if(!obj.file) missingFields.push('file');
    if(!obj.skipPrefix) missingFields.push('skipPrefix');
    if(!obj.allowedLicenseList) missingFields.push('allowedLicenseList');

    return missingFields;
  }

  static getFile(filename)
  {
    return new Promise((resolve, reject) => {
      return fs.readFile(filename, 'utf8', (err, data) => {
        if (err)
          return reject(
            {
              'errorCode': 'LICENSE_CONFIG_NOT_FOUND',
              'errorMessage': err.toString()
            });
        return resolve(data);
      });
    });
  }

  static parseFile(arg)
  {
    return new Promise((resolve, reject) => {
      let object = null;

      try {
        object = JSON.parse(arg);
      } catch (e) {
        return reject(
          {
            'errorCode': 'LICENSE_CONFIG_CORRUPTED',
            'errorMessage': 'License config file is not a valid JSON.'
          });
      }

      let missingFields = LicenseFileHandler.getMissingFields(object);

      if (missingFields.length === 0)
        return resolve(object);
      return reject(
        {
          'errorCode': 'LICENSE_CONFIG_CORRUPTED',
          'errorMessage': 'License config file does not have the parameters: '
            + missingFields.toString()
            + '.'
        });
    });
  }
}

module.exports = LicenseFileHandler;