## Array.join()


Syntax

`arr.join([separator])`
_________________________________


Approach 
________________

- by default the param separator is comma (ex: separator = ',')
- maintain an result which returns in the String format
- By default we are storing result with the first element in an array. Ex: String(this[0])
- perform a basic for loop starting with i=1 and i<this.length
- core logic is : result = result + String(separator) + String(this[i])
- at the end return result post exit from for loop
_____________________________
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
**OR**

```js

if (!Array.prototype.join) {
  Array.prototype.join = function(separator = ',') {
    let str = '';

    for (let i = 0; i < this.length; i++) {
      // If the element is undefined or null, it is converted to an empty string.
      if (this[i] == null) {
        str += '';
      } else {
        str += this[i];
      }
      
      // Add the separator between elements, but not after the last element
      if (i < this.length - 1) {
        str += separator;
      }
    }

    return str;
  };
}

```
