# Itaas Node.js tools

## List of contents
---------------------
   
 * Introduction
 * Developers! Read it before everything explodes
 * Basic Tools
 * Helpers
 * Express tools
 * Promise
 * Cassandra

---------------------

## Introduction

This module should be used in every ITaaS module in order to make your work more simple :

The first step is install it.
After you need to import to your project

## Developers! Read it before everything explodes 

This library have some rules:
- **Freedom**: Everyone is free to pull request
- **Dependencies**: Only really important things should be here. Don't use it to add more dependencies to your project. Useless dependencies are not fun!
- **Test**: You also are responsible for test everything. Current we have 100% of code coverage. Do not think to PR here if coverage will be less than it 
- **Documentation**: Keep the documentation updated and in English

## Basic Tools

### Logger
All options should be send inside an object sent on createLogger method:

| Property     | Possible Value                                       | Default Value                        |
| ------------ | ---------------------------------------------------- | ------------------------------------ |
| name         | (string)                                               | 'app log name'                       |
| logLevels    | 'fatal' , 'error' , 'warn', 'info', 'debug', 'trace' | [ 'fatal', 'error', 'warn', 'info' ] |
| logOutput    | 'rotating-file' , 'standard-streams'                 | 'standard-streams'                   |
| logDirectory | (string)                                               | './logs/test-log-dir'                |

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

### Service Locator

```javascript
const tools = require('itaas-nodejs-tools');
let serviceLocator = tools.createServiceLocator();

// Add Service. It index by anything but we recommend a string value
serviceLocator.addService('my-service-type', 'my-service');

// Returns 'my-service'
serviceLocator.getService('my-service-type'); 
```

### Call Context

```javascript
const tools = require('itaas-nodejs-tools');
const uuid = require('uuid').v4;

let callId = uuid();
let config = '{ key: "value" }';
let logger = tools.createLogger();
let serviceLocator = tools.createServiceLocator();
let context = tools.createCallContext(callId, config, logger, serviceLocator);
```

### Create Field Selector
This is a tool to clean object in order to select only desired fields 
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

### Create Base Response
This class should be used to return all responses. Please does not change/add any attribute from it. This will allow the build from typed languages clients easier

| Property     | Mandatory |
| ------------ | --------- |
| status       | true      |
| message      | true      |
| result       | false     |
| error        | false     |


```javascript
const tools = require('itaas-nodejs-tools');
let response = tools.createBaseResponse('MNEMONIC_MESSAGE', 'Descritive message from result', { a: 1, b: 2 });
/* *********************
 * Result
 * *********************
{
  'status' : 'MNEMONIC_MESSAGE (Mandatory)',
  'message' : 'Descritive message from result',
  'result' : { a: 1, b: 2 },
  'error' : undefined
} 
 * *********************/
```

### Fixed Time Service
To allow tests, it creates a fixed time 
```javascript
const tools = require('itaas-nodejs-tools');
let fixedDate = new Date('2016-06-27 04:54:32Z');
let fixedTimeService = tools.createFixedTimeService(fixedDate);
console.log(fixedTimeService.getNow());
/* *********************
 * Result : '2016-06-27 04:54:32Z' (as date)
 * *********************/
```

### Current Time Service
To allow tests, it creates a fixed time

```javascript
const tools = require('itaas-nodejs-tools');
tools.createCurrentTimeService();
console.log(fixedTimeService.getNow());
/* *********************
 * Result : current date
 * *********************/
```

## Helpers
### Number
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

### UUID (GUID)
```javascript
const tools = require('itaas-nodejs-tools');
tools.uuid.isUuid('6423df02-340c-11e6-ac61-9e71128cae77')
// Result :  true

tools.uuid.isUuid(undefined);
// Result :  false
tools.uuid.isUuid('50e65cab-5229-4612-957b-4ea59851ecbaaaaaaaasdasdasdsa');
// Result :  false
```

### Date
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

## Express Tools
### Call Context Middleware
```javascript
const tools = require('itaas-nodejs-tools');
tools.express.createCallContextMiddleware(
        app.locals.config,
        app.locals.logger,
        app.locals.serviceLocator,
        (req, res, context) => { res.locals.context = context; }));
```

### Morgan Middleware
```javascript
const tools = require('itaas-nodejs-tools');
app.use(tools.express.createMorganMiddleware(
        (req, res) => res.locals.context.logger, 'common'));
```

### Lower case query Middleware
```javascript
const tools = require('itaas-nodejs-tools');
tools.express.createLowercaseQueryMiddleware()
```

## Promise Tools

### Promise.any
```javascript
const tools = require('itaas-nodejs-tools');
let promise1 = Promise.resolve(1);
let promise2 = Promise.resolve(2);
let promise3 = Promise.resolve(3);

tools.promise.any([promise1, promise2, promise3])
  .then(myFunction);
```

## Cassandra Tools

### CQL Helper Methods

#### canConnect() 
```javascript
const tools = require('itaas-nodejs-tools');

let cassandraClient; // = you will need to create a cassandra client. It must be one for application
let queryRunner = tools.cassandra.cql;
let canConnect = queryRunner.canConnect(callContext, cassandraClient)
// If could connect, canConnect = true
```

#### executeQuery() 
```javascript
const tools = require('itaas-nodejs-tools');

let cassandraClient; // = you will need to create a cassandra client. It must be one for application
let cql = 'INSERT INTO testtable (testid, value) VALUES (:id, \'my-value5\');';
let param = { id: '5' };
let queryRunner = tools.cassandra.cql;
queryRunner.executeNonQuery(callContext, cassandraClient, cql, param)
if(result){ /* Insert done*/ }
```

#### executeNonQuery() 
```javascript
const tools = require('itaas-nodejs-tools');

let cassandraClient; // = you will need to create a cassandra client. It must be one for application
let cql = 'SELECT * FROM testtable where testid = :id;';
let param = { id: '5' };
let queryRunner = tools.cassandra.cql;
queryRunner.executeQuery(callContext, cassandraClient, cql, param);
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

#### executeBatch() 
```javascript
const tools = require('itaas-nodejs-tools');

let cassandraClient; // = you will need to create a cassandra client. It must be one for application

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

### Batch Query Builder
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

### Map Converter
Map -> Array
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

Array -> Map
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
### UUID Converter
```javascript
const tools = require('itaas-nodejs-tools');
let UuidConverter = tools.cassandra.converter.uuid;

let uuidAsUuid = Uuid.fromString('47c7630c-a54f-4893-abd0-e5fe5ce9eaac');
let uuidResult = UuidConverter.uuidToString(uuidAsUuid);
// Result: '47c7630c-a54f-4893-abd0-e5fe5ce9eaac' as string

let uuidResult = UuidConverter.stringToUuid('47c7630c-a54f-4893-abd0-e5fe5ce9eaac');
// Result: '47c7630c-a54f-4893-abd0-e5fe5ce9eaac' as UUID
```