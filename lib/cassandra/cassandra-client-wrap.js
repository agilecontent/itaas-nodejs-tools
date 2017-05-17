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
  consistencies : consistencies 
};