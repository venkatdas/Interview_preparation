## useReducer

- syntax

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

```js
import React from "react";
import { useReducer } from "react";

const UseReducer = () => {
  const intialState = {
    count: 0,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "increment":
        return { count: state.count + 1 };
      case "decrement":
        return { count: state.count - 1 };

      default:
        throw new Error();
    }
  };
  const [state, dispatch] = useReducer(reducer, intialState);
  return (
    <div>
      <h1>count: {state.count}</h1>
      <button onClick={() => dispatch({ type: "increment" })}>increment</button>
      <button onClick={() => dispatch({ type: "decrement" })}>decrement</button>
    </div>
  );
};

export default UseReducer;


```

- UseReducer simple counter example
