
# Controlled vs Uncontrolled Components in React

## Controlled Components

A controlled component is a component where React controls the form element's value. The component's state is the "single source of truth," and the value of the input is always driven by the state.

### Key Characteristics:
1. The form element's value is tied to a state variable.
2. Changes to the input are handled by an event handler that updates the state.
3. React re-renders the component when the state changes, ensuring the UI stays in sync with the state.

### Example:
```jsx
import React, { useState } from 'react';

function ControlledComponent() {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Submitted value: ${inputValue}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={inputValue} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ControlledComponent;
```

---

## Uncontrolled Components

An uncontrolled component is a component where the form element manages its own state internally. React does not control the value of the input directly.

### Key Characteristics:
1. The form element's value is accessed using a `ref` instead of React state.
2. React does not re-render the component on input value changes.
3. Useful for simple forms or when you need to interact with third-party libraries.

### Example:
```jsx
import React, { useRef } from 'react';

function UncontrolledComponent() {
  const inputRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Submitted value: ${inputRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" ref={inputRef} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledComponent;
```

---

## Comparison Table

| Feature                  | Controlled Component                     | Uncontrolled Component                  |
|--------------------------|------------------------------------------|-----------------------------------------|
| **State Management**     | State is managed by React.              | State is managed by the DOM.           |
| **Access to Value**      | `value` prop and state variable.         | `ref` to access the DOM element.       |
| **Real-Time Validation** | Easy to implement.                      | Requires additional effort.            |
| **Code Complexity**      | More boilerplate code.                  | Simpler for basic use cases.           |
| **Use Case**             | Complex forms with dynamic interactions.| Simple forms or third-party integrations.|



---------------
## Controlled Components

- Controlled components are the most common type of component in React. They are used when you want to be able to track the state of a component and react to changes in that state.
- For example, if you have a component that represents a user’s input, you would want to use a controlled component so that you can track the user’s input and update the component’s state accordingly.


```js
import React, { useState, useEffect } from 'react';

function ControlledInput() {
  const [value, setValue] = useState(''); // State to store the input's value

  // useEffect to log changes
  useEffect(() => {
    console.log('Input value changed:', value);
  }, [value]); // Dependency array includes `value`, so the effect runs when `value` changes

  const handleChange = (event) => {
    setValue(event.target.value); // Update state with the input's current value
  };

  return (
    <input type="text" value={value} onChange={handleChange} />
  );
}

```
__________________


OR

_________

```js

import React, { Suspense, useState } from "react";
import "./App.css";
import ControlledComponent from "./components/ControlledComponent";

function App() {
  const [value,setValue]= useState('')

  const handleInputChange=(newVal)=>{
    setValue(newVal)
    console.log("Input changed to", newVal);

  }
  return (
    <>
      <h1>Controlled Component</h1>
      <ControlledComponent value={value} onChange={handleInputChange} />
      <p>Current Input Value: {value}</p>
    </>
  );
}

export default App;


import React, { useState } from 'react'

const ControlledComponent = ({value,onChange}) => {

    const[inputValue,setInputValue]= useState(value)

    const handleChange=(e)=>{
        setInputValue(e.target.value)
         if (onChange) {
           onChange(e.target.value);
         }

    }
  return (
    <div>
        <input value={inputValue} onChange={handleChange} />
    </div>
  )
}

export default ControlledComponent

```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/533323b8-9873-4b34-af41-f6d71e32f5f6)





**Uncontrolled Components**

- Uncontrolled components are those that do not use React state to track their value. Instead, they maintain their own internal state. Uncontrolled components are typically used when you do not need to track the state of the component or when you want to allow the user to interact with the component in a way that is not controlled by React.
- To create an uncontrolled component, you do not need to pass any props to the component. The component will maintain its own internal state, and you can access the value of the component using a ref.


```js
import React from 'react'
import { useRef } from 'react';

const UncontrolledComponent = () => {
  const nameRef = useRef();
  const emailRef = useRef();

  const onSubmit = (e) => {
    console.log("Name: " + nameRef.current.value);
    console.log("Email: " + emailRef.current.value);
    e.preventDefault()
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" ref={nameRef} required placeholder='Name' />
      <input type="email" name="email" ref={emailRef} required  placeholder='Email'/>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default UncontrolledComponent
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/4579b048-9094-43a6-9441-3631c5efb561)


- useRef: The useRef hook is used to create a ref (inputRef) that provides direct access to the DOM element, in this case, an input element. This is not stateful and does not cause re-renders when the input changes.
