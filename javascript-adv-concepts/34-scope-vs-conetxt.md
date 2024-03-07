## Scope vs Context

**scope:**

- Scope in JavaScript refers to the accessibility or visibility of variables.
- Variables can either have a local scope (accessible only within a function or block where they are defined) or a global scope (accessible from anywhere in the code). 
- Scope controls the lifetime and accessibility of variables and functions.


**Context**


- Context in JavaScript refers to the value of this in the current execution context.
- The context represents the object that is currently executing or invoking the function.
- The value of this can change depending on how a function is called (e.g., as a method of an object, as a constructor, or through the call, apply, and bind methods).

- Arrow functions do not have their own this context but inherit it from the enclosing lexical context.


