'use strict';

const Cassandra = require('cassandra-driver');

const consistencies = {
  any:          0x00,
  one:          0x01,
  two:          0x02,
  three:        0x03,
  quorum:       0x04,
  all:          0x05,
  localQuorum:  0x06,
  eachQuorum:   0x07,
  serial:       0x08,
  localSerial:  0x09,
  localOne:     0x0a
};

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
  consistencies : consistencies 
};