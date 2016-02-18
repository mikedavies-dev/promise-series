# Run promises in series

Iterate over an array in series. Execution will not move onto the next element in the array until after the current element has resolved.

[![NPM](https://nodei.co/npm/promise-series2.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/promise-series2/)

````javascript
const series = require("promise-series2");

promise = series(
  callback, // callback to return either a value or promise
  parallelCount, // optional parallel count (defaults to 1)
  array // the array of data to iterate
);

promise.then(results => {
  // all done
})
````

## Examples

````javascript
const series = require("promise-series2");
const vals = [1,2,3,4];

series((val,ix) => {
  return Promise.resolve(val);
}, vals)
.then(results => {
  results[0] == vals[0];
  results[1] == vals[1];
  results[2] == vals[2];
  results[3] == vals[3];
});

````

### Example using `setTimeout`
````javascript
const series = require("promise-series2");
const vals = [1,2,3,4];

series((val,ix) => {
  return new Promise((resolve,reject) => {
    setTimeout(()=> resolve(val),1000);
  });
}, vals)
.then(results => {
  // runs after vals.length*1000 milliseconds
});

````

### Example using `request-promise`
````javascript
const series = require("promise-series2");
const rp = require('request-promise');

const vals = [
  "http://www.google.com",
  "http://www.microsoft.com"
];

series(url => return rp(url),vals)
  .then(results => {
    results[0]; // html for google
    results[1]; // html for microsoft
  });

````

### Access to current results set

````javascript
const series = require("promise-series2");
const vals = [1,2,3,4];

series((val,ix,results) => {

  // access previous results if required
  if (ix)
    results[ix-1] == vals[ix-1]; // true

  return Promise.resolve(val);
},vals)
.then(results => {
  results[0] == vals[0];
  results[1] == vals[1];
  results[2] == vals[2];
  results[3] == vals[3];
});

````
