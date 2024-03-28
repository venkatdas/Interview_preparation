### Node Js

## 1.What is node.js
-------


- Node.js is an open-source and cross-platform JavaScript runtime environment.
- Node.js is essentially an open-source server-side runtime environment built on Chrome’s V8 JavaScript engine.
- Its charm lies in its event-driven, non-blocking nature, enabling the creation of scalable server-side web applications in JavaScript.
- It allows to execution of the javascript code on the server (outside of the browser) on any machine. It is not a language & nor a framework. It's a **Javascript runtime environment**.
- It works on single-threaded event loops and non-blocking I/O modal which provides a high rate as it can handle a higher number of concurrent requests.

- It extends the power of handling file and network I/O with a preference for asynchronous patterns after including everything that is Javascript.

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Welcome to node js"); // welcome to node js
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
```
## 2. What is the runtime environment

- All programming languages require a compiler or an interpreter to interpret and execute your source code. For JavaScript, this compiler is referred to as the “JavaScript Engine”. This Engine converts your source code into machine code so that it can understand and execute it.
- All browsers have an in-built JavaScript Engine that is capable of interpreting and executing your typical JS code to make your website interactive. Perhaps the most popular JavaScript Engine is Google’s V8 Engine, which powers Google Chrome and, you guessed it, Node JS!
- Think of a runtime environment as a software environment that encompasses the JavaScript Engine along with additional functionalities. Browsers and servers could have different runtime environments despite using the same JavaScript Engine.
- Chrome’s runtime environment includes the V8 Engine and the DOM API that allows JavaScript code to manipulate and interact with a web page. On the server side, Node JS’ runtime environment also includes the V8 Engine and APIs for file system access and network communication, among other functionalities.
- To summarise, Node JS is merely a freely available, platform-independent software environment that interprets and executes your JS code on the server. It is not a programming language or a framework.

- Run time environment primarly foucuses on providing th necessary infrastructure for code execution, including services like memory management and I/O operations.

## 3. 
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/c0e1ea42-9e33-49b1-b4b7-34f97081d77b)

## 4. What are the features of node.js

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/eb5e69cc-10e5-4deb-853b-ef87ee8f2595)

- Real-time Capabilities: With features like WebSockets, which are part of the HTML5 standard, Node.js is well-suited for developing real-time applications, such as chat applications, live updates, and online gaming, offering low latency and high throughput.
- Built-in Libraries: Node.js provides a rich set of built-in libraries to support applications' needs, including HTTP, file system (FS), path, and buffer modules, among others. These libraries facilitate the development of web servers and networking tools directly within Node.js without the need for external software.


## 5. Synchrnous programming vs single threaded programming

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/0b35d415-5893-4c00-9e2c-ea57e0ed9753)

- Synchronous: Refers to the execution of tasks in a sequential manner, where each task must complete before the next one begins. Synchronous operations can block the execution until they are finished, which can lead to inefficiency in handling I/O operations.

- Single-Threaded: Refers to the execution model where one thread handles all the events and tasks. In Node.js, the main event loop that processes JavaScript callbacks is single-threaded. This model is efficient for I/O-bound operations because it avoids the overhead of context switching and synchronization between threads.


## 6. multi threading 

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/fa3f32d0-c12c-4a24-bcbc-3609ed69dac1)


- multiple threads can create a deadlock problem, if not properly handled.


## 7. Asynchronous programming

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/ed4b9f41-7f9f-4175-a41d-36d46d499469)

## 8. If node js is single threaded,  if yes How?

- Yes, the core of Node.js operates on a single thread, the main thread, but it's designed to perform non-blocking I/O operations, which allows it to handle multiple operations concurrently without the need for multiple threads in the traditional sense.
- Here's a breakdown of how Node.js manages to be effectively single-threaded and still handle concurrency:

- **Event Loop:** At the heart of Node.js is the event loop, which is single-threaded. The event loop handles all asynchronous callbacks. Operations like I/O operations (file, network, database) are executed asynchronously and their callbacks are queued to the event loop. The event loop continuously polls the queue and executes the callbacks when their non-blocking operations are complete.
- **Non-Blocking I/O:** Node.js uses non-blocking I/O calls. This means that operations like reading from a file system or making a network request do not stop the execution of JavaScript code. Instead, these operations are executed in the background, and their outcomes trigger the execution of callback functions once the operation is completed, without blocking the main thread.


## 9. Event driven programming node.js?

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/163babdb-0bac-46d6-9e2d-c960de2202f4)


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/10e2c331-12ac-4d37-a525-a198cac01184)

- Event-driven architecture is a powerful approach to software design that can improve scalability, flexibility, and performance.
- In Node.js, event-driven architecture is implemented using the event loop and the event emitter module, which provide a powerful set of tools for managing asynchronous events.
- If you're interested in building highly scalable and reliable systems, event-driven architecture is definitely worth considering.

**Event**

- An "event" in Node.js is a significant occurrence within the system or application. It can be anything from a user's action (like a mouse click or a key press), a system-generated event (like a timer expiring), or, most commonly in Node.js,
- the completion of an asynchronous input/output operation. For example, when a file read operation completes, it emits an "event" to signal that it's done and the data is now available for processing.

**EventEmitter**

- The EventEmitter is a class in Node.js that is used to handle events and listeners. Any object that can emit events is an instance of the EventEmitter class.
- These objects can emit named events that cause previously registered listeners (callbacks) to be called. So, an EventEmitter is basically an object that triggers an event and informs the event loop that something has happened.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// Event listener
myEmitter.on('event', () => {
  console.log('an event occurred!');
});

// Emit an event
myEmitter.emit('event');
```
- In this example, myEmitter is an instance of EventEmitter. It listens for an 'event' with myEmitter.on(), and emits the 'event' with myEmitter.emit().

