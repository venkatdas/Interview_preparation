## Promise.any polyfill



- Promise.any() is a method that takes an iterable of promises (like an array) and returns a single promise. This promise:

- Resolves as soon as any one of the input promises resolves, with the value of the first resolved promise.
- Rejects only if all the input promises are rejected. In this case, it rejects with an AggregateError, which contains an array of all the rejection reasons.

```js
// Define a static method myAnyPromise on the Promise object
Promise.myAnyPromise = function (arrayOfPromises) {
  // Return a new promise
  return new Promise((resolve, reject) => {
    let counter = 0; // Initialize a counter to track the number of rejected promises
    const errorPromises = []; // Array to store the errors from the rejected promises

    // Loop through the array of promises
    for (let i = 0; i < arrayOfPromises.length; i++) {
      
      // Handle each promise (or value) in the array
      arrayOfPromises[i]
        .then((data) => {
          // If the promise resolves, resolve the new promise with the resolved value
          resolve(data);
        })
        .catch((err) => {
          // If the promise rejects, store the error in the errorPromises array at the corresponding index
          errorPromises[i] = err;
          counter++; // Increment the counter to keep track of rejected promises

          // If all promises have been rejected, reject the new promise
          if (counter === arrayOfPromises.length) {
            // Reject with an AggregateError, which is an array of all the rejection reasons
            reject(
              new AggregateError(errorPromises, "All promises were rejected")
            );
          }
        });
    }
  });
};

```

**Output**

```js
const promise1 = Promise.reject("Error A");
const promise2 = Promise.reject("Error B");
const promise3 = Promise.resolve("Success C");

Promise.myAnyPromise([promise1, promise2, promise3])
  .then((result) => {
    console.log(result); // Output: "Success C"
  })
  .catch((error) => {
    console.error(error); // If all promises reject, this will run
  });
```
