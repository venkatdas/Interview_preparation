## Top interview questions based on react memoization and which scenarios we can use them


## 1. **React.Memo**


- "React.memo is a higher order component (HOC) in React for memoizing functional components. It serves to optimize performance by preventing unnecessary re-renders of components when their props do not change."

- React.Memo is a Higher Order Component in React which gives a memoized version of the Component. React will then not re-render the memoized component unless its props have changed, even if its parent is being re-rendered.

**How it Works**

- "React.memo wraps a functional component. When a component is wrapped in React.memo, React renders the component and memorizes the result. 
- Before the next render, if the new props are the same as the previous props, React reuses the memorized result, skipping the next rendering. 
- This comparison is shallow, meaning that it only checks one level deep. If you use complex objects as props, you should ensure they are the same object, or use a custom comparison function if deeper comparison is needed."

**Syntax**

`const MemoizedComponent = memo(SomeComponent, arePropsEqual?);`

- Pure components are the components which render the same output for the same state and props. In function components, you can achieve these pure components through memoized React.memo() API wrapping around the component. This API prevents unnecessary re-renders by comparing the previous props and new props using shallow comparison. So it will be helpful for performance optimizations.
- But at the same time, it won't compare the previous state with the current state because function component itself prevents the unnecessary rendering by default when you set the same state again.


**Example**

- Below is the example of how child component(i.e., ReactMemo) prevents re-renders for the same props passed by parent component(i.e.,App).

```js
//Child Component to prevent re-renders for same props using react.memo

import React from 'react'
import { memo } from 'react'
const ReactMemo = memo(function ReactMemo ({name,email}) {
   console.log("Rendering CountDisplay, name:", name);

  return (
    <div>
      <h1>react.memo</h1>
      <p>Name:{name}</p>
      <p>Email: {email}</p>
    </div>
  );
});

export default ReactMemo
```


```js
import React from "react";
import ReactMemo from "./components/ReactMemo";
import "./App.css";
import { useState } from "react";
function App() {
  const [name,setName]= useState("");
  const [email,setEmail]= useState('');
  return (
    <div>
      <h1>App Component</h1>
      <label>
        Name: <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <br />
      <br />
      <label>
        Email:{" "}
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <ReactMemo name={name} />
    </div>
  );
}

export default App;
```



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6bad56db-5185-485e-870c-607b3e7e7c49)


**Custom comparision second argument(arePropsEqual)**


```js
(prevProps, nextProps) => {
  return prevProps.name === nextProps.name && prevProps.email === nextProps.email;
}

            //OR

 const isNameSame = prevProps.name === nextProps.name;
  const isEmailSame = prevProps.email === nextProps.email;

  console.log(`Name same: ${isNameSame}, Email same: ${isEmailSame}`);

  return isNameSame && isEmailSame;
```

- Custom Comparison Function: If you need more control over the re-rendering process, you can provide a custom comparison function as the second argument to React.memo. This function takes the previous and next props as arguments and returns true if the props are equal (to prevent a re-render) or false if they are not equal (to allow a re-render).


__________________

```js
import React from "react";
import ReactMemo from "./components/ReactMemo";
import "./App.css";
import { useState } from "react";
function App() {
  const [name,setName]= useState("");
  const [email,setEmail]= useState('');
   const [counter, setCounter] = useState(0); 
  return (
    <div>
      <h1>App Component</h1>
      <label>
        Name: <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br />
      <br />
      <br />
      <label>
        Email:{" "}
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <ReactMemo name={name} />
      <h2>Counter:{counter}</h2>
      <button  onClick={()=>setCounter(counter+1)}>Increment</button>
    </div>
  );
}

export default App;
```

```js
import React from "react";
import { memo } from "react";
const ReactMemo = memo(
  function ReactMemo({ name, email }) {
    console.log("Rendering Display , name:", name);

    return (
      <div>
        <h1>react.memo</h1>
        <p>Name:{name}</p>
        <p>Email: {email}</p>
      </div>
    );
  }
);

export default ReactMemo;
```

- From this code we can observe that, Click the "Increment Counter" button without changing name or email. Since ReactMemo does not depend on counter, there should be no console log from ReactMemo if everything is working correctly. This confirms that React.memo is preventing re-renders effectively when the props it cares about (name and email) do not change.


## 2. useCallback 

