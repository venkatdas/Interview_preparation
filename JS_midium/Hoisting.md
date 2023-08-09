### Hoisting

- Hoisting is a concept in JavaScript where variable and function declarations are moved to the top of their containing scope during the compilation phase before the code is executed. This means that you can use variables and functions before they are declared in your code.
- OR
- Hoisting in JavaScript is a behavior in which a function or a variable can be used before declaration

  #### Examples
#### Empty value assigning
  ``` javascript
  // using test before declaring
console.log(test);   // undefined
var test;
```
- The above program works and the output will be undefined. The above program behaves as

``` javascript
// using test before declaring
var test;
console.log(test); // undefined
```
Since the variable test is only declared and has no value, undefined value is assigned to it.

#### Variable Hoisting
- In terms of variables and constants, keyword var is hoisted and **let and const does not allow hoisting.**

```javascript
// program to display value
a = 5;
console.log(a);
var a; // 5
```
In the above example, variable a is used before declaring it. And the program works and displays the output 5. The program behaves as:

```javascript
// program to display value
var a;
a = 5;
console.log(a); // 5
```
**However in JavaScript, initializations are not hoisted. For example,**

```javascript
// program to display value
console.log(a);
var a = 5; //undefined
```
Above program behave as

```javascript
var a;
console.log(a);
a = 5;
```
Only the declaration is moved to the memory in the compile phase. Hence, the value of variable a is undefined because a is printed without initializing it.

