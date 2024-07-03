## useCallback

- useCallback is a React Hook that returns a memoized callback function.
- This means the function reference is preserved across renders unless one of its dependencies changes. Here's how it works in our context:

**With useCallback**

```js

//Parent component Counter.jsx
import React, { useState, useCallback } from 'react';
import Increment from './Increment';
import Decrement from './Decrement';

const Counter = () => {
  const [count, setCount] = useState(0);

  // Memoize the increment function
  const increment = useCallback(() => {
    console.log('Increment function called');
    setCount(prevCount => prevCount + 1);
  }, []);

  // Memoize the decrement function
  const decrement = useCallback(() => {
    console.log('Decrement function called');
    setCount(prevCount => prevCount - 1);
  }, []);

  console.log('Counter component rendered');

  return (
    <div>
      <h1>Counter: {count}</h1>
      <Increment increment={increment} />
      <Decrement decrement={decrement} />
    </div>
  );
};

export default Counter;
```


**Child Components (Increment.js and Decrement.js)**

```js

import React from 'react';

const Increment = React.memo(({ increment }) => {
  console.log('Increment component rendered');
  return (
    <button onClick={increment}>Increment</button>
  );
});

export default Increment;


import React from 'react';

const Decrement = React.memo(({ decrement }) => {
  console.log('Decrement component rendered');
  return (
    <button onClick={decrement}>Decrement</button>
  );
});

export default Decrement;
```

**Expected logs with intial render**

```js
Counter component rendered
Increment component rendered
Decrement component rendered
```

**Clicking the Increment button:**

```js
Increment function called
Counter component rendered
```

**Clicking the Decrement button**

```js
Decrement function called
Counter component rendered
```

- **Intialization**

- When the Counter component first renders, useCallback creates and returns the increment and decrement functions.
- These functions are created and stored in a way that their references remain the same across renders, unless their dependencies change.
- In this case, there are no dependencies (empty array []), so the functions will never be recreated.

**Nexr Render**

- On subsequent renders, useCallback returns the same function instances (the same references) that were created during the initial render.
- This stability in references ensures that the child components (Increment and Decrement) receive the same function instances as props and do not re-render unnecessarily.




- **Without useCallback:**

1. Functions (increment and decrement) are recreated on every render.
2. Child components (Increment and Decrement) re-render because they receive new function instances as props.

- **With useCallback:**

1. Functions are memoized and stable across renders.
2. Child components do not re-render unnecessarily because they receive the same function instances as props.

- useCallback: Memoizes the functions to provide stable references across renders.
- React.memo: Prevents child components from re-rendering if their props haven't changed.

