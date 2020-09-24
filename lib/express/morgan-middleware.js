'use strict';
const morgan = require('morgan');

module.exports = (getLogger, format) => {
  if (typeof getLogger !== 'function') {
    throw new Error('Missing argument "getLogger" function');
  }

  let morganMiddleware = morgan(function (morgan, req, res) {
    let fmt = morgan[format] || format || morgan.combined;
    let formatFunction = morgan.compile(fmt);
    let line = formatFunction(morgan, req, res);
    getLogger(req, res).child({
      http: line,
      route: res.locals.params || req.params,
      traceparent: res.getHeader('x-request-id'),
      query: req.query
    }).info('');
    return null;
  });

  return morganMiddleware;
};
