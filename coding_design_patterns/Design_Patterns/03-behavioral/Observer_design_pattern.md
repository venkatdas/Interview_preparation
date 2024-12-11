**Behavioral patterns deals with the objet nteraction and communication between the objects**
--- OR----
**For handling communication between the different objects**

## Observer Pattern

- Defines a dependency between objects, so when one changes, others are notified.

- Define a one-to-many dependency between objects where a state change in one object results in all its dependents being notified and updated automatically.

- The Observer design pattern is a software design pattern in which an object maintains a list of its dependents, called observers, and notifies them of any state changes, usually by calling one of their methods.

```js
// Subject (Observable) Class
class Subject {
  constructor() {
    this.observers = []; // List of observers
  }

  // Method to add an observer
  subscribe(observer) {
    this.observers.push(observer);
  }

  // Method to remove an observer
  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // Notify all observers about a state change
  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

// Observer Class
class Observer {
  constructor(name) {
    this.name = name; // Identifier for the observer
  }

  // Update method to be called when notified
  update(data) {
    console.log(`${this.name} received data: ${data}`);
  }
}

// Example Usage:

// Create the Subject (Observable)
const newsAgency = new Subject();

// Create Observers
const observer1 = new Observer("Observer 1");
const observer2 = new Observer("Observer 2");
const observer3 = new Observer("Observer 3");

// Subscribe Observers to the Subject
newsAgency.subscribe(observer1);
newsAgency.subscribe(observer2);
newsAgency.subscribe(observer3);

// Notify Observers of a state change
console.log("First Notification:");
newsAgency.notify("Breaking News: Observer Pattern in Action!");

// Unsubscribe an Observer
newsAgency.unsubscribe(observer2);

// Notify again to see the difference
console.log("\nSecond Notification after unsubscribing Observer 2:");
newsAgency.notify("Update: Observer 2 has been unsubscribed!");
```
