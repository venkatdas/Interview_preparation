- In React, a "pure component" is a specific type of component that optimizes performance by minimizing re-renders
- A React pure component only re-renders if the state or props have changed. This is determined by a shallow comparison of both props and state, making them more efficient in some scenarios.
- PureComponent is similar to Component but it skips re-renders for same props and state.
- Class components are still supported by React, but we don’t recommend using them in new code.

- PureComponent is a subclass of Component and supports all the Component APIs. Extending PureComponent is equivalent to defining a custom shouldComponentUpdate method that shallowly compares props and state.
- Example

```js
import React, { PureComponent } from 'react';

class UserProfile extends PureComponent {
  render() {
    console.log("Rendering UserProfile");
    const { name, age } = this.props;
    return (
      <div>
        <h1>User Profile</h1>
        <p>Name: {name}</p>
        <p>Age: {age}</p>
      </div>
    );
  }
}

class App extends React.Component {
  state = { name: 'John', age: 30 };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ age: 30 }); // This will not cause UserProfile to re-render
    }, 2000);
  }

  changeName = () => {
    this.setState({ name: 'Jane' });
  }

  render() {
    return (
      <div>
        <UserProfile name={this.state.name} age={this.state.age} />
        <button onClick={this.changeName}>Change Name</button>
      </div>
    );
  }
}

export default App;

```

**Functional component with react.memo**

- For functional components, React provides React.memo for a similar optimization. React.memo is a higher-order component that wraps a functional component, enabling it to only re-render when its props change.

```js
import React, { useState, useEffect } from 'react';

const UserProfile = React.memo(({ name, age }) => {
  console.log("Rendering UserProfile");
  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
});

function App() {
  const [name, setName] = useState('John');
  const [age, setAge] = useState(30);

  useEffect(() => {
    setTimeout(() => {
      setAge(30); // This will not cause UserProfile to re-render
    }, 2000);
  }, []);

  const changeName = () => {
    setName('Jane');
  };

  return (
    <div>
      <UserProfile name={name} age={age} />
      <button onClick={changeName}>Change Name</button>
    </div>
  );
}

export default App;

```
------------------



# PureComponent in React

## Overview
`React.PureComponent` is a special type of React class component that optimizes rendering by implementing a shallow comparison of props and state. This helps in reducing unnecessary re-renders, improving the performance of React applications.

### Key Features of `PureComponent`
1. **Shallow Comparison**:
   - React performs a shallow comparison of the previous and new values of `props` and `state` to determine if the component should re-render.
   - If no changes are detected, the component is not re-rendered.

2. **Automatic Optimization**:
   - By extending `React.PureComponent`, you can automatically optimize rendering without manually implementing `shouldComponentUpdate`.

3. **Behavior**:
   - A `PureComponent` re-renders only if there is a change in the shallow reference of `props` or `state`.

### Code Example:
```javascript
import React from 'react';

class MyPureComponent extends React.PureComponent {
  render() {
    console.log('Rendering MyPureComponent');
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default MyPureComponent;
```

### Usage:
```javascript
import React, { useState } from 'react';
import MyPureComponent from './MyPureComponent';

function App() {
  const [name, setName] = useState('Alice');
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setName('Alice')}>Set Name to Alice</button>
      <MyPureComponent name={name} />
    </div>
  );
}

export default App;
```

In this example, `MyPureComponent` will only re-render when the `name` prop changes.

---

## Limitations of PureComponent



- Pure components automatically implement the shouldComponentUpdate() method with a shallow prop and state comparison. This method returns false if the props and state haven’t changed.

1. **Shallow Comparison**:
   - A `PureComponent` only performs a shallow comparison of `props` and `state`.
   - Changes in deeply nested objects or arrays will not trigger a re-render unless their reference changes.

   **Example:**
   ```javascript
   const obj1 = { nested: { value: 1 } };
   const obj2 = { nested: { value: 1 } };
   console.log(obj1 === obj2); // false (different references)

   const obj3 = obj1;
   console.log(obj1 === obj3); // true (same reference)
   ```

   **Impact:**
   If you pass deeply nested objects as props and mutate them directly, the `PureComponent` will not detect the change.

