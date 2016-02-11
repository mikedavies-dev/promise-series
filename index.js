module.exports= (arr,cb) => {
  const results = [];
  return arr.reduce((promise,item,ix) => {
    return promise.then(() => {

      const result = cb(item,ix);

      // if we get a promise back, evalualte and add to the results
      // otherwise just add to the results
      if (result && result.then)
        return result.then(res => results.push(res));

      results.push(result);
    });
  }, Promise.resolve())
  .then(() => results);
};
