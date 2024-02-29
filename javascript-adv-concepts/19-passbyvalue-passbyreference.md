### Pass By value vs Pass by reference

- Primitives are pass by values

```js

let x =2;
let y=x;
y+=1;
console.log(x); //2
console.log(y); //3
```

- By adding 1 to the `y` we did not change the value of `x` so we pass the value.


### Strcutural types uses reference

```js
let xArray = [1, 2, 3];
let yArray = xArray;
yArray.push(4);
console.log(yArray);
console.log(xArray);
```

### Mutable vs Immutable

- Primitives are mutable
- Non primitives are immutable
