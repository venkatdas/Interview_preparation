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

```js
import React from "react";

import { useState } from "react";

const AllHooks = () => {
  const [count, setCount] = useState(0);
  console.log("General count", count);
  const increaseCount = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);

    console.log("insidebutton count", count);
  };
  const resetCount = () => {
    setCount(0);
  };

  return (
    <div>
      <h1>{count}</h1>

      <button onClick={increaseCount}>Increment 3 Times </button>
      <button onClick={resetCount}>Reset</button>
    </div>
  );
};

export default AllHooks;
```

- The above code still gives the same values
- **React does not apply each state update independently and immediately in the function incrementMultipleTimes. Instead, it batches the three updates together. Since each update is based on the same original value of count, which is 0, all three calls to setCount attempt to set the count to 1. Hence, the count only increments by 1 instead of 3.**

______________________________________________________


- Batching Behavior: React batches state updates that occur in event handlers like increaseCount. This means all the setCount calls are processed in a single batch and the component re-renders only once per click of the button.

- Closure Over State Value: Each call to setCount inside increaseCount is based on the same original state value of count. Since count was initially 0, each setCount(count + 1) effectively attempts to set the state to 1, regardless of how many times it's called.

- Resulting State Update: Since all these updates are batched together and they all compute the new state based on the same initial state, the final result after clicking the button is that count is increased only by 1 instead of 3.

**Illustration of Execution**


- setCount(count + 1) is called three times in a row.
- Each call calculates the new state value as 0 + 1 (assuming count starts at 0).
- React batches these updates, so despite three calls, only the last call's effect is applied, setting count to 1.
- The count state is updated only once per click, increasing by 1 instead of 3.

## Correct Approach to Increment by 3


```js

const increaseCount = () => {
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
};

```
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/79e44989-48b7-44b1-b69d-40949b399414)


- If you intend to increase count by 3 with each button click, you should use the functional update form of the setCount method, which ensures that each update is based on the most recent
- The first call updates count from 0 to 1.
- The second call sees the updated count from the first call (1) and increases it to 2.
- The third call then takes the result from the second (2) and increments it to 3.
