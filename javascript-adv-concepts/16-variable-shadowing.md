## Variable shadowing

Variable shadowing in JavaScript occurs 
when a variable in a local scope (e.g., inside a function) has the same name as a variable in the outer scope. 
This can lead to confusion because the inner variable "shadows" the outer variable, meaning that within the local scope, 
the name refers only to the inner variable, 
and the outer variable is temporarily inaccessible.

![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/f73c6e45-7411-4567-8056-496634a84d0c)

- The inner variable shadows the outer variable


Example 2


![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/7d04f7dd-2307-4431-891d-adb1deecbb23)

It can print both Hi and Hello


## Illeagal shadowing
- we can shadow var variable by let but can not do the opposite i.e., if we can shadow the let variable by var it can be leads to error known as Illegal shadowing




![image](https://github.com/venkatdas/javascript-advanced/assets/43024084/db4afaf1-3f00-420c-b368-bd91f72278a1)
