## useReducer


- The useReducer hook in React is a powerful alternative to useState for managing complex state logic in functional components.
- It's especially useful when the next state depends on the previous one or when the state logic is complex.




**MORE**

- React Hook that is used for managing more complex state logic in functional components.
- It is an alternative to the useState Hook when the state logic becomes more involved and involves multiple actions.
- The useReducer function takes two arguments: a reducer function and an initial state.
- The reducer function is responsible for updating the state based on the type of action dispatched. It receives the current state and an action object, and it returns the new state.

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
