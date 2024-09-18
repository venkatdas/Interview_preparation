## promise.race polyfill


```js
Promise.myRace = function (arrayOfPromises) {
  return new Promise((resolve, reject) => {
    // Iterate over each promise in the input array
    for (let i = 0; i < arrayOfPromises.length; i++) {
      // Convert each value to a promise in case it's not already a promise
      Promise.resolve(arrayOfPromises[i])
        .then(resolve)  // Resolve as soon as any promise resolves
        .catch(reject); // Reject as soon as any promise rejects
    }
  });
};

```

**OR**


```js
Promise.myRace = (arrayOfPromises) => {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < arrayOfPromises.length; i++) {
      Promise.resolve(arrayOfPromises[i])
        .then((data) => resolve(data), (e) => reject(e));
    }
  });
};

const promise1 = new Promise((resolve) => setTimeout(resolve, 500, "First"));
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, "Second"));
const promise3 = new Promise((resolve) => setTimeout(resolve, 300, "Third"));

Promise.myRace([promise1, promise2, promise3])
  .then((data) => console.log(data))  // Logs: "Second" because promise2 resolves first
  .catch((e) => console.error(e));

```


__________________

```js
.then(
  (data) => resolve(data),   // First function handles resolved promises
  (e) => reject(e)           // Second function handles rejected promises
);
```

- The above code snippet is short hand for

```js
.then((data) => resolve(data))
.catch((e) => reject(e));
```
