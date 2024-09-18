## Prmise.all() polyfill

_____________________


```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise1 setTimeout");
  }, 1000);
});

const promise2 = new Promise((resolve, reject) =>
  // setTimeout(() => resolve(new Error("Success B")), 200)
  setTimeout(resolve, 200, "Success B")
);
const promise3 = new Promise((resolve, reject) =>
  setTimeout(resolve, 200, "Success C")
);


const promise4 = 10;


const allPromises = Promise.all([promise1, promise2, promise3, promise4]);



allPromises
  .then((result) => {
    console.log("Resolved with result:", result);
  })
  .catch((err) => {
    console.log("Rejected with error:", err);
  });

// Output


﻿



```


![image](https://github.com/user-attachments/assets/97d59ef1-a78a-41c6-997f-8e8491ea8e73)



- The above output is normal withour polyfil


___________________________


- Initialization: Creates a new promise and initializes:

- counter to track resolved promises.
- results array to store resolved values.
- Iterate Over Promises:

- Uses Promise.resolve to handle each item in the input (convert non-promises to resolved promises).
- On resolution, stores the value in results and increments counter.
- If counter equals the length of input, resolves with the results array.
- On rejection, immediately rejects with the error.
- Edge Case: An empty array input resolves instantly with an empty array.


```js
Promise.myAll = function (arrayOfPromises) {
  return new Promise((resolve, reject) => {
    let counter = 0;
    const results = [];
    for (let i = 0; i < arrayOfPromises.length; i++) {
      Promise.resolve(arrayOfPromises[i])
        .then((data) => {
          results[i] = data;
          counter++;

          if (counter === arrayOfPromises.length) {
            resolve(results);
          }
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

const allPromises = Promise.myAll([promise1, promise2, promise3, promise4]);


allPromises
  .then((result) => {
    console.log("Resolved with result:", result);
  })
  .catch((err) => {
    console.log("Rejected with error:", err);
  });
```

_ in above code all resolved, so will get resolved array
