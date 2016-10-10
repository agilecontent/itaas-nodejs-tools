'use strict';

module.exports = () => {
  return (req, res, next) => {
    for (let key in req.query) {
      let queryValue = req.query[key];
      if(queryValue){
        req.query[key] = queryValue.trim();
      }
    }
    next();
  };
};
