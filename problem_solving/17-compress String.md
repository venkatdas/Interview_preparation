```js

function compressedString(str) {
  if (str.length === 0) {
    return "Enter a valid string";
  }

  let compressed = "";
  let count = 1;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === str[i + 1]) {
      count++;
    } else {
      compressed = compressed + str[i] + count;

      count = 1;
    }
  }
  return compressed;
}

console.log(compressedString("aaabc")); //a3b1c1

console.log(compressedString("")); // Enter a valid string
console.log(compressedString("aaaa")); //a4
console.log(compressedString("aaaabbc")); //a4b2c1
console.log(compressedString("aaaabbcaabb")); //a4b2c1a2b2

```




