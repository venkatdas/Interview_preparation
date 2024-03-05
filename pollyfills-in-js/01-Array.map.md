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

const mappeddarr = arr.map((num) => {
  return num * 2;
});

console.log(mappeddarr);
```

- Above code is for just executing the map built in function


```js
if (!Array.prototype.map) {
  Array.prototype.myMapFunc = function (callback, thisArg) {
     if (typeof callback !== "function") {
       throw new TypeError("Callback must be a function");
     }
    let resultArr = [];

    for (let i = 0; i < this.length; i++) {
      resultArr.push(callback.call(thisArg, this[i], i, this));
    }
    return resultArr;
  };
}

const result = arr.myMapFunc((num) => {
  return num * 3;
});

console.log(result);

```



- MAP pollyfil

  ``






