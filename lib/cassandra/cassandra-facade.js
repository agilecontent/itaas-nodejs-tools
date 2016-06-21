'use strict';

const cassandra = require('cassandra-driver');

let client;

class CassandraFacade {
  canConnect(callContext) {
    return this.executeQuery(
      callContext, 'SELECT now() FROM system.local;', [])
      .then((result) => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  executeScalar(callContext, cql, parameters) {
    let result = this.executeQuery(callContext, cql, parameters)
      .then(rows => rows[0]);
    return result;
  }

  executeQuery(callContext, cql, parameters, routingNameArray) {
    let queryParameters =
      {
        routingNames: routingNameArray,
        prepare: true
      };
    return new Promise(function (resolve, reject) {
      client.execute(cql, parameters, queryParameters, function (err, result) {
        if (err) {
          callContext.logger.error(generateQueryLogError(cql, parameters, err));
          reject(err);
        } else {
          let items = [];
          for (let i = 0; i < result.rows.length; i++)
            items.push(result.rows[i]);
          resolve(items);
        }
      });
    });
  }

  executeNonQuery(callContext, cql, parameters, routingNameArray) {
    let queryParameters =
      {
        routingNames: routingNameArray,
        prepare: true
      };
    return new Promise(function (resolve, reject) {
      client.execute(cql, parameters, queryParameters, function (err) {
        if (err) {
          callContext.logger.error(generateQueryLogError(cql, parameters, err));
          reject(err);
        }
        resolve(true);
      });
    });
  }

  executeBatch(callContext, builderQueries) {
    return new Promise(function (resolve, reject) {
      client.batch(builderQueries, { prepare: true }, function (err) {
        if (err) {
          callContext.logger.error(generateBatchQueryLogError(builderQueries, err));
          reject(err);
        }
        resolve(true);
      });
    });
  }
}

function generateBatchQueryLogError(preparatorQueries, err) {
  let errorLog =
    {
      queries: preparatorQueries,
      err: err
    };
  return errorLog;
}

function generateQueryLogError(cql, parameters, err) {
  let errorLog =
    {
      query: cql,
      parameters: parameters,
      err: err
    };
  return errorLog;
}

module.exports.createFacade = (opts) => {
  //opts.contactPoints
  //opts.keyspace
  //opts.cassandraUser
  //opts.cassandraPassword
  //opts.enableLogs
  //opts.timeout
  //opts.log (function)

  //Unique client
  if (!client) {
    let socketOptions = undefined;

    if (opts.timeout !== undefined) {
      socketOptions = {
        connectTimeout: opts.timeout
      };
    }

    client = new cassandra.Client(
      {
        contactPoints: opts.contactPoints,
        keyspace: opts.keyspace,
        authProvider: new cassandra.auth.PlainTextAuthProvider(opts.cassandraUser, opts.cassandraPassword),
        socketOptions: socketOptions
      });

    if (opts.log) {
      if (typeof opts.log !== 'function') {
        throw new Error('onLog should be a function');
      }
      
      client.on('log', function (level, className, message, furtherInfo) {
        opts.log({
          type: 'cassandra-client',
          msg: message,
          level: level,
          className: className,
          furtherInfo: furtherInfo
        });
      });
    }
  }

  return new CassandraFacade();
};

//internal lib only
module.exports.killClient = () => {
  client = undefined;
};
