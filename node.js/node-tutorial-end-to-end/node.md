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
