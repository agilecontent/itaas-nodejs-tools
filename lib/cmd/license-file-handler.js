'use strict';

const fs = require('fs');

class LicenseFileHandler
{
	static getFile(filename)
	{
		return new Promise((resolve,reject) => {
			if (fs.existsSync(filename))
				return resolve(fs.readFileSync(filename, 'utf8'));
			else
				return reject({"errorCode":"LICENSE_CONFIG_NOT_FOUND", "errorMessage":"Could not find any license config file."});
		});
 	}

	static parseFile(arg)
	{
		return new Promise((resolve,reject) => {
			let object = null;
			
			try {
				object = JSON.parse(arg);
			} catch (e) {
				return reject({"errorCode":"LICENSE_CONFIG_CORRUPTED", "errorMessage":"License config file is not a valid JSON."});
			}

			if (object.header     !== null && object.header     !== undefined &&
				object.file       !== null && object.file       !== undefined &&
				object.skipPrefix !== null && object.skipPrefix !== undefined &&
				object.allowedLicenseList !== null &&
				object.allowedLicenseList !== undefined)
				return resolve(object);
			return reject({"errorCode":"LICENSE_CONFIG_CORRUPTED", "errorMessage":"License config file does not have needed parameters."});
		});
	}
}

module.exports = LicenseFileHandler;