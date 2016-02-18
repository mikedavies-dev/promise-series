module.exports= (cb,parallel,arr) => {

  parallel= parallel || 1;

  // allow default parallel count of 1 if array
  // passed as second param (this a good idea?)
  if (Array.isArray(parallel)) {
    arr = parallel;
    parallel= 1;
  }

  const results = [];
  const promises = [];

  for (var i= 0; i< parallel; i++)
    promises.push(Promise.resolve());

  arr.forEach((item,ix) => {

    const position = ix % parallel;
    const promise = promises[position];

    promises[position] = promise.then(() => {
      return Promise.resolve(cb(item,ix,results))
        .then(res => results.push(res));
      });
  });

  return Promise.all(promises)
    .then(() => results);
};
