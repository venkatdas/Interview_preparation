## Node 

- event diven architecture
- capable of Asynchrnous I/O  or (Non-blocking I/O)

**History Of node JS**

- wherever there is JS, defintly there is JS engine


## EPI-4
- **Module.export&require**
- By default modules are protected means moduled protected their variables and functions from leaking

- To export multiple modules we have to use object like this
  
```js

module.exports = {sum:sum,

y:y}
```

# EPI-5

- How node executes modules
- the whole file that u have imported so far treats as a function, this func is IIFE.
- like example in a function if u declare a variable and u can not access it from outside, the same way modules will work until u export.

![image](https://github.com/user-attachments/assets/005de3c5-c030-4da9-b434-6a0ff33b60b2)

- the above image treated as a function.

![image](https://github.com/user-attachments/assets/a9a08e7c-6b85-4ed2-bb49-00e6eb50ee60)

-- Reason is, which private access, immediate invoke

![image](https://github.com/user-attachments/assets/ecd41ff1-474d-4316-bf92-5c6eb66aacf8)

- From the  above the require comes from the node js and passes to IIFE as parameters.
**Steps to execute from require path**

![image](https://github.com/user-attachments/assets/9266f0b7-1fad-4f81-b2fb-31198ecb4ae7)



# EPI-6 Libuv & Asynchrnous I/O


- Synchrnous vs Asynchrnous

![image](https://github.com/user-attachments/assets/e9d185ac-0222-4d4a-b506-06d1162ff050)

_______________________

- This is how unused memory collects from heap.

![image](https://github.com/user-attachments/assets/35441bce-4a75-4c56-8268-2aff0c838de8)

- Js Garbage collector colects the memory of unused variables or functions.

![image](https://github.com/user-attachments/assets/167948da-7fd2-483e-ac90-d7c041ea100c)


# EPI- 7 - sync,Async, execution code

![image](https://github.com/user-attachments/assets/a230d389-62d7-488e-bc8d-8698ef696718)

- Blocking code

![image](https://github.com/user-attachments/assets/37af8005-43fb-4892-9208-6f30de96cd2b)

- Timeout

![image](https://github.com/user-attachments/assets/c3a47602-d659-46b8-b092-340cbd2b7796)


# EPI-9 Libuv and Event loop

![image](https://github.com/user-attachments/assets/80ccb4fc-471b-42b3-9d2a-dc5da7a11ebe)

![image](https://github.com/user-attachments/assets/7b1789b4-c05c-404e-8ad4-38803970a915)

- Evnet loop phases

![image](https://github.com/user-attachments/assets/6ebf19f5-40c1-48bb-acc8-3eaf986cd48e)


- jgh

![image](https://github.com/user-attachments/assets/a913140d-ed87-4fde-b3ee-19d2ab0d539d)

- From above image , process.nextcallbacks runs before any loop starts.

**Example 1**

```js
require('./xyz')
const fs = require("fs")

const a =100;
setImmediate(()=>console.log("setImmediate"))

fs.readFile("./file.txt","utf8",()=>{
    console.log("File Reading CB");
    
})
setTimeout(()=>console.log("Timer Expired"),0)

function printA(){
    console.log("a=",a);
    
}
printA();
console.log("Last line of the file");

//output
a= 100
Last line of the file
Timer Expired  
setImmediate   
File Reading CB


```

