'use strict';

const superagent = require('superagent');

/**
 * Keeps the response body as text, whatever the content type is
 */
function textParser(response, callback) {
  let text = '';

  response.setEncoding('utf8');
  response.on('data', (chunk) => text += chunk);
  response.on('end', () => callback(null, text));
}

/**
 * GET request returning the status code and the body as text, with the same behavior of the request library used
 * before: redirects are followed (up to 10) and any HTTP status is a response, so only network errors are rejected.
 */
function getText(url, headers) {
  return superagent
    .get(url)
    .set(headers || {})
    .redirects(10)
    .buffer(true)
    .parse(textParser)
    .ok(() => true)
    .then((response) => ({ statusCode: response.status, text: response.body }));
}

module.exports.getText = getText;
