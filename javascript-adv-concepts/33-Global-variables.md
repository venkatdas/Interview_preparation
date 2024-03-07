## Global Variables


- Global variables in JavaScript are variables that are accessible from anywhere in the application.
- They are defined outside of functions or are declared without the use of var, let, or const keywords inside a function
- making them attach to the global object (window in web browsers, global in Node.js).
- The issue with Global Variables is that we can have variable collisions.
- 
1) Explici attached to global
```js
window.globalVar = "I am a global variable";
console.log(globalVar); // Outputs: I am a global variable
```

2) Implicit global

```js
function setGlobalVar() {
  globalVarImplicit = "Implicitly global variable"; // No var, let, or const keyword
}
setGlobalVar();
console.log(globalVarImplicit); // Outputs: Implicitly global variable
```


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/cd831996-7cc1-44e3-b2ed-08bdd16fdccf)

- This is because everything is on Global Execution context and they overwrite each other if there's any duplicates
