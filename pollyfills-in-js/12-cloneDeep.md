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



Example


```js
const object1 = {
  name: "Alice",
  address: {
    age: 30,
    city: "Wonderland",
  },
  hobbies: ["reading", "coding"],
};

// Assigning object1 to object2 - this creates a reference, not a clone.
const object2 = object1;

// Modifying object2
object2.name = 'Bob';

console.log(object1.name);

console.log(object2)// {name: 'Bob', address: {…}, hobbies: Array(2)}
console.log(object1); //{name: 'Bob', address: {…}, hobbies: Array(2)}
```
- Before deep clone object1 was assigned to object2
- If i'm trying to change the object2.name it will reflect to the object1 also
- - To avoid this we have to perform DeepClone

```js
const object1 = {
  name: "Alice",
  address: {
    age: 30,
    city: "Wonderland",
  },
  hobbies: ["reading", "coding"],
};

// Assigning object1 to object2 - this creates a reference, not a clone.
const object2 = customCloneDeep(object1);

// Modifying object2
object2.name = 'Bob';

console.log(object1.name);

console.log(object2)// {name: 'Bob', address: {…}, hobbies: Array(2)}

console.log(object1); //{name: 'Alice', address: {…}, hobbies: Array(2)}
```



