- While useDispatch is used to change the state, useSelector is used to read the state.

- Dispatching an Action: When the user clicks a button, the component uses useDispatch to send an action to the Redux store.
- State Update: The Redux store processes the action using a reducer, updating the state.
- Selecting State: Another component (or the same one) uses useSelector to read the updated state and reflect it in the UI.

## redux

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/db78ec7b-2aef-40a4-97ce-23b51939b37b)

- Redux is a popular library for managing state in JavaScript applications, particularly useful with React, though it can be used with other frameworks too.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/7885fbe1-ea7f-4beb-92b7-dde14b66e44b)

**Core Concepts of Redux**

- Explanation: The initial state is the starting point of your application's state. It's a plain JavaScript object that holds the default values for your application's state.

1. **Actions**

- Actions are JavaScript objects that describe what happened in the application. They must have a type property that indicates the type of action being performed. They can also have additional data fields, called the payload.
- In other words action test the reducer, what to do and how to manipulate the state.

- **Example Action: { type: 'ADD_TODO', text: 'Learn Redux' }**

2. **Reducers**

- Reducers are resposible for directly changing the state of aotr app, its basically a function that takes action and current state as arguments and returns new state reuslts.
- Reducers are pure functions that take the current state of the application and an action, and return a new state. They describe how the state changes in response to actions.
- Reducers must be pure functions—functions that return the exact same output for given inputs. They should not have side effects like API calls or routing transitions.
- Example Reducer: A reducer that handles the above action by adding a new todo to the state.

3.  **Store**

- The store is the object that brings actions and reducers together. The store holds the application state and provides a few helper methods to access the state, dispatch actions, and register listeners.
- The entire state of a Redux application is stored in a single store.

**How the flow works**

- Application(UI)->Actions->Reducers->Store-> Application(useSelector)

## What are the core principles of Redux?

- Redux is a predictable state container for JavaScript apps, commonly used with React but compatible with other frameworks as well. It helps manage the state of applications in a predictable way by following three core principles:

1. **Single source of truth**: The state of your whole application is stored in an object tree within a single store. Moreover, having a single state tree makes it easier to debug or inspect an application at any point in time.
2. **State is Read-Only**: The only way to change the state is to emit(dispatch) an action, an object describing what happened.
3. **Changes are Made with Pure Functions**: o specify how the state tree is transformed by actions, you write pure reducers. Reducers are just pure functions that take the previous state and an action, and return the next state. They are called "reducers".

## 3) Key features of Redux Toolkit

- **configureStore():** Simplifies the setup of the store with good defaults, which automatically sets up the Redux DevTools extension and redux-thunk middleware.
- **createSlice():** Simplifies creating reducers and generating action creators and action types simultaneously. It allows you to define a slice of the Redux state along with the reducers and actions.
- **createAsyncThunk:** A function that helps to handle asynchronous logic in a Redux-friendly way. It abstracts the usual task of dispatching actions and handling loading, success, and error states.
- **createSelector**: Redux Toolkit re-exports createSelector from the Reselect library, which you can use to write memoized selectors that can compute derived data, allowing Redux to store the minimal possible state.
- **createEntityAdapter:** Provides prebuilt reducers and selectors for performing CRUD operations on normalized state that is stored as collections of entities.
- **RTK Query:** An advanced tool built into Redux Toolkit that provides a powerful data fetching and caching capability. It is intended to simplify managing remote data in your Redux store.

## 4) Simple example of redux toolkit works

- **Setting up the store with configureStore:**

```js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice"; // createSlice and then imported here.

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
```

- **Creating a slice with createSlice:**

```js
import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
  name: "counter",
  initialState: {
    value: 0,
  },
  reducers: {
    incremented: (state) => {
      state.value += 1;
    },
    decremented: (state) => {
      state.value -= 1;
    },
  },
});

export const { incremented, decremented } = counterSlice.actions;
export default counterSlice.reducer;
```

- **Using the slice in a React component:**

```js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { incremented, decremented } from "./counterSlice";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(decremented())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(incremented())}>+</button>
    </div>
  );
}

export default Counter;
```

