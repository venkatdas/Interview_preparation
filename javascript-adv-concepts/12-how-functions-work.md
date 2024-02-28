### functions


![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/019007dc-abb7-48ba-91d9-e82860bd9bbe)




![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/44fb7b2a-bb12-48dd-963a-cd57f37aa0b0)

- second function of working

  


![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/e0655fb0-d375-433c-8a69-5d55de1ba68a)


- after everything cleared from context and call stack our program successfully runs.



#### Window and this


- Whenever you create an execution context and this keyword is created along with it even for functinal and global execution context
- At global level this points to global object called window


![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/1a02b957-915e-4e87-b82e-90f8361dba13)

- whenever you create varables in gobal space these can be attached in a window

### Another example

![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/86f88bef-ba87-43dd-8ae0-e64980b8cdf5)


- The x is not defined in the global space it is intially in the local scope that is the reason we are getting the error x is not defined

- if you try log the values with 'window.a' or 'a' will get the result because it is in global scope
- finally 'window===this'
- even 'console.log(this.a)' will get the value of a
