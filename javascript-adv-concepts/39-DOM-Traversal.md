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



