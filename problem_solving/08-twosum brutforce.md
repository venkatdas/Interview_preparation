## two sum

```js
function twoSumBrutforce(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if(arr[i]+arr[j]===target){
        return [i,j]
      }
    }
  }
  return 'no indices found'
}

console.log(twoSumBrutforce([1, 1, 3], 5));
```
