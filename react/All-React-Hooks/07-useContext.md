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



- Example for theme Changing when clicking on button

1) Creating the context

```js
import { createContext } from "react";
const ThemeContext = createContext("");

export default ThemeContext;

```
2) Creating provider

```js
import React, { useState } from "react";

import ThemeContext from "./ThemeContext";

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? "dark" : "light"));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
```

3) 

```js
import React, { useContext } from 'react'
import ThemeContext from '../context/ThemeContext'
const ThemeButton = () => {
    const {theme,toggleTheme} = useContext(ThemeContext)
  return (
    <div>
      <button
        onClick={toggleTheme}
        style={{
          backgroundColor: theme === "light" ? "#FFF" : "#333",
          color: theme === "light" ? "#333" : "#FFF",
        }}
      >
        Toggle Theme
      </button>
    </div>
  );
}

export default ThemeButton
```


```js

import React, { useCallback, useContext } from "react";
import "./App.css";
import { useState } from "react";
import UseCallback from "./hooks/UseCallback";
import Usememo from "./hooks/Usememo";
import AnotherUseMemo from "./hooks/AnotherUseMemo";
import ThemeButton from "./components/ThemeButton";
import ThemeContext from "./context/ThemeContext";
function App() {

  const {theme }= useContext(ThemeContext)
  

   const appStyle = {
     backgroundColor: theme === "light" ? "#FFF" : "#333",
     color: theme === "light" ? "#333" : "#FFF",
     minHeight: "100vh", // Makes sure the div takes at least the whole height of the viewport
     display: "flex",
     flexDirection: "column",
     alignItems: "center",
     justifyContent: "center",
   };
  return (
    <div style={appStyle}>
      <ThemeButton />
    </div>
  );
}

export default App;
```


```js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import ThemeProvider from "./context/ThemeProvider.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

```
