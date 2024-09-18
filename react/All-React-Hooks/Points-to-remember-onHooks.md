**1. useState**

- What is useState: A hook that allows you to add local state to a functional component
- It provides a way to create and access state variables in a component, which was previously only available in class-based components.
- Before hooks, managing state was only possible in class components. useState was introduced to enable state management in functional components, allowing them to become more powerful and versatile.
- Use useState when you need a local state in a functional component, such as tracking form input, toggling a modal, or implementing counters.
- The useState hook returns an array. The first element is the state’s current value, and the second element is a function to update that state.
- The setState function does not immediately mutate the state but schedules it for the next render.
- Use useState in any functional component where you need to track and update local state values. 


**2. useEffect Hook**


- useEffect is a hook that allows you to handle side effects in functional components.
- A side effect is any logic that affects something outside of the component’s scope, such as fetching data, updating the DOM, or subscribing to external services.
- Before hooks, side effects were managed using lifecycle methods like componentDidMount, componentDidUpdate, and componentWillUnmount in class components.
- useEffect provides a single unified API to handle all side effects in functional components, simplifying the development process. 
- useEffect solves the problem of managing side effects in functional components.
- It avoids the need for class-based lifecycle methods and makes it easier to group related side effects and cleanup logic in the same place.
- Effect logic: Code that runs after the component renders.
- Cleanup logic: Code that runs when the component is unmounted or before the next effect is executed.
- dependencies: Array of variables that the effect depends on; the effect re-runs when these change.
- Fetching data from an API. Directly interacting with the DOM. Setting up subscriptions or timers. Cleaning up resources when the component unmounts.

- The first argument is a function containing the side effect logic. It can optionally return a cleanup function.
- The second argument is an array of dependencies. If it’s empty [], the effect runs only once after the initial render.


**3. useCallback Hook**

- useCallback is a hook that returns a memoized version of a function, which means the function reference is preserved between renders unless its dependencies change.
- In React, functions are re-created on every render, which can cause unnecessary re-renders when functions are passed as props to child components.
- useCallback helps optimize performance by memoizing functions, preventing unnecessary re-creation.
- useCallback solves the problem of unnecessary function re-creation, which can trigger unnecessary re-renders in child components, especially when passing functions as props.
- It takes two parameters.
- memoizedCallback: The memoized version of the callback function.
- dependencies: The list of variables that the function depends on; if any change, the function is re-created.
- You pass functions as props to child components that use React.memo or similar optimizations.
- You want to avoid re-creating the same function unless its dependencies change.
- Use useCallback in parent components when passing functions to child components, especially in performance-sensitive applications.

**4. useMemo Hook**

- useMemo is a hook that memoizes the result of an expensive computation and only recalculates it when its dependencies change.
- In React, calculations inside components re-run on every render.
- useMemo prevents this by memoizing the result of a computation, ensuring that the computation is only executed if its dependencies change.

- useMemo solves performance issues by preventing unnecessary recalculations of expensive functions during renders, optimizing performance, especially for heavy calculations.
```js
const memoizedValue = useMemo(() => {
  return expensiveCalculation();
}, [dependencies]);
```

- memoizedValue: The result of the expensive calculation, memoized until dependencies change.
- dependencies: The values that trigger recalculation when they change.
- Use useMemo in performance-sensitive applications where expensive calculations (like sorting large arrays, filtering data) are involved.


**5. useContext Hook**

- useContext is a hook that allows components to consume values from a React context, which is a way to share state between components without prop drilling
- React introduced useContext to simplify sharing state across multiple components without passing props manually through intermediate components.
- useContext solves the problem of prop drilling, where you need to pass props through multiple levels of components, even when intermediate components don’t use the props.
- You need to access global data across your component tree (like themes, authenticated user, etc.).
- You want to avoid passing props down through multiple layers of components.


**6. useRef Hook**

- useRef is a React hook that returns a mutable object whose .current property persists across renders. 
- It can store any value, including DOM references or values you want to keep between renders.
- useRef exists to provide a way to persist values across renders without triggering a re-render when the value changes.
- It also provides access to DOM elements directly, without requiring state changes to track them.
- useRef solves the problem of managing mutable values that don’t need to cause re-renders when they change.
- It is particularly useful for accessing and interacting with DOM elements or for storing values (like timers) that should persist across renders without causing re-renders.
- `const myRef = useRef(initialValue);`

- myRef: The object that holds the .current property, which persists between renders.
- initialValue: Optional initial value assigned to the .current property.


- Use useRef when:
- You need to access a DOM element directly (for example, to focus an input field).
- You want to store mutable values (like timers, previous values, etc.) that should persist between renders but don’t need to trigger re-renders.
- You want to keep track of a previous state or value without triggering a re-render.
- useRef returns an object with a .current property, which can be updated without causing a re-render. It can also be assigned to a DOM element to access it directly.



**7. useReducer Hook**

- useReducer is a React hook that is used for managing complex state logic in components.
- It works similarly to useState, but is better suited for state logic that involves multiple sub-values or complex actions.
- useReducer exists to handle more complex state transitions in React components. While useState is sufficient for simple state logic,
- useReducer provides a more scalable way to manage state when the logic becomes more complex (e.g., managing multiple state values with multiple actions).

- `const [state, dispatch] = useReducer(reducer, initialState);`
- state: The current state value.
- dispatch: A function to trigger state changes by dispatching actions.
- reducer: A function that specifies how the state changes based on the action.
- initialState: The initial value of the state.

- Use useReducer in scenarios where you have complex state logic, such as:
- Forms with multiple fields where you want to manage the state in one place.
- Complex state transitions that involve multiple actions (e.g., increment, decrement, reset).



**8. useLayoutEffect Hook**

- useLayoutEffect is a hook that works similarly to useEffect, but it fires synchronously after all DOM mutations.
- This means it runs before the browser has painted the screen, making it useful for **measuring** the **layout** or synchronously manipulating the DOM.
- useLayoutEffect exists to handle situations where you need to perform side effects that affect the layout,
- such as **measuring DOM elements** or making layout adjustments before the screen is painted.
- It ensures that the layout is adjusted synchronously before the browser renders the frame, avoiding visual inconsistencies like flickers.
- useLayoutEffect solves the problem of synchronously handling side effects that depend on the DOM layout. 
- For example, when you need to measure the size of an element or adjust its position before the screen is rendered.

```js
useLayoutEffect(() => {
  // Synchronous side effect logic
  return () => {
    // Cleanup logic
  };
}, [dependencies]);
```

- Effect logic: Runs synchronously after DOM mutations and before the browser paints.
- Cleanup logic: Optional cleanup that runs when the component is unmounted or before the next effect runs.
- dependencies: List of values that, when changed, will re-run the effect



**React.memo**

- React.memo is a higher-order component (HOC) that memoizes a functional component, preventing unnecessary re-renders if the component's props do not change.
- It optimizes performance by only re-rendering when its props have changed.

- React.memo exists to optimize the performance of functional components. In React, when a parent component re-renders, all its child components also re-render by default.
- React.memo helps prevent this by memoizing the child component and skipping its re-render if the props haven’t changed.



```js
const MyComponent = ({ name }) => {
  console.log("Rendering MyComponent");
  return <div>Hello, {name}!</div>;
};

const MemoizedComponent = React.memo(MyComponent);

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <MemoizedComponent name="Venkat" />
    </div>
  );
};
```




- `const MemoizedComponent = React.memo(Component, areEqual);`

- Component: The functional component you want to memoize.
- areEqual: Optional custom comparison function. It compares the previous and next props and determines whether the component should re-render.
- If it returns true, the component will not re-render
- 





