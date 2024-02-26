![image](https://github.com/venkatdas/Interview_prep/assets/43024084/846de6a3-c102-4f4e-8c5b-50a86e75e63a)####Promises


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



