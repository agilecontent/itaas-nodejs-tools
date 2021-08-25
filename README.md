# iTaaS Node.js Tools
[![GitHub release](https://img.shields.io/github/release/agilecontent/itaas-nodejs-tools.svg)](https://github.com/agilecontent/itaas-nodejs-tools/releases)
[![Travis](https://img.shields.io/travis/agilecontent/itaas-nodejs-tools/master.svg)](https://travis-ci.org/agilecontent/itaas-nodejs-tools)
[![David](https://img.shields.io/david/agilecontent/itaas-nodejs-tools.svg)](https://david-dm.org/agilecontent/itaas-nodejs-tools)

A collection of tools and utilities for Node.js, maintained by the iTaaS team and used by various iTaaS projects.

Some of its features are designed to be generic enough for any Node.js project, while others are only suited for Express applications.

----

## Table of Contents

* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Documentation](#documentation)
* [Development](#development)
  * [Testing](#testing)
  * [Debugging](#debugging)
* [Contributing](#contributing)
* [Related Projects](#related-projects)

----

## Requirements

* Node.js v4+

**Tip:**  use [nvm](https://github.com/creationix/nvm) to install and manage multiple versions of Node.js and `npm`.


## Installation

`itaas-nodejs-tools` is not published on `npm`, but you can install it straight from GitHub with the following command:

```
npm install --save git+https://github.com/agilecontent/itaas-nodejs-tools.git#VERSION
```

Replace `VERSION` with the desired version from [releases](https://github.com/agilecontent/itaas-nodejs-tools/releases). The latest version is always recommended.


## Usage

```javascript
const tools = require('itaas-nodejs-tools');
const uuid = require('uuid').v4;

let callId = uuid();
let config = { key: "value" };
let logger = tools.createLogger();
let serviceLocator = tools.createServiceLocator();

let context = tools.createCallContext(callId, config, logger, serviceLocator);
```


## Documentation

Read the full docs [here](DOCUMENTATION.md).

## Development

Developing on Linux is recommended, so you can run integration tests easily with Docker.




### Testing

You can run all unit tests with this command:
```
npm run test-unit
```

To run all tests, including integration tests, use this command:
```
npm test
```


### Debugging

Debugging tests can be done with the following script:
```
npm run test-debug
```

It will enable Node.js debugger and make it listen on port 5858.
You can then use Visual Studio Code or another editor to debug.


## Contributing

Everyone is free to open pull requests in this repository.

For more information on how to contribute properly, check these [instructions](CONTRIBUTING.md).


## Related Projects

These projects use iTaaS Node.js Tools:
- [Spotlight](https://github.com/agilecontent/spotlight)
- [Amadeus](https://github.com/agilecontent/amadeus)
- [Payback](https://github.com/agilecontent/payback)
- [Godfather](https://github.com/agilecontent/godfather)
- [Startrek](https://github.com/agilecontent/startrek)
- [Swordfish](https://github.com/agilecontent/swordfish)
- [Agora](https://github.com/agilecontent/agora)
- [Agora Transformers](https://github.com/agilecontent/agora-transformers)
- [Storks](https://github.com/agilecontent/storks)
- [iTaaS Node.js API Framework](https://github.com/agilecontent/itaas-nodejs-api-framework)
