'use strict';

class CassandraCqlTools {
  static canConnect(callContext, cassandraclient) {
    return this.executeQuery(
      callContext, cassandraclient.client, 'SELECT now() FROM system.local;', [])
      .then((result) => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }

  static executeQuery(callContext, cassandraclient, cql, parameters, routingNames, consistency) {
    
    let queryParameters = CassandraCqlTools.buildQueryParameters(routingNames, consistency);

    return new Promise(function (resolve, reject) {
      cassandraclient.client.execute(cql, parameters, queryParameters, function (err, result) {
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

  static executeNonQuery(callContext, cassandraclient, cql, parameters, routingNames, consistency) {
    
    let queryParameters = CassandraCqlTools.buildQueryParameters(routingNames, consistency);

    return new Promise(function (resolve, reject) {
      cassandraclient.client.execute(cql, parameters, queryParameters, function (err, result) {
        if (err) {
          callContext.logger.error(generateQueryLogError(cql, parameters, err));
          reject(err);
        }
        resolve(processNonQueryResult(result));
      });
    });
  }

  static executeBatch(callContext, cassandraclient, builderQueries) {
    
    let queryParameters = CassandraCqlTools.buildQueryParameters(null, null);    

    return new Promise(function (resolve, reject) {
      cassandraclient.client.batch(builderQueries, queryParameters, function (err) {
        if (err) {
          callContext.logger.error(generateBatchQueryLogError(builderQueries, err));
          reject(err);
        }
        resolve(true);
      });
    });
  }

  static buildQueryParameters(routingNames, consistency)
  {
    let queryParameters = { prepare: true };
    
    if(routingNames) queryParameters.routingNames = routingNames;

    if(consistency) queryParameters.consistency = consistency;

    return queryParameters;    
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