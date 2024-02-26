#### Async/Await

```js
console.log("start");

function importantAction(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Welcome to the ${username}`);
    }, 1000);
  });
}
function likeTheVideo(video) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Like the ${video} video`);
    }, 100);
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
      reject(`Subscribe the ${video} channel`);
    }, 1110);
  });
}

const result = async () => {
  try {
      const messag1 = await importantAction("Codebydas");
      console.log(messag1);
      const message2 = await likeTheVideo("js questions");
      console.log(message2);
      const message3 = await shareTheVideo("js questions");
      console.log(message3);
      const message4 = await subscribeChannel("codebydas");
      console.log(message4);
  } catch (error) {
    console.log("Promise failed" , error);
    
  }

};
result();
console.log("End");

```
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/dda77033-aab5-4b81-af3c-223aa8d1974b)

