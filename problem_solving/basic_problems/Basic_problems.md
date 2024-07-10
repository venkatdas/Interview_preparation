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

**Implementation**

1) Initialize an Empty Array (unique): Start with an empty array to store unique elements.

2) Iterate Over the Original Array (arr): Use a for loop to go through each element in the original array.

3) Check for Uniqueness: For each element arr[i], use indexOf on the unique array to check if it already contains that element.

4) Add Unique Elements: If arr[i] is not found in unique (indicated by indexOf returning -1), add arr[i] to unique using push.

5) Return the Unique Array: After completing the iteration, return the unique array, which now contains only unique elements from arr.

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


## 5. FizzBuzz

- Write a program that prints the numbers from 1 to 100. But for multiples of three print “Fizz” instead of the number and for the multiples of five print “Buzz”.
- For numbers which are multiples of both three and five print “FizzBuzz”.

<details>
<summary>Solution</summary>

```js
for (let i = 1; i <= 100; i++) {
  let output =
    i % 3 === 0 && i % 5 === 0
      ? "FizzBuzz"
      : i % 3 === 0
      ? "Fizz"
      : i % 5 === 0
      ? "Buzz"
      : i;
  console.log(output);
}
```
</details>



## 6. Sort an float array

<details>
  <summary>solution</summary>

```js
function sortFloatArray(arr) {
  return arr.sort((a, b) => a - b);
}

// Example usage:
const floatArray = [3.01, 2.99, 5.55, 4.04, 1.22];
const sortedArray = sortFloatArray(floatArray);
console.log(sortedArray); // [1.22, 2.99, 3.01, 4.04, 5.55]

```
</details>


## 7. Find max and min in array


<details>
  <summary>Solution</summary>

```js
// Define the array of numbers
const arrayItems = [10, 20, 11, 35, 12, 40, 13, 65, 14, 78, 16];

// Find the maximum value in the array
const max = Math.max(arrayItems);
console.log(max); // Output: 78

// Find the minimum value in the array
const min = Math.min(...arrayItems);
console.log(min); // Output: 10
```
</details>

- Alternative Approach

<details>
  <summary>Solution</summary>

```js
function findMaxMin (arr){

  let max = arr[0];
  let min = arr [0];

  for (let i = 0; i < arr.length; i++) {
    if(arr[i]>max){
      max = arr[i]
    } 

    if(arr[i]<min){
      min = arr[i];
    }
    
  }
  return {max,min}


}

console.log(findMaxMin([3,5,623,2,1,232,43,]));
```
</details>


## 8. Follow the Instructions and give the result

```js
// Given two arrays, output should be c=[1,2,3,4,5,9,88]
// merge a and b and remove duplicates
// sort the array in ascending
```

<details>
  <summary>Solution</summary>

```js
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [1, 2, 3, 4, 5, 88, 9, 3];

const mergedArr = [...new Set([...arr1, ...arr2])];

const overallResult = mergedArr.sort((x, y) => x - y);

console.log(overallResult);
```
</details>


## 9. follow the instructions and change the values

```js

// 1. Given the below array
let a = [
  { key: '1', name: 'AAA', field: 'Software', location: 'Bangalore' },
  { key: '2', name: 'BBB', field: 'Hardware', location: 'Bangalore' },
  { key: '3', name: 'CCC', field: 'SW&HW', location: 'Bangalore' },
];

// 2. key 2 should be modified into Software and Hyderabad

```

<details>
  <summary>Solution</summary>

```js
// Use map to iterate and modify the array
let modifiedArray = a.map((item) => {
  if (item.key === "2") {
    // If key is '2', return a modified object
    return {
      ...item, // Spread operator to copy properties from the original object
      field: "Software", // Update the field
      location: "Delhi", // Update the location
    };
  }
  // For other items, return them unchanged
  return item;
});

console.log(modifiedArray);
```
</details>

## 10. 

```js
// Destructure nested city into a plain so that when I log city it should be logging Noida
var obj = { name: "Raj", address: { city: "Noida" } };
```

<details>
  <summary>
    solution
  </summary>

```js
const {
  name,
  address: { city },
} = obj;
console.log(city);
```
</details>


## 11. Check if an object is empty

<details>
  <summary>Solution</summary>

```js
Using Object.keys()//

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

console.log(isEmpty({})); // true
console.log(isEmpty({a: 1})); // false
```


- Using Object.getOwnPropertyNames()

```js
function isEmpty(obj) {
  return Object.getOwnPropertyNames(obj).length === 0;
}

console.log(isEmpty({})); // true
console.log(isEmpty({a: 1})); // false

```
</details>


## 12. How to empty an array in javascript

a) Setting array length to 0

<details>
  <summary>Solution</summary>
  
```js
let arr = [1, 2, 3, 4, 5];
arr.length = 0;
console.log(arr); // []
```
</details>

b) Using the splice() Method

<details><summary>Solution</summary>


```js
let arr = [1, 2, 3, 4, 5];
arr.splice(0, arr.length);
console.log(arr); // []
```
</details>

