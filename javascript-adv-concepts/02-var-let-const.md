### var-let-const


- Variables declared using the var keyword are scoped to the function in which they are created, or if created outside of any function, to the global object.

- var - Since javascript is came into existence, var variable has been used. This a function scoped/global scoped

- **let and const are block scoped, meaning they are only accessible within the nearest set of curly braces (function, if-else block, or for-loop).**

- let variables cannot be re-declared but can be re-assigned
- const variables cannot be re-declared and re-assigned


  
```javascript

function foo() {
  // All variables are accessible within functions.
  var bar = 'bar';
  let baz = 'baz';
  const qux = 'qux';

  console.log(bar); // bar
  console.log(baz); // baz
  console.log(qux); // qux
}

console.log(bar); // ReferenceError: bar is not defined
console.log(baz); // ReferenceError: baz is not defined
console.log(qux); // ReferenceError: qux is not defined

```


- we have declared those value inside the function if you try to access from outside will get the reference error.

2)
  ```javascript

if (true) {
  var bar = 'bar';
  let baz = 'baz';
  const qux = 'qux';
}

// var declared variables are accessible anywhere in the function scope.
console.log(bar); // bar
// let and const defined variables are not accessible outside of the block they were defined in.
console.log(baz); // ReferenceError: baz is not defined
console.log(qux); // ReferenceError: qux is not defined

```

3)

- var allows variables to be hoisted, **meaning they can be referenced in code before they are declared. let and const will not allow this, instead throwing an error.**

```javascript

console.log(foo); // undefined

var foo = 'foo';

console.log(baz); // ReferenceError: can't access lexical declaration 'baz' before initialization

let baz = 'baz';

console.log(bar); // ReferenceError: can't access lexical declaration 'bar' before initialization

const bar = 'bar';
```

4)
**Redeclaring a variable with var will not throw an error, but let and const will.**


```javascript

var foo = 'foo';
var foo = 'bar';
console.log(foo); // "bar"

let baz = 'baz';
let baz = 'qux'; // Uncaught SyntaxError: Identifier 'baz' has already been declared
```

5)
let and const differ in that let allows reassigning the variable's value while const does not.

```javascript
// This is fine.
let foo = 'foo';
foo = 'bar';

// This causes an exception.
const baz = 'baz';
baz = 'qux';
```
