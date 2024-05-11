### Modules.

- Modules gives us better way to organize funcions and variables so, we can group funcions and variables together to make sense.

## CJs.


```js
//importing 
const doSomething = require('./doSomething.js'); 

//exporting
module.exports = function doSomething(n) {
  // do something
}
```


### AMD.

- AMD stands for Asynchronous Module Definition.
```js
define(['dep1', 'dep2'], function (dep1, dep2) {
    //Define the module value by returning a value.
    return function () {};
});
```
### UMD.

### ESM(ES6)

- Introduced in ES6 (ECMAScript 2015), ES modules are now widely used in modern JavaScript development.

- Named Exports 
```js
// mathUtils.js
export function add(a, b) {
  return a + b;
}
export function subtract(a, b) {
  return a - b;
}
```
- Default exports
```js
// appConfig.js
const config = { appName: 'MyApp', version: '1.0.0' };
export default config;
```

**Importing both**

```js
// index.js
import { add, subtract } from './mathUtils.js'; // Named Import
import config from './appConfig.js'; // Default Import

console.log(add(5, 3)); // Output: 8
console.log(config.appName); // Output: MyApp
```
