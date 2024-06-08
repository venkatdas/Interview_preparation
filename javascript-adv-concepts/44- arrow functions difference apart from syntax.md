## Arrow function and what is the difference apart from syntax?


- "Arrow functions, introduced in ES6, provide a shorter syntax for writing functions.
- They are defined using the => syntax. Apart from the syntax, they have several distinct differences compared to normal functions."


1) this context
**Normal function**
- Can be used as constructors and called with the new keyword.

```js
function normalFunction() {
  console.log(this);
}
const obj = { method: normalFunction };
obj.method(); // Logs obj
normalFunction(); // Logs global object (or undefined in strict mode)

```

**Arrow function**

- Do not have their own this context.
- Inherit this from the surrounding lexical scope at the time they are defined.

```js
const arrowFunction = () => {
  console.log(this);
};
const obj = { method: arrowFunction };
obj.method(); // Logs the surrounding context, not obj
arrowFunction(); // Logs the surrounding context
```

2) Arguments object

**Normal function**

- Have their own arguments object containing all arguments passed to the function.

```js
function normalFunction() {
  console.log(arguments);
}
normalFunction(1, 2, 3); // Logs: [1, 2, 3]
```

**Arrow Function**

- Do not have their own arguments object.
- Use rest parameters to handle arguments.

```js
const arrowFunction = (...args) => {
  console.log(args);
};
arrowFunction(1, 2, 3); // Logs: [1, 2, 3]
```

3) Constructor Usage:

**Normal Functions:**
- Can be used as constructors and called with the new keyword.


```js
function Person(name) {
  this.name = name;
}
const person = new Person('John');
console.log(person.name); // John

```

**Arrow Function**

- Cannot be used as constructors and throw an error if used with new.

```js
const Person = (name) => {
  this.name = name;
};
const person = new Person('John'); // TypeError: Person is not a constructor
```

4) Implicit return in One-Liners:

**Normal Functions:**
- Require an explicit return statement to return a value.
```js
function add(a, b) {
  return a + b;
}

```

**Arrow function**
- Can implicitly return a value in a single-line statement without the return keyword.

`const add = (a, b) => a + b`
