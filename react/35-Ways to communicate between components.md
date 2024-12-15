## Ways to communicate between components

**1. Send data from parent to child using PROPS**

- Props (Parent to Child Communication)

```js
//Parent.js
import React from "react";
import Child from "./Child";

function Parent() {
  const message = "Hello from Parent!";
  return <Child message={message} />;
}

export default Parent;
```

- Child.js

```js
import React from "react";

function Child({ message }) {
  return <p>{message}</p>;
}

export default Child;
```

**2. Callback Functions (Child to Parent Communication)**

- Definition:
- Since data flow is one-way (parent to child) in React, child components can communicate with parents by invoking a function passed as a prop.

- How It Works:

- The parent passes a function (onEvent) to the child as a prop.
  The child calls this function and can optionally pass data back to the parent.
- Example Use Case: Notify the parent when a button in the child is clicked.

```js
//Parent.js
import React from "react";
import Child from "./Child";

function Parent() {
  const handleChildEvent = (data) => {
    console.log("Received from child:", data);
  };

  return <Child onEvent={handleChildEvent} />;
}

export default Parent;
```

```js
//Child.js
import React from "react";

function Child({ onEvent }) {
  return <button onClick={() => onEvent("Hello from Child!")}>Click Me</button>;
}

export default Child;
```



**3. State Lifting**
- Two sibling components passing data to each other
- Definition:
- When sibling components need to share data, state is "lifted" to their common parent. The parent manages the state, and children either read it or update it via props.

- How It Works:

- The parent holds the shared state using useState.
One child updates the state by calling a function passed via props, while the other reads it.


```js
function Parent() {
    const [counter, setCounter] = React.useState(0); // Initial counter value set to 0

    return (
        <>
            <IncrementChild setCounter={setCounter} />
            <DisplayChild counter={counter} />
        </>
    );
}

function IncrementChild({ setCounter }) {
    return (
        <button onClick={() => setCounter((prevCounter) => prevCounter + 1)}>
            Increment Counter
        </button>
    );
}

function DisplayChild({ counter }) {
    return <p>Counter Value: {counter}</p>;
}
```


**Props Drilling in React:**

- Props drilling involves passing props from a parent component to a deeply nested child component through intermediate components. This occurs when data needs to be transmitted to descendant components that are several levels deep in the component tree.

```js
// Parent Component:

import ChildA from "./components/ChildA";

export default function Home() {
  let webName = "My Website";
  let name1 = "My Child";
  return (
    <div>
      <h1>Welcome To my {webName}</h1>
      <ChildA name={name1} />
    </div>
  );
}

---------------------------------------------------------------------------
// ChildA:

import ChildB from './ChildB'

const ChildA = ({ name }: any) => {
  return (
      <ChildB name={name} />
  )
}

export default ChildA

---------------------------------------------------------------------------
// ChildB:

import ChildC from './ChildC'

const ChildB = ({ name }: any) => {
  return (
    <ChildC name={name} />
  )
}

export default ChildB

---------------------------------------------------------------------------
// ChildC:

const ChildC = ({ name }: any) => {
  return <div>I am {name}</div>; // I am My Child

};

export default ChildC;
```