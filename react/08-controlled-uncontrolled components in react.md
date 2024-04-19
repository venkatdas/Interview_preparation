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