c) By creating new array

<details>
  <summary>Solution</summary>
```js
let arr = [1, 2, 3, 4, 5];
arr = [];
console.log(arr); // []
```
</details>


d) Using pop method

<details>
  <summary>Solution</summary>

```js
let arr = [1, 2, 3, 4, 5];
while (arr.length > 0) {
  arr.pop();
}
console.log(arr); // []

```
</details>


## 13. Factorial

a) Iterative approach

<details>
  <summary>solution</summary>

```js
function factorialFunc(n) {
  let result = 1;
  for (let i = 2; i < n; i++) {
    result *= i;
  }
  return result;
}

console.log(factorialFunc(5));
```
</details>

b) Recursive Approach

- The recursive approach involves the function calling itself with a decremented value until it reaches the base case (n = 0).

<details>
  <summary>Solution</summary>

```js
function factorial(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120

```
</details>

## 14. Fiboonacii

<details>
  <summary>
    solution
  </summary>

```js
function fibonacciSeries(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  let series = [0, 1]; // Starting point for the Fibonacci series

  for (let i = 2; i < n; i++) {
    series[i] = series[i - 1] + series[i - 2];
  }

  return series;
}

console.log(fibonacciSeries(1)); // Outputs: [0]
console.log(fibonacciSeries(10)); // [0, 1,  1,  2,  3, 5, 8, 13, 21, 34 ]
```
</details>



## 15. Convert 12 hours time into 24 hours

<details>
  <summary>Solution</summary>

  ```js
function convertTo24HourFormat(time12h) {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`
}

// Example usage:
console.log(convertTo24HourFormat("12:00 PM")); // "12:00"
console.log(convertTo24HourFormat("2:00 PM")); // "00:00"
console.log(convertTo24HourFormat("1:00 PM")); // "13:00"
console.log(convertTo24HourFormat("1:00 AM")); // "01:00"
```
</details>

## 16. palindrome number

<details>
  <summary>solution</summary>

```js
function isPalindrome(number) {
    // Convert the number to a string
    const numStr = number.toString();
    
    // Reverse the string
    const reverseStr = numStr.split('').reverse().join('');
    
    // Compare the original string with the reversed string
    return numStr === reverseStr;
}

// Example usage
console.log(isPalindrome(12321)); // true
console.log(isPalindrome(123456)); // false

```
</details>

- without using the inbuilt methods

<details>
  <summary>Solution</summary>

```js
function isPalindromeNumber(number) {
  // Early return for negative numbers as they cannot be palindromes
  if (number < 0) return false;

  let originalNumber = number; // Keep the original number for comparison
  let reversed = 0;

  // Process to reverse the number, similar to the reverseNumber function
  while (number > 0) {
    let lastDigit = number % 10;
    reversed = reversed * 10 + lastDigit;
    number = Math.floor(number / 10);
  }

  // Compare the original number with the reversed number
  return originalNumber === reversed;
}

// Example usage
console.log(isPalindromeNumber(12321)); // true, because it reads the same backward as forward
console.log(isPalindromeNumber(-12321)); // false, negative numbers are not considered palindromes
console.log(isPalindromeNumber(12345)); // false, because it does not read the same backward as forward
```
</details>


## 17. Reverese the number

- Loop until the number is greater than 0. Each iteration processes one digit:
- Extract the last digit of the number using the modulo operation (number % 10).
- Add this digit to the reversed number, correctly positioning it by first multiplying reversed by 10 (to shift existing digits left) and then adding the extracted digit.
- Remove the processed (last) digit from number by dividing it by 10 and using Math.floor() to ensure the result is an integer, effectively shifting all digits right.


<details>
  <summary>Solution</summary>

```js
function reverseNumber(number) {
    let isNegative = number < 0; // Check if the number is negative
    number = Math.abs(number); // Convert to absolute value

    let reversed = 0;
    while (number > 0) {
        let lastDigit = number % 10;
        reversed = (reversed * 10) + lastDigit;
        number = Math.floor(number / 10); // Remove the last digit
    }

    if (isNegative) {
        reversed = -reversed; // Reapply the negative sign if needed
    }

    return reversed;
}

console.log(reverseNumber(-123)); // Output: -321
```
</details>



## 18. Find the third largest element in the array

<details>
  <summary>Solution</summary>

```js
function findThirdLargest(arr) {
  if (arr.length < 3) {
    throw new Error("Array should have at least three elements");
  }

  // Initialize the first, second, and third largest elements
  let first = -Infinity;
  let second = -Infinity;
  let third = -Infinity;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > first) {
      // Update first, second, and third
      third = second;
      second = first;
      first = arr[i];
    } else if (arr[i] > second && arr[i] < first) {
      // Update second and third
      third = second;
      second = arr[i];
    } else if (arr[i] > third && arr[i] < second) {
      // Update third
      third = arr[i];
    }
  }

  return third;
}

// Example usage:
const arr = [12, 13, 1, 10, 34, 16];
const thirdLargest = findThirdLargest(arr);
console.log(thirdLargest);  // Output: 13
```
</details>
