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

