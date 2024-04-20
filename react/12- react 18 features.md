##  React 18 features


**1. Automatic Batching**

- Batching is when React groups multiple state updates into a single re-render for better performance.
- Without automatic batching, we only batched updates inside React event handlers.
- Updates inside of promises, setTimeout, native event handlers, or any other event were not batched in React by default.
-  With automatic batching, these updates will be batched automatically. reducing the number of re-renders and improving performance.

**Before Automatic Batching**
- Prior to React 18, **React did batch state updates that occurred in response to synthetic events (such as clicks or inputs)** and lifecycle methods.
- However, updates outside of these synchronous events—like in promises, timeouts, or native event handlers—were not automatically batched.
- This means each state update triggered its own re-render, which could lead to performance issues.

```js
function myComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount(c => c + 1);
      setCount(c => c + 1);
    }, 1000);
  }, []);

  return <div>{count}</div>;
}
```
- In this example, because the updates are triggered from within a setTimeout (an asynchronous JavaScript function), React would not batch these updates. Consequently, the setCount function would cause two separate renders:

- Increment count to 1 and re-render.
- Immediately after, increment count again to 2 and re-render.

**After Automatic Batching**

- With the introduction of React 18, automatic batching now extends to updates triggered outside of React event handlers, such as promises, timeouts, native event handlers, and other asynchronous APIs.
- This means that multiple state updates within these functions are batched together into a single re-render cycle, improving performance by reducing the number of renders.

```js
function myComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setCount(c => c + 1);
      setCount(c => c + 1);
    }, 1000);
  }, []);

  return <div>{count}</div>;
}

```


- Now, with automatic batching enabled, React would handle both setCount calls in a single batch. This results in only one re-render:

- Both increments are processed together, and count becomes 2 before the component re-renders.

2. **Concurrent Rendering**
- Concurrent rendering in React is a powerful feature that allows React to prepare multiple versions of the UI in a non-blocking way. (OR)
- Concurrent rendering allows React to work on multiple tasks at once without blocking the user interface.
-  It does this by breaking the rendering work into small units and executing them over multiple frames, similar to how a browser might handle animations using requestAnimationFrame.


- 
**EXample**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/32f8140b-468e-43e5-b3b3-65722712486b)

**Key capabilities and benifits**


- Non-blocking-UI
- Prioritized-rendering
- Interruptible work



 3. **New Root API:**
- React 18 introduces a new root API which makes it easier to opt into concurrent features. The new root API (createRoot) replaces the old


**New Suspense Features**



**New Feature: Transitions**


- Transitions can be used to mark UI updates that do not need urgent resources for updating.

- For example, when typing in a typeahead field, there are two things happening: a blinking cursor that shows visual feedback of your content being typed, and a search functionality in the background that searches for the data that is typed.

- Showing a visual feedback to the user is important and therefore urgent. Searching is not so urgent, and so can be marked as non-urgent.

- These non-urgent updates are called transitions. By marking non-urgent UI updates as "transitions", React will know which updates to prioritize. This makes it easier to optimize rendering and get rid of stale rendering.

- You can mark updates as non-urgent by using startTransition. Here is an example of what a typeahead component would like when marked with transitions:

```js
import React, { Suspense, useState } from "react";
import { startTransition } from "react";
import { useTransition } from "react";
import "./App.css";

const data = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
  { id: 4, name: "Date" },
  { id: 5, name: "Elderberry" },
];

// Simulated heavy filtering operation
function performSearch(input) {
  // Simulate a computationally intensive task
  return data.filter((item) =>
    item.name.toLowerCase().includes(input.toLowerCase())
  );
}
function App() {
  const [input, setInput] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e) => {
    const nextInput = e.target.value;
    setInput(nextInput);
    console.log("nextInput",nextInput);

    // Using startTransition to defer this state update
    startTransition(() => {
      const filtered = performSearch(nextInput);
      setFilteredData(filtered);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Type to filter..."
      />
      {isPending ? <p>Loading...</p> : null}
      <ul>
        {filteredData.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

- Before search
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/ce6149e9-816b-4d2a-a5f3-3360fcf5a686)

- After search
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/92caf4b2-048d-4620-bed5-3d3f7fb5422e)


