##  React 18 features


- Concept --	  Concurrent React
- Features --	Automatic Batching, Transitions, Suspense on the server
- APIs	  --  createRoot, hydrateRoot, renderToPipeableStream, renderToReadableStream
- Hooks	  --  useId, useTransition, useDeferredValue, useSyncExternalStore, useInsertionEffect
- Updates	 -- Strict mode
- Deprecated/discouraged --	ReactDOM.render, renderToString


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


4.**New Suspense Features**

- Code splitting on the server with suspense
- Streaming rendering on the server

**Client rendering vs server rendering**

- In a client-rendered app, you load the HTML of your page from the server along with all the JavaScript that is needed to run the page, and make it interactive.
- If, however, your JavaScript bundle is huge, or you have a slow connection, this process can take a long time and the user will be waiting for the page to become interactive, or to see meaningful content.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/a4312925-3ee0-4366-9315-a6e4b72349b9)

- Fig: In a client rendering flow, a user has to wait a long time before the page becomes interactive

- **For optimizing the user experience and avoiding the user having to sit on a blank screen, we can use server rendering.**
- **Server rendering** is a technique where you render the HTML output of your React components on the server and send HTML from the server. This lets the user view some UI while JS bundles are loading and before the app becomes interactive.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/e8f9064e-abaf-4d37-872e-ab8fafacd3f4)
- fig: In a server rendering flow, we can display meaningful data to the user much faster by sending HTML from the server. 


- Server rendering further enhances the user experience of loading the page and reducing time to interactive.

- Now what if most of your app is fast except for one part? **Maybe this part loads data slowly,** or maybe it needs to download a lot of JS before it gets interactive.
- Now what if most of your app is fast except for one part? Maybe this part loads data slowly, or maybe it needs to download a lot of JS before it gets interactive.
- One slow component can slow down the entire page. This is because server rendering was all or nothing – you couldn’t tell React to defer loading of a slow component and couldn’t tell React to send HTML for other components.
- **Now React comes with suspense**

- React 18 adds support for Suspense on server. With the help of suspense, you can wrap a slow part of your app within the Suspense component, telling React to delay the loading of the slow component.
- This can also be used to specify a loading state that can be shown while it's loading.
- In React 18, one slow component doesn’t have to slow the render of your entire app. With Suspense, you can tell React to send HTML for other components first along with the HTML for the placeholder, like a loading spinner.
- Then when the slow component is ready and has fetched its data, the server renderer will pop in its HTML in the same stream.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/257d579d-2e39-4317-b4ab-26a11d82e3c0)

- This way the user can see the skeleton of the page as early as possible and see it gradually reveal more content as more pieces of HTML Arrive.
- All of this happens before any JS or React loads on the page, which significantly improves the user experience and user-perceived latency.

5.**New Feature: Transitions**


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




**6. new Hooks**


- React 18 introduces new hooks, such as

- useId()
- useTransition()
- useDeferredValue()
- useSyncExternalStore()
- useInsertionEffect()


**7. Strict mode**

- Strict mode in React 18 will simulate mounting, unmounting, and re-mounting the component with a previous state.
- What does this mean? For example, when a user tabs away from a screen and back, the previous screen should be immediately seen. I’ll explain the process:
  - When the user gets to the screen at first, React mounts the component
  - When the user tabs away from the screen, React dismounts the component
  - When the user goes back to the screen, React mounts the component again.

- This is done over and over again. Strict mode will make sure that components are not affected by being mounted and unmounted over and over again.
