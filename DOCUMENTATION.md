# Documentation 
 
## Table of Contents

* [API Tools](#api-tools)
  * [General](#general)
    * [createLogger](#createlogger)
    * [createCallContext](#createcallcontext)
    * [createServiceLocator](#createservicelocator)
    * [createFieldSelector](#createfieldselector)
    * [createRemoteConfig](#createremoteconfig)
    * [cacheRemoteObject](#cacheremoteobject)
  * [Time services](#time-services)
    * [createFixedTimeService](#createfixedtimeservice)
    * [createCurrentTimeService](#createcurrenttimeservice)
  * [Number](#number)
    * [number.isInt32](#numberisint32)
    * [number.parseInt32](#numberparseint32)
    * [number.isFloat](#numberisfloat)
    * [number.parseFloat](#numberparsefloat)
  * [UUID](#uuid)
    * [uuid.isUuid](#uuidisuuid)
  * [Date](#date)
    * [date.isDate](#dateisdate)
    * [date.parseDate](#dateparsedate)
  * [HttpStatus](#httpstatus)
    * [httpStatus.isHttpStatus](#httpStatusishttpstatus)
    * [httpStatus.getClass](#httpstatusgetclass)
    * [httpStatus.isClientError](#httpstatusisclienterror)
    * [httpStatus.isServerError](#httpstatusisservererror)
    * [httpStatus.isHttpError](#httpstatusishttperror)
  * [Express](#express)
    * [express.createCallContextMiddleware](#expresscreatecallcontextmiddleware)
    * [express.createMorganMiddleware](#expresscreatemorganmiddleware)
    * [express.createLowercaseQueryMiddleware](#expresscreatelowercasequerymiddleware)
    * [express.createTrimQueryValueMiddleware](#expresscreatetrimqueryvaluemiddleware)
  * [Promise](#promise)
    * [promise.any](#promiseany)
* [Commands](#commands)
  * [license](#license)

----

## API Tools

----

### General

This section describes general use tools that can solve common needs of Node.js applications.

#### `createLogger`
Creates a [Bunyan](https://github.com/trentm/node-bunyan) logger, which works with log levels and has a really flexible [logging style](https://github.com/trentm/node-bunyan#log-method-api).

This function takes an options object which accepts the properties described in the table below.

| Property     | Type | Required | Description                                       | Default value                        |
| ------------ |-|-| ---------------------------------------------------- | ------------------------------------ |
| `name`         | string | No | The name of the application. | `app log name`|
| `logLevels`    | string array | No | The log levels that will be sent to the output. Messages logged in other levels will be ignored. The levels are `fatal`, `error`, `warn`, `info`, `debug` and `trace.` | [`fatal`, `error`, `warn`, `info`] |
| `logOutput`    | string | No | The log output type. For using the standard output, specify `standard-streams`. For saving logs in a file system folder, specify `rotating-file`.| `standard-streams`|
| `logDirectory` | string | No | The directory in which logs files must be stored (relative to the application start directory). This parameter is only used if the selected log output is `rotating-file`. | `./logs`|

```javascript
const tools = require('itaas-nodejs-tools');

let logger = tools.createLogger({
  name: 'your-app',
  logLevels: ['fatal', 'error', 'warn'],
  logOutput: 'rotating-file',
  logDirectory: './logs'
});

logger.error('A terrible error has occurred!'); // logged in "./logs"
logger.info('Doing everyday things'); // not logged because info level is not enabled
```

#### `createServiceLocator`
Creates an empty service locator.

A service locator is a collection of keys and values with the specific purpose of acting as a dependency injection tool.

Constructing an application in a layer-based structure lets you easily replace layers (depending on business rules, or for test purposes), and the service locator helps with that by keeping references to layer implementations.

```javascript
const tools = require('itaas-nodejs-tools');

class UserService {
  getUser(id) {
    // complicated requests and database queries
    return user;
  }
}

class MockUserService{
  getUser(id){
    let user = fakeUsersInMemory[id];
    return user;
  }
}

let serviceLocator = tools.createServiceLocator();

// for application setup
serviceLocator.addService('user-service', new UserService());

// for unit test setup
serviceLocator.addService('user-service', new MockUserService());

// for either of the above, the code that uses the service is the same
let userService = serviceLocator.getService('user-service');
userService.getUser(id);
```

#### `createCallContext`
Creates a call context with configuration, logger and service locator for a single request or execution.

Call context is one of the most important concepts of iTaaS components. It concentrates generally useful things in a single object, which should be passed around as a parameter throughout the execution.

| Parameter      | Type | Required | Description | Default value |
| -------------- | ---- | --------- | ---------- | ------------- |
| `callId`         | string | Yes      | A unique ID for the request/execution. It is useful to identify the request/execution in logs. | - |
| `config`         | object | Yes      | An object containing all settings your application needs. | - |
| `logger`         | object | Yes      | A logger for the request/execution. See [createLogger](#createlogger). | - |
| `serviceLocator` | object | Yes      | A service locator for the request/execution. See [createServiceLocator](#createservicelocator). | - |

```javascript
const tools = require('itaas-nodejs-tools');
const uuid = require('uuid').v4;

let callId = uuid();
let config = { key: "value" };
let logger = tools.createLogger();
let serviceLocator = tools.createServiceLocator();

let context = tools.createCallContext(callId, config, logger, serviceLocator);
```

*Using a call context*
```javascript
function anyFunction(context /* , otherParameters, ... */) {

  console.log(context.callId); // some UUID

  console.log(context.config.key); // "value"

  context.logger.info('Now I can log anywhere in the code!');

  context.serviceLocator.getService('service-accessible-anywhere');

  otherFunction(context /* , otherParameters, ... */);

}
```

#### `createFieldSelector`

Creates a field selector, a tool that selects properties recursively in a Javascript object, creating a new object with only the selected properties.

The only parameter is a string description of the properties which must be selected, with a specific syntax. The created selector has a function `select`, whose single parameter is the source object to select properties from.

**Notes**
* Properties are case-insensitive and must be separated by comma (`,`)
* Nested properties can be selected by joining the property names with dots (`.`)
* Properties or nested properties that don't exist will never cause an error
* Selections on arrays are done for each of their elements.

```javascript
const tools = require('itaas-nodejs-tools');

let source = {
  name: 'Don Vito Corleone',
  age: 53,
  address: {
    country: 'United States',
    city: 'New York',
    street: { name: 'Mott Street', postalCode: '10012' }
  },
  actors: [
    { name: 'Robert De Niro', startAge: 25, endAge: 31 },
    { name: 'Marlon Brando', startAge: 53, endAge: 63 }
  ]
};

let selector = tools.createFieldSelector('address.city,address.street.postalCode,potato,actors.name');
let selection = selector.select(source); 

console.log(selection);
  /* {
  address: {
    city: 'New York'
    street: { postalCode: '10012' }
  },
  actors: [
    { name: 'Robert De Niro' },
    { name: 'Marlon Brando' }
  ]
} */
```  

The field selector is particularly useful for letting application clients choose which fields of the resource they want returned. A query string parameter can be exposed for that purpose.

```
GET /users/1234?fields=name

{
  "name": "Michael Jackson"
}


GET /users/1234?fields=name,job

{
  "name": "Michael Jackson",
  "job": "musician"
}
```


#### createRemoteConfig

Creates a remote config loader that provides a config object obtained from a JSON in the given URL. It caches the config for a period of time that can be specified, then refreshes it after that time has elapsed since the last refresh.

```javascript
const tools = require('itaas-nodejs-tools');

let configUrl = 'http://config.com/my-config.json';
let refreshTimeSeconds = 60;

let configLoader = tools.createRemoteConfig(configUrl, refreshTimeSeconds);

configLoader.getConfigObject(context)
  .then((config) => {
    console.log('My config: ' + JSON.stringify(config));
  });
```

This function accepts these parameters:

| Parameter | Type | Required | Description | Default value |
|----------------------|---------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `url` | string | Yes | The URL where the config is located | - |
| `refreshTimeSeconds` | integer | No | The amount of seconds before the config cache is considered to be expired and a refresh is needed. If not specified, the config will only be retrieved once and will never be refreshed. | no refresh |

The config loader has a function `getConfigObject` that only receives a [context](#createcallcontext). It returns the config from the cache, but first refreshes the cache if the refresh time has elapsed.


#### cacheRemoteConfig

Creates a remote object loader that provides a object obtained from a JSON in the given URL. It caches the config for a period of time that can be specified, then refreshes it after that time has elapsed since the last refresh the object asynchronous.

```javascript
const tools = require('itaas-nodejs-tools');

let objectUrl = 'http://config.com/my-config.json';
let refreshTimeSeconds = 60;

let objectLoader = tools.cacheRemoteObject(objectUrl, refreshTimeSeconds);

objectLoader.getFresh(context)
  .then((remoteObject) => {
    console.log('My config: ' + JSON.stringify(remoteObject));
  });
```

This function accepts these parameters:

| Parameter | Type | Required | Description | Default value |
|----------------------|---------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| `url` | string | Yes | The URL where the object is located | - |
| `refreshTimeSeconds` | integer | No | The amount of seconds before the object cache is considered to be expired and a refresh is needed. If not specified, the config will only be retrieved once and will never be refreshed. | no refresh |

The Cache Object Remote has a function `getFresh` that only receives a [context](#createcallcontext). It returns a freshy object, and update the cache status, another function is `getCached`, that will return the cached object and check if a refresh is needed (if needed, runs the `refreshCache` assyncronous).

----

### Time services

The time services from iTaaS Node.js Tools are objects with a `getNow` parameterless function which returns a Javascript Date object.

You can easily replace a time service using a [service locator](#createservicelocator).

You can implement your own time services, but iTaaS Node.js Tools provides two simple ones for convenience.

#### `createFixedTimeService`
Creates a time service which always responds the specified date.
It is useful for testing applications with time-related rules, such as token expiration, resource expiration, date filters, etc.

```javascript
const tools = require('itaas-nodejs-tools');

let fixedTimeService = tools.createFixedTimeService(new Date('2016-06-27T04:54:32Z'));

let now = fixedTimeService.getNow();

console.log(now.toISOString());
// "2016-06-27T04:54:32Z"
```

#### `createCurrentTimeService`
Creates a time service which responds the current date.

```javascript
const tools = require('itaas-nodejs-tools');

let currentTimeService = tools.createCurrentTimeService();

let now = currentTimeService.getNow();

console.log(now.toISOString());
// <current date in ISO-8601 format>
```

----

### `number`

Under `number`, there are some handy functions for interpreting numbers, which sometimes reach the application as strings.

#### `number.isInt32`

Returns `true` if the parameter is a 32-bit integer or a string that can be parsed into a 32-bit integer, `false` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.number.isInt32(-2147483648)); // true
console.log(tools.number.isInt32('10'));        // true

console.log(tools.number.isInt32('eleven'));    // false
console.log(tools.number.isInt32(1.2));         // false
```

#### `number.parseInt32`

Returns the integer value of the parameter if it's acceptable by `isInt32`, throws an `Error` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.number.parseInt32('10'));     // 10

tools.number.parseInt32('eleven'); // Error!
```

#### `number.isFloat`

Returns `true` if the parameter is a single-precision floating point number or a string that can be parsed into a single-precision floating point number, `false` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.number.isFloat('10'));      // true
console.log(tools.number.isFloat('1.2'));     // true

console.log(tools.number.isFloat('eleven'));  // false
```

#### `number.parseFloat`

Returns the float value of the parameter if it's acceptable by `isFloat`, throws an `Error` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.number.parseFloat('1.2'));    // 1,2

tools.number.parseFloat('eleven'); // Error!
```

----

### `uuid`

Under `uuid`, there are UUID validation functions.

#### `uuid.isUuid`

Returns `true` if the string is a valid UUID, `false` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.uuid.isUuid('6423df02-340c-11e6-ac61-9e71128cae77')); // true

console.log(tools.uuid.isUuid(null));                                   // false
console.log(tools.uuid.isUuid('this is not a UUID'));                   // false
console.log(tools.uuid.isUuid('6423df02340c11e6ac619e71128cae77'));     // false
```

----

### `date`

Under `date`, there are some handy functions for interpreting dates, which often reach the application as strings.

**Important**: these functions only accept the [ISO 8601] format and use [Moment](https://github.com/moment/moment) strictly to validate and parse dates in that format.

#### `date.isDate`

Returns `true` if the parameter is a valid Javascript `Date` object or a string in ISO 8601 date format, `false` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.date.isDate(new Date()));             // true
console.log(tools.date.isDate('2016-06-24T23:56:37Z')); // true
console.log(tools.date.isDate('2016-06-24 23:56'));     // true
console.log(tools.date.isDate('2016-06-24'));           // true

console.log(tools.date.isDate(new Date('random')));     // false
console.log(tools.date.isDate(null))                    // false
console.log(tools.date.isDate('24/06/2016 23:56:37'));  // false
console.log(tools.date.isDate('2016-24-06'));           // false
```

#### `date.parseDate`

Returns a Javascript `Date` object equivalent to the parameter if it's acceptable by `isDate`, throws an `Error` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

let date = tools.date.parseDate('2016-06-24 23:56');
console.log(date.toISOString());    // 2016-06-24T23:56:00.000Z

tools.date.parseDate('2016-24-06'); // Error!
tools.date.parseDate(null);         // Error!
```

----
### `httpStatus`

Under `httpStatus`, there are some functions that validates Http Statuses.

#### `httpStatus.isHttpStatus`

Returns `true` if the passed `status` a valid http status (between 100 and 599). Returns `false` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.httpStatus.getClass('100')); // true
console.log(tools.httpStatus.getClass('200')); // true
console.log(tools.httpStatus.getClass('404')); // true
console.log(tools.httpStatus.getClass('451')); // true
console.log(tools.httpStatus.getClass('599')); // true

console.log(tools.httpStatus.getClass(200));   // true
console.log(tools.httpStatus.getClass(404));   // true

console.log(tools.httpStatus.getClass(0));     // false
console.log(tools.httpStatus.getClass('1'));   // false 
console.log(tools.httpStatus.getClass('a'));   // false 
console.log(tools.httpStatus.getClass('600')); // false 
```

#### `httpStatus.getClass`

Returns http status type of the passed `status` if it is a valid integer and is a valid http status (between 100 and 599). Throws an `Error` otherwise.

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.httpStatus.getClass('100')); // 1 
console.log(tools.httpStatus.getClass('200')); // 2
console.log(tools.httpStatus.getClass('404')); // 4
console.log(tools.httpStatus.getClass('451')); // 4
console.log(tools.httpStatus.getClass('599')); // 5

console.log(tools.httpStatus.getClass(200));   // 2
console.log(tools.httpStatus.getClass(404));   // 4

console.log(tools.httpStatus.getClass(0));     // Error! 
console.log(tools.httpStatus.getClass('1'));   // Error! 
console.log(tools.httpStatus.getClass('a'));   // Error! 
console.log(tools.httpStatus.getClass('600')); // Error! 
```

#### `httpStatus.isClientError`

If is a valid http status, returns `true` if the http status is 4xx, and `false` otherwise. If is not a valid http status, throws an `Error` (see [httpStatus.getClass](#httpstatusgetclass))

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.httpStatus.isClientError('100')); // false
console.log(tools.httpStatus.isClientError('200')); // false

console.log(tools.httpStatus.isClientError('404')); // true
console.log(tools.httpStatus.isClientError('451')); // true

console.log(tools.httpStatus.isClientError('599')); // false

console.log(tools.httpStatus.isClientError(200));   // false
console.log(tools.httpStatus.isClientError(404));   // true

console.log(tools.httpStatus.isClientError(0));     // Error! 
console.log(tools.httpStatus.isClientError('1'));   // Error! 
console.log(tools.httpStatus.isClientError('a'));   // Error! 
console.log(tools.httpStatus.isClientError('600')); // Error! 
```

#### `httpStatus.isServerError`

If is a valid http status, returns `true` if the http status is 5xx, and `false` otherwise. If is not a valid http status, throws an `Error` (see [httpStatus.getClass](#httpstatusgetclass))

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.httpStatus.isServerError('100')); // false
console.log(tools.httpStatus.isServerError('200')); // false

console.log(tools.httpStatus.isServerError('404')); // false

console.log(tools.httpStatus.isServerError('500')); // true
console.log(tools.httpStatus.isServerError('599')); // true

console.log(tools.httpStatus.isServerError(200));   // false
console.log(tools.httpStatus.isServerError(503));   // true

console.log(tools.httpStatus.isServerError(0));     // Error! 
console.log(tools.httpStatus.isServerError('1'));   // Error! 
console.log(tools.httpStatus.isServerError('a'));   // Error! 
console.log(tools.httpStatus.isServerError('600')); // Error! 
```

#### `httpStatus.isHttpError`

If is a valid http status, returns `true` if the http status is 4xx or 5xx, and `false` otherwise. If is not a valid http status, throws an `Error` (see [httpStatus.getClass](#httpstatusgetclass))

```javascript
const tools = require('itaas-nodejs-tools');

console.log(tools.httpStatus.isHttpError('100')); // false
console.log(tools.httpStatus.isHttpError('200')); // false

console.log(tools.httpStatus.isHttpError('400')); // true
console.log(tools.httpStatus.isHttpError('404')); // true
console.log(tools.httpStatus.isHttpError('500')); // true
console.log(tools.httpStatus.isHttpError('599')); // true

console.log(tools.httpStatus.isHttpError(200));   // false
console.log(tools.httpStatus.isHttpError(404));   // true
console.log(tools.httpStatus.isHttpError(503));   // true

console.log(tools.httpStatus.isHttpError(0));     // Error! 
console.log(tools.httpStatus.isHttpError('1'));   // Error! 
console.log(tools.httpStatus.isHttpError('a'));   // Error! 
console.log(tools.httpStatus.isHttpError('600')); // Error! 
```

## `express`

This section contains middlewares for APIs built on top of [Express](https://github.com/expressjs/express), one of the most popular web frameworks for Node.js.

### `express.createCallContextMiddleware`

Returns an Express middleware that creates a [call context](#createcallcontext) for each request received.

In order to make the context available to other middlewares and to all routes, this should be the first middleware in the middleware stack and it should be applied globally, not just to a path.

This function accepts these parameters:

| Parameter | Type | Required | Description | Default value |
|-----------|------|----------|-------------|---------------|
| `config` | object | Yes | An object containing the application configuration | - |
| `logger` | logger | Yes | A logger created by [createLogger](#createlogger) for the application. | - |
| `serviceLocator` | service locator | Yes | A service locator created by [createServiceLocator](#createservicelocator) | - |
| `setContext` | function | Yes | Function that will store the context somewhere of your choice. It must have 3 parameters: the first is the `req` from Express, the second is `res`, and the third is the context. We recommend placing the context inside the `res.locals` object. | - |

The context call ID is automatically extracted from the HTTP header `uux-call-context-id` if it exists. If it doesn't, a random UUID is generated for it.

The logger inside each context created by this middleware is a child of the logger specified in the parameters. Each child logs the respective call ID automatically to make it easier to track log messages from each request.

```javascript
const express = require('express');
const tools = require('itaas-nodejs-tools');

let app = express();

let logger = tools.createLogger(/* ... */);
let serviceLocator = tools.createServiceLocator();

let contextMiddleware = tools.express.createCallContextMiddleware(
  config,
  logger,
  serviceLocator,
  (req, res, context) => { res.locals.context = context; }));

app.use(contextMiddleware);

// all other middlewares and routes
```

### `express.createMorganMiddleware`

Returns an Express middleware that logs formatted HTTP request information at `info` level. It uses [Morgan](https://github.com/expressjs/morgan) to generate the formatted log message, but still uses the [Bunyan](https://github.com/trentm/node-bunyan) logger for the actual logging.

This function accepts these parameters:

| Parameter | Type | Required | Description | Default value |
|-----------|------|----------|-------------|---------------|
| `getLogger` | function | Yes | Function that returns the logger to be used. It can have 2 parameters: the first is the `req` from Express, the second is `res`. If the [call context middleware] is also being used, this function should return the logger within the context. | - |
| `format` | string | No | The format to use for the HTTP requests log messages. It must be one of the [predefined formats from Morgan](https://github.com/expressjs/morgan#predefined-formats) | `combined` |

```javascript
const tools = require('itaas-nodejs-tools');

let morganMiddleware = tools.express.createMorganMiddleware(
  (req, res) => res.locals.context.logger, 'common');

app.use(morganMiddleware);
```

Example of logged HTTP request (`common` format):
```
127.0.0.1 xyz - [01/Feb/1998:01:08:39 -0800] "GET /bannerad/ad.htm HTTP/1.0" 200 198
```

### `express.createLowercaseQueryMiddleware`

Returns an Express middleware that changes all incoming query string parameter names to lowercase. The query string is case sensitive by standard, but case insensitivy is necessary for some APIs.

```javascript
const tools = require('itaas-nodejs-tools');

let lowercaseQueryMiddleware = tools.express.createLowercaseQueryMiddleware();

app.use(lowercaseQueryMiddleware);
```

*Example*

```javascript
GET www.myapi.com/users?Name=john&ORDER=age

function(req, res, next) {
  // using lowercase query string names
  console.log(req.param.name); // "john"
  console.log(req.param.order); // "age"
}
```

### `express.createTrimQueryValueMiddleware`

Returns an Express middleware that removes all white space from the start and end of query string parameter values.

The middleware uses Javascript's `String.prototype.trim` on each value of query string parameters.

```javascript
const tools = require('itaas-nodejs-tools');

let trimQueryStringValueMiddleware = tools.express.createTrimQueryValueMiddleware();

app.use(trimQueryStringValueMiddleware);
```

----

## `promise `

Under `promise`, there are some useful extensions to the standard `Promise` API from Node.js.

### `promise.any`

Returns a `Promise` that resolves as soon as one of the promises resolves, or rejects if all promises reject.

The resolution value of `promise.any` is the value returned by the promise that resolved. The rejection value of `promise.any` is an array of the caught errors from each promise.

> **Note:** The errors aren't guaranteed to be in the same order as their respective promises.

```javascript
const tools = require('itaas-nodejs-tools');

let promise1 = getUrl('http://www.google.com');
let promise2 = getUrl('http://www.github.com');
let promise3 = getUrl('http://www.npmjs.com');

tools.promise.any([promise1, promise2, promise3])
  .then((response) => {
    console.log('One of the URLs responded!');
  })
  .catch((errors) => {
    console.log('No URLs responded!');
    for (let error of errors) {
      console.log(error.message);
    }
  });
```

----

## Commands

iTaaS Node.js Tools also include command line tools for common tasks.
The commands can only be executed within npm scripts.

### `license`

Validates the licenses of the whole dependency tree of the package and generates a third party license compilation file with all packages and their respective licenses.

This command accepts these parameters:

| Parameter | Type | Required | Description | Default value |
|--------------|--------|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `--config` | string | No | The path of the third party license configuration file | `.license-config` |
| `--header` | string | Yes (can be specified in the config file) | A header to be added to the beginning of the third party licenses file | - |
| `--allow` | string | Yes (can be specified in the config file) | Comma separated list of allowed license names. An error occurs if there is any dependency with a license which is not in this list. | - |
| `--file` | string | Yes (can be specified in the config file) | Name of the file to be generated with the compilation of dependency licenses | - |
| `--skipPrefix` | string | Yes (can be specified in the config file) | The prefix of package names that must not be validated or included in the compilation file. This should be the name of the package using the `license` command. | - |

The parameters can also be defined in a JSON in a configuration file. By default, a file named `.license-config` is expected in the root directory of the package.

The JSON should contain these properties:

| Parameter | Type | Required | Description | Default value |
|--------------|--------|-------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|
| `header` | string | Yes | A header to be added to the beginning of the third party licenses file | - |
| `allowedLicenseList` | array of strings | Yes | List of allowed license names. An error occurs if there is any dependency with a license which is not in this list. | - |
| `file` | string | Yes | Name of the file to be generated with the compilation of dependency licenses | - |
| `skipPrefix` | string | Yes | The prefix of package names that must not be validated or included in the compilation file. This should be the name of the package using the `license` command. | - |

#### Examples

*Using inline parameters*
```
$ license \
  --header="3RD PARTY LICENSES"
  --allow=MIT,ISC,GPL,Apache-2.0
  --file="3RD-PARTY-LICENSES"
  --skipPrefix=my-project
```

*Using configuration file with default name*

File: `./.license-config`
```json
{
  "header": "3RD PARTY LICENSES",
  "allowedLicenseList": [ "MIT", "ISC", "GPL", "Apache-2.0" ],
  "file": "3RD-PARTY-LICENSES",
  "skipPrefix": "my-project"
}
```
```
$ license
```

*USing configuration file with different name*

File: `./license-config-tools.json`
```
$ license --config ./license-config-tools.json
```
