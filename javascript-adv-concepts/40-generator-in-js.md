## Generator


- Generators are functions that can be paused and resumed, making them very useful for scenarios such as managing asynchronous operations in a synchronous manner, processing large datasets,
- and implementing custom iterators.

- A generator function is defined similar to a regular function, but with the function* syntax (notice the asterisk). When called, it doesn't execute its code immediately.
- Instead, it returns a special object called a Generator object.

Example 1)


```js
function* simpleGenerator() {
  yield 1
  yield 2
  yield 3
}
```

  
