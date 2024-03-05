## Array.join()


Syntax

`arr.join([separator])`
_________________________________

```js

Array.prototype.myJoin = function (separator = ",") {

  if(this.length===0){
    return '' // if the array empty return empty string
  }
// start the first element as it won't be prefixed with the separator

  let result = String(this[0]) // 

  // loop through the array starting from the second element (ex: Iteration starts from i=1)

  for (let i = 1; i < this.length; i++) {
    result = result+ String(separator)+ String(this[i])
    
  }
  return result;
};

const fruits = ["Banana", "Orange", "Apple", "Mango"];
let text = fruits.myJoin();

console.log(text); //Banana,Orange,Apple,Mango

```
