'use strict';

const expect = require("chai").expect;
const series = require("../index");

describe("PromiseSeries()", function() {

  const timeoutPromise = timeout => {
    return new Promise((resolve,reject) => {
      setTimeout(() => resolve(),timeout);
    });
  };

  const rand = (max) => {
    return Math.floor(Math.random() * max) + 1;
  };

  it("Should run in series", function() {

    const vals = [1,2,3,4,5];
    const check = [];

    return series((val,ix) => check.push(val),vals)
    .then(() => {
      let ix = 0;
      expect(check[ix]).to.equal(vals[ix++]);
      expect(check[ix]).to.equal(vals[ix++]);
      expect(check[ix]).to.equal(vals[ix++]);
      expect(check[ix]).to.equal(vals[ix++]);
    });
  });

  it("Should run in series with timeout", function() {

    const vals = [1,2,3,4,5];
    const check = [];

    return series((val,ix) => {
      return timeoutPromise(rand(100)).then(() => check.push(val));
    },vals)
    .then(() => {
      let ix = 0;
      expect(check[ix]).to.equal(vals[ix++]);
      expect(check[ix]).to.equal(vals[ix++]);
      expect(check[ix]).to.equal(vals[ix++]);
      expect(check[ix]).to.equal(vals[ix++]);
    });
  });

  it("Should return values", function() {

    const vals = [1,2,3,4,5];

    return series((val,ix) => {
      return Promise.resolve(val);
    },vals)
    .then(results => {
      let ix = 0;
      expect(results[ix]).to.equal(vals[ix++]);
      expect(results[ix]).to.equal(vals[ix++]);
      expect(results[ix]).to.equal(vals[ix++]);
      expect(results[ix]).to.equal(vals[ix++]);
    });
  });

  it("Should mix values and promises", function() {

    const vals = [1,2,3,4,5];

    return series((val,ix) => {
      if (ix === 0)
        return val;

      return Promise.resolve(val);
    },vals)
    .then(results => {
      let ix = 0;
      expect(results[ix]).to.equal(vals[ix++]);
      expect(results[ix]).to.equal(vals[ix++]);
      expect(results[ix]).to.equal(vals[ix++]);
      expect(results[ix]).to.equal(vals[ix++]);
    });
  });

  it("Should pass array index to callback", function() {

    const vals = [1,2,3,4,5];
    let index= 0;

    return series((val,ix) => {
      expect(ix).to.equal(index++);
      return Promise.resolve(val);
    },vals);
  });

  it("Should pass the current results to the callback", function() {

    const vals = [1,2,3,4,5];
    let index= 0;

    return series((val,ix,results) => {

      if (ix)
        expect(results[ix-1]).to.equal(vals[ix-1]);

      return Promise.resolve(val);
    },vals);
  });

  it("Should handle a result that looks like a promise but is not", function() {

    return series((val,ix,results) => {
      return {
        then: 1
      };
    },[0])
    .then(res => expect(res[0].then).to.equal(1));
  });

  it("Should run in series and in parallel", function() {

    const vals = [1,2];

    return series((val,ix) => {
      if (ix === 0)
        return timeoutPromise(250).then(() => val);
      return val;
    }, 2, vals)
    .then(res => {
      expect(res[0]).to.equal(vals[1]);
      expect(res[1]).to.equal(vals[0]);
    });
  });
});
