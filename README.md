# Run promises in series

Iterate over an array in series. Execution will not move onto the next element in the array until after the current element has resolved.

## Examples

````javascript
const series = require("promise-series2");
const vals = [1,2,3,4];

return series(vals, (val,ix) => {
  return Promise.resolve(val);
})
.then(results => {
  results[0] == vals[0];
  results[1] == vals[1];
  results[2] == vals[2];
  results[3] == vals[3];
})

````

### setTimeout
````javascript
const series = require("promise-series2");
const vals = [1,2,3,4];

return series(vals, (val,ix) => {
  return new Promise((resolve,reject) => {
    setTimeout(()=>{
      resolve(val);
    },1000);
  });
})
.then(results => {
  // runs after vals.length*1000 milliseconds
});

````

### Remote request using `request-promise`
````javascript
const series = require("promise-series2");
const rp = require('request-promise');

const vals = [
  "http://www.google.com",
  "http://www.microsoft.com"
];

return series(vals, url => return rp(url))
  .then(results => {
    results[0]; // html for google
    results[1]; // html for microsoft
  });

````
