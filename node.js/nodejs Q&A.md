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


## 11.Node.js Architecture

- Node.js has its core part written in C and C++. Node js is based on a single-threaded event loop architecture which allows Node to handle multiple client requests. Node js uses the concept of an asynchronous model and non-blocking I/O.

- Node.js is an extremely powerful JavaScript-based platform that’s built on Google Chrome’s JavaScript V8 Engine, used to develop I/O intensive web applications like video streaming sites, single-page applications, online chat applications, and other web apps.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/55fb5724-2c86-46f2-8c62-5c72667d10a3)


- **Basic of web components**
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/b1b65b24-dad0-4acb-9531-4f7fe588cac5)


- Client:

The user interacts with the front-end part of a web application. The front-end is usually developed using languages like HTML and CSS styles, along with extensive usage of JavaScript-based frameworks like ReactJS and Angular, which help with application design.

- Server:

The server is responsible for taking the client requests, performing the required tasks, and sending responses back to the clients. It acts as a middleware between the front-end and stored data to enable operations on the data by a client. Node.js, PHP, and Java are the most popular technologies in use to develop and maintain a web server.

- Database:

The database stores the data for a web application. The data can be created, updated, and deleted whenever the client requests. MySQL and MongoDB are among the most popular databases used to store data for web applications.

- **Architecture**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/dc4da4d9-4179-467c-b476-3fd472185f90)

- Node.js uses the “Single Threaded Event Loop” architecture to handle multiple concurrent clients. Node.js Processing Model is based on the JavaScript event-based model along with the JavaScript callback mechanism.

**Parts of Node js Architecture:**

- Requests : Incoming requests can be blocking (complex) or non-blocking (simple), depending upon the tasks that a user wants to perform in a web application
Node.js server: Node.js server is a server-side platform that takes requests from users, processes those requests, and returns responses to the corresponding users
- Event Queue: Event Queue in a Node.js server stores incoming client requests and passes those requests one-by-one into the Event Loop
- Thread pool: Thread pool consists of all the threads available for carrying out some tasks that might be required to fulfill client requests
- Event loop: Event Loop indefinitely receives requests and processes them, and then returns the responses to corresponding clients.
- External Resources: External resources are required to deal with blocking client requests. These resources can be for computation, data storage, etc.


**Workflow of node js architecture**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/365c3791-81da-4615-9c37-aea720d03634)

- A web server developed using Node.js typically has a workflow that is quite similar to the diagram illustrated below. Let’s explore this flow of operations in detail.

- Clients send requests to the webserver to interact with the web application. Requests can be non-blocking or blocking e.g Querying the data , updating the data or deleting the data .
- Node.js retrieves the incoming requests and adds those requests to the Event Queue.
- The requests are then passed one-by-one through the Event Loop. It checks if the requests are simple enough to not require any external resources.
- Event Loop processes simple requests (non-blocking operations), such as I/O Polling, and returns the responses to the corresponding clients.

- A single thread from the Thread Pool is assigned to a single complex request. This thread is responsible for completing a particular blocking request by accessing the external resources, such as compute, database, file system, etc.


**Advantages of node js architecure**

- Handling multiple concurrent client requests is fast and easy: With the use of Event Queue and Thread Pool, the Node.js server enables efficient handling of a large number of incoming requests.
- No need for creating multiple threads: Event Loop handles all requests one-by-one, so there is no need to create multiple threads. Instead, a single thread is sufficient to handle a blocking incoming request.


## 12. Phases of event loop

- Timers Phase: This phase executes callbacks scheduled by setTimeout() and setInterval(). It checks for timers whose time thresholds have elapsed and executes their callback functions.
- Pending Callbacks Phase: Some callbacks need to be delayed until the next loop iteration. This phase executes I/O callbacks deferred to the next loop cycle.
- Idle, Prepare Phase: This is an internal phase used for setting up some internal operations. It is not something that can be interacted with from a Node.js program.
- Poll Phase: The poll phase has two main functions:

  1. Execute scripts for timers that are set to run and see if any other timers are due to be executed.
  2. Process events in the poll queue. If there are no timers scheduled, it will wait for callbacks to be added to the queue, executing them as they are added. If scripts are not scheduled and there are no callbacks, it will continue to the next phase.


