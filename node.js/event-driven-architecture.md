## Basic server using http


```js
// Import the http module
const http = require('http');

// Create the server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

// Server listens on port 3000
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

## using Express

```js
// Import the express module
const express = require('express');

// Create an instance of express
const app = express();

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Server listens on port 3000
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});

```











## Event Driven Programming in Node.js

- Event-driven programming is a programming paradigm in which the flow of the application is determined by events such as user actions (e.g., clicks, inputs), messages from other systems,
- or internal events like timers or I/O operations. Instead of executing code sequentially, the program listens for events and executes corresponding callback functions when these events occur.



![image](https://github.com/user-attachments/assets/9b7b527a-a74d-45bd-a130-3e5432c68dee)



- Event Emitter emits the event and they are listened by the Event Listener , Whatever they have listened perform the callback function.



 - Event Emitter:

- The core of EDA in Node.js is the EventEmitter class, which is part of the events module.
- It allows you to emit events and attach listeners (functions) to respond to those events.


```js
const http = require('http');

const server= http.createServer();

server.on("request", (req, res) => {
  res.end("this is event emitter ");
});

server.listen(8080,()=>{
    console.log("server is listening on 8080")
})
```
- On 8080 port will get this is event emitter
- 
- .on is the event emitter
___________________

## Create our own events


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





