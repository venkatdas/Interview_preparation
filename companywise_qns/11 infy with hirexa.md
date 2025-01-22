# Round1

1. Intro
2. Promise.all
3. syntax, working flow
4. One scenario based question on promise.all
   - I have a promise with reject, in general it will go the catch block , and now instead of going to the catch block, i wnat to reject in then block only , how will you do.
5. react machine coding on recursion component

```js
const data = {
  name: "Root",
  children: [
    {
      id: 2,
      name: "Child 1",
      children: [
        {
          id: 3,
          name: "Grandchild 1",
        },
        {
          id: 4,
          name: "Grandchild 2",
        },
      ],
    },
  ],
};

const Tree = ({ node }) => {
  return (
    <div>
      <p>{node.name}</p>
      {node.children &&
        node.children.map((child) => <Tree key={child.id} node={child} />)}
    </div>
  );
};

export default function App() {
  return (
    <div>
      <h1>Tree Structure</h1>
      <Tree node={data} />
    </div>
  );
}
```

6. custom hook
7. custom hook implementation on fetch (error,loading,data)
8. DOM, eventListener, getElementById, querySelector.
9. What is the useEffect and how it align with class based components


-------------------------


# Round 2

- Intro
- What is Javascript and what is react
- Hooks in react and some of the hooks syntax
- Es6 features
- Object destructuring example , given the code

```js
const obj1 = {
  country: "India",
  city: {
    details: {
      name: "das",
    },
  },
};

// Destructuring the nested object
const { country, city: { details: { name } } } = obj1;

console.log(country); // Output: India
console.log(name);    // Output: das

```
- ForEach vs Map
- Todo in react - texbox, while entering the text in text box it shold added into the list

```js
import React, { useState } from 'react';

function App() {
  // State to store the current input value
  const [name, setName] = useState('');
  
  // State to store all submitted names
  const [names, setNames] = useState([]);

  // Handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the page from reloading
    if (name.trim() !== '') {
      setNames([...names, name]); // Add the new name to the list
      setName(''); // Clear the input field
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Name Submission</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update the name state
        />
        <button type="submit">Submit</button>
      </form>
      
      <h2>Submitted Names:</h2>
      <ul>
        {names.map((n, index) => (
          <li key={index}>{n}</li> // Display all submitted names
        ))}
      </ul>
    </div>
  );
}

export default App;

```
- Web Workers
- Array.flat in js

#### Verdict: Selected



