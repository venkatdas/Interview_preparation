### Deep Clone


___________


**Approach**

- one condition for primitives and null (ex: typeof value!==object || value === null)
- one condition for Array.isArray(value)
- another condition for typeof value === 'object'
- for primitives & null (I mean for condition 1), simply return the param that you have passed (ex: value)
- for Array condition, write a basic for loop based on the value.length. Maintain an array for recursion (ex: arrCopy[i] = customCloneDeep(value[i])). Post for loop ends, return that stored/created arrCopy.
- for object condition, maintain an empty object and perform a for-in-loop and pass recursively (ex: objCopy[key] = customCloneDeep(value[key])). Post for loop ends, return the finalObj

```js

function customCloneDeep(value) {
  //Handle primitives and null/undefined

  if (value === null || typeof value !== "object") {
    return value;
  }

  //Handle the arrays

  if (Array.isArray(value)) {
    const arrCopy = [];
    for (let i = 0; i < value.length; i++) {
      arrCopy[i] = customCloneDeep(value[i]);
    }
    return arrCopy;
  }

  //Handle the object

  if (typeof value === "object") {
    const objCopy = {};

    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        objCopy[key] = customCloneDeep(value[key]);
      }
    }
    return objCopy;
  }

  // In case the value is a special type that isn't handled above
  throw new Error("Unable to clone value! Its type is not supported.");
}
```
