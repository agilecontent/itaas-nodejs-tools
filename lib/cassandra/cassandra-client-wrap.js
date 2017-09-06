'use strict';

let Cassandra;

class CassandraClientWrap {
  constructor(params) {
    CassandraClientWrap.loadCassandra();
    this.client = this.getClientInstance(params);
  }

  getClientInstance(params) {

    this.validateParams(params);

    let clientParams = {
      contactPoints: params.contactPoints
    };

    if (params.keyspace) clientParams.keyspace = params.keyspace;

    if (params.cassandraUser && params.cassandraPassword) {
      clientParams.authProvider = new Cassandra.auth.PlainTextAuthProvider(
        params.cassandraUser,
        params.cassandraPassword);
    }

    if (params.consistency) clientParams.queryOptions = { consistency: params.consistency };

    if (params.socketOptions) clientParams.socketOptions = params.socketOptions;

    if (params.policies) clientParams.policies = params.policies;

    if (params.pooling) clientParams.pooling = params.pooling;
    
    let client = new Cassandra.Client(clientParams);
    return client;
  }

  validateParams(params) {
    if (!params.contactPoints) throw new Error('Parameter "contactPoints" can not be null.');
  }

  static loadCassandra() {
    if (Cassandra === undefined) {
      Cassandra = require('cassandra-driver');
    }
  }

  static getConsistencies() {
    CassandraClientWrap.loadCassandra();
    return Cassandra.types.consistencies;
  }
}

module.exports = {
  client: CassandraClientWrap,
  getConsistencies: CassandraClientWrap.getConsistencies
};
