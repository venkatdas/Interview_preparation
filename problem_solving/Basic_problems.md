## We have to know these problems mandatory


## 1. Reverse String

- Steps

1) Split the String into Characters: Convert the string into an array of characters. You can do this by using the split('') method, where the empty string '' argument indicates that the split should occur at every character.

2) Reverse the Array: Use the reverse() method to reverse the order of elements in the array. This will place the last character of the string at the beginning and the first character at the end.

3) Join the Characters Back into a String: Convert the array of characters back into a single string. The join('') method is used for this purpose, where passing an empty string '' as the argument means that the characters should be joined without any additional characters inserted between them.


<details>
  <summary>
    Solution
  </summary>
```
  function reverseString(str) {
  // const str = "das";
  return str.split("").reverse().join("");
}

console.log(reverseString("hello")); //olleh
```
</details>

