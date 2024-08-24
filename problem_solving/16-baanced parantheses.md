```js
function isValid(s) {
    // Edge case: if the string length is odd, it can't be balanced
    if (s.length % 2 !== 0) return false;

    const stack = [];
    const map = {
        '(': ')',
        '{': '}',
        '[': ']'
    };

    for (let char of s) {
        if (map[char]) {
            // If character is an opening bracket, push it onto the stack
            stack.push(char);
        } else {
            // If it's a closing bracket, check if it matches the top of the stack
            const last = stack.pop();
            if (char !== map[last]) {
                return false;
            }
        }
    }

    // If the stack is empty, all brackets were matched
    return stack.length === 0;
}

// Example usage:
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
console.log(isValid("([)]"));   // false
console.log(isValid("{[]}"));   // true

```


___________________________


```js

function isValid(s) {
    if (s.length % 2 !== 0) return false;

    const stack = [];

    for (let char of s) {
        // Check if it's an opening bracket
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            // It's a closing bracket; check against the top of the stack
            const last = stack.pop();

            // Calculate the difference between the ASCII values
            // For round brackets: ')' - '(' = 1
            // For curly brackets: '}' - '{' = 2
            // For square brackets: ']' - '[' = 2
            if (
                (char === ')' && last !== '(') ||
                (char === '}' && last !== '{') ||
                (char === ']' && last !== '[')
            ) {
                return false;
            }
        }
    }

    return stack.length === 0;
}

// Example usage:
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));     // false
console.log(isValid("([)]"));   // false
console.log(isValid("{[]}"));   // true

```
