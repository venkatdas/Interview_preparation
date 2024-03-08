

## Functions are first class citizens


- First-class citizenship simply means being able to do what everyone else can do.
- In JavaScript, functions are objects (hence the designation of first-class object).
- JavaScript has all those abilities or features that are required to be a language having First Class Functions, hence functions are treated as First Class Citizens.

- Let’s look at all the abilities of functions being a First Class Citizen.


1. Ability to treat functions as values-
- You can store functions in variables just like any other value.

```js
var hello = function(){
  return "hello world"
}

console.log(hello()) //hello world
```

2 .  Ability to Pass functions as arguments-

```js
function hello(fn){
  fn()
}

hello(function() { console.log("hello world") }) //hello world
```
3. Ability return a function from another function

```js
function hello(){
  return function() {
    return "hello world"
  }
}

var hi=hello()
console.log(hi()) //hello world
```

