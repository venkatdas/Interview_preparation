### Diffrent ways to create objects


1) Object Literals

```js

const person = {
    firstName: "Venky",
    lastName: "mama",
    age: 30
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
  constructor(firstName, lastName,profession, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.profession=profession
  }
}
const person1 = new Person("John", "Doe", "IT Engineer",30);

console.log(person1);
```
**3) Object.create();**

```js
const personProto = {
  greet() {
    console.log(`Hello, my name is ${this.firstName} ${this.lastName} and age is ${this.age}`);
  },
};
const person = Object.create(personProto);
person.firstName = "John";
person.lastName = "Doe";
person.age = 30;

console.log(person);
```




