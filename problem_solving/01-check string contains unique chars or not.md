## Check wheather string contains unique chars or not?

**Approach Taken**

- Initiate Outer Loop: Start looping through each character in the string.
- Initiate Inner Loop: For each character, start another loop from the next character to the end of the string..
- Check for Duplicate: Compare the current character with every other character in the inner loop.
- Return False if Duplicate Found: If any character matches the current character, return false.
- Return True if No Duplicate: After completing all iterations without finding duplicates, return true.

```js
function hasUniqueChars(str){
for(let i=0; i<str.length;i++){
  for (let j=i+1; j<str.length;j++){
    if(str[i]=== str[j]){
      return false; // duplicate found
    }
  }
}
return true
}

console.log(hasUniqueChars('ravi')); //true
console.log(hasUniqueChars("hello")); //false
```

_____________________

## Using Set method


- you can leverage a Set. A Set is a collection of unique values. By converting the string into a set, the duplicate characters are automatically removed.
- Then, you can compare the length of the set with the original string's length.
- If they are equal, it means all characters in the string were unique.

```js
const checkStringContainsUniqueChars =(str)=> new Set(str).size === str.length

console.log(checkStringContainsUniqueChars('abcd')); //true
console.log(checkStringContainsUniqueChars("hello")); //false
```

