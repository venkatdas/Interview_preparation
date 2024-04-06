## How to load JS asynchronously


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/2b1f964b-4f7b-40a0-a274-a310f9458265)



1. **When JS placed after the body tag**

- Once HTML parsing is done, it encounters the JS, it downloads the JS and then it executes the JS.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6f727f20-7863-4804-b221-a7d590d82c83)


2. **When JS placed in the Head TAG**

- During HTML parsing it encounters the JS and it pauses the HTML parsing and it downloads the JS and then it executes the JS and then HTML parsing is resumed.

**Cons:** It stops the execution of DOM tree which is a bad User experience.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/0a182ab1-329e-49d4-bf79-a78ffa34430d)


3. **With async attribute in head tag**

- During HTML parsing it encounters the JS and the HTML parsing is continued during download phase

- But when it starts executing the JS, the HTML parsing is paused and once it completes executing the JS then HTML parsing is resumed.

**Cons**: It stops the execution of DOM tree which is a bad User experience.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/d529d756-8e83-4261-b670-398419b90334)

4. **With defer attribute in head**

- During HTML parsing it encounters the JS and the HTML parsing is continued during download phase

- After HTML parsing is completed, it executes the JS.
- 
**Note**: This is more optimized approach when compared to others because we are prefetch the Javascript code during the parsing phase.
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/081d42ea-9e90-4c26-807a-bb5fa034a0f7)



