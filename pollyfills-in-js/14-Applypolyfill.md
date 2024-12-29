

## Apply polyfill

Syntax

`func.apply(thisArg, [argsArray])`


```js

Function.prototype.myCall =  function (context ={}, ...args) {
  //context is empty object
  // we don't know how many arguments are there so used ...args rest operatot

  if(typeof this !== 'function'){
    throw new Error (this +' it is not  callable')
  }
// context is object, we can add function into that
  context.fn = this;
  context.fn(...args)

}
purchaseCar.apply(car1,["$",657365]);
```

____

**Approach**




```js
Function.prototype.myApply =  function (context ={}, args=[]) {
  //context is empty object
  // we don't know how many arguments are there so used ...args rest operatot

  if(typeof this !== 'function'){
    throw new Error (this +' it is not  callable')
  }

  if(!Array.isArray(args)){
    throw new Error("TypeError: CreateListFromArrayLike called on non-object");
  }
// context is object, we can add function into that
  context.fn = this;
  context.fn(...args)



  
}

purchaseCar.myApply(car1,["$",657365]); //I have purchased Red and Ferrari car for $ 657365

```
--------------------------


## `apply` Polyfill

The `apply` method is used to call a function with a given `this` value and an array of arguments. Here's a custom implementation:

### Code:

```javascript
Function.prototype.myApply = function (thisArg, args) {
  // If the context is null or undefined, default to globalThis
  thisArg = thisArg || globalThis;

  // Temporarily set the function (`this`) as a property (`fn`) of the `thisArg` object
  thisArg.fn = this;

  // Call the function (`thisArg.fn`) with the arguments spread from the array `args`
  const result = thisArg.fn(...args);

  // Clean up by deleting the temporary property
  delete thisArg.fn;

  // Return the result of the function call
  return result;
};
```

### Explanation:
1. **`thisArg = thisArg || globalThis;`**:
   - If `thisArg` is `null` or `undefined`, it defaults to `globalThis`, ensuring that the function uses the global object as the context when no valid `thisArg` is provided.
   
2. **`thisArg.fn = this;`**:
   - The function (`this`) is temporarily assigned as a property (`fn`) of the `thisArg` object. This allows the function to be invoked with `thisArg` as its context.

3. **`const result = thisArg.fn(...args);`**:
   - The function is called with the arguments spread from the `args` array. This ensures that the function is executed with the correct context (`thisArg`) and the provided arguments.

4. **`delete thisArg.fn;`**:
   - After the function call, the temporary property `fn` is deleted from `thisArg` to avoid modifying the object permanently.

5. **`return result;`**:
   - The result of the function call is returned.

### Example Usage:

```javascript
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

const person = { name: 'Alice' };
greet.myApply(person, ['Hello', '!']); // Outputs: "Hello, Alice!"
```