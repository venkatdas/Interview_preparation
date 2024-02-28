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

### ESM
