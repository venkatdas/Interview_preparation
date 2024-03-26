### Node Js

## 1.What is node.js
-----


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
