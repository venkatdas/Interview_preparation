## Bind polyfill

syntax:


- Before custom polyfill
- 
```js

let car1 = {
  color: "Red",
  company: "Ferrari",
};

function purchaseCar(currency, price) {
  console.log(
    `I have purchased ${this.color} and ${this.company} car for ${currency} ${price}`
  );
}

console.log(purchaseCar.bind(car1)); // which gives us function of purchase car.
```

- If i want to execute that `console.log(purchaseCar.bind(car1)());` // I have purchased Red and Ferrari car for $ 9000000


______________

Approach



```js

Function.prototype.myBind = function (context = {}, ...args) {
  //context is empty object
  // we don't know how many arguments are there so used ...args rest operatot

  if (typeof this !== "function") {
    throw new Error(this + " can not be bound as  it is not  callable");
  }

  // context is object, we can add function into that
  context.fn = this;

  return function (...innerArgs) {
    return context.fn(...args, ...innerArgs);
  };
};

const newFunc = purchaseCar.myBind(car1,"$")

console.log(newFunc(900000));
```






