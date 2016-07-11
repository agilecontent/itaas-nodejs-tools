'use strict';

class CassandraCqlTools {
  static canConnect(callContext, client) {
    return this.executeQuery(
      callContext, client, 'SELECT now() FROM system.local;', [])
      .then((result) => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  static executeQuery(callContext, client, cql, parameters, routingNameArray) {
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

  static executeNonQuery(callContext, client, cql, parameters, routingNameArray) {
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
        }
        resolve(processNonQueryResult(result));
      });
    });
  }

  static executeBatch(callContext, client, builderQueries) {
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

function processNonQueryResult(result) {
  let ret = true;
  if (result && result.rows && result.rows.length > 0) {
    ret = result.rows[0].get('[applied]') === true;
  }
  return ret;
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

module.exports = CassandraCqlTools; 