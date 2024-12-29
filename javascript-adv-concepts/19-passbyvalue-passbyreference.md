### Pass By value vs Pass by reference

- Primitives are pass by values

```js

let x =2;
let y=x;
y+=1;
console.log(x); //2
console.log(y); //3
```

- By adding 1 to the `y` we did not change the value of `x` so we pass the value.


### Strcutural types uses reference

```js
let xArray = [1, 2, 3];
let yArray = xArray;
yArray.push(4);
console.log(yArray);
console.log(xArray);
```

### Mutable vs Immutable

- Primitives are mutable
- Non primitives are immutable



------------

# Pass by Value and Pass by Reference in JavaScript

## **Pass by Value**
- In **pass by value**, a **copy** of the actual value is passed to a variable or a function.
- Any changes made to the copied value do **not affect** the original value.
- This applies to **primitive data types** in JavaScript, such as `number`, `string`, `boolean`, `null`, `undefined`, `symbol`, and `bigint`.

### **Example**
```javascript
let a = 10;
let b = a; // Copy the value of 'a' into 'b'

b = 20; // Modify 'b'
console.log(a); // 10 (unchanged)
console.log(b); // 20
```

---

## **Pass by Reference**
- In **pass by reference**, a **reference** to the original value (memory address) is passed to a variable or a function.
- Any changes made to the referenced value **affect** the original value.
- This applies to **non-primitive data types** in JavaScript, such as `objects`, `arrays`, and `functions`.

### **Example with an Object**
```javascript
let obj1 = { name: "Alice" };
let obj2 = obj1; // Copy the reference of 'obj1' into 'obj2'

obj2.name = "Bob"; // Modify the property via 'obj2'
console.log(obj1.name); // "Bob" (affected)
console.log(obj2.name); // "Bob"
```

### **Example with an Array**
```javascript
let arr1 = [1, 2, 3];
let arr2 = arr1; // Copy the reference of 'arr1' into 'arr2'

arr2.push(4); // Modify the array via 'arr2'
console.log(arr1); // [1, 2, 3, 4] (affected)
console.log(arr2); // [1, 2, 3, 4]
```

---

## **Key Difference**
| **Aspect**           | **Pass by Value**                | **Pass by Reference**            |
|-----------------------|----------------------------------|-----------------------------------|
| **What is passed?**   | A copy of the value.            | A reference to the original data.|
| **Data types?**       | Primitive types (e.g., number). | Non-primitive types (e.g., object, array). |
| **Original affected?**| No                             | Yes                              |
