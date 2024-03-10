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

- In order to understand what this function does we need to talk about the weird syntax. The first weird syntax is the asterisk * next to the function keyword.
- This is simply there to tell JavaScript you are creating a generator function. Every generator function will use the function* syntax.

- This yield keyword essentially constitutes a break in the generator. Whenever yield is encountered the generator will stop running and will return the value.
- You can almost think of the yield keyword as a mini return.
-  So how do you access the values from the yield and how do you tell the generator function to continue on to the next yield?



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/1e0b4721-b3d5-4f4a-8691-4926b0a9e0b0)

- From above image we get results instantly

_________________________

- To work with manual on those values.. yield is nothing but , we can pause the execution untill we give the next command.
- You can also manually control the execution of a generator by using the next() method on the generator object.
- This method returns an object with two properties: value, which is the yielded value, and done, which is a boolean indicating whether the generator has finished executing.

- 
```js
function* simpleGenerator() {
  yield 1
  yield 2
  yield 3
yield 4
}

const generatorObject = simpleGenerator()
console.log(generatorObject.next())
// { value: 1, done: false }
console.log(generatorObject.next())
// { value: 2, done: false }
console.log(generatorObject.next())
// { value: 3, done: false }
console.log(generatorObject.next().value) //4
console.log(generatorObject.next())
// { value: undefined, done: true }
```


