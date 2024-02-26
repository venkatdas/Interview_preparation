####Promises

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/846de6a3-c102-4f4e-8c5b-50a86e75e63a)


```js
console.log("promise start");

const promiseResult = new Promise((resolve,reject)=>{
  setTimeout(() => {
    const success = false;
    if (success) resolve("He succeeded");
    else reject(new Error("He's still striving for success?"));
  }, 2000);

})

console.log(promiseResult);

promiseResult.then((res)=>{
  console.log(res);
}).catch((err)=>{
  console.log(err);
})
console.log("promise end");
```

- output
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/f8a136e4-94d3-45e1-b393-95e82865b30a)


_______________________________________________________________________________________

#### callbacks to promises
```js
console.log("start");

function importantAction(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Welcome to the ${username}`);
    }, 2000);
  });
}
function likeTheVideo(video) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Like the ${video} video`);
    }, 1000);
  });
}
function shareTheVideo(video) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Share the ${video} video`);
    }, 1000);
  });
}
function subscribeChannel(video) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Subscribe the ${video} channel`);
    }, 1000);
  });
}

importantAction("codebydas")
  .then((res) => {
    console.log(res);
    likeTheVideo("JS Questions").then((res)=>{
      console.log(res);
      shareTheVideo("Js qustions").then((res)=>{
        console.log(res);
        subscribeChannel("codebydas").then((res)=>{
          console.log(res);
        })
      })
    })
  })
  .catch((err) => console.log(err));
console.log("End");
```


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/b47ccd14-a6bd-41b0-ad9c-29a9224b5fdd)


- we are rewriting this code from callbacks to promises but still it's looks like pyramid of doom
- It's way better than call backs
___________________________________________________
- **To avoid that we can do Promise Chaining**

  ```js
  importantAction("codebydas")
  .then((res) => {
    console.log(res);
    return likeTheVideo("Js questions");
  })
  .then((res) => {
    console.log(res);
    return shareTheVideo("js questions");
  }).then((res)=>{
    console.log(res);
    return subscribeChannel("codebydas")
  }).then((res)=>{
    console.log(res);
  }).catch((err)=>{
    console.log(err);
  })
  ```
- Why this is called promise chaining
- we are returning promise and we are chianing another promise one ofter the other as we return value for the previous prmmise.

   

-----------------------------------------------------------------

#### Promise combinators

1) promise.all();

- If we provided multiple promises to promise.all() it's run all promises in parallel it will return array of fullfilled promises . if one of the promise failed , then it's fail complete promise.all();

- Promise.all() is a method in JavaScript that takes an array of promises and returns a single Promise that resolves when all of the promises in the array have been resolved, or rejects with the reason of the first promise that rejects.
- It's an efficient way to run multiple promises in parallel and wait for all of them to finish


```js
 Promise.all([
   importantAction("codebydas"),
   likeTheVideo("JS Questions"),
   shareTheVideo("Js qustions"),
   subscribeChannel("codebydas"),
 ]).then((res)=>{
  console.log(res);
 }).catch((err)=>{
  console.log("error",err);
 })
console.log("End");
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/fa2e0f20-118e-4417-9349-93140a48d134)

- If promise.all() fails will get the error . and it won't run further

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/1febb749-f4e9-47db-a8f4-95a9d8f2736b)