## 13 setImmediate() vs setTimeout()

```js
// Timeout vs. Immediate
setTimeout(() => {
  console.log('setTimeout: Hey there!');
}, 0);

setImmediate(() => {
  console.log('setImmediate: Hello there!');
});

```


```js
setImmediate: Hello there!
setTimeout: Hey there!
```

- Check Phase: The check phase allows for immediate callbacks to be run after the poll phase. Callbacks registered with setImmediate() are executed in this phase.
- Close Callbacks Phase: This phase executes callbacks for some system operations such as TCP stream errors. For example, if a TCP socket was closed abruptly ('close' event), the callback is executed in this phase.

## 14 Difference between process.nextTick(), setImmediate()

1) Allow users to handle errors, cleanup any then unneeded resources, or perhaps try the request again before the event loop continues.

2) At times it's necessary to allow a callback to run after the call stack has unwound but before the event loop continues.


- **use process.nextTick() when you want to execute a callback function immediately after the current operation completes, but before other I/O events or timers. Use setImmediate() when you want to schedule a callback to be executed in the next event loop iteration, after any pending I/O events or process.nextTick() callbacks.**


```js
console.log('Hello => number 1');

setImmediate(() => {
  console.log('Running before the timeout => number 3');
});

setTimeout(() => {
  console.log('The timeout running last => number 4');
}, 0);

process.nextTick(() => {
  console.log('Running at next tick => number 2');
});
```

```js
Hello => number 1
Running at next tick => number 2
Running before the timeout => number 3
The timeout running last => number 4
```
_______________________________________

## Manipulating Files

## 15) Node.js File stats

```js
const { log } = require("console");
const fs = require("fs");

fs.stat("example.txt", (err, stats) => {
  if (err) {
    console.error(err);
  }

  // console.log(stats);

  
  console.log(`File Size: ${stats.size} bytes`);
  console.log(`Is it a file? ${stats.isFile()}`);
  console.log(`Is it a directory? ${stats.isDirectory()}`);
  console.log(`Created At: ${stats.birthtime}`);
  console.log(`Last Modified: ${stats.mtime}`);
  console.log(`Size: ${stats.size}`);
  console.log(`isSymbolicLink: ${stats.isSymbolicLink}`);


  // we have access to the file stats in `stats`
});


console.log("End");
```
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/2997cb31-42eb-4704-b3a6-44c4e8ae1629)

- The same code using promise based file

## 16 ) Reading files with Node.js

- The simplest way to read a file in Node.js is to use the fs.readFile() method, passing it the file path, encoding and a callback function that will be called with the file data (and the error):


```js
const fs = require("node:fs");

fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

```
- It will log the data whatever the data that consists in example.txt

- Alternatively, you can use the synchronous version fs.readFileSync():

```js
const fs = require("node:fs");

try {
  const data = fs.readFileSync("example.txt", "utf8");
  console.log(data);
} catch (err) {
  console.error(err);
}
```



```js
const fs = require("node:fs/promises");

async function example() {
  try {
    const data = await fs.readFile("example.txt", { encoding: "utf8" });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
example();
```

- All three of fs.readFile(), fs.readFileSync() and fsPromises.readFile() read the full content of the file in memory before returning the data.


## 17. Writing files with Node.js

- The easiest way to write to files in Node.js is to use the fs.writeFile() API.

```js
const fs = require("node:fs");

const content = "Some content!";

fs.writeFile("example.txt ", content, (err) => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});
```

- Writing a file synchronously


```js
const fs = require('node:fs');

const content = 'Some content!';

try {
  fs.writeFileSync('example.txt', content);
  // file written successfully
} catch (err) {
  console.error(err);
}

```

- You can also use the promise-based fsPromises.writeFile() method offered by the fs/promises module:

