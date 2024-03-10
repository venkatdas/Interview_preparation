## DOM Traversal

- Let's look at this examples.

  ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/c8feeb13-7e70-44d9-b38b-48d9dc60e46f)

- This is the output

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/a9216ff7-0441-4a86-bb42-bfc3ca81c5cc)


1) To get an element by id


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/48e2701c-32cd-4a6f-aad8-bc8a90301b7d)

```js

const grandParent = document.getElementById('grandparent-id'); // this should match the id attribute provided in .html file
grandParent.style.backgroundColor = '#333';
```


- To work in aneother way (reusability of code)

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6b038b19-32c5-4cd6-b7bb-fb620bcb7553)


________________________________________
2) getElementByClassName

- Since multiple elements can have classNames, it always returns a collection of elements (in our case two parent elements)


```js
//script.js

const parents = Array.from(document.getElementsByClassName('parent'));
parents.forEach(changeColor); // changes the backgroundColor for both of the parent classes

function changeColor(element) {
  element.style.backgroundColor = '#333'; //grey color
}
```

- IN out html file we have two classes with `parent' so, it will reflect both of these.


Output

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/e7e5b671-437b-4e3c-a24c-58bc26b81e74)


_________________________________

3) querySelector

- To select an single elment we have use
  - ise # for id
  - use . for class


- **To retrieve ID**

```js
const grandParent = document.querySelector('#grandparent-id');
changeColor(grandParent);

function changeColor(element) {
  element.style.backgroundColor = '#333';
}
```

- To get traverse for class

```js
const grandParent = document.querySelector('.grandparent');
changeColor(grandParent);

function changeColor(element) {
  element.style.backgroundColor = '#333';
}
```

- The above code is only works for one class, What if there are multiple classes we nee to approach different one , thus came to picture of `querySelectorAll`.


```js
const parent = document.querySelector('.parent');
changeColor(parent);

function changeColor(element) {
  element.style.backgroundColor = '#333';
}
```

 ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/966ac71e-fc3e-4a21-8a20-ab628d1273f7)

- Below code is only applicalble for 1st parent class.
- still that grey color not applied to the second parent class

___________________________

4) **querySelectorAll**


- with multiple classes or div elements we can apply this querySelectorAll


```js
const parents = document.querySelectorAll('.parent');
parents.forEach(changeColor);

function changeColor(element) {
  element.style.backgroundColor = '#333';
}
```


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/f1ec6b6c-f195-4b44-8f15-94de359402fd)


_____________________________________

5) Selecting Children


- `grandparent` is the main class
- we have nested child classes inside the parent class

```js
const grandParent = document.querySelector('.grandparent');
const parents = Array.from(grandParent.children); // To get the children classes

parents.forEach(changeColor);

function changeColor(element) {
  element.style.backgroundColor = '#333';
}
```


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/368af5ed-4b13-4053-ad82-0bb7eae8501a)

output

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/9cfe77dc-2371-4a0e-a151-9bd0c08b5f84)


- What if I want to change the specific children color

```js
const grandParent = document.querySelector('.grandparent');
const parents = Array.from(grandParent.children);
const parentOne = parents[0];
const children = parentOne.children;

changeColor(children[0]);
function changeColor(element) {
  element.style.backgroundColor = '#333';
}
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/7b88b4fb-b700-49a5-a56d-d384de404c3e)

____________________________________

6) Selecting Descendents

- To select all child classes.

```js
const grandParent = document.querySelector('.grandparent');
const children = grandParent.querySelectorAll('.child');

children.forEach(changeColor);

function changeColor(element) {
  element.style.backgroundColor = '#333';
}
```
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/e3cd6b58-edbd-4382-83c8-29dc000ed3ec)











