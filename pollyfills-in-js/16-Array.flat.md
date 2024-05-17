## flat polyfill

**Approach taken**

- Check if Array.prototype.flat is already defined.
- Define the polyfill function if not already defined.
- Set default depth parameter to 1.
- Define a recursive helper function flatten.
- Return shallow copy if depth < 1.
- Use reduce to accumulate flattened values.
- Check if each element is an array using Array.isArray.
- Recursively call flatten for nested arrays with depth - 1.
- Push flattened or non-array elements into the accumulator.
- Return the flattened array from the flat method.

```js
Array.prototype.myflatten = function (depth=1) {

  function flatten(depth,arr) {
    if(depth<1){
      return console.log(arr.slice());;
    }

    return arr.reduce((acc,val)=>{
      if(Array.isArray(val)){
        acc.push(...flatten(val,depth-1))
      }else{
        acc.push(val)
      }
      return acc
    },[])
    
  }

  return flatten(this,depth)
  
}


const nestedArray = [1, [2, [3, [4]], 5]];
console.log(nestedArray.flat()); // [1, 2, [3, [4]], 5]
```


        **OR**



```js
// Check for native support
if (!Array.prototype.flat) {
  // Define the polyfill
  Array.prototype.flat = function(depth = 1) {
    // Recursive flatten function
    function flatten(arr, depth) {
      // Base case for recursion
      if (depth < 1) {
        return arr.slice();
      }
      // Use reduce to accumulate values
      return arr.reduce((acc, val) => {
        // Check for nested arrays
        if (Array.isArray(val)) {
          // Recursively flatten the array
          acc.push(...flatten(val, depth - 1));
        } else {
          // Concatenate flattened elements
          acc.push(val);
        }
        return acc;
      }, []);
    }
    // Return flattened array
    return flatten(this, depth);
  };
}

// Usage example
const nestedArray = [1, [2, [3, [4]], 5]];
console.log(nestedArray.flat()); // [1, 2, [3, [4]], 5]
console.log(nestedArray.flat(2)); // [1, 2, 3, [4], 5]
console.log(nestedArray.flat(3)); // [1, 2, 3, 4, 5]
```

