- In React, components are removed from the DOM as part of the unmounting process, typically in one of these ways:

**1. Conditional Rendering**

- You can control whether a component is rendered using conditional logic. By removing a component from the rendered JSX, React unmounts it.

```js
import React, { useState } from "react";

const ChildComponent = () => {
  return <div>I am a child component!</div>;
};

const ParentComponent = () => {
  const [showChild, setShowChild] = useState(true);

  return (
    <div>
      <button onClick={() => setShowChild(!showChild)}>
        {showChild ? "Remove Component" : "Show Component"}
      </button>
      {showChild && <ChildComponent />}
    </div>
  );
};

export default ParentComponent;
```

- Clicking the button toggles showChild.
- If showChild is false, the `<ChildComponent /> `is removed from the DOM.

**2. React Router (Route Navigation)**

- In applications using React Router, navigating to a different route removes the current route’s components from the DOM.

```js
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
```

- When you navigate to /about, the Home component is removed from the DOM.

**3. Using State Management for Cleanup**

- If your component is tied to state, clearing or resetting the state can remove the component.

```js
const App = () => {
  const [componentVisible, setComponentVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setComponentVisible(false)}>
        Remove Component
      </button>
      {componentVisible && <div>This component will be removed</div>}
    </div>
  );
};
```

**Unmounting Lifecycle in Class Components**

If you're using a class component, React provides the componentWillUnmount lifecycle method, which is called just before the component is removed from the DOM. You can use this for cleanup tasks like:

Canceling API requests
Clearing timers
Removing event listeners

```js
import React, { Component } from "react";

class MyComponent extends Component {
  componentWillUnmount() {
    console.log("Component is about to be removed!");
  }

  render() {
    return <div>My Component</div>;
  }
}

export default MyComponent;
```

**Unmounting in Functional Components**

- In functional components, cleanup tasks are handled inside the useEffect hook with a cleanup function:

```js
import React, { useEffect } from "react";

const MyComponent = () => {
  useEffect(() => {
    console.log("Component mounted");

    // Cleanup function
    return () => {
      console.log("Component unmounted");
    };
  }, []); // Empty dependency array means it runs once on mount and unmount

  return <div>My Component</div>;
};

export default MyComponent;
```
