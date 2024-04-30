## useContext

- The useContext API in React is a powerful tool for managing state globally across a component tree without having to pass props manually at every level.
- Here’s an example of how you can implement a theme context using the useContext API in a React application.

`const value = useContext(SomeContext)`

- To implement usecontext we have to follow these steps.
1) Create Context 
```js
import React from 'react';

const ThemeContext = React.createContext();

```

2) Create Provider Component

```js
const MyProvider = ({ children }) => {
  const [state, setState] = React.useState("Initial State");

  // You can also include functions that modify the state here
  const updateState = newValue => {
    setState(newValue);
  };

  return (
    <MyContext.Provider value={{ state, updateState }}>
      {children}
    </MyContext.Provider>
  );
};
```

3) Step 3: Consume the Context
```js
import React, { useContext } from 'react';

const ChildComponent = () => {
  const { state, updateState } = useContext(MyContext);

  return (
    <div>
      <p>Current State: {state}</p>
      <button onClick={() => updateState("Updated State")}>
        Update State
      </button>
    </div>
  );
};

```

4) Wrap Components with the Provider

```js
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <MyProvider>
    <ChildComponent />
  </MyProvider>,
  document.getElementById('root')
);
```
