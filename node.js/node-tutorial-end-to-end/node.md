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

![Uploading image.png…]()

