'use strict';

class BatchQueryBuilder {
  constructor() {
    this.queries = [];
  }

  add(query, params) {
    this.queries.push({
      query: query,
      params: params
    });
  }

  getQueries() {
    return this.queries;
  }

  static create() {
    return new BatchQueryBuilder();
  }
}

module.exports = BatchQueryBuilder;