**Event Loop**

- The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that JavaScript is single-threaded
- The event loop is the mechanism that takes events from the event queue and starts their corresponding event handlers.

**Event Handler**

- An event handler, or a listener, is a callback function that is called when an event is emitted. The handler is registered with an instance of an EventEmitter and is bound to a specific event by name.

```js
// Registering an event handler for the 'data' event
myEmitter.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes of data.`);
});

```
- When the data event is emitted by myEmitter, the registered event handler is called with the data that was emitted.
- This allows different parts of your application to react as needed to new information or state changes.




## 10. how node js handle a multiple requests?

- Node.js is indeed single-threaded when it comes to executing JavaScript code. The way it can handle multiple requests concurrently lies in its event-driven, non-blocking I/O model and its use of the event loop.

- Node JS Platform does not follow Request/Response Multi-Threaded Stateless Model. It follows Single Threaded with Event Loop Model. Node JS Processing model mainly based on Javascript Event based model with Javascript callback mechanism.
- As Node JS follows this architecture, it can handle more and more concurrent client requests very easily. Before discussing this model internals, first go through the diagram below
- Node JS Platform does not follow Request/Response Multi-Threaded Stateless Model. It follows Single Threaded with Event Loop Model. Node JS Processing model mainly based on Javascript Event based model with Javascript callback mechanism.

- **The main heart of Node JS Processing model is “Event Loop”.**

- **Here are Single Threaded Event Loop Model Processing Steps:**
    1. Clients Send request to Web Server.
    2. Node JS Web Server internally maintains a Limited Thread pool to provide services to the Client Requests.
    3. Node JS Web Server receives those requests and places them into a Queue. It is known as “Event Queue”.
    4. Node JS Web Server internally has a Component, known as “Event Loop”. Why it got this name is that it uses indefinite loop to receive requests and process them. (See some Java Pseudo code to understand this below).
    5. Event Loop uses Single Thread only. It is main heart of Node JS Platform Processing Model.
    6. Even Loop checks any Client Request is placed in Event Queue. If no, then wait for incoming requests for indefinitely.
    7. If yes, then pick up one Client Request from Event Queue ,Starts process that Client Request
    8. If that Client Request Does Not requires any Blocking IO Operations, then process everything, prepare response and send it back to client.
    9. If that Client Request requires some Blocking IO Operations like interacting  with Database, File System, External Services then it will follow different approach
    10. Then Checks Threads availability from Internal Thread Pool
    11. Picks up one Thread and assign this Client Request to that thread.
    12. That Thread is responsible for taking that request, process it, perform Blocking IO operations, prepare response and send it back to the Event Loop
    13. Event Loop in turn, sends that Response to the respective Client.


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/269c297b-c781-4612-bcd0-16afd75caac3)

- Explanation

- Here “n” number of Clients Send request to Web Server. Let us assume they are accessing our Web Application concurrently.
- Let us assume, our Clients are Client-1, Client-2… and Client-n.
- Web Server internally maintains a Limited Thread pool. Let us assume “m” number of Threads in Thread pool.
- Node JS Web Server receives Client-1, Client-2… and Client-n Requests and places them in the Event Queue.
- Node JS Even Loop Picks up those requests one by one.

**1. Even Loop pickups Client-1 Request-1**

- Checks whether Client-1 Request-1 does require any Blocking IO Operations or takes more time for complex computation tasks.
- As this request is simple computation and Non-Blocking IO task, it does not require separate Thread to process it.
- Event Loop process all steps provided in that Client-1 Request-1 Operation (Here Operations means Java Script’s functions) and prepares Response-1
- Event Loop sends Response-1 to Client-1

**2. Even Loop pickups Client-2 Request-2**

- Checks whether Client-2 Request-2does require any Blocking IO Operations or takes more time for complex computation tasks.
- As this request is simple computation and Non-Blocking IO task, it does not require separate Thread to process it.
- Event Loop process all steps provided in that Client-2 Request-2 Operation and prepares Response-2
- Event Loop sends Response-2 to Client-2

**3. Even Loop pickups Client-n Request-n**

- Checks whether Client-n Request-n does require any Blocking IO Operations or takes more time for complex computation tasks.
- As this request is very complex computation or Blocking IO task, Even Loop does not process this request.
- Event Loop picks up Thread T-1 from Internal Thread pool and assigns this Client-n Request-n to Thread T-1
- Thread T-1 reads and process Request-n, perform necessary Blocking IO or Computation task, and finally prepares Response-n
- Thread T-1 sends this Response-n to Event Loop
- Event Loop in turn, sends this Response-n to Client-n
