#### Protypical Inheritance

- Prototypical inheritance is a feature in JavaScript where objects can inherit properties and methods from other objects. Instead of using classes (as in classical inheritance), JavaScript uses prototypes to enable inheritance.
- Every JavaScript object has an internal link (referred to as [[Prototype]] or __proto__) that points to another object, called its prototype.
- Through this chain, objects can access properties and methods of other objects.

**How It Works**
- When you try to access a property or method on an object, JavaScript first looks at that object.
- If the property is not found, it looks up the [[Prototype]] chain until it finds the property or reaches null.
- 


________________
- Prototypal inheritance is a feature in JavaScript that allows objects to inherit properties and methods from other objects
- One object trying to access the properties and methods form another object.
- 
![Screenshot (74)](https://github.com/venkatdas/Interview_prep/assets/43024084/fa2a6fac-89b9-48f6-af75-41fb70e1d8f0)


- How does this object knows those methods like greet , name methods..?

- These will come via prototype

So , What is it?


- Whenever you create any object , javascript engine automatically puts the hidden properties into an aobject and attaches to your project.
- To access those hidden properties using __proto__ keyword, This is the object where javascript engine will keeping methods and props
- 



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/bfc7bbb3-a5b0-4a95-931e-ec7f6952689b)

- Prototype chain


________________________________________________


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/355b8481-c5a8-46ae-b54b-2d48c8786183)


object2 is inheriting the properties from object1 this is called prototypical inheritance


______________________________________________

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/379baf2f-8149-4a30-827f-dd65cda241e2)

- If you try to access the getIntro from object2 it will get `Aditya from dehradun` because `this` points to the object2 and it will get the access, when coming to `city` , it is not there in object2 sothat accroding to prototype chain it will inherit from object1.


_______________________________________________


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/0ea20720-8e91-42b1-8c77-b738fae3fbce)

- Whatever the functions you will create , it will have access to mybind because of prototype

