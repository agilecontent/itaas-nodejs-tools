'use strict';
const morgan = require('morgan');

// eslint-disable-next-line max-len
const ITAAS_DEFAULT_FORMAT = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

module.exports = (getLogger, format) => {
  if (typeof getLogger !== 'function') {
    throw new Error('Missing argument "getLogger" function');
  }

  let morganMiddleware = morgan(function (morgan, req, res) {
    let fmt = morgan[format] || format || ITAAS_DEFAULT_FORMAT;
    let formatFunction = morgan.compile(fmt);
    let line = formatFunction(morgan, req, res);
    getLogger(req, res).child({
      http: line,
      route: res.locals.params || req.params,
      traceparent: res.getHeader('traceparent') || res.getHeader('request-id'),
      query: req.query,
      body: req.body      
    }).info('');
    return null;
  });

  return morganMiddleware;
};
