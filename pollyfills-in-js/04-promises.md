## Promise with resolve , reject, then and catch

**Note: Need to chck again entire thing  seems hard**

________________________________
```js
function PromisePolyfill(executor) {
  let onResolve,
    onReject,
    isFullfilled = false,
    isRejected = false,
    isCalled = false,
    value;

  function resolve(val) {
    isFullfilled = true;
    value = val;

    if (typeof onResolve === "function") {
      onResolve(val);
      isCalled = true;
    }
  }

  function reject(val) {
    isRejected = true;
    value=val;
    if(typeof onReject==='function'){

      onReject(val);
      isCalled= true
    }
  }

  this.then = function (callback) {
    onResolve = callback;
    if (isFullfilled && !isCalled) {
      isCalled = true;
      onResolve(value)
    }
    return this;
  };

  this.catch = function (callback) {
    onReject = callback;
    if(isRejected&& !isCalled){
      isCalled = true;
      onReject(value)
    }
    return this;
  };
  try {
    
    executor(resolve, reject);
  } catch (error) {
    reject(error)
  }
}
```

ex

```js
const examplePromise = new PromisePolyfill((resolve, reject) => {

setTimeout(() => {
  resolve(2)
}, 1000);

}).then((res)=>{
  console.log(res);
}).catch((err)=>{
  console.log(err);
})
```



______________
resolve and reject polyfil


```js
PromisePolyfill.resolve =(val)=>{
  return new PromisePolyfill(function executor(resolve,reject){
    resolve(val)
  })
}

PromisePolyfill.reject = (val) => {
  return new PromisePolyfill(function executor(resolve, reject) {
    reject(val);
  });
};
```
