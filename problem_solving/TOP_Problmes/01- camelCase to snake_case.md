```js
function camelToSnake(str) {
  let result = "";

  for (let i = 0; i < str.length; i++) {
    let char = str[i];

    if (char === char.toUpperCase()) {
      result = result + "_" + char.toLowerCase();
    } else {
      result += char;
    }
  }
  return result;
}

console.log(camelToSnake("iAmVenkatdasFromIndia")); 
// Output: "i_am_venkatdas_from_india"

```
