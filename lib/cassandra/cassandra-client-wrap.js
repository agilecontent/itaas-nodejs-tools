'use strict';

const Cassandra = require('cassandra-driver');

class CassandraClientWrap { 
  constructor(params){
    this.client = this.getClientInstance(params);
  }

  getClientInstance(params) {
    
    this.validateParams(params);
    
    let clientParams = {
      contactPoints: params.contactPoints
    };

    if(params.keyspace) clientParams.keyspace = params.keyspace;
    
    if(params.cassandraUser && params.cassandraPassword) { 
      clientParams.authProvider = new Cassandra.auth.PlainTextAuthProvider(
       params.cassandraUser,
       params.cassandraPassword);
    }

    if(params.consistency) clientParams.queryOptions = { consistency : params.consistency };

    if(params.socketOptions) clientParams.socketOptions = params.socketOptions;

    if(params.policies) clientParams.policies = params.policies;

    if(params.pooling) clientParams.pooling = params.pooling;

    

    let client = new Cassandra.Client(clientParams);
    return client;
  }

  validateParams(params){
    if(!params.contactPoints) throw new Error('Parameter "contactPoints" can not be null.');
  }
}

module.exports = {
  client : CassandraClientWrap,
  consistencies : Cassandra.types.consistencies 
};