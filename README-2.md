# iTaaS Node.js Tools
[![GitHub release](https://img.shields.io/github/release/agilecontent/itaas-nodejs-tools.svg)](https://github.com/agilecontent/itaas-nodejs-tools/releases)
[![Travis](https://img.shields.io/travis/agilecontent/itaas-nodejs-tools.svg)](https://travis-ci.org/agilecontent/itaas-nodejs-tools)
[![David](https://img.shields.io/david/agilecontent/itaas-nodejs-tools.svg)](https://david-dm.org/agilecontent/itaas-nodejs-tools)

A collection of tools and utilities for Node.js, maintained by the iTaaS team and used by various iTaaS projects.

Some of its features are designed to be generic enough for any Node.js project, while others are only suited for Express applications or for integrating with Cassandra databases.

----

## Table of Contents

* [1. Requirements](#1-requirements)
* [2. Installation](#2-installation)
* [3. Usage](#3-usage)
* [4. Documentation](#4-documentation)
* [5. Development](#5-development)
  * [5.1. Building]()
  * [5.2. Debugging]()
  * [5.3. Testing]()
* [6. Using Docker]()
* [7. Configuration]()
* [8. Contributing]()
* [9. Related Projects]()

----

## 1. Requirements

* Node.js v4+

**Tip:**  use [nvm](https://github.com/creationix/nvm) to install and manage multiple versions of Node.js and `npm`.


## 2. Installation

`itaas-nodejs-tools` is not published on `npm`, but you can install it straight from GitHub with the following command:

```
npm install --save git+https://github.com/agilecontent/itaas-nodejs-tools.git#VERSION
```

Replace `VERSION` with the desired version from [releases](https://github.com/agilecontent/itaas-nodejs-tools/releases). The latest version is always recommended.


## 3. Usage

```js
/* Examples */
const tools = require('itaas-nodejs-tools');

// TODO: add examples here
```


## 4. Documentation

Read the full docs [here](DOCUMENTATION.md).

## 5. Development

Developing on Linux is recommended, so you can run integration tests easily with Docker.

Before working on a feature or bugfix, make sure to create a branch from the `dev` branch.

```
git checkout dev
git checkout -b my_branch
```

Happy coding!


### 5.1. Testing

You can run all unit tests with this command:
```
npm run test-unit
```

To run all tests, including integration tests, use this command:
```
npm test
```

Note that integration tests require a running Cassandra instance.
The test Cassandra host can be configured in the environment variable `TEST_CASSANDRA_ENDPOINT`. It defaults to `127.0.0.1`.


### 5.1. Debugging

Debugging tests can be done with the following script:
```
npm run test-debug
```

It will enable Node.js debugger and make it listen on port 5858.
You can then use Visual Studio Code or another editor to debug.


## 8. Contributing

Everyone is free to open pull requests in this repository.

**Rules**
1. Do not add non-generic features. This library must contain only reusable code.
2. Add tests for your changes and keep code coverage at 100%.
3. Always update the [docs](DOCUMENTATION.md) and the [CHANGELOG](CHANGELOG.md).


## 9. Related Projects

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
