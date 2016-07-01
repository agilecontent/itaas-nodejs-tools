'use strict';

module.exports = () => {
  return (req, res, next) => {
    for (let key in req.query) {
      let lowercasedKey = key.toLowerCase();

      if (lowercasedKey !== key) {
        req.query[lowercasedKey] = req.query[key];
        delete req.query[key];
      }
    }
    next();
  };
};
