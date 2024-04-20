## Lifting state up in react

- Lifting state up is a common pattern that react developers use to share state between multiple components.
- This process involves moving the state management from child components to a common ancestor (parent component).
- This way, the state becomes the "source of truth" for child components, and they can access and update it through props.

      (or)

- "Lifting state up" is a common technique in React for managing shared state across multiple components.
- This approach involves moving the state to the closest common ancestor of the components that need it, rather than keeping local state in each component.



**Why Lift State Up?**
- When multiple components need to access or modify the same state, it's inefficient and complex to manage this state in multiple places.
- Lifting the state up to their common ancestor keeps the state management centralized and makes it easier to maintain and debug.



**Steps to do lifting state up**

- Remove state from the child components.
- Pass hardcoded data from the common parent.
- Add state to the common parent and pass it down together with the event handlers.

**Example**

```js
import React, { useState } from 'react';

// Parent component that holds the state
function ParentComponent() {
    // State that keeps track of the count
    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>Shared Counter</h1>
            <ComponentA count={count} setCount={setCount} />
            <ComponentB count={count} setCount={setCount} />
        </div>
    );
}

// ComponentA allows incrementing the counter
function ComponentA({ count, setCount }) {
    return (
        <div>
            <h2>Component A</h2>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

// ComponentB allows decrementing the counter
function ComponentB({ count, setCount }) {
    return (
        <div>
            <h2>Component B</h2>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
    );
}

// Export the ParentComponent as the main component
export default ParentComponent;
```
 



                        **OR**


```js
import React, { Suspense, useState } from "react";
import { startTransition } from "react";
import { useTransition } from "react";
import "./App.css";


function App() {
   const [count, setCount] = useState(0);

     const handleIncrement = () => {
       setCount((prevCount) => prevCount + 1);
     };

     // Function to decrement the counter
     const handleDecrement = () => {
       setCount((prevCount) => prevCount - 1);
     };

   return (
     <div>
       <h1>Counter: {count}</h1>
       <ComponentA onIncrement={handleIncrement} />
       <ComponentB onDecrement={handleDecrement} />
     </div>
   );
}

function ComponentA({  onIncrement }) {
  return (
    <div>
      <h2>Component A</h2>
      {/* <p>Count: {count}</p> */}
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}

// ComponentB allows decrementing the counter
function ComponentB({ onDecrement }) {
  return (
    <div>
      <h2>Component B</h2>
      {/* <p>Count: {count}</p> */}
      <button onClick={onDecrement}>Decrement</button>
    </div>
  );
}

export default App;

```



