## 3. What are the different module systems


**1. CJS**

- CommonJS is the module system used in Node.js.
- It was one of the first widely adopted JavaScript module systems and remains very popular in the Node.js ecosystem.
- Modules are defined using module.exports and imported using require
- Modules are loaded synchronously.
- non strict mode
- older way

- Mainly used in server-side JavaScript (Node.js). Not recommended for browser use due to its synchronous nature.

```js
// Exporting a module
const myFunction = () => {
  console.log("Hello from CommonJS");
};
module.exports = myFunction;

// Importing a module
const importedFunction = require('./myModule');
importedFunction();

```


**ECMAScript Modules (ESM)**

- MJS
- ECMAScript Modules, also known as ES Modules, were introduced in ES6 (2015) as the official standard for JavaScript modules.
- They are now supported by modern browsers and Node.js.
- Modules are defined using export and imported using import.
- Modules are loaded asynchronously.
- Preferred for both client-side (browser) and server-side (Node.js) applications due to its support for asynchronous loading and better performance.

```js
// Exporting a module
export const myFunction = () => {
  console.log("Hello from ES Module");
};

// Importing a module
import { myFunction } from './myModule.js';
myFunction();
```
**Asynchronous Module Definition (AMD)**

- AMD was created for the browser to define modules that can be loaded asynchronously. The most notable library that uses AMD is RequireJS.
- Uses a define function to define modules and a require function to import them.
- Modules can be loaded asynchronously, which is useful for optimizing load time in browsers.

```js
// Defining a module
define(['dependency1', 'dependency2'], function(dep1, dep2) {
  function myFunction() {
    console.log("Hello from AMD");
  }
  return myFunction;
});

// Importing a module
require(['myModule'], function(myFunction) {
  myFunction();
});
```


**4. Universal Module Definition (UMD)**

