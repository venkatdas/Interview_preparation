## Count of Occurance of each letter in a input string

```js
function countOccurance(str){

  const countValue = new Map();

  for (const char of str) {

    if(countValue.has(char)){
      countValue.set(char, countValue.get(char)+1)
    }else{
      countValue.set(char,1)
    }
    
  }


  countValue.forEach((count,char)=>{
    console.log(`${char}:${count}`);
  })


}

console.log(countOccurance("aabbcc")); //a:2 ,b:2, c:2
```
