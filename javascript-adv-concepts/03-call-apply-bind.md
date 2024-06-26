### Call and Apply and Bind

- call, apply, and bind are methods in JavaScript used to control the `this` context of a function.
- In order to manipulate this keyword, there are three important methods. Those are call, apply, bind.

  - Both `.call` and `.apply are used to invoke functions and the first parameter will be used as the value of this within the function.
 -  However, `.call` takes in comma-separated arguments as the next arguments while `.apply` takes in an array of arguments as the next argument.
 -  An easy way to remember this is C for `call` and comma-separated and A for `apply` and an array of arguments.



```javascript

function add(a, b) {
  return a + b;
}

console.log(add.call(null, 1, 2)); // 3
console.log(add.apply(null, [1, 2])); // 3
```

### Syntax of Call

`functionName.call(thisArg, arg1, arg2, ..., argN);`

- thisArg: The value to use as `this` when the function is called.
- `arg1, arg2, ..., argN`: Arguments for the function.

  
 Example 1)

```javascript
const person = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
}
const person1 = {
  firstName:"John",
  lastName: "Doe"
}
const person2 = {
  firstName:"Mary",
  lastName: "Doe"
}

// This will return "John Doe":
person.fullName.call(person1);
```


- In the provided example, the call method is used to borrow the fullName method from the person object and apply it to person1
- When person.fullName.call(person1); is executed, the fullName function is called with its this context set to person1.
- The call method allows person.fullName to be executed as if it were a method of person1. This is possible because call can set the this value to person1 for the duration of the fullName method's execution.
- Within fullName, this.firstName refers to person1.firstName and this.lastName refers to person1.lastName. Therefore, the method returns "John Doe".


Example 2)

```javascript
function greeting() {
  console.log(`Hi, I am ${this.name} and I am ${this.age} years old`);
}
const john = {
  name: 'John',
  age: 24,
};
const jane = {
  name: 'Jane',
  age: 22,
};
// Hi, I am John and I am 24 years old
greeting.call(john);
// Hi, I am Jane and I am 22 years old
greeting.call(jane);
```

 #### <ins> The call() Method with Arguments</ins>

 Example 1)

```javascript

const person = {
  fullName: function(city, country) {
    return this.firstName + " " + this.lastName + "," + city + "," + country;
  }
}

const person1 = {
  firstName:"John",
  lastName: "Doe"
}

person.fullName.call(person1, "Oslo", "Norway"); // John Doe,Oslo,Norway
```

Example 2)

```javascript

function greet(greeting, punctuation) {
    console.log(greeting + ', ' + this.name + punctuation);
}

const person = {
    name: 'John'
};

greet.call(person, 'Hello', '!'); //Hello, John!


```


#### Syntax for apply

- The apply method is similar to call, but the main difference is that apply accepts an array of arguments instead of individual ones.

`functionName.apply(thisArg, [argsArray]);`

`functionName.apply(thisArg, [argsArray]);`

Example 1)

```javascript
function greet(greeting, punctuation) {
    console.log(greeting + ', ' + this.name + punctuation);
}

const person = {
    name: 'John'
};

greet.apply(person, ['Hello', '!']); // Hello, John!
```
Example 2)

```javasacript
const person = {
  fullName: function(city, country) {
    return this.firstName + " " + this.lastName + "," + city + "," + country;
  }
}

const person1 = {
  firstName:"John",
  lastName: "Doe"
}

person.fullName.apply(person1, ["Oslo", "Norway"]);
```

#### Syntax for Bind

`const boundFunction = functionName.bind(thisArg, arg1, arg2, ..., argN);`

`const newFunc = Function.bind(context, thisArg1, thisArg2, thisArg3);`

- The bind method creates a copy of the function and sets the this keyword
- while the call and apply methods sets the this keyword and calls the function immediately


- bind: It returns a new function, permanently binding this and optionally setting up initial arguments.Example:

```js
function greet(greeting, name) {
    console.log(`${greeting}, ${name}!`);
}

const sayHelloToCarol = greet.bind(null, 'Hello', 'Carol');
sayHelloToCarol(); // Output: Hello, Carol!
```


```js

const college={
  collegeName: function (city, type) {
    return (
      this.name +
      " is best college from " +
      this.country +
      ", " +
      city +
      " among " +
      type
    );
    
  }
}

const college1={
  name:"CBIT",
  country:"India"
}
const bindraj =college.collegeName.apply(college1,["Hyd","Engineering"])
console.log(bindraj);
```



- call vs apply: Both invoke a function immediately with a specific this context, but call accepts individual arguments, while apply expects an array.
- bind: Different from call and apply, bind returns a new function that can be called later, using the bound this value.
