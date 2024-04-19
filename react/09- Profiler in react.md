## Profiler

- <Profiler> lets you measure rendering performance of a React tree programmatically.
```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

- The Profiler measures how often a React application renders and what the “cost” of rendering is. Its purpose is to help identify parts of an application that are slow so that we can work on optimizing them.


**How It Works**
- The Profiler component measures how often a React application renders and what the "cost" of rendering is. It does this by wrapping around other components. 
- You can attach it to any part of your component tree, and it will record performance information for all its children.



**Key Props**
- id (string): A unique identifier for the profiler tree. This can be used to distinguish different Profilers in an application.
- onRender (function): A callback function that React calls any time a component within the Profiler tree "commits" an update. It provides detailed timing information about the render phase.


```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```



**Parameters of onRender**

- id: The id prop of the Profiler tree that has just committed.
- phase: Either "mount" (if the tree just mounted) or "update" (if it re-rendered).
- actualDuration: Time spent rendering the committed update.
- baseDuration: Estimated time to render the entire subtree without memoization.
- startTime: When React began rendering this update.
- commitTime: When React committed this update.
- interactions: The set of interactions belonging to this update.

_____________________________

- Measuring different parts of the application 
- You can use multiple <Profiler> components to measure different parts of your application:

```js
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```




```js


import React from "react";
import { useRef } from "react";

const UncontrolledComponent = () => {
  const nameRef = useRef();
  const emailRef = useRef();

  const onSubmit = (e) => {
    console.log("Name: " + nameRef.current.value);
    console.log("Email: " + emailRef.current.value);
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="name"
        ref={nameRef}
        required
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        ref={emailRef}
        required
        placeholder="Email"
      />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default UncontrolledComponent;



//App.js
import React, { Suspense, useState } from "react";
import "./App.css";
import UncontrolledComponent from "./components/UncontrolledComponent";
import { Profiler } from "react";
function App() {

  function onRenderCallback(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) {
    console.log("Rendering:", id);
    console.log("Phase:", phase);
    console.log("Actual duration:", actualDuration);
    console.log("Base duration:", baseDuration);
    console.log("Start time:", startTime);
    console.log("Commit time:", commitTime);
    console.log("Interactions:", interactions);
  }
  return (
    <>
      <Profiler id="MainApp" onRender={onRenderCallback}>
        <h1>Uncontrolled Component</h1>
        <UncontrolledComponent />
      </Profiler>
    </>
  );
}

export default App;

```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5db1db0c-89f4-4ab1-b340-c3923522732d)



























