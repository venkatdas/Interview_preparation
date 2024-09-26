## Interview Qns

1. Formal Introduction
2. What is the component in react
3. In react, how can we do the component reusability.
4. In the react application, if we have two components and both are sharing a common component and it should call different functions or we have two components C1 and C2 , there is a common componet that is text , we need to use this common component in both C1 and C2, inside the text component, when i do some changes and i need to call function which is return C1, and if i call from C2 , it should call from C2.


**5. What JSX.**


- JSX stands for JavaScript XML. It is a syntax extension for JavaScript that looks similar to HTML or XML and is used in React to describe what the UI should look like.
- When you write JSX, you are essentially writing a syntax that gets compiled to React.createElement() calls under the hood, which creates React elements.
- Explanation: JSX makes it easier to write and understand the structure of React components.
- It allows developers to write the UI in a declarative manner, mixing HTML-like syntax with JavaScript logic.
- This improves readability and maintainability compared to the alternative of using plain JavaScript with React.createElement().
- Explanation: JSX isn’t valid JavaScript, so it needs to be compiled into JavaScript before it can be executed by the browser.
- Tools like Babel are used to transform JSX into React.createElement() calls. For example, <div>Hello</div> in JSX is compiled to React.createElement('div', null, 'Hello').

```js
const element = <h1>Hello, world!</h1>;

// Transformed into:
const element = React.createElement('h1', null, 'Hello, world!');
```

**6. Is there any difference between normal html and JSX syntax.**

- Yes, there are several key differences between normal HTML and JSX syntax. Here’s a breakdown of the main differences:

**Attribute Naming**

- HTML: Uses standard attribute names like class, for, onclick, etc.
- JSX: Uses camelCase for attribute names. For example:
- class becomes className
- for becomes htmlFor
- onclick becomes onClick

**Self-Closing Tags**
- HTML: Tags like <img>, <input>, <br> can be written without self-closing slashes.
- JSX: All elements without children must be self-closed using a slash /.

**JavaScript Expressions**
- HTML: Pure HTML cannot directly embed JavaScript expressions.
- JSX: You can embed JavaScript expressions within {}.

**Style Attribute**

- HTML: Inline styles are written as a string.
- JSX: Inline styles are passed as an object, with camelCase properties.

```js
<!-- HTML -->
<div style="background-color: blue;"></div>
// JSX
<div style={{ backgroundColor: 'blue' }}></div>
```

**Conditional Rendering**

- HTML: Cannot directly perform conditional rendering.
- JSX: You can use JavaScript logic to conditionally render elements.
```js
// JSX
{isLoggedIn ? <h1>Welcome!</h1> : <h1>Please sign in</h1>}
```
**Fragment Syntax**

- HTML: HTML doesn’t have an equivalent to React Fragments.
- JSX: You can use <React.Fragment> or shorthand <>...</> to group elements without adding extra nodes to the DOM.

**7. Internal CSS in react. write an example**

```js
// JSX
<div style={{ backgroundColor: 'blue' }}></div>
//or

import React from 'react';

function MyComponent() {
  const style = {
    backgroundColor: 'blue',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
  };

  return (
    <div style={style}>
      This is an inline-styled component
    </div>
  );
}

export default MyComponent;

```
**8. what is the virtual DOM**

- The Virtual DOM is an in-memory representation of the real DOM elements.
- It’s essentially a lightweight copy of the actual DOM, which React uses to determine the minimal number of changes required to update the user interface.

**Initial Rendering:**

- When a React component is first rendered, a Virtual DOM tree is created. This tree is a lightweight copy of the actual DOM, representing the structure of the UI at that moment.
-  React creates a Virtual DOM tree that mirrors the structure of the real DOM. This includes elements like <div>, <ul>, <li>, etc.

**Updating the UI:**

- When the state or props of a component change, a new Virtual DOM tree is generated to reflect the updated UI.
- React then compares this new Virtual DOM tree with the previous one using a process called "diffing."

**Diffing Algorithm:**

- The diffing algorithm efficiently determines the differences (or "diffs") between the new Virtual DOM tree and the old one.
- Instead of updating the entire DOM, React identifies the minimal set of changes required to update the UI.

**Reconciliation:**

- After identifying the changes, React updates the actual DOM only where necessary, applying patches to the parts of the DOM that have changed. This process is known as reconciliation.

**Batching Updates:**

- React also batches multiple updates together to reduce the number of re-renders and DOM manipulations, further improving performance.



9. I have one array with 3 elements, i need to display ul,li with ths array values, and in the browser i can see these values , now i am adding two more elements in the array.. based on that i have 5 elements in the browser,saving the file and how does browser updates VDOM and all things.is it will update the whole Ui or only changed 2 elemtns.?

- **Initial Rendering:**

- When you first render the array with 3 elements, React creates a Virtual DOM representation of the unordered list (ul) with 3 list items (li), each corresponding to an element in your array.
- React then compares this Virtual DOM with the real DOM and updates the real DOM to reflect the changes. Since it's the initial render, the entire ul with its 3 li elements is added to the real DOM.

- **Updating the Array:**

- You then add two more elements to the array, making it 5 elements in total.
- React will trigger a re-render of the component where this array is used. During this re-render, React generates a new Virtual DOM with 5 li elements instead of 3.

- **Virtual DOM Diffing:**

- React compares the previous Virtual DOM (with 3 li elements) with the new Virtual DOM (with 5 li elements).
- React identifies that the first 3 li elements are the same and only 2 new li elements have been added.

- **Updating the Real DOM:**

- React efficiently updates the real DOM by only adding the 2 new li elements to the existing ul without re-rendering the entire ul and the original 3 li elements.
- This efficient update is due to React’s reconciliation algorithm, which minimizes the number of changes needed to update the UI.


10. **What is the state?**

- State is a built-in object in React that stores data or information about the component that can change over time.
- It's essentially the "memory" of the component, allowing it to keep track of dynamic values and rendering the UI based on those values.
- When the state changes, React re-renders the component to reflect the new state.
- State is local to the component, meaning it encapsulates the data within the component, making it easier to manage and debug.
- You should never directly modify the state.
- Instead, use state setters (like setState in class components or the setter function returned by useState in functional components) to update state,
- ensuring a new object reference is created.
- State updates are often batched and handled asynchronously, meaning that multiple state updates may be combined for efficiency, and the actual state update may not happen immediately.







11. what is the diff b/w redux state? In redux how many source are there/


12. What is the useEffect and syntax? and how it works?

- useEffect is a hook in React that allows you to perform side effects in your functional components.
- Side effects include operations like data fetching, subscriptions, manual DOM manipulations, logging, and setting up timers.
- The useEffect hook combines the functionality of React’s lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount
- in class-based components into a single API.

```js
useEffect(() => {
  // Your side effect logic goes here

  return () => {
    // Cleanup logic goes here (optional)
  };
}, [dependencies]);
```
- Initial Render: When the component first renders, useEffect runs the effect function after the DOM updates.
- Cleanup Function (Optional): The function returned from the effect function is where you can clean up side effects like cancelling subscriptions, clearing timers,
- or other cleanup operations. This function runs when the component unmounts or before the effect is re-run.

```js
useEffect(() => {
  console.log('Effect runs after every render');
}); // No dependency array: runs after every render
```

13. What is pure component?

- A Pure Component in React is a component that renders the same output given the same props and state.
- Pure Components implement a shallow comparison between the previous and current props and state, which allows React to skip rendering the component if nothing has changed.
- This optimization can lead to better performance, especially in larger applications.

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


