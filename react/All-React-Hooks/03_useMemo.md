## useMemo 

- This is the custom hook in react.
- useMemo is a React hook that memoizes the result of a function. It's part of React's Hooks API, introduced in React 16.8,
- which allows you to use state and other React features without writing a class.
- useMemo is used to optimize performance by memoizing expensive calculations.

Simply

- when same task repeated again and again , it will cache the result .

- How useMemo Works
- useMemo takes two arguments:

**Create function:** A function that returns the value you want to memoize.
**Dependencies array:** An array of dependencies that, when changed, will cause the memoized value to be recalculated.


- Syntax

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```



```js
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { useState,useEffect } from "react";
import "./App.css";
import Usememo from "./hooks/Usememo";
// import UseEffectHook from "./hooks/useEffectHook";
// import AllHooks from "./hooks/AllHooks";
function App() {
  //  const [users, setUsers] = useState([]);
    
      const initialUsers = [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ];

  return (
    <div>
      <Usememo initialUsers={initialUsers} />
    </div>
  );
}

export default App;

```

```js

import React, { useMemo, useState, useRef } from "react";

const Usememo = ({ initialUsers }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(initialUsers);
  // useMemo to filter users based on search input
  const filteredUsers = useMemo(() => {
    console.log("Filtering users");
    return users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, users]); // Dependencies array: only recompute when 'search' or 'users' change

  // Example of adding a new user (correctly causing an update)
  const addUser = () => {
    const newUser = { id: users.length + 1, name: "Dave" };
    setUsers([...users, newUser]); // Correctly updating with a new array reference
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={addUser}>Add User</button>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Usememo;

```



-------------------


```js
import React, { useMemo, useState, useRef } from "react";

const Usememo = () => {
  const [counter, setCounter] = useState(0);
  const [counter2, setCounter2] = useState(100);

  const squre = () => {
    console.log("Expensive Calculation");
    return counter * counter;
  };
  const memoisedResult = useMemo((squre),[counter])
  return (
    <div>
      <h2>Counter : {counter}</h2>
      <h2>SquredCounter : {memoisedResult}</h2>

      <button onClick={() => setCounter(counter + 1)}>Increment</button>
      <h2>Counter2 : {counter2}</h2>
      <button onClick={() => setCounter2(counter2 - 1)}>Decrement</button>
    </div>
  );
};

export default Usememo;
```
- useMemo is a React Hook that lets you cache the result of a calculation between re-renders.
- 
- **The useMemo hook in React is a performance optimization tool that memorizes a computed value from a function and only recalculates that value when one of its specified dependencies has changed. It serves to prevent expensive, unnecessary re-computations of that value during re-renders that do not involve changes to the dependencies.**


- The useMemo hook in your code is used to compute the square of the counter state variable. This computation would normally occur every time the component re-renders for any reason. However, with useMemo, the square of counter is only computed when counter itself changes. Here's a step-by-step explanation of what happens:

First Render:

- When the component mounts for the first time, useMemo runs the provided function, computes the square of counter, and the result is memoized (stored).
Subsequent Renders (Unrelated to counter Changes):

- If the component re-renders for reasons not related to counter (for example, if counter2 changes), useMemo does not recompute the square of counter. Instead, it provides the previously memoized (cached) value.
This is efficient because if the computation were expensive, you would save resources by not running it again.
Subsequent Renders (Related to counter Changes):

- If counter is incremented, useMemo recognizes that its dependency has changed. It then recomputes the square of counter because the dependency array [counter] provided to useMemo has a different value.
The new result is memoized, replacing the previous one.
**Using the Memoized Value:**

- The variable memoisedResult holds the memoized value and is used in the component's render output. You can use this value just like any other variable in your JSX or JavaScript logic within the component.
In essence, useMemo is optimizing performance by ensuring that the computation of counter * counter only occurs when absolutely necessary (i.e., when counter changes). It does not eliminate the computation but rather minimizes its frequency, reducing the overall computational cost across re-renders. This optimization is especially useful when dealing with more complex and resource-intensive calculations.











