### Event Loop

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5957a087-d05e-4065-951e-14d5a51fe0f3)

- When program runs callstack is created and inside there is GEC and after it will run the line by line.



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/4a196ac6-b871-41fe-9be1-5e1537e0f74c)


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/7da31637-875b-401e-a4c0-b3605bbb60c6)

- From above Image those are not part of the javascript . and those features consits from browser and browser gives access to our callstack
- through `window` keyword.


--------------------------------------------------

#### How Asynchronous code executed inside the callstack

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/e80817a3-4a3e-40cc-b55a-53fb217921c8)

- we have an image with setTimeout function and as we know everytime when code runs it will create global execution context which syncrnous code.
- When next line comes it is a callback function and this passed to setTimeout and  it will basically registers  the callback.
- And next sees the delay it also starts the timer of 5000 ms to the timer provided by the browser and it will start the counting
- Next javascript code moves to the next line and it does not wait for anything and it sees the code logs the `end` value.
- And GEC pops up.

- Meanwhile timer is running.. As soon as timer fininshes and that callback function need be executed
- As we know JS code is executed inside the GEC and callback also need be executed in that only...
- But, it does not passes directly

**Now EVENT LOOP and Callback Queue comes to the picture.**


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/522fc7ae-ea5a-4484-a6e2-3901dc90e7ea)

- From above picture
- callback directly can not go into the callstack instead of that it will simply go to the callback queue and cb function waits there.
- Now **Event Loop** functionality it acts as a mediator between GEC and callstack queue and it checks if there is function inside the
- callstack queue , if it is then it will pass that function to the call stack ,GEC and agian the process is same.. it will create GEC again and executes the code.
- Finally `callback` strings logs to console.

--------------------------------

### How Event Handlers works?

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/be3aae04-b14e-4747-966a-49643a7d1431)

-----------------------------------
### Why do we need callback Queue?

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/3c54f3cd-2869-488f-8a14-7a15d1653365)


----------------------------------------

#### How fetch method works?

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/bb1581e2-d10e-4bcc-81bb-a34ff3ab41af)

- Microtasks will have more priority than the callback queue.
---------------------------
#### What are microtasks in JS?

### What can come into the microtask queue?

- All callback functions which comes through promises will go to the microtask queue and Mutation observer
- 
- Remaining web API's will go to the callback queue


----------------------------
### Starvation of the callback queue
or
- starvation of callbacks or taks inside the callback queue

- How it occures
- if microtask will create another microtask if it is keep on going the callback will never get chance to execute the task .. this is called starvation of the callback queue.
- 




