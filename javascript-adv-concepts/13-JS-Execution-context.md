# JS exection context
- Javascript is a synchrnous single threaded language

- ![execuion-context](https://github.com/venkatdas/javascript-advanced/assets/43024084/9cdcc508-aad7-44ae-95b0-5da4e98cf5f5)


- When you run program executioncontext is created

- Let's take example for how code is executed
- 


![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/f79512b3-9f4c-4abe-82d7-c9dac35cc519)

form the above Image the exection context is created and this is how it looks like

![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/1d2fe88d-8b1a-487d-8b67-b7fa5af3d9da)

_ Intially, in memory cell, jS creates memory for each and every variable as undefined and for the functions it will be created like whole strctured function data within curly braces


-  In code phase all variables are replaced with the values instead of undefined and invoke the function
-  when invoke the function again executionn context is created calculate the 'ans' variable and it returns data . once it is completed execution context is deleted



## JS call stack

- call stack maintains the** order of exection **of execution contexts.
- call stack also known as below words

![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/870d5bec-b5a7-484c-88f5-e69d2cc22813)



![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/ad99b322-b970-4074-9047-940222cdab76)

- Whole global execution stack is pushed into the stack now it will go the function again it will create new context onece it is executed it will popup from the stack and then it will navigate to the another function once it is completed it will pop untill stack is empty.








