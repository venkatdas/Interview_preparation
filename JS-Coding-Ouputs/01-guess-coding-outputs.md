## 1. 

```js
function main() {
  console.log("A");
  setTimeout(function print() {
    console.log("B");
  }, 0);
  console.log("C");
}
main();
```

<details>
  <summary >
  solution
   </summary>

A,C,B


- The statements order is based on the event loop mechanism. The order of statements follows the below order,

At first, the main function is pushed to the stack.
Then the browser pushes the first statement of the main function( i.e, A's console.log) to the stack, executing and popping out immediately.
But setTimeout statement moved to Browser API to apply the delay for callback.
In the meantime, C's console.log added to stack, executed and popped out.
The callback of setTimeout moved from Browser API to message queue.
The main function popped out from stack because there are no statements to execute
The callback moved from message queue to the stack since the stack is empty.
The console.log for B is added to the stack and display on the console.

</details>


## 2. 

```js
console.log(0.1 + 0.2 === 0.3);
```

<details>
  <summary> solution</summary>

- false
- This is due to the float point math problem. Since the floating point numbers are encoded in binary format,
-  In binary, numbers like 0.1 and 0.2 have repeating fractions, which can't be represented exactly with a finite number of binary digits. When these numbers are added together, the result is not exactly 0.3, but something very close to it (e.g., 0.30000000000000004).

</details>


## 3. Which of these values are falsy?

```js
0;
new Number(0);
('');
(' ');
new Boolean(false);
undefined;
```

<details>
  <summary>solution</summary>
There are 8 falsy values:

- undefined
- null
- NaN
- false
- '' (empty string)
- 0
- -0
- 0n (BigInt(0))
- Function constructors, like new Number and new Boolean are truthy.
</details>


## 4. 

```js
const numbers = [1, 2, 3];
numbers[10] = 11;
console.log(numbers);
```

<details>

  <summary>solution</summary>
- When you set a value to an element in an array that exceeds the length of the array, JavaScript creates something called "empty slots". These actually have the value of undefined, but you will see something like:

- [1, 2, 3, empty x 7, 11]

- depending on where you run it (it's different for every browser, node, etc.)
</details>


## 5. 

```js
[1, 2, 3].map(num => {
  if (typeof num === 'number') return;
  return num * 2;
});
```

<details><summary>
  solution
</summary>
- `[undefined, undefined, undefined]`
  
- When mapping over the array, the value of num is equal to the element it’s currently looping over. In this case, the elements are numbers, so the condition of the if statement typeof num === "number" returns true. The map function creates a new array and inserts the values returned from the function.

- However, we don’t return a value. When we don’t return a value from the function, the function returns undefined. For every element in the array, the function block gets called, so for each element we return undefined.
</details>


## 6.

```js
function greeting() {
  throw 'Hello world!';
}

function sayHi() {
  try {
    const data = greeting();
    console.log('It worked!', data);
  } catch (e) {
    console.log('Oh no an error:', e);
  }
}

sayHi();
```

<details>
  <summary>
    solution
  </summary>

- **Oh no an error: Hello world!**

- With the throw statement, we can create custom errors. With this statement, you can throw exceptions. An exception can be a string, a number, a boolean or an object. In this case, our exception is the string 'Hello world!'.

- With the catch statement, we can specify what to do if an exception is thrown in the try block. An exception is thrown: the string 'Hello world!'. e is now equal to that string, which we log. This results in 'Oh an error: Hello world!'.
</details>

## 7. 
