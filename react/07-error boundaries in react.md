
- **Error boundaries do not catch errors for below:**

- Event handlers
- Asynchronous code (e.g., setTimeout or requestAnimationFrame callbacks)
- Server-side rendering
- Errors thrown in the error boundary itself (rather than its children)

**Error boundary can catch error in following scenarios**
- Render Method: If an error is thrown during the render phase of a class or functional component, an error boundary will catch it. This includes errors in the return statement of the component or errors thrown while rendering child components.
- Lifecycle Methods: Any error thrown in lifecycle methods of class components, such as componentDidMount, componentDidUpdate, or any other methods that are part of the creation and updating phases, will be caught by an error boundary. Note that componentWillUnmount is not included, as error boundaries do not handle errors in asynchronous code.
- Constructor: If an error occurs during the initialization of a class component in its constructor, it will be caught by an error boundary.

- A JavaScript error in a part of the UI shouldn’t break the whole app. To solve this problem for React users, React 16 introduces a new concept of an “error boundary”.

- Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.
- Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

- A class component becomes an error boundary if it defines a new lifecycle method called componentDidCatch(error, info):

- **Implementation:** To create an error boundary, you need a class component with either **getDerivedStateFromError() or componentDidCatch()** lifecycle methods defined.
- **getDerivedStateFromError():** This method is used to render a fallback UI after an error has been thrown. It receives the error as a parameter and returns a new state.
- **componentDidCatch():** This method is used for error logging. It captures the error and the information about which part of the tree was affected by it.

**Example**

```js
import React from "react";

class ErrorBoundaries extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error caught in error boundary: ", error);
    console.log("Error details: ", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#fee",
            color: "#911",
          }}
        >
          <h1>Oops! Something went wrong.</h1>
          <p>{this.state.error.toString()}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaries
```

```js
import React from 'react'
import { useState } from 'react';
const ErrorCounter = () => {
  const [count, setCount] = useState(0);
const [errorTriggered, setErrorTriggered] = useState(false);
  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

//   const throwError = () => {
//     throw new Error("User triggered error!");
//   };
  if (errorTriggered) {
    throw new Error("User triggered error!");
  }

  const throwError = () => {
    setErrorTriggered(true);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ color: "#007BFF" }}>Counter: {count}</h1>
      <button
        onClick={increment}
        style={{ margin: "5px", padding: "10px", fontSize: "16px" }}
      >
        Increment
      </button>
      <button
        onClick={decrement}
        style={{ margin: "5px", padding: "10px", fontSize: "16px" }}
      >
        Decrement
      </button>
      <button
        onClick={throwError}
        style={{
          margin: "5px",
          padding: "10px",
          fontSize: "16px",
          backgroundColor: "#dc3545",
          color: "white",
        }}
      >
        Trigger Error
      </button>
    </div>
  );
}

export default ErrorCounter
```

```js
import React from "react";

import "./App.css";
import ErrorBoundaries from "./components/ErrorBoundaries";
import ErrorCounter from "./components/ErrorCounter";
function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <ErrorBoundaries>
        <ErrorCounter />
      </ErrorBoundaries>
    </div>
  );
}

export default App;
```


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/759e7a29-5387-46a8-bc01-7fd93b3f2f39)

- Intial UI
- When i click on the trigger error button it will show us fallback UI

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/08294d20-914b-4a7c-b703-b02f58d3da89)



**Note:**  However, because React event handlers are asynchronous, errors thrown in event handlers (like your throwError function) aren't caught by error boundaries. 
- Normally, an error boundary can only catch an error in the rendering phase, lifecycle methods, or constructors of the child components.

```js
  const throwError = () => {
    throw new Error("User triggered error!");
  };
```

- If i implement directlly it will not catch the error.
________________

- **The above code comes under rendering phase**

- Rendering Phase: If any child components throw an error during their render method or function, the error boundary will catch it. This includes errors that occur when JSX is being rendered or when components are being mounted to the DOM. The updated ErrorCounter component triggers an error during the rendering phase by using a piece of state errorTriggered to throw an error conditionally during the render. When this state is set to true, the component re-renders and immediately throws an error, which falls under the rendering phase.
- Lifecycle Methods: If any child class components throw an error during the execution of lifecycle methods (constructor, componentDidMount, componentDidUpdate, getDerivedStateFromError, etc.), the error boundary will catch it. However, in your provided code, there aren't any class components that use lifecycle methods where an error is thrown; the ErrorCounter is a functional component.
- Constructors: If a constructor of a child class component throws an error during the initialization of the component, the error boundary can catch that. This is not applicable in your current code since you're using a functional component (ErrorCounter) without a constructor.

**Note:** Remember that for functional components, hooks such as useState and useEffect do not fall under the scenarios where error boundaries catch errors.
- Errors thrown inside these hooks need to be caught and handled using traditional error handling methods like try/catch blocks or error handling in promises and async functions.




____________________________


- **Why this.props.children**
```js
<ErrorBoundaries>
  <ErrorCounter />
</ErrorBoundaries>
```

-  In my code, return this.props.children; within the ErrorBoundaries component serves a very specific purpose.


- No Error State: When there's no error, this.props.children refers to <ErrorCounter />. So, return this.props.children; effectively means "render the ErrorCounter component normally".
- Error Handling: If an error occurs within ErrorCounter during the rendering phase or in any lifecycle methods (if ErrorCounter was a class component), the ErrorBoundaries component will set its state to indicate an error has happened (this.state.hasError becomes true).
- Fallback UI: After an error is captured by the ErrorBoundaries component's getDerivedStateFromError or componentDidCatch method, the render method will check the this.state.hasError flag. If it's true, instead of returning this.props.children, it will return the fallback UI, which in your case is a styled div with an error message.

