## Filter Pollyfil

____________________

`//syntax:
filter(callbackFn, thisArg);`

**Approach**

- maintain an new result array to return in the final.
- perform a basic for loop, with this.length
- main logic is : if this condition is true `callbackFn.call(array, iterationVariable, arrayItself) then finalArr.push(arrayElement)`
- outside the for loop return the array




_____________________

```js
Array.prototype.myFilter = function (callback) {
  let newArr = [];

  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      newArr.push(this[i]);
    }
    
  }
  return newArr;
};


const arr = [2, 3, 4];

const result = arr.myFilter((num) => {
  return num >2;
});

console.log(result); //[3,4]
```