2. **Immutability Required**:
   - To fully benefit from `PureComponent`, you must ensure immutability of `props` and `state`.
   - Avoid mutating objects or arrays directly.

   **Correct Usage:**
   ```javascript
   const newState = { ...oldState, key: 'newValue' };
   ```

   **Incorrect Usage:**
   ```javascript
   oldState.key = 'newValue';
   this.setState(oldState); // Mutation can lead to bugs
   ```

3. **Not Always Optimal**:
   - In some cases, the overhead of shallow comparison might outweigh the cost of re-rendering.
   - For very simple components, the benefits of `PureComponent` might be negligible.

---

## Handling Deep Comparisons
When dealing with deeply nested objects or arrays, `PureComponent` alone might not suffice. Consider these strategies:

1. **Use Immutable Data Structures**:
   - Use libraries like [Immutable.js](https://immutable-js.github.io/immutable-js/) to ensure immutability and simplify updates.

2. **Manual Implementation of `shouldComponentUpdate`**:
   - Override `shouldComponentUpdate` to perform a custom comparison for deeply nested structures.

   **Example:**
   ```javascript
   class MyComponent extends React.Component {
     shouldComponentUpdate(nextProps) {
       return JSON.stringify(this.props.nested) !== JSON.stringify(nextProps.nested);
     }

     render() {
       return <div>{this.props.nested.value}</div>;
     }
   }
   ```

3. **React.memo**:
   - For functional components, use `React.memo` to achieve similar optimization as `PureComponent`.

   **Example with Deep Comparison:**
   ```javascript
   import React from 'react';

   const MyMemoizedComponent = React.memo(
     function MyComponent({ nested }) {
       return <div>{nested.value}</div>;
     },
     (prevProps, nextProps) => {
       return JSON.stringify(prevProps.nested) === JSON.stringify(nextProps.nested);
     }
   );

   export default MyMemoizedComponent;
   ```

---

## React.memo vs PureComponent

| Feature                | `React.PureComponent`               | `React.memo`                      |
|------------------------|--------------------------------------|------------------------------------|
| **Type**              | Class Component                     | Functional Component              |
| **Optimization**      | Shallow comparison of `props` and `state` | Shallow comparison of `props`    |
| **Customization**     | Requires overriding `shouldComponentUpdate` | Supports custom comparison function |
| **Usage**             | Use with class-based components      | Use with functional components    |

### Example of React.memo:
```javascript
import React, { useState } from 'react';

const MyComponent = React.memo(({ name }) => {
  console.log('Rendering MyComponent');
  return <h1>Hello, {name}!</h1>;
});

function App() {
  const [name, setName] = useState('Alice');
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setName('Alice')}>Set Name to Alice</button>
      <MyComponent name={name} />
    </div>
  );
}

export default App;
```

---

## Conclusion
`PureComponent` and `React.memo` are powerful tools for optimizing React applications. While `PureComponent` is used with class components, `React.memo` serves the same purpose for functional components. When dealing with deeply nested objects, ensure immutability or implement custom comparison logic for optimal results.

---------------------------------------------



# React.PureComponent vs React.memo

This document explains `React.PureComponent` and `React.memo` in detail with fully implemented examples.

---

## **1. React.PureComponent**

### **Definition**
`React.PureComponent` is a base class in React for creating components that implement a shallow comparison of props and state to decide whether the component should re-render.

### **Key Points**

1. **Shallow Comparison**:
   - Compares the current props and state with the next props and state using a shallow equality check (`===`).
   - If there are no changes, the component will not re-render.

2. **Class Component Only**:
   - `PureComponent` is specifically for class-based components.
   - Functional components cannot use `PureComponent`.

3. **Performance Optimization**:
   - Avoids unnecessary renders, improving performance.
   - Useful for components with large trees or heavy computations.

4. **Limitations**:
   - Only performs shallow comparisons:
     - Works well for primitive values (`number`, `string`, `boolean`).
     - Fails for deeply nested objects or arrays unless explicitly handled.
   - Does not work well if props or state are mutated directly instead of being replaced with new references.

5. **Usage**:
   Replace `React.Component` with `React.PureComponent` in class components.

### **Example**

```jsx
import React, { PureComponent } from 'react';

// Child Component
class Counter extends PureComponent {
  render() {
    console.log('Rendering Counter');
    return (
      <div>
        <h2>Counter: {this.props.count}</h2>
      </div>
    );
  }
}

// Parent Component
class App extends React.Component {
  state = {
    count: 0,
    randomValue: 0, // This will trigger unnecessary renders if not optimized
  };

  incrementCounter = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  generateRandomValue = () => {
    this.setState({ randomValue: Math.random() });
  };

  render() {
    console.log('Rendering App');
    return (
      <div>
        <h1>React.PureComponent Example</h1>
        <button onClick={this.incrementCounter}>Increment Counter</button>
        <button onClick={this.generateRandomValue}>Generate Random Value</button>
        <Counter count={this.state.count} />
      </div>
    );
  }
}

export default App;
```

---

## **2. React.memo**

### **Definition**
`React.memo` is a higher-order component (HOC) that optimizes functional components by memoizing their output. It skips rendering if the props haven’t changed.

### **Key Points**

1. **Functional Components**:
   - `React.memo` is designed for functional components.
   - It’s the functional component equivalent of `PureComponent`.

2. **Shallow Comparison**:
   - Similar to `PureComponent`, it performs a shallow comparison of props.
   - If props remain the same, the component is not re-rendered.

3. **Custom Comparison**:
   - Allows you to provide a custom comparison function to control when the component should re-render.

   ```jsx
   const MyComponent = React.memo(
     (props) => {
       console.log('Rendering MyComponent');
       return <div>{props.value}</div>;
     },
     (prevProps, nextProps) => prevProps.value === nextProps.value
   );
   ```

4. **Usage**:
   Wrap the functional component with `React.memo`.

### **Example**

```jsx
import React, { useState } from 'react';

// Child Component
const Counter = React.memo(({ count }) => {
  console.log('Rendering Counter');
  return (
    <div>
      <h2>Counter: {count}</h2>
    </div>
  );
});

// Parent Component
const App = () => {
  const [count, setCount] = useState(0);
  const [randomValue, setRandomValue] = useState(0);

  const incrementCounter = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const generateRandomValue = () => {
    setRandomValue(Math.random());
  };

  return (
    <div>
      <h1>React.memo Example</h1>
      <button onClick={incrementCounter}>Increment Counter</button>
      <button onClick={generateRandomValue}>Generate Random Value</button>
      <Counter count={count} />
    </div>
  );
};

export default App;
```

---

### **Advanced Example with Custom Comparison for React.memo**

In some cases, a shallow comparison may not be sufficient. You can provide a custom comparison function.

```jsx
import React, { useState } from 'react';

// Child Component with Custom Comparison
const Counter = React.memo(
  ({ count, randomValue }) => {
    console.log('Rendering Counter');
    return (
      <div>
        <h2>Counter: {count}</h2>
        <p>Random Value: {randomValue}</p>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.count === nextProps.count
);

// Parent Component
const App = () => {
  const [count, setCount] = useState(0);
  const [randomValue, setRandomValue] = useState(0);

  const incrementCounter = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const generateRandomValue = () => {
    setRandomValue(Math.random());
  };

  return (
    <div>
      <h1>React.memo with Custom Comparison</h1>
      <button onClick={incrementCounter}>Increment Counter</button>
      <button onClick={generateRandomValue}>Generate Random Value</button>
      <Counter count={count} randomValue={randomValue} />
    </div>
  );
};

export default App;
```

---

## **Comparison: PureComponent vs React.memo**

| Feature               | PureComponent                     | React.memo                       |
|-----------------------|------------------------------------|-----------------------------------|
| **Component Type**    | Class-based components            | Functional components            |
| **Comparison Type**   | Shallow comparison of props/state | Shallow comparison of props      |
| **Customization**     | No custom comparison allowed      | Allows custom comparison function |
| **Use Case**          | Optimizing class components       | Optimizing functional components |
| **Usage**             | Extend `React.PureComponent`      | Wrap component with `React.memo` |
| **State Comparison**  | Includes state comparison         | Does not handle state (props only) |

---

## **Best Practices**

1. Use **`PureComponent`** or **`React.memo`** only when:
   - Performance bottlenecks are observed due to frequent re-renders.
   - The component's props/state are predictable and stable.

2. Avoid using them for:
   - Components with deeply nested objects or arrays unless you ensure immutability.
   - Lightweight components where the overhead of memoization might outweigh the benefits.

3. Always test and measure performance improvements using tools like React Developer Tools or browser profiling.

-------------


# Why Shallow Comparison Fails for Deeply Nested Objects or Arrays

`PureComponent` and `React.memo` perform shallow equality checks. This means they compare only the top-level references of props or state. If a deeply nested property changes but the reference of the object remains the same, the change is not detected, leading to incorrect behavior.

## Example of Failure

```jsx
import React, { PureComponent } from 'react';

class Parent extends PureComponent {
  state = {
    data: { name: 'Venkat', details: { age: 25 } },
  };

  updateAge = () => {
    // Updating the age without changing the reference of `data`
    this.state.data.details.age = 30;
    this.setState({}); // No reference change
  };

  render() {
    console.log('Parent Rendered');
    return (
      <div>
        <Child data={this.state.data} />
        <button onClick={this.updateAge}>Update Age</button>
      </div>
    );
  }
}

class Child extends PureComponent {
  render() {
    console.log('Child Rendered');
    return <div>{this.props.data.details.age}</div>;
  }
}

export default Parent;
```

### Explanation:
1. The `Parent` component updates the `age` property inside `data.details` without changing the reference of `data`.
2. Since `PureComponent` only checks the reference of `data` (shallow comparison), the `Child` component does not re-render, even though `age` has changed.

## How to Overcome This Limitation

### Solution 1: Ensure Immutability
Always create a new object or array reference when updating deeply nested properties.

```jsx
import React, { PureComponent } from 'react';

class Parent extends PureComponent {
  state = {
    data: { name: 'Venkat', details: { age: 25 } },
  };

  updateAge = () => {
    // Create a new reference for `data` and its nested properties
    this.setState({
      data: {
        ...this.state.data,
        details: { ...this.state.data.details, age: 30 },
      },
    });
  };

  render() {
    console.log('Parent Rendered');
    return (
      <div>
        <Child data={this.state.data} />
        <button onClick={this.updateAge}>Update Age</button>
      </div>
    );
  }
}

class Child extends PureComponent {
  render() {
    console.log('Child Rendered');
    return <div>{this.props.data.details.age}</div>;
  }
}

export default Parent;
```

### Solution 2: Use Deep Comparison
Implement a custom comparison function in `React.memo` for functional components to handle deeply nested objects.

```jsx
import React from 'react';

const Child = React.memo(
  ({ data }) => {
    console.log('Child Rendered');
    return <div>{data.details.age}</div>;
  },
  (prevProps, nextProps) => {
    // Perform a deep comparison for `data`
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  }
);

const Parent = () => {
  const [data, setData] = React.useState({ name: 'Venkat', details: { age: 25 } });

  const updateAge = () => {
    setData((prevData) => ({
      ...prevData,
      details: { ...prevData.details, age: 30 },
    }));
  };

  console.log('Parent Rendered');
  return (
    <div>
      <Child data={data} />
      <button onClick={updateAge}>Update Age</button>
    </div>
  );
};

export default Parent;
```

### Solution 3: Use Libraries for Deep Comparison
Leverage libraries like `lodash.isequal` for efficient deep comparison.

```bash
npm install lodash.isequal
```

```jsx
import React from 'react';
import isEqual from 'lodash.isequal';

const Child = React.memo(
  ({ data }) => {
    console.log('Child Rendered');
    return <div>{data.details.age}</div>;
  },
  (prevProps, nextProps) => isEqual(prevProps.data, nextProps.data)
);

const Parent = () => {
  const [data, setData] = React.useState({ name: 'Venkat', details: { age: 25 } });

  const updateAge = () => {
    setData((prevData) => ({
      ...prevData,
      details: { ...prevData.details, age: 30 },
    }));
  };

  console.log('Parent Rendered');
  return (
    <div>
      <Child data={data} />
      <button onClick={updateAge}>Update Age</button>
    </div>
  );
};

export default Parent;
```

## Best Practices
1. **Favor Immutability**:
   - Always update objects immutably using spread operators or libraries like `immer`.

2. **Use Custom Comparisons Sparingly**:
   - Use custom comparison functions only when necessary, as they add computational overhead.

3. **Consider Libraries for Deep Comparison**:
   - Libraries like `lodash.isequal` are optimized for deep comparisons and can simplify implementation.

4. **Optimize Component Hierarchy**:
   - Keep deeply nested state minimal by lifting state higher or flattening the structure.
