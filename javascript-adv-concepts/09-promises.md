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


2) **Promise.race();**

- Promise.race() is another promise combinator similar to Promise.all(), but instead of waiting for all promises to be resolved or rejected, Promise.race() will resolve or reject as soon as one of the promises in the iterable resolves or rejects, with the value or reason from that promise.
- Time can be a critical factor with Promise.race() because the first promise to settle (either resolve or reject) determines the outcome of the entire Promise.race() operation.
- It retuns first promise of whether it is fullfilled or rejected.

```js
 Promise.race([
   importantAction("codebydas"),
   likeTheVideo("JS Questions"),
   shareTheVideo("Js qustions"),
   subscribeChannel("codebydas"),
 ])
   .then((res) => {
     console.log(res);
   })
   .catch((err) => {
     console.log("error", err);
   });
```
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/24a0927f-fd0e-453c-9709-0bccf3d6df30)

- Here **likeTheVideo** function has less time that's why it's logged

- If reject/resolve  based on the time, promise.race will log that



**3) promise.allSettled();**

- This method returns a promise that resolves after all of the given promises have either resolved or rejected, with an array of objects that each describe the outcome of each promise.
- Promise.allSettled() is particularly useful when you want to know the result of each promise, regardless of whether it was fulfilled or rejected.

```js

 Promise.allSettled([
   importantAction("codebydas"),
   likeTheVideo("JS Questions"),
   shareTheVideo("Js qustions"),
   subscribeChannel("codebydas"),
 ])
   .then((res) => {
     console.log(res);
   })
   .catch((err) => {
     console.log("error", err);
   });
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/276c14f3-7eab-4750-803f-e5189fd320b5)


**4) Promise.any();**

- it does it only return first fullfilled promise and ignores all the rejected ones


-----------------------------------------------------------------------------------------------------

### input/output

## 1.

```js

console.log("start")

const promise1 = new Promise((resolve,reject)=>{
  console.log(1); // synchrnous
  resolve(2)
}).then((res)=>{
  console.log(res);
})
console.log("end"); //sync
```

<details>
  <summary>
    solution
  </summary>
  
 ```js
start
 1
 end
 2
```

</details>

## 2.
```js

console.log("start")

const promise1 = new Promise((resolve,reject)=>{
  console.log(1); // synchrnous
  resolve(2)
console.log(3)
}).then((res)=>{
  console.log(res);
})
console.log("end"); //sync
```
<details>
  <summary>
    solution
  </summary>

  ```js

start
1
3
end
2
```
</details>

## 3.

```js
console.log("start");

const fn =()=>
  new Promise((resolve,reject)=>{
    console.log(1);
    resolve("success")
  })
  console.log("middle");

  fn().then((res)=>{
    console.log(res);
  })

console.log("end"); //sync

```
<details>
  <summary>
    Solution
  </summary>
  
  ```js
  start
  middle
  1
  end
  success
```
</details>

## 4.

```js
function job(){
  return new Promise((resolve,reject)=>{
    reject();
  })
}

let promise = job();
promise.then((res)=>{
  console.log("success 1");
}).then(()=>{
  console.log("suc 2");
}).then(()=>{
  console.log("suc 3");
}).catch(()=>{
  console.log("error 1");
}).catch(()=>{
  console.log("error 2");
}).then(()=>{
  console.log("suc 4");
}).then(()=>{
  console.log("suc 5");
})


```
<details>
  <summary>Solution</summary>
  ```js
  error 1
suc 4
suc 5
```
</details>
