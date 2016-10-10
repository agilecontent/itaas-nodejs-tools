# Itaas Node.js tools

## List of contents
---------------------
   
 * [Introduction](#introduction)
 * [Developers! Read it before everything explodes](#developers-read-it-before-everything-explodes)
 * [API Tools](#api-tools)
   * [createLogger](#createlogger)
   * [createCallContext](#createcallcontext)
   * [createServiceLocator](#createservicelocator)
   * [createFieldSelector](#createfieldselector)
   * [createBaseResponse](#createbaseresponse)
   * [createFixedTimeService](#createfixedtimeservice)
   * [createCurrentTimeService](#createcurrenttimeservice)
   * [number](#number)
   * [uuid](#uuid)
   * [date](#date)
   * [express.createCallContextMiddleware](#expresscreatecallcontextmiddleware)
   * [express.createMorganMiddleware](#expresscreatemorganmiddleware)
   * [express.createLowercaseQueryMiddleware](#expresscreatelowercasequerymiddleware)
   * [express.createTrimQueryValueMiddleware](#expresscreatetrimqueryvaluemiddleware)
   * [promise.any](#promiseany)
   * [cassandra.cql](#cassandracql)
   * [cassandra.createBatchQueryBuilder](#cassandracreatebatchquerybuilder)
   * [cassandra.converter.map](#cassandraconvertermap)
   * [cassandra.converter.uuid](#cassandraconverteruuid)

---------------------

## Introduction
This module should be used in ITaaS projects in order to simplify common things:

You should only install and use it.
```bash
$ npm install https://github.com/UUX-Brasil/itaas-nodejs-tools.git#master --save
```

## Developers! Read it before everything explodes 

This library have some rules:
- **Freedom**: Everyone is free to pull request
- **Dependencies**: Only really important things should be here. Don't use it to add more dependencies to your project. Useless dependencies are not fun!
- **Test**: You also are responsible for testing everything. Currently we have 100% of code coverage. Do not think to PR here if coverage will be less than it 
- **Documentation**: Keep the documentation updated and in English

To contribute, clone this project and procedure with known commands:
```bash
$ npm clone (this github repository URL)
$ cd itaas-nodejs-tools
$ npm install
```

By default, tests will run assuming there is a Cassandra in localhost (127.0.0.1). 
Anyway, you can set environment variable `TEST_CASSANDRA_ENDPOINT` to desired Cassandra endpoint.
> **Tip:** If you want to run a Cassandra endpoint using docker, use following command:
> ```bash
> $ docker run -p 9042:9042 --name DB -d cassandra:2.2.5
> ```

## API Tools

### createLogger
This method create a Bunyan logger.
All options should be send inside an object sent on createLogger method:

| Property     | Possible Value                                       | Default Value                        |
| ------------ | ---------------------------------------------------- | ------------------------------------ |
| name         | (string)                                             | 'app log name'                       |
| logLevels    | 'fatal' , 'error' , 'warn', 'info', 'debug', 'trace' | [ 'fatal', 'error', 'warn', 'info' ] |
| logOutput    | 'rotating-file' , 'standard-streams'                 | 'standard-streams'                   |
| logDirectory | (string)                                             | './logs/test-log-dir'                |

```javascript
const tools = require('itaas-nodejs-tools');
let name = 'app log name'
let levels = ['fatal', 'error', 'warn']
let output = 'rotating-file'
let directory = './logs/test-log-dir'

let logger = tools.createLogger({
  name: name
  logLevels: levels,
  logOutput: output,
  logDirectory: directory
});
```

### createServiceLocator
Service Locator is our dependency injection tool. The main function is allow you to implement inversion of control for resolving dependencies. 

```javascript
class MyClass{
  myMethod(){
    return true;
  }
}

const tools = require('itaas-nodejs-tools');
let serviceLocator = tools.createServiceLocator();

serviceLocator.addService('my-service', new MyClass());

console.log(serviceLocator.getService('my-service-type').myMethod());
// Console: true
```

### createCallContext
Call Context is one of the most important concepts on ITaaS components. 
A Call Context concentrates the useful things in a call. It receives:

| Parameter      | Mandatory | Definition                                                                               |
| -------------- | --------- | ---------------------------------------------------------------------------------------- |
| callId         | true      | a unique id to call                                                                      |
| config         | true      | your app configurations.                                                                 |
| logger         | true      | your app logger. Also check [createLogger](#createlogger)                                |
| serviceLocator | true      | your dependency injection tool. Also check [createServiceLocator](#createservicelocator) |

```javascript
const tools = require('itaas-nodejs-tools');
const uuid = require('uuid').v4;

let callId = uuid();
let config = { key: "value" };
let logger = tools.createLogger();
let serviceLocator = tools.createServiceLocator();
let context = tools.createCallContext(callId, config, logger, serviceLocator);
```

### createFieldSelector
This is a tool to clean object in order to select only desired fields. It is really useful to return only desired values

```javascript
const tools = require('itaas-nodejs-tools');
let source = {
  name: 'Don Vito Corleone',
  age: 53,
  address: {
    city: 'His City',
    state: 'HC',
    street: { name: 'His Street', postalCode: '57230489' }
  },
  actors: [
    { name: 'Robert De Niro', startAge: 25, endAge: 31 },
    { name: 'Marlon Brando', startAge: 53, endAge: 63 }
  ]
};

let selector = tools.createFieldSelector('address.city,actors');
let selection = selector.select(source); 

/* *********************
 * Result
 * *********************
{
  address: {
    city: 'His City'
  },
  actors: [
    { name: 'Robert De Niro', startAge: 25, endAge: 31 },
    { name: 'Marlon Brando', startAge: 53, endAge: 63 }
  ]
}
 * *********************/
```

### createBaseResponse
This class should be used to return all responses. Please does not change/add any attribute from it. This will allow the build from typed languages clients easier

| Property     | Mandatory | Definition                               |
| ------------ | --------- | ---------------------------------------- |
| status       | true      | Mnemonic Message.                        |
| message      | true      | Descritive message.                      |
| result       | false     | Result from call. It should be an object |
| error        | false     | Error from call. It should be an object  |

```javascript
const tools = require('itaas-nodejs-tools');
let response = tools.createBaseResponse('MNEMONIC_MESSAGE', 'Descritive message from result', { a: 1, b: 2 });

/* *********************
 * Result
 * *********************
{
  'status' : 'MNEMONIC_MESSAGE',
  'message' : 'Descritive message from result',
  'result' : { a: 1, b: 2 },
  'error' : undefined
} 
 * *********************/
```

### createFixedTimeService
It creates a service which responds a fixed date

```javascript
const tools = require('itaas-nodejs-tools');
let fixedDate = new Date('2016-06-27 04:54:32Z');
let fixedTimeService = tools.createFixedTimeService(fixedDate);
console.log(fixedTimeService.getNow());

/* *********************
 * Result : '2016-06-27 04:54:32Z' (as date)
 * *********************/
```

### createCurrentTimeService
It creates a service which responds the current date

```javascript
const tools = require('itaas-nodejs-tools');
tools.createCurrentTimeService();
console.log(fixedTimeService.getNow());

/* *********************
 * Result : current date
 * *********************/
```

### number
It is a handy number helper. You can parse and validate.

Parsing

```javascript
const tools = require('itaas-nodejs-tools');
tools.number.parseInt32('-2147483648');
// Result :  -2147483648

tools.number.parseInt32('a');
// Result :  throws Exception
```
Validating

```javascript
const tools = require('itaas-nodejs-tools');
tools.number.isInt32('-2147483648')
// Result :  true

tools.number.isInt32('a');
// Result :  false
tools.number.isInt32('1.2');
// Result :  false
```

### uuid
It is a handy uuid helper. You can validate.

```javascript
const tools = require('itaas-nodejs-tools');
tools.uuid.isUuid('6423df02-340c-11e6-ac61-9e71128cae77')
// Result :  true

tools.uuid.isUuid(undefined);
// Result :  false
tools.uuid.isUuid('50e65cab-5229-4612-957b-4ea59851ecbaaaaaaaasdasdasdsa');
// Result :  false
```

### date
It is a handy date helper. You can parse and validate.

Parsing

```javascript
const tools = require('itaas-nodejs-tools');

tools.date.parseDate('2016-06-24 23:56');
// Result: 2016-06-24 23:56 as date

tools.date.parseDate('2016-24-06');
// Result: throws Exception
tools.date.parseDate(undefined);
// Result: throws Exception
```

Validating

```javascript
const tools = require('itaas-nodejs-tools');

tools.date.isDate('2016-06-24 23:56');
// Result: true

tools.date.isDate('2016-24-06');
// Result: false
tools.date.isDate(undefined);
// Result: false
```

## API Tools - Express

### express.createCallContextMiddleware
This Middleware creates a default CallContext from the current call. 
It by default checks if there is a call id on header, if not creates a new one. 
It also creates a child log.

| Property       | Mandatory | Definition                                                                                                           |
| -------------- | --------- | -------------------------------------------------------------------------------------------------------------------- |
| config         | true      | Your configuration object                                                                                                   |
| logger         | true      | Bunyan logger. Also check [createLogger](#createlogger)                                                              |
| serviceLocator | true      | Dependency Injection class. Also check [createServiceLocator](#createservicelocator)                                 |
| setContext     | true      | Method to set new Call Context. Express recomends usage of [res.locals](http://expressjs.com/en/api.html#res.locals) |

```javascript
const tools = require('itaas-nodejs-tools');
tools.express.createCallContextMiddleware(
        app.locals.config,
        app.locals.logger,
        app.locals.serviceLocator,
        (req, res, context) => { res.locals.context = context; }));
```

### express.createMorganMiddleware
[Morgan](https://github.com/expressjs/morgan) is a HTTP request logger middleware. 
But as we use a custom logger ([Bunyan](https://github.com/trentm/node-bunyan)), we have wrapped the Morgan and we use it only for get HTTP request. 
Using express.createMorganMiddleware it records HTTP request and logs in Bunyan info       

| Property       | Mandatory | Definition                                                                                                                |
| -------------- | --------- | ------------------------------------------------------------------------------------------------------------------------- |
| getLogger      | true      | Function to get correct logger                                                                                            |
| format         | true      | Desired Morgan format. Check available formats on [Morgan Github](https://github.com/expressjs/morgan#predefined-formats) |

```javascript
const tools = require('itaas-nodejs-tools');
app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger, 'common'));
```

### express.createLowercaseQueryMiddleware
Express is query case-sensitive. In order to avoid it, this middleware changes all query parameters to lowercase. 
E.g.: www.myapi.com/contents?Query1=x&queryTwo=y. It will be available to controllers the query 'query1' and 'querytwo'. 

```javascript
const tools = require('itaas-nodejs-tools');
app.use(tools.express.createLowercaseQueryMiddleware());
```

### express.createTrimQueryValueMiddleware
This middleware remove start and end space characters from queryString values. 

```javascript
const tools = require('itaas-nodejs-tools');
app.use(tools.express.createTrimQueryValueMiddleware());
```

## API Tools - Promise 
### promise.any
Promise.then will be executed if any function run successfully. 
If none catch block will be called.

```javascript
const tools = require('itaas-nodejs-tools');
let promise1 = Promise.resolve(1);
let promise2 = Promise.resolve(2);
let promise3 = Promise.resolve(3);

tools.promise.any([promise1, promise2, promise3])
  .then(myFunction);
```

## API Tools - Cassandra

### cassandra.cql
It is a helper class which specify a little more the result from 'execute' function from Cassandra driver  

#### canConnect() 
Check if there is a connection between your client and a Cassandra database. It does not check if keyspace was created.

| Property       | Mandatory | Definition                                                                                                                       |
| -------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| callContext    | true      | Call Context. Also check [callContext](#createCallContext)                                                                       | 
| cassandraClient| true      | Your Cassandra Client. It must be one for application. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)  |                 

```javascript
const tools = require('itaas-nodejs-tools');

let cassandraClient = yourCassandraClient; 
let queryRunner = tools.cassandra.cql;
let canConnect = queryRunner.canConnect(callContext, cassandraClient)
// If could connect, canConnect = true
```

#### executeQuery() 
Execute a query (SELECT) on Cassandra. It returns an array with result

| Property        | Mandatory | Definition                                                                                                                        |
| --------------  | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| callContext     | true      | Call Context. Also check [callContext](#createCallContext)                                                                        |
| cassandraClient | true      | Your Cassandra Client. It must be one for application. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)   |
| cql             | true      | Desired query to be executed. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)                            |
| parameters      | false     | Key-value pair object containing parameters from query. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)  |
| routingNameArray| false     | Array of Routing Names. Also check [Routing Queries](https://docs.datastax.com/en/developer/nodejs-driver/3.0/nodejs-driver/reference/routingQueries.html) |

```javascript
const tools = require('itaas-nodejs-tools');

let cassandraClient = yourCassandraClient; 
let cql = 'SELECT * FROM testtable where testid = :id;';
let parameters = { id: '5' };
let queryRunner = tools.cassandra.cql;
queryRunner.executeQuery(callContext, cassandraClient, cql, parameters);

/* *********************
 * Result
 * *********************
[
  {
    'testid': '5',
    'value': 'my-value5'
  }
]
 * *********************/
```

#### executeNonQuery() 
Execute a NonQuery (E.g.: INSERT, DELETE) on Cassandra. It returns a boolean with the result.
It also check result in case of "IF EXISTS / IF NOT EXISTS" clause to return correct boolean.

| Property        | Mandatory | Definition                                                                                                                        |
| --------------  | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| callContext     | true      | Call Context. Also check [callContext](#createCallContext)                                                                        |
| cassandraClient | true      | Your Cassandra Client. It must be one for application. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)   |
| cql             | true      | Desired query to be executed. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)                            |
| parameters      | false     | Key-value pair object containing parameters from query. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)  |
| routingNameArray| false     | Array of Routing Names. Also check [Routing Queries](https://docs.datastax.com/en/developer/nodejs-driver/3.0/nodejs-driver/reference/routingQueries.html)|

```javascript
const tools = require('itaas-nodejs-tools');

let cassandraClient = yourCassandraClient;
let cql = 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value5\');';
let parameters = { id: '5' };
let queryRunner = tools.cassandra.cql;
queryRunner.executeNonQuery(callContext, cassandraClient, cql, parameters)
if(!result){
  throw new Error('Insert was not executed successfully');
}
/* Insert done*/
```

#### executeBatch() 
A batch statement on Cassandra combines more than one DML statement (INSERT, UPDATE, DELETE) into a single logical operation. 
For further information, check [Cassandra Batch Page](https://docs.datastax.com/en/cql/3.3/cql/cql_reference/batch_r.html).
This method executes batch statement.

| Property        | Mandatory | Definition                                                                                                                             |
| --------------  | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| callContext     | true      | Call Context. Also check [callContext](#createCallContext)                                                                             |
| cassandraClient | true      | Your Cassandra Client. It must be one for application. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)        |
| builderQueries  | true      | Key-value pair object containing query and parameters. To make it easier check [Batch Query Buider](cassandra.createBatchQueryBuilder) |

```javascript
const tools = require('itaas-nodejs-tools');

let cassandraClient = yourCassandraClient;

let builder = tools.cassandra.createBatchQueryBuilder();
builder.add(
  'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value3\');',
  { id: '3' }
);
builder.add(
  'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value4\');',
  { id: '4' }
);

let queryRunner = tools.cassandra.cql;
queryRunner.executeBatch(callContext, cassandraClient, builder.getQueries())
```

### cassandra.createBatchQueryBuilder
To execute batch statement, Cassandra asks for a particular object format. 
To make it easier, use this method and insert new queries. 
After all, use getQueries() to generate desired object, sending it to [executeBatch()](#executeBatch)  

#### add
| Property        | Mandatory | Definition                                                                                                                        |
| --------------  | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| cql             | true      | Desired query to be executed. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)                            |
| parameters      | false     | Key-value pair object containing parameters from query. Also check [Cassandra Client](https://github.com/datastax/nodejs-driver)  |

#### getQueries
Generates object to batch statement (is the same as client.batch from 
[Datastax Cassandra Driver](https://docs.datastax.com/en/developer/nodejs-driver/3.0/nodejs-driver/reference/batchStatements.html))

```javascript
const tools = require('itaas-nodejs-tools');

let builder = tools.cassandra.createBatchQueryBuilder();
builder.add(
  'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value3\');',
  { id: '3' }
);
builder.add(
  'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value4\');',
  { id: '4' }
);

console.log(builder.getQueries());

/* *********************
 * Result
 * *********************
[
  {
    'query' : 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value3\');',
    'params' : { id: '3' }
  },
  {
    'query' : 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value4\');',
    'params' : { id: '4' }
  }
] 
 * *********************/
```

### cassandra.converter.map

#### mapToArray
Converts a Map to Array

```javascript
const tools = require('itaas-nodejs-tools');
let MapConverter = tools.cassandra.converter.map;

let map = {
  myId1: { myKey11: 'MyValue11', myKey12: 'MyValue12' },
  myId2: { myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
};
MapConverter.mapToArray(map, 'myId');

/* *********************
 * Result
 * *********************
[
  { myId: 'myId1', myKey11: 'MyValue11', myKey12: 'MyValue12' },
  { myId: 'myId2', myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
];
 * *********************/
```

#### arrayToMap
Converts an Array to Map

```javascript
const tools = require('itaas-nodejs-tools');
let MapConverter = tools.cassandra.converter.map;

let array = [
  { myId: 'myId1', myKey11: 'MyValue11', myKey12: 'MyValue12' },
  { myId: 'myId2', myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
];

let arrayToMapResult = MapConverter.arrayToMap(array, 'myId');

/* *********************
 * Result
 * *********************
{
  myId1: { myKey11: 'MyValue11', myKey12: 'MyValue12' },
  myId2: { myKey21: 'MyValue21', myKey22: 'MyValue22', myKey23: 'MyValue23' }
};
 * *********************/
```
### cassandra.converter.uuid
#### uuidToString
Converts an UUID to string

```javascript
const tools = require('itaas-nodejs-tools');
let UuidConverter = tools.cassandra.converter.uuid;

let uuidAsUuid = Uuid.fromString('47c7630c-a54f-4893-abd0-e5fe5ce9eaac');
let uuidResult = UuidConverter.uuidToString(uuidAsUuid);
// Result: '47c7630c-a54f-4893-abd0-e5fe5ce9eaac' as string
```

#### stringToUuid
Converts a string to UUID

```javascript
const tools = require('itaas-nodejs-tools');
let UuidConverter = tools.cassandra.converter.uuid;

let uuidResult = UuidConverter.stringToUuid('47c7630c-a54f-4893-abd0-e5fe5ce9eaac');
// Result: '47c7630c-a54f-4893-abd0-e5fe5ce9eaac' as UUID
```