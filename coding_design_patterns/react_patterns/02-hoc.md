# Higher-Order Component (HOC) Pattern

## Description
A Higher-Order Component (HOC) is a function that takes a component and returns a new component with additional functionality. This pattern is used to share common logic across multiple components.

## Example Implementation

### HOC Definition
```jsx
// withLogger.js
import React from 'react';

function withLogger(WrappedComponent) {
  function NewComponent(props) {
    console.log('Props:', props);
    return <WrappedComponent {...props} />;
  }

  return NewComponent;
}

export default withLogger;
```

### Wrapped Component
```jsx
// Button.js
import React from 'react';

const Button = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

export default Button;
```

### Using the HOC
```jsx
// App.js
import React from 'react';
import Button from './Button';
import withLogger from './withLogger';

const ButtonWithLogger = withLogger(Button);

const App = () => {
  return (
    <div>
      <ButtonWithLogger label="Click Me" onClick={() => alert('Button clicked!')} />
    </div>
  );
};

export default App;
```

## Advantages
1. **Reusability**: Encapsulate shared behavior in a single place.
2. **Separation of Concerns**: Keeps components focused on their primary responsibilities.
3. **Scalability**: Easily extend existing components without modifying their code.

## Usage
1. Define the HOC as a function that takes a component and returns a new component.
2. Use the HOC to wrap components where you need the additional functionality.

## Folder Structure
```
src/
  components/
    Button.js
  hoc/
    withLogger.js
  App.js
```
