###  cars 24



#### Hoisting

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/c485d82f-2eb1-45bd-b991-7f635a2f5422)

- var is hoisted will get the result as undefined

-  where as let and const behave little bit different , they are hoisted but in temperal dead zone  we cant access them

```Javascript


function abc() {
  console.log(a, b, c);
  const c = 30;
  let b = 20;
  var a = 10;
}

abc();


```





![image](https://github.com/venkatdas/Interview_prep/assets/43024084/66056db5-600a-4a66-85d1-b4a37776119b)




- As we know all are in the execution context the result is undefined , they are in temporal dead zone
- Temporal dead zone , is the state where variables are in the scope but they are not yet declared


  ### Implicit and Explicit binidng

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/ed4cb430-63cd-4c12-89e0-dd58b5f2d283)

- Guess the output

- before that let me split the code 

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/d59ff2f0-749c-4894-8440-c861540d3985)

- In above image the `obj.display()` will point the name in the display object will get the result as `piyush`

- For first screenshot we are getting the result as `ABC` we are poiniting the obj1.


- If that display functtion can be rewritten as arrow function will get the empty result refer the SS below.

  ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/ca89e94e-932b-40a0-bb66-a6d342d9ff4f)

- The reason behind is if we try to console the only this keyword will get the global or window object and name variable not in the global or window so that we are not getting the result>




