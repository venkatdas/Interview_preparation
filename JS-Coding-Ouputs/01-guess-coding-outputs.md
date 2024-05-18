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



