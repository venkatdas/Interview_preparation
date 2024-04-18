## VDOM


## 1.
- Virtual DOM: Explaining how the Virtual DOM works, why it’s used, and how it improves performance can be challenging.
- You may need to clarify concepts like reconciliation and how React efficiently updates the actual DOM.

- The Virtual DOM (Document Object Model) is a concept used in web development frameworks, particularly in libraries like React.
- Virtual DOM in React is a “virtual” representation of the actual DOM. It is nothing but an object created to replicate the actual DOM.

- It’s a lightweight in-memory representation of the actual DOM elements in a web page. Instead of directly manipulating the real DOM, developers make changes to the Virtual DOM first.


## How Does it Work?(VDOM)

- **Initial Render:**
- When a web application is loaded or initially rendered, the entire UI is created in the Virtual DOM.
- The Virtual DOM is a JavaScript object that mirrors the structure of the actual DOM.

**Component State Changes:**


- When the state of a component changes (due to user interaction, data updates, etc.), a new Virtual DOM representation of the updated UI is created.
- This new Virtual DOM is then compared with the previous one.
- This is done by the diffing alogoritm

- Then it updates the Browser DOM with the least number of changes possible without rendering the entire DOM again.


## 2. Diffing Algorithm:

- The Virtual DOM uses a “diffing” algorithm to identify the differences between the new and old Virtual DOM representations.
- It calculates the minimal number of steps needed to update the real DOM to match the new Virtual DOM.

**Batching Updates:**

- React may batch multiple state changes together and perform a single update to the real DOM, further optimizing performance.



 **Why is it Used?**
- Performance Optimization:
  - Directly manipulating the real DOM can be computationally expensive and may lead to a slow user experience, especially in complex web applications.
  - The Virtual DOM minimizes the number of actual DOM manipulations, making updates more efficient.
- Simplified Development:
  - Developers work with a virtual representation of the DOM, allowing them to focus on building and updating UI components without worrying about the underlying complexities of the real DOM.
 - Cross-Browser Consistency:
  - The Virtual DOM abstracts away browser-specific quirks, providing a consistent development environment regardless of the user’s browser.
- Easier Debugging:
  - Working with the Virtual DOM can simplify debugging, as developers can inspect the state of the Virtual DOM at different points in time, making it easier to identify issues.


## Reconsilation



- Reconciliation is the process through which React updates the Browser DOM.
- React compares the Virtual DOM with Real DOM. It finds out the changed nodes and updates only the changed nodes in Real DOM leaving the rest nodes as it is. This process is called Reconciliation.
- Important concepts behind the working of the Reconciliation process are: Virtual DOM and Diffing Algorithm

1. **Virutal DOM**


- Virtual DOM in React is a “virtual” representation of the actual DOM. It is nothing but an object created to replicate the actual DOM.
- When we make changes or add data, React creates a new Virtual DOM and compares it with the previous one.
- Comparison is done by Diffing Algorithm
- Then it updates the Browser DOM with the least number of changes possible without rendering the entire DOM again.



2. **The Diffing Algo**

- React uses a heuristic algorithm called the Diffing algorithm for reconciliation based on these assumptions:
- React checks the root elements for changes and the updates depend on the types of the root elements,
- Two elements of different types will produce different trees and comparing two elements of the same type, keep the underlying node as same and only update changes in attributes or styles.
- The developer can hint at which child elements may be stable across different renders with a key prop.


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/1c00ac89-144a-43d6-bfae-379ff1d9b198)




## React Fiber


- React Fiber is an internal, reimplementation of the core algorithm used by React to perform the process of reconciliation.
- React Fiber is an internal architecture within React that enhances the efficiency, responsiveness, and control of the rendering process.
- It achieves this by introducing incremental rendering, prioritization of tasks, and a concurrency model, making React better equipped to handle complex user interfaces and dynamic updates.

**The Structure of a Fiber**



- A fiber is a JavaScript object, a unit of work. It represents a node of the DOM tree, or a React element, and contains data about a component, its I/P and O/P.
- A fiber is both an instance of a component as well as frame in the call stack.
- Fibers have both types and keys, just like React elements. When a fiber is created from an element, these two fields are copied over directly.
- React, uses internal objects called “fibers” to hold additional information about the component tree.



— The type of a fiber describes the component that it corresponds to. For composite components, the type is the function or class component itself. For host components (div, span, etc.), the type is a string.

— The key is used during reconciliation to determine whether the fiber can be reused



 - A fiber created from a React element inherits that element’s type and key. The main use for types and keys in a fiber is for reconciliation to determine whether or not it’s possible for the fiber to be reused.



**Key benefits and features of React Fiber:**

**1. incremental Rendering**

- **Old Behavior**: Prior to Fiber, React’s reconciliation process could be blocking, meaning it would recursively process components and changes all at once, potentially leading to performance issues for large updates.
- **With Fiber**: React can now split the work into smaller chunks and spread it out over multiple frames, allowing for smoother animations and interactions.

**2. Concurrency**

- Fiber allows React to perform multiple tasks at the same time (concurrent mode), such as rendering multiple component trees independently.


**3. Task Prioritization:**

- With Fiber, React can prioritize certain updates over others. For example, user interactions (like clicks or key presses) are given higher priority than less critical updates.
- This leads to a more responsive user interface, as high-priority updates can interrupt and preempt low-priority ones.


**Time Slicing:**

- Time slicing is a technique where React, with the help of Fiber, can break down work into small time slices and yield control back to the browser event loop intermittently.
- This ensures that the UI remains responsive even while heavy computations are being done in the background.
**5. Error Boundaries**

- Fiber introduced a more robust mechanism for handling errors in the application. Error boundaries are components that can catch JavaScript errors anywhere in a component tree and log those errors, display a fallback UI, or take other actions.
- Prior to Fiber, unhandled errors could corrupt the internal state of React and cause the entire application to crash.






