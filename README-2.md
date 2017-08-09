# iTaaS Node.js Tools
[![GitHub release](https://img.shields.io/github/release/agilecontent/itaas-nodejs-tools.svg)](https://github.com/agilecontent/itaas-nodejs-tools/releases)
[![Travis](https://img.shields.io/travis/agilecontent/itaas-nodejs-tools.svg)](https://travis-ci.org/agilecontent/itaas-nodejs-tools)
[![David](https://img.shields.io/david/agilecontent/itaas-nodejs-tools.svg)](https://david-dm.org/agilecontent/itaas-nodejs-tools)

A collection of tools and utilities for Node.js, maintained by the iTaaS team and used by various iTaaS projects.

Some of its features are designed to be generic enough for any Node.js project, while others are only suited for Express applications or for integrating with Cassandra databases.

----

## Table of Contents

* [1. Requirements](#1-requirements)
* [2. Installation]()
* [3. Usage]()
* [4. Documentation]()
* [5. Development]()
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

Developing on Linux is recommended, so you can run Cassandra tools tests easily with Docker.

Before working on a feature or bugfix, make sure to create a branch from the `dev` branch.

```
git checkout dev
git checkout -b my_branch
```

Happy coding!


### 5.1. Debugging

Debugging is done using Node.js debugger listening on port 5858.



`npm run test-debug`

And for integration test:


`npm run integration-test-debug`

### 5.3. Testing

This is the command for unit test:


`npm run test`

And for integration test:


`npm run integration-test`

## 6. Using Docker

Docker is love. Docker is life.


`docker run the-best`

## 7. Configuration

If you need to setup your own configuration for the best project ever, those are the environment variables used.

|**Environment Variable**|**Value**|
|:----------------------:|:-------:|
|`THE BEST`|`this project`|


## 8. Contributing

If you want to be one with the greatest people there is, you need to understand how to contribute to the project.

For more information about contributing, see our [Contribution Guidelines]()

## 9. Related Projects

No other project compares to the best project ever.
