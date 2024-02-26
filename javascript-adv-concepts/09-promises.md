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

- **To avoid that we can do Promise Chaining**

   





