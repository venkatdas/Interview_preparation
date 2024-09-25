## Interview Qns

1. Formal Introduction
2. What is the component in react
3. In react, how can we do the component reusability.
4. In the react application, if we have two components and both are sharing a common component and it should call different functions 
  - we have two components C1 and C2 , there is a common componet that is text , we need to use this common component in both C1 and C2, inside the text component, when i do some changes and i need to call function which is return C1, and if i call from C2 , it should call from C2.
5. What JSX.
6. Is there any difference between normal html and JSX syntax.


7. Internal CSS in react. write an example
8. what is the virtual DOM
9. I have one array with 3 elements, i need to display ul,li with ths array values, and in the browser i can see these values , now i am adding two more elements in the array.. based on that i have 5 elements in the browser,saving the file and how does browser updates VDOM and all things.is it will update the whole Ui or only changed 2 elemtns.?
10. What is the state?
11. what is the diff b/w redux state? In redux how many source are there/
12. What is the useEffect and syntax? and how it works?
13. What is pure component?
14. What is the difference between export and export default?
15. what is named export?
16. How promises works?
17. What is async/ await?
18. What is Asynchrnous means?
19. What is responsive desigining?
20. How do we write CSS to implement responsiveness
21. What is SASS? and preprocessors 
22. Do you have hosting experience , like web application hosting?
23. What is the diff b/w filter and find?

- Both filter and find are array methods in JavaScript used to search through elements of an array, but they serve different purposes and return different types of results
**filter Method**

- The filter method creates a new array with all elements that pass the test implemented by the provided function. It returns an array of elements that match the criteria specified in the callback function.4
- . If no elements match, it returns an empty array.
- filter can return multiple elements (or none), depending on how many elements match the condition
- filter continues to iterate through the entire array, even if some elements already matched, to gather all possible matches.
- filter: Immutable — returns a new array, does not modify the original array.
-

**find Method:**

- The find method returns the first element in the array that satisfies the provided testing function. If no element satisfies the testing function, undefined is returned.
- find: Use find when you need to retrieve only the first element that matches a condition. If you are only interested in one matching element, find is more appropriate.
- find stops iterating as soon as it finds the first match, which can be more efficient when you're only interested in one result.
- find: Immutable — returns the first matching element, does not modify the original array.

```js
const numbers = [1, 2, 3, 4, 5];
const firstEvenNumber = numbers.find(num => num % 2 === 0);
console.log(firstEvenNumber); // Output: 2
console.log(numbers); // Output: [1, 2, 3, 4, 5] (Original array remains unchanged)
```
24. 


