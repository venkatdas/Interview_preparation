#### JS outputs


## 1)

```js

console.log(1)
const promise = new Promise((resolve) => {
  console.log(2)
  resolve()
  console.log(3)
})

console.log(4)

promise.then(() => {
  console.log(5)
}).then(() => {
  console.log(6)
})

console.log(7)

setTimeout(() => {
  console.log(8)
}, 10)

setTimeout(() => {
  console.log(9)
}, 0)
```




<details>
  <summary>
    Solution
  </summary>
- The output of the provided JavaScript code occurs in this sequence due to the way JavaScript handles synchronous code, promise resolution, and asynchronous callbacks like setTimeout:
Synchronous code is executed first, so console.log(1), console.log(2), console.log(3), console.log(4), and console.log(7) are logged in that order.
  
- Promise resolutions are handled next. The .then callbacks are microtasks and are processed immediately after the current script block finishes executing, before any other macrotasks like setTimeout. This results in console.log(5) and then console.log(6).
- setTimeout callbacks are macrotasks and are executed after all microtasks are completed. The setTimeout with 0 milliseconds delay (console.log(9)) executes before the one with 10 milliseconds delay (console.log(8)), because the event loop checks for any macrotasks to execute next, processing them in the order they were scheduled.
- Therefore, the output order is determined by JavaScript's event loop and task queue mechanisms, leading to the sequence: 1, 2, 3, 4, 7, 5, 6, 9, 8.
  
</details>



## 2)

```js
new Promise((resolve, reject) => {
  resolve(1)
  resolve(2)
  reject('error')
}).then((value) => {
  console.log(value)
}, (error) => {
  console.log('error')
})
```

<details>
  <summary>
    Solution
  </summary>

- In a Promise, once it is resolved or rejected, any subsequent calls to resolve or reject are ignored. Therefore, in the given code, the promise is resolved with the value 1 on the first resolve call, and the subsequent resolve(2) and reject('error') calls are ignored.
- The .then method is attached to the promise, which takes two arguments: the first is a callback function for the success case (when the promise is resolved), and the second is a callback function for the failure case (when the promise is rejected). Since the promise is resolved with the value 1, the success callback is executed, and 1 is logged to the console.

- // output 1
</details>


## 3)

```js
Promise.resolve(1)
.then(() => 2)
.then(3)
.then((value) => value * 3)
.then(Promise.resolve(4))
.then(console.log)
```

<details>
  <summary>
    Solution
  </summary>
  1. Promise.resolve(1) immediately resolves with the value `1`.
  2. .then(() => 2) executes, returning 2, which becomes the value for the next .then.
  3. .then(3) doesn't alter the promise chain because 3 is not a function. .then expects a function as its argument; passing anything else (like 3) will result in the argument being ignored, and the previous promise's resolved value (2) is passed through unchanged.
  4. .then((value) => value * 3) takes the passed-through value (2) and multiplies it by 3, resulting in 6.
  5. .then(Promise.resolve(4)) also doesn't alter the chain because Promise.resolve(4) is not a function. Similar to the previous non-function argument, this results in the previous value (6) being passed through.
  6. .then(console.log) logs the result to the console.
  
</details>
