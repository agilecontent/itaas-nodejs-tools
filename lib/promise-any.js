'use strict';

module.exports = function (arrayOfPromises) {
  let promiseAny = new Promise((resolveAny, rejectAny) => {
    let remainingPromises = arrayOfPromises.length;
    let resolved = false;
    let rejectList = [];

    for (let promise of arrayOfPromises) {
      promise
        .then((value) => {
          if (!resolved) {
            resolveAny(value);
            resolved = true;
          }
        })
        .catch((value) => {
          rejectList.push(value);

          remainingPromises--;
          if (remainingPromises == 0) {
            rejectAny(rejectList);
          }
        });
    }
  });

  return promiseAny;
};
