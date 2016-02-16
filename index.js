module.exports= (arr,cb) => {
  const results = [];
  return arr.reduce((promise,item,ix) => {
    return promise.then(() => {
      return Promise.resolve(cb(item,ix,results))
        .then(res => results.push(res));
    });
  }, Promise.resolve())
  .then(() => results);
};
