
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

- different way to solve the problem

```js

function validAnagram(s,t){

  if(s.length!==t.length) return false

  const charCount = new Map();
//incr3ementing the count
  for(let char of s){
    if(charCount.has(char)){
      charCount.set(char, charCount.get(char)+1)
    }else{
      charCount.set(char,1)
    }
  }
 
  //decementing the count

  for(let char of t){
   if (!charCount.has(char)) {
     return false; // Found a char in t not present in s, or excess count
   } else{
    charCount.set(char, charCount.get(char)-1 )
   }
   if(charCount.get(char)===0) {
    charCount.delete(char)
   }
  }
  return charCount.size===0

}


console.log(validAnagram('anagram', 'nagaram'));  // Output: true
console.log(validAnagram('rat', 'car'));  // Output: false
```
