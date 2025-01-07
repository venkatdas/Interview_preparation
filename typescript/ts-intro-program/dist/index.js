"use strict";
function sum(a, b) {
    // Check if both `a` and `b` are numbers
    if (typeof a === "number" && typeof b === "number") {
        return a + b;
    }
    // Convert both to strings and concatenate them if at least one is a string
    return a.toString() + b.toString();
}
// Usage examples:
console.log(sum("1", "2")); // Outputs: 3
console.log(sum("Hello", " World")); // Outputs: Hello World
console.log(sum("Value: ", 42)); // Outputs: Value: 42
