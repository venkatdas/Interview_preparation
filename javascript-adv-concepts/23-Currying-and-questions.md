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






