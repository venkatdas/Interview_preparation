### Currying


- Currying is a technique of translating a function from callable as f(a, b, c) into f(a)(b)(c).
- It involves breaking down a function that takes multiple arguments into a series of functions that each take a single argument.

- A function takes one argument at a time and return aneother function and expecting the aneother argument.

  This is normal function and will convert this to currying

  ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/90ddccc4-79fb-4b26-9925-fc81a01e4d60)

  - Currying function
 
  ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/a153ce14-38d0-4e21-8a1c-4ee93e7c5c51)


**Why should currying be used?**

Following are the reasons why currying is good :

✅ It makes a function pure which makes it expose to less errors and side effects.

✅ It helps in avoiding the same variable again and again.

✅ It is a checking method that checks if you have all the things before you proceed.

✅ It divides one function into multiple functions so that one handles one set of responsibility.


Examples

1) Convert sum(2,6,1) to sum(2)(6)(1)

```js
function sum(a) {
    return (b) => {
        return (c) => {
            return a + b + c
        }
    }
}
/* you can call it in two ways*/
1️⃣ console.log(sum(1)(2)(3)); //6

2️⃣ const sum1 = sum(1);
const sum2 = sum1(2);
const result = sum2(3);
console.log(result); // 6

// Answer

function sum(a) {
  return function (b) {
    return function (c) {
       return ` Sum is ${a + b+c}`;
    }
   
  };
}

console.log(sum(3)(5)(2));

```

## 2.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/c9930cda-37b3-469e-9d34-a99d00b78385)


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/cda60e62-c89f-4323-987c-3456e0281a84)

## 3. **Infinite currying** -> sum(1)(2)....(n)

_ To implement this solution we have to call recursive function

```js
function sum(a) {
  return function (b) {
    if (b) {
      return sum(a + b);
    } else {
      return a;
    }
  };
}

console.log(sum(3)(5)(2)(15)(4)()); //29
```

**OR**
```js
function sum(a) {
  return function (b) {
    if (b) return sum(a + b)
    else return a;
  };
}

console.log(sum(3)(5)(2)(15)(4)());
```

1️⃣ It will keep returning a function until arguments are provided.

2️⃣ If there are no more arguments specified, we simply return the value of 'a' which is the added total result


## 4. Currying vs Partial Application

- This is Partial Function

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/f26e0ff9-658c-4302-bc81-496f4030502c)

- ✅ We concluded that the above function named sum expected 3 arguments and had 2 nested functions (Partial Application) unlike previous implementation where the function expected 3 arguments and had 3 nested functions.(currying)
- Partial application transforms a function into another function with smaller arity.

## 5. DOM Manipulation using currying



## 6. Write a function curry() that converts f(a,b,c) into a curried function f(a)(b)(c) . 


```js


function curry(func) {
  // func will take function that coverted to curyy
  return function curriedFunc(...args) {
    // this is curried Func
    if (args.length >= func.length) {
      return func(...args);
    } else {
      return function (...nexrArgs) {
        return curriedFunc(...args, ...nexrArgs);
      };
    }
  };
}

const sumResult = (a, b, c) => {
  return a + b + c;
};

const resultVal = curry(sumResult);

console.log(resultVal(2)(3)(4));

```



**How above curry function will work**

```js
function multiply(a, b, c) {
  return a * b * c;
}

const curriedMultiply = curry(multiply);
console.log(curriedMultiply(2)(3)(4)); // Expected output: 24
```

- Purpose: curry is a higher-order function that converts a normal function into a curried version.
Parameters:
- func: The original function that needs to be curried.

**Working Process (Using multiply as an Example)**

1) Function Initialization:
- curry takes the original function (multiply in this case) and returns a new function called curriedFunc.
2) Initial Call:
- curriedFunc is first invoked with a subset of arguments, e.g., resultVal(2).
- Check:
  - If the number of arguments provided (1 here) is less than the arity of multiply (3), curriedFunc returns a new function to collect more arguments.
- This returned function has access to the arguments already collected ([2]).
3) Subsequent Calls:
- Second Call:
- The new function is invoked with another argument, e.g., resultVal(2)(3).
- Now, curriedFunc is called with [2, 3].
- If fewer than 3 arguments are still provided (2 here), it returns another function to gather more arguments.
- Third Call:
- The final function is called with the last argument, e.g., resultVal(2)(3)(4).
- curriedFunc is now called with [2, 3, 4].
3) Final Execution:
- Once curriedFunc is invoked with the full number of required arguments (3 in this case), it directly calls the original multiply function with all collected arguments, computing:

_______________________________

## Infinite currying

```js

function curry(a){
  return function(b){
    if(b){
      return curry(a+b)
    }else{
      return a
    }
  }
}


console.log(curry(1)(2)(3)(null)());


```

- This will work but it will not handle the falsy values, like 0 and null.
- which results undefined

- to remove that we have to add the check condition as follows


```js
function curry(a){
  return function(b){
    if(b!== undefined){
      return curry(a+b)
    }else{
      return a
    }
  }
}


console.log(curry(1)(2)(3)(null)()); //6
```




