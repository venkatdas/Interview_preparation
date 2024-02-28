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
- 
