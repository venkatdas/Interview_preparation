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

export default ErrorBoundaries;
```

```js
import React from "react";
import { useState } from "react";
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
};

export default ErrorCounter;
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

**Note:** However, because React event handlers are asynchronous, errors thrown in event handlers (like your throwError function) aren't caught by error boundaries.

- Normally, an error boundary can only catch an error in the rendering phase, lifecycle methods, or constructors of the child components.

```js
const throwError = () => {
  throw new Error("User triggered error!");
};
```

- If i implement directlly it will not catch the error.

---

- **The above code comes under rendering phase**

- Rendering Phase: If any child components throw an error during their render method or function, the error boundary will catch it. This includes errors that occur when JSX is being rendered or when components are being mounted to the DOM. The updated ErrorCounter component triggers an error during the rendering phase by using a piece of state errorTriggered to throw an error conditionally during the render. When this state is set to true, the component re-renders and immediately throws an error, which falls under the rendering phase.
- Lifecycle Methods: If any child class components throw an error during the execution of lifecycle methods (constructor, componentDidMount, componentDidUpdate, getDerivedStateFromError, etc.), the error boundary will catch it. However, in your provided code, there aren't any class components that use lifecycle methods where an error is thrown; the ErrorCounter is a functional component.
- Constructors: If a constructor of a child class component throws an error during the initialization of the component, the error boundary can catch that. This is not applicable in your current code since you're using a functional component (ErrorCounter) without a constructor.

**Note:** Remember that for functional components, hooks such as useState and useEffect do not fall under the scenarios where error boundaries catch errors.

- Errors thrown inside these hooks need to be caught and handled using traditional error handling methods like try/catch blocks or error handling in promises and async functions.

---

- **Why this.props.children**

```js
<ErrorBoundaries>
  <ErrorCounter />
</ErrorBoundaries>
```

- In my code, return this.props.children; within the ErrorBoundaries component serves a very specific purpose.

- No Error State: When there's no error, this.props.children refers to `<ErrorCounter />`. So, return this.props.children; effectively means "render the ErrorCounter component normally".
- Error Handling: If an error occurs within ErrorCounter during the rendering phase or in any lifecycle methods (if ErrorCounter was a class component), the ErrorBoundaries component will set its state to indicate an error has happened (this.state.hasError becomes true).
- Fallback UI: After an error is captured by the ErrorBoundaries component's getDerivedStateFromError or componentDidCatch method, the render method will check the this.state.hasError flag. If it's true, instead of returning this.props.children, it will return the fallback UI, which in your case is a styled div with an error message.

---

# Error Handling in React: `getDerivedStateFromError` vs `componentDidCatch`

## Are `error` and `errorInfo` Default Parameters?

- **No**, they are not default parameters. React automatically provides these arguments when an error is thrown in the child component tree of an error boundary.

---

## Difference Between `getDerivedStateFromError` and `componentDidCatch`

### 1. **`static getDerivedStateFromError(error)`**

- **Purpose**: Updates the component's state when an error occurs.
- **Parameters**: Only receives the `error` object.
- **Behavior**: Runs during the **render phase**, meaning it is synchronous and cannot have side effects (e.g., logging).
- **Use Case**: Update the state to trigger a re-render and display a fallback UI.
- **Error Parameter**: This is the same `error` object that React propagates when a child throws an error.

#### Example:

```javascript
static getDerivedStateFromError(error) {
  return { hasError: true, errorMessage: error.message };
}
```

---

### 2. **`componentDidCatch(error, errorInfo)`**

- **Purpose**: Logs the error or performs side effects (e.g., sending error data to a logging service).
- **Parameters**:
  - `error`: The error object (same as in `getDerivedStateFromError`).
  - `errorInfo`: Additional information about where the error occurred in the component tree, including the `componentStack`.
- **Behavior**: Runs during the **commit phase**, meaning it can have side effects like logging, API calls, etc.
- **Use Case**: Use for logging or reporting errors to an external service.
- **Error Parameter**: This `error` is the same error passed to `getDerivedStateFromError`.

#### Example:

```javascript
componentDidCatch(error, errorInfo) {
  console.error("Error occurred:", error);
  console.error("Error details:", errorInfo.componentStack);
}
```

