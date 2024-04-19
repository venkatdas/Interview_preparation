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



- **Key Props**
- id (string): A unique identifier for the profiler tree. This can be used to distinguish different Profilers in an application.
- onRender (function): A callback function that React calls any time a component within the Profiler tree "commits" an update. It provides detailed timing information about the render phase.
