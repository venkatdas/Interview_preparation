### Pure Functions

- Pure functions deterministic in nature means
-  Given the same inputs, a pure function always returns the same output.
-  This means the function's output depends solely on its input values and does not rely on any external or mutable state.
-  A pure function does not cause any observable side effects in the application. This means it does not modify any external state,
-  such as global variables, input arguments, or I/O operations (like logging to the console, modifying the DOM, or writing to a file).

Examples)

## 1. Adding Two numbers


```js
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // 5
console.log(add(2, 3)); // 5
```

## 2. Calculating the Area of Circle

```js
function areaOfCircle(radius) {
  return Math.PI * radius * radius;
}

console.log(areaOfCircle(4)); // Approximately 50.265
console.log(areaOfCircle(4)); // Approximately 50.265
```


### Impure functions.

- Impure functions in programming are those that do not consistently **return the same output for the same set of inputs** or cause side effects.
- The function's output depends on the state of variables or data outside its scope.
- Modification of External State: The function changes variables or data outside its own scope.

Examples

## 1.

```js
let count = 0; // External state

function incrementCount() {
  count += 1; // Modifies external state
  return count;
}

console.log(incrementCount()); // 1
console.log(incrementCount()); // 2
```

- Each call to incrementCount changes the value of the global variable count,
- and the function's output depends on the external state of count.

## 2.  Using Date or Time Functions

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6f1d1da9-0a64-4d24-abdd-621c870d30e5)

## 3.  Random Number

```js
function getRandomNumber() {
  return Math.random(); // Returns a random number
}

console.log(getRandomNumber());
```

## 4. Making API calls

```js
function fetchUserData(userId) {
  fetch(`https://api.example.com/users/${userId}`) // Makes an API call
    .then(response => response.json())
    .then(data => console.log(data));
}

fetchUserData(1); // Side effect: network request

```

- A pure function is like a math problem—you give it numbers (inputs), and it gives you back a number (output), nothing more.

// Impure Function

```js
function printName(name) {
  console.log(name);
}
```



    
