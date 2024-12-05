## Event Driven Programming in Node.js

- Event-driven programming is a programming paradigm in which the flow of the application is determined by events such as user actions (e.g., clicks, inputs), messages from other systems,
- or internal events like timers or I/O operations. Instead of executing code sequentially, the program listens for events and executes corresponding callback functions when these events occur.



![image](https://github.com/user-attachments/assets/9b7b527a-a74d-45bd-a130-3e5432c68dee)



- Event Emitter emits the event and they are listened by the Event Listener , Whatever they have listened perform the callback function.



 - Event Emitter:

- The core of EDA in Node.js is the EventEmitter class, which is part of the events module.
- It allows you to emit events and attach listeners (functions) to respond to those events.


```js

const EventEmitter = require('events');

// Create an instance of EventEmitter
const myEmitter = new EventEmitter();

// Add an event listener
myEmitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// Trigger the event
myEmitter.emit('greet', 'Alice');

```


