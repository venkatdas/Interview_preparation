## useRef

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/ba83e9b4-bd45-4252-91d5-50eeb674be9f)

- useRef is a React Hook that lets you reference a value that’s not needed for rendering.
- useRef is a hook in React that allows you to persist values between renders without causing additional renders when the value is updated.

```js
const refContainer = useRef(initialValue);
```
- useRef returns a ref object with a single current property initially set to the initial value you provided.

**Common Uses**
- Accessing DOM Elements
- Storing Mutable Values:


- **By using a ref, you ensure that:**

- You can store information between re-renders (unlike regular variables, which reset on every render).
- Changing it does not trigger a re-render (unlike state variables, which trigger a re-render).
- The information is local to each copy of your component (unlike the variables outside, which are shared).


```js

import React, { useEffect } from "react";
import { useRef } from "react";

const UseRef = () => {
  const data = useRef(null);

  const formSubmit =(e)=>{
    e.preventDefault();
    console.log(data.current.value);
    
  }

  useEffect(()=>{
    data.current.focus()
  },[])
  return (
    <form onSubmit={formSubmit}>
      <center>
        <h1>UseRef</h1>
        <input ref={data} type="text" placeholder="Enter a name" />
        <br />
        <input type="submit" />
      </center>
    </form>
  );
};

export default UseRef;

```

- from above code 

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/e907dccf-fd1d-4aa8-99dd-623d74ae54f3)

- It does not cause re render
- from current object we will get values whatever we want
