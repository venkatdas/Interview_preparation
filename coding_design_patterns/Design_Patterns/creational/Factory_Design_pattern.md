## Factory design pattern

- The Factory method pattern provides an interface for creating objects that can be modified after creation.
- The cool thing about this is that the logic for creating our objects is centralized in a single place
- implifying and better organizing our code.

- This pattern can be implemented in two ways

  - using classes
  - using factory functions(function that returns object)

- The Factory Design Pattern is a creational design pattern that provides a way to create objects without specifying their exact class.
- It abstracts the process of object creation, allowing flexibility in choosing the type of object based on certain conditions or inputs.

- Example1

```js
// Product class
class Product {
  constructor(name) {
    this.name = name;
  }
}

// Factory for creating products
class ProductFactory {
  createProduct(name) {
    return new Product(name);
  }
}

// Usage
const factory = new ProductFactory();
const productA = factory.createProduct("Product A");
const productB = factory.createProduct("Product B");

console.log(productA.name); // Output: 'Product A'
console.log(productB.name); // Output: 'Product B'
```

- Example 2

```js
// Implementation example of the Factory Pattern
class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }
}

class CarFactory {
  createCar(make, model) {
    return new Car(make, model);
  }
}

const factory = new CarFactory();
const myCar = factory.createCar("Tope", "Model 1");
```


- Example 3

```js

// Factory function implementation for creating different types of vehicles

// Car class representing a specific type of vehicle
class Car {
  constructor(make, model) {
    this.make = make; // Brand or manufacturer of the car
    this.model = model; // Model of the car
  }

  // Method to get details of the car
  details() {
    return `Car: ${this.make} ${this.model}`;
  }
}

// Bike class representing another type of vehicle
class Bike {
  constructor(make, model) {
    this.make = make; // Brand or manufacturer of the bike
    this.model = model; // Model of the bike
  }

  // Method to get details of the bike
  details() {
    return `Bike: ${this.make} ${this.model}`;
  }
}

// VehicleFactory class to handle the creation of vehicle objects
class VehicleFactory {
  // Static method to create a vehicle object based on the type
  static createVehicle(type, make, model) {
    switch (type) {
      case 'car': // If the type is 'car', create and return a Car object
        return new Car(make, model);
      case 'bike': // If the type is 'bike', create and return a Bike object
        return new Bike(make, model);
      default:
        // If an invalid type is provided, throw an error
        throw new Error('Invalid vehicle type');
    }
  }
}

// Usage example of the VehicleFactory
const myCar = VehicleFactory.createVehicle('car', 'Toyota', 'Corolla'); // Creating a Car object
console.log(myCar.details()); // Output: Car: Toyota Corolla

const myBike = VehicleFactory.createVehicle('bike', 'Yamaha', 'R15'); // Creating a Bike object
console.log(myBike.details()); // Output: Bike: Yamaha R15
```


- Factory Function: The VehicleFactory class is the core of the Factory Design Pattern. It abstracts the creation of Car and Bike objects based on the input type.


**If you don't want to use a static method, you can rewrite the factory pattern to use an instance method instead. Here's the updated implementation with comments:**


```js
// Factory function implementation for creating different types of vehicles without using a static method

// Car class representing a specific type of vehicle
class Car {
  constructor(make, model) {
    this.make = make; // Brand or manufacturer of the car
    this.model = model; // Model of the car
  }

  // Method to get details of the car
  details() {
    return `Car: ${this.make} ${this.model}`;
  }
}

// Bike class representing another type of vehicle
class Bike {
  constructor(make, model) {
    this.make = make; // Brand or manufacturer of the bike
    this.model = model; // Model of the bike
  }

  // Method to get details of the bike
  details() {
    return `Bike: ${this.make} ${this.model}`;
  }
}

// VehicleFactory class to handle the creation of vehicle objects
class VehicleFactory {
  // Instance method to create a vehicle object based on the type
  createVehicle(type, make, model) {
    switch (type) {
      case 'car': // If the type is 'car', create and return a Car object
        return new Car(make, model);
      case 'bike': // If the type is 'bike', create and return a Bike object
        return new Bike(make, model);
      default:
        // If an invalid type is provided, throw an error
        throw new Error('Invalid vehicle type');
    }
  }
}

// Usage example of the VehicleFactory
const factory = new VehicleFactory(); // Create an instance of the factory

const myCar = factory.createVehicle('car', 'Toyota', 'Corolla'); // Creating a Car object
console.log(myCar.details()); // Output: Car: Toyota Corolla

const myBike = factory.createVehicle('bike', 'Yamaha', 'R15'); // Creating a Bike object
console.log(myBike.details()); // Output: Bike: Yamaha R15
```





## with extend keyword

-  the extends keyword is used in JavaScript to create subclasses, enabling inheritance between classes. When you see the extends keyword in a Factory Design Pattern or elsewhere, it's typically because the implementation uses inheritance to build a hierarchy of related classes.

- Here is how the extends keyword fits into a Factory Design Pattern:

```js
// Base class
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  details() {
    return `Vehicle: ${this.make} ${this.model}`;
  }
}

// Subclasses extending the base class
class Car extends Vehicle {
  constructor(make, model, doors) {
    super(make, model); // Call the parent class constructor
    this.doors = doors;
  }

  details() {
    return `Car: ${this.make} ${this.model} with ${this.doors} doors`;
  }
}

class Bike extends Vehicle {
  constructor(make, model, type) {
    super(make, model); // Call the parent class constructor
    this.type = type;
  }

  details() {
    return `Bike: ${this.make} ${this.model} (${this.type} bike)`;
  }
}

// Factory class
class VehicleFactory {
  static createVehicle(type, make, model, extra) {
    switch (type) {
      case 'car':
        return new Car(make, model, extra); // extra is the number of doors
      case 'bike':
        return new Bike(make, model, extra); // extra is the type of bike
      default:
        throw new Error('Invalid vehicle type');
    }
  }
}

// Usage
const myCar = VehicleFactory.createVehicle('car', 'Tesla', 'Model S', 4);
console.log(myCar.details()); // Car: Tesla Model S with 4 doors

const myBike = VehicleFactory.createVehicle('bike', 'Giant', 'Defy 3', 'road');
console.log(myBike.details()); // Bike: Giant Defy 3 (road bike)
```





---------------- This below is factory function . NOT design pattern

- Example

```js
// Factory function to create a user profile
function createUser(name, role) {
  return {
    name, // shorthand for name: name
    role,
    login() {
      console.log(`${this.name} logged in as ${this.role}.`);
    },
    logout() {
      console.log(`${this.name} logged out.`);
    },
  };
}

// Using the factory function
const admin = createUser("Alice", "Admin");
const guest = createUser("Bob", "Guest");

// Real-time usage
admin.login(); // Output: Alice logged in as Admin.
guest.login(); // Output: Bob logged in as Guest.

admin.logout(); // Output: Alice logged out.
guest.logout(); // Output: Bob logged out.
```
