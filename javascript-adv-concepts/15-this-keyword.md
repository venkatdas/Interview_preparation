### This keyword

- Ok, so let's start by defining what the this keyword is. In JavaScript, the this keyword always refers to an object. The thing about it is that the object it refers to will vary depending on how and where this is being called.

And there's a few different ways in which you can use the this keyword, so let's see the most common cases and how it behaves in each of them.

- An important comment is that this is not a variable – it's a keyword, so its value can't be changed or reassigned.

## this in global space
- whatever you write outside of the fucntion it will call global scope or top level

`var a=5` // global scope '

`console.log(this) // global object`
In browser's globalObject is window and some other environments it might be a global depending upon the where we are running the this keyword

![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/6f4a8ca3-3592-4af8-9278-5491e61cff48)

## this  keyword inside a function
- This keyword referes to an window object inside the function , where as this window object is different from the global window object
- this keyword inside a fucntion will vary depends on the strict and non strict mode of Javascipt
- strict mode means JS follows some rules to run the program

Let's run the program in strict mode 

![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/b601f48e-daff-4ea2-98b4-02c93cad1d0f)

We will get the value is undefined
- this inside non-strict mode - (this substitution)
- according to (this keyword substition )

If this keyword is undefined or null and this keyword will be replaced with global object ,  and it will work in the non strict mode.


- The below image is this keyword will run in non strict mode
![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/ae2557ac-c11d-40e4-b623-287019d9e347)




