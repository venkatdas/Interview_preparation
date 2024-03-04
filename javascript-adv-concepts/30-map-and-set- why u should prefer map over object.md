### Maps:

- Unlike objects map can **store** any **data type of key value**.
- Map is a collection of keyed data items, just like an Object. But the main difference is that Map allows keys of any type.

 Ex:

 ```js

let map  = new Map();

map.set("1","Front End") // string key
map.set(2,"val") // numerric
map.set(true,"true") //boolean key
console.log(map);
console.log(map.size);
console.log(map.get('1'));
console.log(map);

map.has(key) // tells whetther key contains or not
console.log(map.has(true)); //true
```


### Set
- A Set is a special type collection – “set of values” (without keys), where each value may occur only once.
- A Set is a collection of values, where each value may occur only once; it's like a unique array.


```js
let set = new Set();

set.add('apple');
set.add('banana');
set.add('apple');

console.log(set); // Set { 'apple', 'banana' }

```



#### Iteration with set

```js
let set = new Set(["oranges", "apples", "bananas"]);

for (let value of set) alert(value);

// the same with forEach:
set.forEach((value, valueAgain, set) => {
  alert(value);
});
```

#### Iteration with set


-Iteration over Map
- For looping over a map, there are 3 methods:

- map.keys() – returns an iterable for keys,
- map.values() – returns an iterable for values,
- map.entries() – returns an iterable for entries [key, value], it’s used by default in for..of.





 
