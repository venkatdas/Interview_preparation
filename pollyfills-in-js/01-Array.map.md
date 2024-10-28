### Array.map()
___________________________


Syntax of Pollyfill it is common for everthing.. 

```js
if (!Array.prototype.map) { 
  Array.prototype.map = function(callback, thisArg) {

 if (typeof callback !== "function") {
       throw new TypeError("Callback must be a function");
     }
    // Implementation here
  };
}
```








```js
const arr = [2, 3, 4];

const mappeddarr = arr.map((num,index, arr) => {
  return num * 2;
});



console.log(mappeddarr);
```

- num , current element this [i]
- index current index , i
- arr, current array, this

- Above code is for just executing the map built in function
--------------------------------------------------

**Approach**


- Check if Array.prototype.map already exists.
- Define the polyfill function on Array.prototype.map.
- Validate that the provided callback is a function.
- Initialize a new array for the results.
- Loop over the original array.
- For each element, check if the element exists (to handle sparse arrays).
- Apply the callback to each existing element, using call to set thisArg as the context.
- Store the result of the callback in the new array.
- Return the new array containing the mapped values.

```js
  Array.prototype.myMapFunc = function (callback, thisArg) {
     if (typeof callback !== "function") {
       throw new TypeError("Callback must be a function");
     }
    let resultArr = [];

    for (let i = 0; i < this.length; i++) {
// this means parent array., parentarray.length
      resultArr.push(callback.call(thisArg, this[i], i, this));
    }
    return resultArr;
  };


const result = arr.myMapFunc((num) => {
  return num * 3;
});

console.log(result);

```

**OR**





```js
  Array.prototype.myMapFunc = function (callback, thisArg) {
    
    let resultArr = [];

    for (let i = 0; i < this.length; i++) {
      resultArr.push(callback(this[i], i, this)); // this is parent array
    }
    return resultArr;
  };


const result = arr.myMapFunc((num) => {
  return num * 3;
});

console.log(result);
```


  ``