## 5. What is the difference between a store and a state in Redux? with example

- The store is an object that holds the application state
- The store in Redux is an object that brings together the state, reducers, and actions of your application. It has several key responsibilities:

- Holding the application state: The store is the central place where all the application's state is stored.
- Allowing access to the state: The store provides methods to access the state, such as getState().
- Allowing state to be updated: The store dispatches actions to the reducer functions which handle how the state should be updated based on those actions.

- Example of creating store (Redux)

```js
import { createStore } from "redux";

function rootReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(rootReducer);
```

**State**

- The state in Redux refers to the application data at a given point in time. This is what your application displays and manipulates. The state in a Redux application is typically structured as a single, immutable object tree.
- Immutable: The state in Redux should never be modified directly. Instead, changes are made via functions called reducers that take the previous state and an action, and return a new state.
- Single Source of Truth: The entire state of the application is stored in one place, the store, which makes it easier to debug or inspect an application.

**Example of Accessing and Updating State**

```js
console.log(store.getState()); // { count: 0 }

store.dispatch({ type: "INCREMENT" });
console.log(store.getState()); // { count: 1 }

store.dispatch({ type: "DECREMENT" });
console.log(store.getState()); // { count: 0 }
```

## 6. what is the middleware in redux

- In Redux, middleware is a powerful feature that provides a way to interact with the dispatch process of actions before they reach the reducer.

**Purpose of Middleware**

- Logging: Tracking what actions are being dispatched and what changes are occurring in the state.
- Crash Reporting: Sending crash reports or error logs to a server.
- Asynchronous Handling: Dealing with asynchronous actions in Redux, for instance by dispatching other actions based on asynchronous requests (like API calls).
- Transforming Actions: Modifying actions or cancelling them before they reach the reducer.

**How Middleware Works**

- Middleware in Redux is a sequence of nested functions that wrap the store’s dispatch function. Redux middleware are functions that conform to a very specific signature and use currying. The middleware signature looks like this: (store) => (next) => (action) => {}.

**Popular redux middleware**

- Redux Thunk: Allows you to write action creators that return a function instead of an action. This is useful for handling side effects such as asynchronous operations.
- Redux Saga: A library that aims to make side effects (i.e., asynchronous things like data fetching and impure things like accessing the browser cache) in Redux applications easier and better.

**Example of Creating Middleware**

```js
const loggerMiddleware = (store) => (next) => (action) => {
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};
```

**Applying Middleware to Redux Store**

- Redux provides applyMiddleware() function, which can be used with createStore() to apply the middleware to the store. Here’s how you might apply the above loggerMiddleware to a Redux store:

```js
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(loggerMiddleware));
```

## 7. Fetch data in redux toolkit using **createAsyncThunk**

1.

```js
npm install @reduxjs/toolkit react-redux
```

**Store setup**

```js
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import modalReducer from "./features/modal/modalSlice";
import productsReducer from "./features/products/productSlice";
const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer,
    products: productsReducer,
  },
});

export default store;
```

**Provide the Redux Store to Your Application**

