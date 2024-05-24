## Reverse vowels in a string

**Approach taken**

- Define a string of vowels: This helps us quickly check if a character is a vowel.
- Array to store the vowels: We create an array foundVowels to store the vowels found in the string.
- Collect all vowels: Loop through the string and add each vowel to the foundVowels array.
- Convert the string to an array: Convert the string to an array to manipulate it easily.
- Replace vowels with reversed vowels: Loop through the array again and replace each vowel with the last vowel from foundVowels (using pop() to get them in reverse order).
- Convert the array back to a string: After all replacements are done, convert the array back to a string to get the final result.


```js
function reverseVowels(str) {
  const vowels = "aeiouAEIOU";

  let vowelsArr = [];

  for (const char of str) {
    if (vowels.includes(char)) {
      vowelsArr.push(char);
    }
  }

  let splitArr = str.split('')

for (let i = 0; i < splitArr.length; i++) {
  if(vowels.includes(splitArr[i])){
    splitArr[i]=vowelsArr.pop();
  }
  
}
return splitArr.join('')

}

console.log(reverseVowels("hello")); // holle

```


```js
  if(vowels.includes(splitArr[i])){
    splitArr[i]=vowelsArr.pop();
  }
```


- how above line works here

- splitArr is an array of characters derived from the original string. For example, for the input string "hello world", strArray would be ['h', 'e', 'l', 'l', 'o'].
- vowelsArr is an array that stores all the vowels found in the original string in the order they appear. For "hello", vowelsArr would be ['e', 'o', 'o'].

- vowelsArr.pop(): This part of the line removes the last element from the vowelsArr array and returns it. In the context of the example "hello", the first time pop() is called, it returns 'o' and the vowelsArr array becomes ['e', 'o'].
- splitArr[i]: This refers to the current character in the strArray at index i that we're processing.


- **1. First Vowel Replacement:**
-
  1. Let's say i = 1 (the second character in "hello" is 'e', which is a vowel).
  2. vowelsArr.pop() returns 'o' (the last vowel in foundVowels).
 3. splitArr[1] = 'o' replaces 'e' with 'o'.
4. Now, splitArr looks like ['h', 'o', 'l', 'l', 'o'].
5. vowelsArr is now ['e', 'o'].
