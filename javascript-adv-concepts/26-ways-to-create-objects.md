### Diffrent ways to create objects

- //object literal

```js
const obj = {
  name: "bala",
  married: "yes",
};

console.log(obj);
```

- 2nd constructor function

```js
function Details(name, study) {
  this.name = name;
  this.study = study;
}

const data = new Details("das", "BE");

console.log(data);
// Details { name: 'das', study: 'BE' }
```

- 3 classes ES6

```js
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}
const person1 = new Person("kvds", 34);
console.log(person1);
//Person { name: 'kvds', age: 34 }
```

- 4 objct.create;

```js
const prototypeObj = {
  greet: function () {
    console.log("Hello!");
  },
};

const newObj = Object.create(prototypeObj);
newObj.greet(); //Hello!
```

- 5.Factory Functions
- A function that returns an object.

```js
function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      console.log(`Hi, I'm ${name} and age is ${age}`);
    },
  };
}
const person3 = createPerson("Charlie", 22);
person3.greet();

// Hi, I'm Charlie and age is 22
```

- 6 Using object constructor

```js
const obj123 = new Object();
obj123.name = "Diana";
obj123.age = 25;

console.log(obj123);
// { name: 'Diana', age: 25 }
```

---

1. Object Literals

```js
const person = {
  firstName: "Venky",
  lastName: "mama",
  age: 30,
};
```

**2) Constructor Functions or ES6**

```js
function Person(firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
}
const person1 = new Person("John", "Doe", 30);

//or

class Person {
  constructor(firstName, lastName, profession, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.profession = profession;
  }
}
const person1 = new Person("John", "Doe", "IT Engineer", 30);

console.log(person1);
```

**3) Object.create();**

```js
const personProto = {
  greet() {
    console.log(
      `Hello, my name is ${this.firstName} ${this.lastName} and age is ${this.age}`
    );
  },
};
const person = Object.create(personProto);
person.firstName = "John";
person.lastName = "Doe";
person.age = 30;

console.log(person);
```
