##  React 18 features


**1. Automatic Batching**

- Batching is when React groups multiple state updates into a single re-render for better performance.
- Without automatic batching, we only batched updates inside React event handlers.
- Updates inside of promises, setTimeout, native event handlers, or any other event were not batched in React by default.
-  With automatic batching, these updates will be batched automatically. reducing the number of re-renders and improving performance


**Concurrent Rendering**


**New Root API:**



**New Suspense Features**



**New Feature: Transitions**

