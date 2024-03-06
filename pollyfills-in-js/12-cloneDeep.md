### Deep Clone


___________


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
