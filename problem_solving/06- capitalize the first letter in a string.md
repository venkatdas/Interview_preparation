## capitalize the first letter in string 

```js

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// Example usage:
const exampleString = "das";
const capitalizedString = capitalizeFirstLetter(exampleString);
console.log(capitalizedString); // Output: "Hello world"
```
