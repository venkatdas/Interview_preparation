
- Anagrams are words or phrases formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once. 
- For example, "listen" and "silent" are anagrams.


```js

function isAnagram(str1, str2) {
  // Removes spaces and convert into the lowercase letter

  str1 = str1.replace(/\s/g, '').toLowerCase()
  str2 = str2.replace(/\s/g, '').toLowerCase()

  if (str1.length !== str2.length) {
    return false
  }

  // Sort the characters in the given string
  str1 = str1.split('').sort().join('')
  str2 = str2.split('').sort().join('')
  console.log(str1, str2);

  return str1 === str2
}

console.log(isAnagram("modi", "monu")); //false
```