```js
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

**Create an Async Thunk for Data Fetching**

```js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchproducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch(
      "https://www.course-api.com/react-useReducer-cart-project"
    );
    const data = await response.json();
    console.log("data", data);
    return data;
  }
);
export const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    status: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchproducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchproducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(fetchproducts.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});
export default productSlice.reducer;
```

**Dispatch the Thunk from a Component**

```js
import { fetchproducts } from "../features/products/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => {
    return state.products.items;
  });
  const status = useSelector((state) => state.products.status);

  useEffect(() => {
    dispatch(fetchproducts());
  }, [dispatch]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error fetching products.</p>;

  return (
    <div>
      <ul>
        {products.map((item) => (
          <li key={item.id}>
            {item.title} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5d1896f6-457d-4c81-a3e7-33f449d8dda2)

## 8. How do u setup the redux toolkit

https://chat.openai.com/share/adaf0a56-fcd9-491c-812f-2cb2f57597bb

---

src/
├── app/
│ └── store.js // Redux store setup
├── features/
│ └── counterSlice.js // Feature slice
├── App.js // Main React component
└── index.js // Entry point

-features/counterSlice.js

```js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

app/store.js

```js
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counterSlice";

export const store = configureStore({
  reducer: { counter: counterReducer },
});
```

- App.js

```js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  incrementByAmount,
} from "./features/counterSlice";

function App() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>
        Increment by 5
      </button>
    </div>
  );
}

export default App;
```

-index.js

```js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux"; // Provides the Redux store to the React app
import { store } from "./app/store"; // Import the configured store
import App from "./App"; // Main App component

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") // Attach to the root element in your HTML
);
```

Step 1: Clicking the "Increment" button triggers dispatch(increment()).
Step 2: The action is sent to the store.
Step 3: The store forwards the action to the reducer in the counterSlice.
Step 4: The reducer updates the state by incrementing the value.
Step 5: The store holds the new state, replacing the old one.
Step 6: The useSelector hook extracts the updated value from the state.
Step 7: React re-renders the UI to display the updated value.

---

## 9.What Happens to Redux State on Page Reload

- When a page reloads, the state in Redux (or Redux Toolkit) is reset to its initial state unless explicitly persisted. Here’s what happens and how you can handle it:

- Default Behavior:

- The Redux store exists only in memory.
- When the page reloads, the store and its state are lost because the browser reloads the application from scratch.
- The Redux store reinitializes, and the state resets to the initial values defined in your reducers or slices.

```js
const initialState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});
```

- After a reload, state.value will reset to 0, as defined in initialState.

**How to Persist State Across Reloads**

- . Use Local Storage or Session Storage
- Save the Redux state to local storage or session storage before the page unloads and restore it on initialization.

```js
// Save state to localStorage
store.subscribe(() => {
  localStorage.setItem("reduxState", JSON.stringify(store.getState()));
});

// Restore state from localStorage
const persistedState = localStorage.getItem("reduxState")
  ? JSON.parse(localStorage.getItem("reduxState"))
  : undefined;

const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});
```

- Use Redux-Persist
- Use Backend Persistence

- When Should You Persist State?

  - Persist state for:

- User authentication tokens or user preferences.
- Data that doesn't change often and is user-specific (e.g., theme settings).

## 10.Redux components, Middleware and principles

## 11. Context API VS Redux

### Context API vs Redux: Key Differences

| **Feature**                     | **Context API**                                                                                                           | **Redux**                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Purpose**                     | Built-in for passing data through the component tree without props drilling. Ideal for simple to medium state management. | Standalone library for predictable and centralized state management. Best for complex state handling.    |
| **Learning Curve**              | Easy to learn, no additional setup required.                                                                              | Steeper learning curve due to actions, reducers, and middleware.                                         |
| **Performance**                 | May cause re-renders for all consuming components if not optimized. Suitable for less frequent updates.                   | Optimized for performance using `connect` and selectors. Suitable for frequent or complex updates.       |
| **Scalability**                 | Works well for small to medium apps but harder to manage with multiple contexts in large apps.                            | Designed for large-scale applications with centralized store and middleware.                             |
| **Debugging Tools**             | Limited debugging; manual inspection of React components is needed.                                                       | Excellent tools like Redux DevTools for state tracking and time-travel debugging.                        |
| **Middleware and Side Effects** | No built-in support for side effects; requires custom solutions or libraries like `useReducer` or `useEffect`.            | Built-in middleware support with libraries like `redux-thunk` or `redux-saga` for handling side effects. |
| **Setup**                       | Minimal setup: create context, provider, and consumer.                                                                    | Requires boilerplate: actions, reducers, and store setup.                                                |
| **When to Use**                 | Lightweight state sharing for simple scenarios like themes, authentication, or localized state.                           | Large-scale apps with complex logic, advanced debugging needs, and frequent state interactions.          |

## 12 How to setup a redux store in React

## 13 ReduxToolKit Query vs ReactQuery

## 14 Middewares that you have worked on

## 15 Redux Middleware and Redux Toolkit
