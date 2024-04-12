## useEffect

- These are all inbuilt methods in react
- The useEffect hook is used to handle side effects in your component. Side effects are any operations that can affect components outside their scope or that need to persist or change over time, such as data fetching, subscriptions, timers, manually changing the DOM, and more.


```js
useEffect(() => {
  // Your side-effect logic here.

  return () => {
    // Cleanup logic here.
  };
}, [dependencies]);

```

- Dependencies array: This array is the second argument to useEffect. The hook will only re-run the effect if one of the dependencies has changed since the last render. If the array:
- Is not provided, the effect will run after every render.
- Is empty ([]), the effect will run once after the initial render, acting like componentDidMount.
- Contains variables, the effect will run after the initial render and after any subsequent re-renders if those variables change.


```js

import React from "react";
import { useEffect,useState } from "react";
const UseEffectHook = () => {
  const [age, setAge] = useState(0);
  const handleClick = () => setAge(age + 1);

  useEffect(() => {
    console.log("running on if age clicks");
    document.title = "You are " + age + " years old!";
  }, [age]); // Only re-run the effect if age changes
  return (
    <div>
      <h1>useEffect</h1>
      <button onClick={handleClick}>Update Title</button>
    </div>
  );
};

export default UseEffectHook;

```
