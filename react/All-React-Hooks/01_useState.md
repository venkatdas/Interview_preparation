## useState


```js
import React from "react";

import { useState } from "react";

const AllHooks = () => {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>{count}</h1>

      <button onClick={increaseCount}>Increase </button>
    </div>
  );
};

export default AllHooks;
```

- From above code will get basic implemetation of useState.
- when you click on increment it will increment the count.


- **The value changes made through the useState hook in React do not change immediately. Instead, they are queued and processed asynchronously.**
- This is an important aspect of React's state management system, designed to optimize performance and ensure consistency across renders.



- When you update state using setState from useState, React schedules the update and then exits the current code block. The actual state update and the component's re-render happen later, not right after the setState call.
- This means you won't see the updated state immediately if you check right after calling setState.

- Example

```js
import React from "react";

import { useState } from "react";

const AllHooks = () => {
  const [count, setCount] = useState(0);
console.log("General count",count);
  const increaseCount = () => {
    setCount(count + 1);

    console.log("insidebutton count",count);
  };

  return (
    <div>
      <h1>{count}</h1>

      <button onClick={increaseCount}>Increase </button>
    </div>
  );
};

export default AllHooks;
```


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/7c571993-2e43-4090-a65d-8e53ddb253c7)

- **Even after the clicking the increment button insidebutton count stil 0, and general count is 1**

_________________________

- How do we get using setState only

- **If you want to immediately see the incremented value after setting state in React using useState, you can't achieve this directly in the function where you update the state because of how React schedules state updates asynchronously. However, there is a common workaround using an additional local variable to compute the value you expect the state to have, and then using that for logging or other immediate needs within the same execution context.**

```js
 const increaseCount = () => {

    const newCount = count+1; // Calculate the new count
    setCount(newCount); //// Update the state

    console.log("insidebutton count",newCount); // Log the new count immediately
  };
```

- Compute Before Setting State: In the handleIncrement function, we first calculate the new value for count and store it in a local variable newCount. This allows us to use the incremented value immediately within the same function—e.g., for logging or further calculations.

- Use the Local Variable: After computing the newCount, we then set the state with setCount(newCount) and use the newCount variable for immediate needs, such as logging.


___________________

**Understanding Batching and State Updates**
