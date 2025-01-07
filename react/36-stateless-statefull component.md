
# Stateless vs Stateful Components in React

## Stateless Components

A stateless component is a component that does not manage its own state. It is typically a presentational component that only receives props and renders UI based on those props.

### Key Characteristics:
1. Does not have internal state.
2. Only relies on props passed from the parent component.
3. Can be a functional component or a class component without state.

### Example:
```jsx
import React from 'react';

function StatelessComponent({ message }) {
  return <h1>{message}</h1>;
}

export default StatelessComponent;
```

---

## Stateful Components

A stateful component is a component that manages its own internal state. It can change its state in response to user interactions or other events, and it re-renders when the state changes.

### Key Characteristics:
1. Has internal state that can be modified.
2. State is managed using `useState` in functional components or `this.state` in class components.
3. Can trigger re-renders when state changes.

### Example (Functional Component):
```jsx
import React, { useState } from 'react';

function StatefulComponent() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default StatefulComponent;
```

### Example (Class Component):
```jsx
import React, { Component } from 'react';

class StatefulComponentClass extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default StatefulComponentClass;
```

---

## Comparison Table

| Feature                  | Stateless Component                    | Stateful Component                      |
|--------------------------|----------------------------------------|-----------------------------------------|
| **State Management**     | No internal state.                     | Manages its own internal state.         |
| **Re-rendering**         | Does not trigger re-renders on its own. | Triggers re-renders when state changes. |
| **Complexity**           | Simpler and more focused on presentation. | More complex due to state management.   |
| **Use Case**             | Display data passed via props.         | Handle user interactions and dynamic behavior. |