---

### **Comparison of Parameters**

| Method                                | `error` Parameter                       | `errorInfo` Parameter                          |
| ------------------------------------- | --------------------------------------- | ---------------------------------------------- |
| `getDerivedStateFromError(error)`     | The error thrown in the child component | Not available                                  |
| `componentDidCatch(error, errorInfo)` | Same `error` object as above            | Includes additional details (`componentStack`) |

---

### **How They Work Together**

- **`getDerivedStateFromError`**: Handles immediate error recovery by setting state and rendering a fallback UI.
- **`componentDidCatch`**: Logs the error and performs side effects after the component has updated.

#### Example Workflow:

1. An error is thrown in a child component.
2. React calls `getDerivedStateFromError` with the `error` to update the state.
3. React then calls `componentDidCatch` with the same `error` and additional `errorInfo` for logging.

---

### Example Code

#### Error Boundary Component

```javascript
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error("Error occurred:", error);
    console.error("Error details:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>Error Details: {this.state.errorMessage}</p>
        </div>
      );
    }

    // Render children if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### Simulating an Error in a Child Component

Here is an example of how to simulate an error in a child component:

```javascript
import React from "react";
import ErrorBoundary from "./ErrorBoundary";

const BuggyComponent = () => {
  // Simulate an error
  throw new Error("Simulated error!");
  return <div>This will not render.</div>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BuggyComponent />
    </ErrorBoundary>
  );
};

export default App;
```

---

### Simulated Error Workflow

1. `BuggyComponent` throws an error (`throw new Error("Simulated error!")`).
2. `ErrorBoundary` catches the error via `getDerivedStateFromError` and updates the state.
3. The fallback UI (`Something went wrong.`) is displayed.
4. The error is logged to the console via `componentDidCatch`. This includes:
   - The error message (`Simulated error!`).
   - The `componentStack` trace showing where the error occurred.

---

### Simulating Errors in Different Phases

#### 1. Simulating an Error in the Constructor

Errors in the constructor are also caught by `ErrorBoundary`.

```javascript
class BuggyConstructorComponent extends React.Component {
  constructor(props) {
    super(props);
    throw new Error("Error in constructor!");
  }

  render() {
    return <div>Constructor Component</div>;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <BuggyConstructorComponent />
    </ErrorBoundary>
  );
};

export default App;
```

---

#### 2. Simulating an Error in a Lifecycle Method

Errors in lifecycle methods like `componentDidMount` can also be caught by `ErrorBoundary`.

```javascript
class BuggyLifecycleComponent extends React.Component {
  componentDidMount() {
    throw new Error("Error in componentDidMount!");
  }

  render() {
    return <div>Lifecycle Component</div>;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <BuggyLifecycleComponent />
    </ErrorBoundary>
  );
};

export default App;
```

---

#### 3. Simulating an Error in an Event Handler

Errors in event handlers are **not caught** by `ErrorBoundary`. You need to handle these errors explicitly.

```javascript
const BuggyEventHandler = () => {
  const handleClick = () => {
    throw new Error("Error in event handler!");
  };

  return <button onClick={handleClick}>Click Me</button>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BuggyEventHandler />
    </ErrorBoundary>
  );
};

export default App;
```

**Solution for Event Handlers**:
Use a `try-catch` block inside the event handler to manage such errors.

```javascript
const BuggyEventHandler = () => {
  const handleClick = () => {
    try {
      throw new Error("Error in event handler!");
    } catch (error) {
      console.error("Caught error in event handler:", error);
    }
  };

  return <button onClick={handleClick}>Click Me</button>;
};
```

---

#### 4. Simulating Errors in Asynchronous Code

Errors in asynchronous operations are **not caught** by `ErrorBoundary`. You need to handle these explicitly.

```javascript
const BuggyAsyncComponent = () => {
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        throw new Error("Error in async operation!");
      } catch (error) {
        console.error("Caught error in async operation:", error);
      }
    };

    fetchData();
  }, []);

  return <div>Async Component</div>;
};

const App = () => {
  return (
    <ErrorBoundary>
      <BuggyAsyncComponent />
    </ErrorBoundary>
  );
};

export default App;
```
