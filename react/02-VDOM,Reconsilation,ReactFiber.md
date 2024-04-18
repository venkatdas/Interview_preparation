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





















