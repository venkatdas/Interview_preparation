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




