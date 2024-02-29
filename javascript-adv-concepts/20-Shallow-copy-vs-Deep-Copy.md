### Shallow Copy vs Deep Copy

- Before that
- Pure functions require you to aviod mutating the original data
- Impure function mutates the original data


**Ex:**

```js
const scoreArray = (array, score) => {
  array.push(score);

  return array;
};

const resultArray =[34,45,23,24]

console.log(scoreArray(resultArray,28));
```
- It will mutate the original array
- Note: `const` does not make immutable


### Shallow Copy. Objects are reference typed

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6d1cf4d5-4804-47fe-ad02-c98bedacf2db)

- Even if I change the second object still it got reflected to object1

- To avoid this we can use two methods
  1) Object.assign();

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/42e6c761-92c6-46d8-bd90-836c0160440a)


2) Spread Operator


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/f3fb7482-af2c-44ca-ac3a-86ac7b94d2e0)

### Deep Copy
- what if multiple nested objects are there the above two methods won't work

  ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/8f6ffca6-5600-493c-adcf-99507e1dcb19)

  **Result**


  ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/2002614d-0d31-4f15-b2ad-31a619cd2d0c)



