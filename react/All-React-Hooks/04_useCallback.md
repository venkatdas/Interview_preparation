## useCallback

- useCallback is a React Hook that lets you cache a function definition between re-renders.

```js
const cachedFn = useCallback(fn, dependencies)
```

- The useCallback hook is a feature in React, a JavaScript library for building user interfaces. This hook is used to memoize functions, which means it keeps the same function instance between component re-renders unless its dependencies change.
- This can be particularly useful for optimizing performance in components that rely on referential equality to prevent unnecessary re-renders.

**How to Use useCallback**
The useCallback hook takes two arguments:

- Callback: The function that you want to memoize.
- Dependencies: An array of dependencies that the callback depends on. The memoized function will only change if one of the dependencies has changed.

- ```js
  const memoizedCallback = useCallback(
  () => {
    // Function code here
  },
  [dependencies], // Array of dependencies
);

```
