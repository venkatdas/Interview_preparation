## Debounce and throttling

- Debouncing and throttling are both used to enhance the website performance by limiting the number of times the events are triggered. Debouncing and throttling are not provided by JavaScript.
- They’re just concepts that can be implemented using the setTimeout web API.
- These techniques are particularly useful in handling repetitive events such as scrolling, resizing, keypress, or mouse movements in web development, allowing for better performance and user experience.


 ### Debouncing
- **Definition**: Debouncing is a technique where you delay the execution of a function until after a certain amount of time has passed.
- No matter how many times the user fires the event, the connected function will only run once the user stops firing the event, according to the Debouncing approach. 
- Essentially, it ensures that a function does not get called again until a certain amount of time has passed without it being called.

- Let’s take an example. You have opened an e-commerce website to search for laptop bags.

- If debounce is not applied you can see in the below image the number of calls is made on every keystroke.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/9653d263-816f-4852-ae73-f1f358869249)

- After implementing debounce, we have significantly reduced the number of calls. Now calls are made only when the user types again after the specified time.
- The function will be executed only when the time taken by the user to type again is equal to the delay that we have provided.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/8b2a97f9-b664-43d2-986a-7cde80ff1988)

___________________________


### Throttling:

- **Definition**:
- Throttling is a similar technique to debouncing, but instead of delaying the execution of a function, it limits the rate at which a function.
- Throttling is a technique in which, no matter how many times the user fires the event, the attached function will be executed only once in a given time interval. 

- Throttling is also used to rate-limit the function call.
- Throttling will fire the function call only once in 1000ms(the limit which we have provided), no matter how many times the user fires the function call.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/4a91590b-c454-45c7-8314-0b6fe8754aff)
 

------------------------------

## Implementation of debounce using lodash as follows

**Question**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5aae2be7-f218-4770-94f8-a9ae4c73cea0)


```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>this keyword</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div>
      <h1>Debounce</h1>
    </div>

    <button class="increment_btn">Increment</button>
    <p>Button Pressed <span class="increment_pressed">0</span> Times</p>
    <p>Triggered<span class="increment_count"> 0 </span> Times</p>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js" integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="./script.js"></script>
  </body>
</html>

```

```js

const btn = document.querySelector(".increment_btn");
const btnPress = document.querySelector(".increment_pressed");
const count = document.querySelector(".increment_count");

var pressedCount = 0;
var triggerCount = 0;

const debouncedCount =  _.debounce(()=>{
 count.innerHTML = ++triggerCount; // we're gonna increment the pressed count and
//add it to the innerHtml of increment_pressed class

},800)


btn.addEventListener("click", function () {
 btnPress.innerHTML= ++pressedCount;
 debouncedCount()
});

```

**Output**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6f0baee3-e774-4ae4-b0dd-d7a016f0bfb0)


- From abbove image we implemeted a deobounce technique
- when you're continuosly pressing it's not going to increment , It will only when give a pause or it will pass 800ms then only it will trigger.



  ________________________________

### Throttle Implementation.

**Question**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/84b6cb29-78f0-4143-a52a-057dc73d590d)


- Everything is same in html code and slight change in js as shown here,

```js
const btn = document.querySelector(".increment_btn");
const btnPress = document.querySelector(".increment_pressed");
const count = document.querySelector(".increment_count");

var pressedCount = 0;
var triggerCount = 0;
const start = new Date().getTime();
const throttledCount =_.throttle(()=>{
  const now = new Date().getTime()
  console.log(now-start);
  count.innerHTML=++triggerCount

},800)


btn.addEventListener("click", function () {
 btnPress.innerHTML= ++pressedCount;
 throttledCount();
});

```

output


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/799d3653-e399-43db-a9dd-653bbe912b01)


- From above image we can notice that it can trigger every 800 ms without pause.. that user clicks.
- We can notice the time difference also between them which has 800 ms or more

_____________________

## Debounce polyfill

```js

const myDebounce = (cb,delay) => {
let timer; // measure the time for every single key storke or button press
return function (...args) { //return function of debounce 
if(timer) clearTimeout(timer)
  timer= setTimeout(() => {
    cb(...args)
    
  }, delay);
  
}

};
```

___________________________

## Throttile polyfill









