

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
