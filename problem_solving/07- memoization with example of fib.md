## Memoization in js

- Define a Wrapper Function: Create a simpleMemoization function that takes another function (fn) as its input.
-Initialize a Cache: Inside simpleMemoization, start with an empty cache object to store results of fn.
- Return a New Function: simpleMemoization returns a new function that takes an argument x, acting as the memoized version of fn.
- Check the Cache: In the returned function, check if a result for x already exists in the cache.
- If Yes: Return the cached result without calling fn.
- If No: Proceed to the next step.
- Compute and Store: Call fn with x, store the result in the cache, and then return this result.
- Reuse Cached Results: On subsequent calls with the same x, use the cached result to avoid recalculating.


```js
function simpleMemoization(fn) {
  let cache = {};
  return function (x) {
    if (cache[x]) {
      console.log(cache);
      console.log("we are going to return the value from cache");
      return cache[x];
    } else {
      const result = fn(x);

      cache[x] = result;
      console.log("calculate the result");
      return result;
    }
  };
}
```


```js
function fib(num) {
  if (num <= 1) return num;
  else return fib(num - 1) + fib(num - 2);
}
```


```js
const calculateFib = simpleMemoization(fib);

console.log(calculateFib(10)); // 55 , calculate the result
console.log(calculateFib(10)); //55 return from cache
console.log(calculateFib(10)); // 55 return from cache
console.log(calculateFib(11)); // 89 calucalte the result
console.log(calculateFib(11)); // 89 return from cache
```






________________

```js

function factorialFunc(n) {
  if (n <= 1) return 1;
  else return n * factorialFunc(n - 1);
}


const factorialResult = simpleMemoization(factorialFunc);

console.log(factorialResult(5)); // 120 calculte result
console.log(factorialResult(5)); // 120 fetched from cache


```



