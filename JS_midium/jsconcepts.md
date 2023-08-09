#### Javascript Memoization - web dev simplified
- Memoization is an optimization technique used in programming to improve the performance of functions by caching the results of expensive function calls and returning the cached result when the same inputs occur again. This can help avoid redundant computations and speed up the execution of functions, especially in cases where the same inputs are used frequently.
- Idea of this you store the previous results so that , if we call the function a bunch of times in a row with the same value we're caching the value based on the inputs
- In other words, memoization is a way to speed up a function by storing its previously computed results and returning them instead of recomputing the result whenever the function is called with the same arguments.
- 
``` javascript
function squre(n) {
  let result = 0;
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= n; j++) {
      result += 1;
    }
  }
  return result;
}
console.log(squre(9999));
console.log(squre(9999));
console.log(squre(9999));
console.log(squre(9999));


- From the above code whenever we're trying to executing the code , the logs are getting delayed . Other words It will take some time to execute the code or if there is any larger number again it will take some time .
-  For that memoization comes into picture
- We're caching hre value based on the inputs


```

### Memoization technique

```javascript
const prevValues=[]
function squre(n) {
if(prevValues[n]!= null){
  return prevValues[n]
}
  let result = 0;
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= n; j++) {
      result += 1;
    }
  }
  prevValues[n]=result
  return result;
}
console.log(squre(9999));
console.log(squre(9999));
console.log(squre(9999));
console.log(squre(9999));
```