```js
  const fs = require('node:fs/promises');

async function example() {
  try {
    const content = 'Some content!';
    await fs.writeFile('example.txt', content);
  } catch (err) {
    console.log(err);
  }
}

example();
```

## 18. What is buffer in nodeJS

- Buffer is a temporary memory, mainly used by the stream to hold some data until consumed.
- Buffer is mainly used to store binary data while reading from a file or receiving packets over the network.
- They are created with a specific size (in bytes) and can store any type of data in that allocated space.
- Buffer sizes are fixed, meaning once a Buffer is allocated, its size cannot be changed.

- To create a buffer and allocate the fixed size

```js
const buf1 = Buffer.alloc(10); // creates a buffer of 10 bytes
console.log(buf1);
 //<Buffer 00 00 00 00 00 00 00 00 00 00>
```
- Creating an buffer from an existing array

```js
const buf2 = Buffer.from([1, 2, 3, 4, 5]); // creates a buffer containing 1, 2, 3, 4, 5
console.log(buf2); //<Buffer 01 02 03 04 05>
```

- Creating a Buffer from a string:

```js
const buf3 = Buffer.from('Hello World', 'utf-8'); // creates a buffer containing the string "Hello World" in utf-8 encoding
console.log(buf3); //<Buffer 48 65 6c 6c 6f 20 57 6f 72 6c 64>
```

- Manipulating Buffer Data

```js
const buf = Buffer.from([1, 2, 3, 4, 5]);
const json = JSON.stringify(buf);
console.log(json); // '{"type":"Buffer","data":[1,2,3,4,5]}'

const copy = Buffer.from(JSON.parse(json).data);
console.log(copy); // <Buffer 01 02 03 04 05>
```

- This code snippet demonstrates how to serialize a Node.js Buffer to a JSON string and then deserialize it back to a Buffer.
- It's a practical example of converting binary data to a text-based format and then reversing the process,


## 20 Add middleware for authentication


```js

const express = require("express");
// const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT =   4000;

// Secret key for JWT
const SECRET_KEY = "your_secret_key";

// Middleware to parse JSON bodies
app.use(express.json());


// In-memory user store (for demonstration purposes)
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/',(req,res)=>{
  res.send("Testing route")
})

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(400).send("Username or password is incorrect");
  }

  const accessToken = jwt.sign(
    { username: user.username, id: user.id },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  res.json({ accessToken });
});

// Logout route (just a placeholder since JWTs are stateless)
app.post("/logout", authenticateToken, (req, res) => {
  // Here we just send a message since JWTs are stateless and cannot be invalidated server-side
  res.send(`Logout successful for user ${req.user.username}`);
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.send(`Hello ${req.user.username}, this is a protected route`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```


## 21. Aneother example using middleware

```js

const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Logging middleware
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// Authentication middleware
const authenticate = (req, res, next) => {
  console.log("Headers:", req.headers);
    const apiKey = req.headers["apikey"] || req.headers["apiKey"];
  // const { apiKey } = req.headers;
  if (apiKey === "secret") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

// Validation middleware for user creation
const validateUserCreation = (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).send("Name and email are required");
  }
  next();
};

// Apply the logger middleware globally
app.use(logger);

// Apply the authenticate middleware to specific routes
app.use("/user", authenticate);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

app.get("/about", (req, res) => {
  res.send("Welcome to the About Page!");
});

app.get("/contact", (req, res) => {
  res.send("Welcome to the Contact Page!");
});

app.get("/user/:username", (req, res) => {
  const username = req.params.username;
  res.send(`Welcome to the profile of ${username}`);
});

// POST route with validation middleware
app.post("/user", validateUserCreation, (req, res) => {
  const user = req.body;
  res.send(`User ${user.name} created!`);
});

app.put("/user/:username", (req, res) => {
  const username = req.params.username;
  const updatedUser = req.body;
  res.send(`User ${username} updated to ${updatedUser.name}`);
});

app.delete("/user/:username", (req, res) => {
  const username = req.params.username;
  res.send(`User ${username} deleted!`);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

```
