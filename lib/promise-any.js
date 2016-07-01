'use strict';

module.exports = function (arrayOfPromises) {
  let promiseAny = new Promise((resolveAny, rejectAny) => {
    let remainingPromises = arrayOfPromises.length;
    let resolved = false;
    let rejectList = [];

    for (let item of arrayOfPromises) {
      // When it is not a promise, we create a promise using 
      // the value. Same behavior as Promise.all
      let promise;
      if (!(item instanceof Promise)) {
        promise = Promise.resolve(item);
      } else {
        promise = item;
      }

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
