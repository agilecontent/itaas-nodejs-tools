'use strict';

/*global types */

const Cassandra = require('cassandra-driver');

class CassandraClientWrap { 
  constructor(params){
    this.client = this.getClientInstance(params);
  }

  getClientInstance(params) {
    let clientParams = {
      contactPoints: params.contactPoints,
      keyspace: params.keyspace,
      authProvider: new Cassandra.auth.PlainTextAuthProvider(
       params.cassandraUser,
       params.cassandraPassword)
    };

    if(params.consistency) clientParams.queryOptions = { consistency : params.consistency };

    let client = new Cassandra.Client(clientParams);
    return client;
  }
}

module.exports = {
  client : CassandraClientWrap,
  consistencies : types.consistencies 
};