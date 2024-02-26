###Synchrnous vs Asynchrnous


- Sync
```js
console.log("start");
console.log("Welcome to the synchronous code");
console.log("End");
```


- It will execute the code line by line

#### Async

```js

console.log("start");
setTimeout(()=>{
  console.log("Welcome to the Asynchronous code");

},2000)
console.log("End");
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/1bf00767-bd0b-4082-ab3e-19460f7904d6)
a nd it cannot 
- JS is a single thereded language and it can not execute setTimeout in parallel as our code been executed

Example 2) 

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5d8c9b69-938b-4765-ae74-dceade9d1c93)


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/1776a1a0-de7e-4aeb-8503-0c1c80caf3b9)

Example 3) 

```js
console.log("start");

function importantAction(username){
  setTimeout(( ) => {
    return `Welcome to the ${username}`
    
  }, 2000);
}
const result = importantAction("codebydas")
console.log(result);

console.log("End");
```

```js
//result is
start
undefined
end
```

- To make above code to be executed as asynchrnous we have to use callback functions

```js

console.log("start");

function importantAction(username,cb) {
  setTimeout(() => {
    cb (`Welcome to the ${username}`);
  }, 2000);
}
const result = importantAction("codebydas", function (result){

  console.log(result);
})

console.log("End");
```


```js

console.log("start");

function importantAction(username, cb) {
  setTimeout(() => {
    cb(`Welcome to the ${username}`);
  }, 2000);
}
function likeTheVideo(video, cb) {
  setTimeout(() => {
    cb(`Like the ${video} video`);
  }, 1000);
}
function shareTheVideo(video, cb) {
  setTimeout(() => {
    cb(`Share the ${video} video`);
  }, 1000);
}
function subscribeChannel(video, cb) {
  setTimeout(() => {
    cb(`Subscribe the ${video} video`);
  }, 1000);
}
importantAction("codebydas", function (result) {
  console.log(result);
  likeTheVideo("Js Questions", function (action) {
    console.log(action);
    shareTheVideo("JS questions", function (action) {
      console.log(action);
      subscribeChannel("Js questions", (channel) => {
        console.log(channel);
      });
    });
  });
});

console.log("End");
```


