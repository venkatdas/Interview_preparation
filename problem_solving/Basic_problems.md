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
  
```js
  function reverseString(str) {
  // const str = "das";
  return str.split("").reverse().join("");
}

console.log(reverseString("hello")); //olleh
```
</details>

## Without using inbulit methods (using loops)


<details>
  <summary>solution</summary>

  ```js
function reverseString(str) {
  let reversed = ""; // Step 1
  for (let i = str.length - 1; i >= 0; i--) {
    // Step 2
    reversed += str[i]; // Step 3
  }
  return reversed;
}

console.log(reverseString("hello from india")); //aidni morf olleh
```
</details>


## 2. Check If string is palindrome or not

<details>
  <summary>Solution</summary>

  ```js

function isPalin(str) {
  const reveredStr = str.split("").reverse().join("");

  return reveredStr === str;
}

console.log(isPalin("madam")); //true
console.log(isPalin("hello")); //false
```
</details>


## 3. Find the MAX element in the array

- USING math.max

```js
function findMax(arr) {
    return Math.max(...arr);
}
console.log(findMax([1, 3, 5, 7, 9]));  // Outputs: 9

```

- without using inbuilt method

<details>
  <summary>
    solution
  </summary>

  
  ```js
    function findMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

console.log(findMax([1, 3, 5, 7, 9])); // Outputs: 9
```
</details>

## 4. Find unique elements in array without using inbuilt methods

<details>
  <summary>
    solution
  </summary>

  
  ```js
  
function uniqueElements(arr) {
  let unique = [];
  for (let i = 0; i < arr.length; i++) {
    if (unique.indexOf(arr[i]) === -1) {
      unique.push(arr[i]);
    }
  }
  return unique;
}
console.log(uniqueElements([1, 2, 3, 4, 1, 2])); //[1, 2, 3, 4]
```
</details>
