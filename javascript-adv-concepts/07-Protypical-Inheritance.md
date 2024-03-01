#### Protypical Inheritance

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
