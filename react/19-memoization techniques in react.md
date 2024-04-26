## Top interview questions based on react memoization and which scenarios we can use them


**React.Memo**


- "React.memo is a higher order component (HOC) in React for memoizing functional components. It serves to optimize performance by preventing unnecessary re-renders of components when their props do not change."

- React.Memo is a Higher Order Component in React which gives a memoized version of the Component. React will then not re-render the memoized component unless its props have changed, even if its parent is being re-rendered.

**Hoe it Works**

- "React.memo wraps a functional component. When a component is wrapped in React.memo, React renders the component and memorizes the result. 
- Before the next render, if the new props are the same as the previous props, React reuses the memorized result, skipping the next rendering. 
- This comparison is shallow, meaning that it only checks one level deep. If you use complex objects as props, you should ensure they are the same object, or use a custom comparison function if deeper comparison is needed."

