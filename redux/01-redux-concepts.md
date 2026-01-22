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

----------

# Redux Toolkit - Complete Interview Guide

## Table of Contents
1. [useSelector & useDispatch](#useselector--usedispatch)
2. [How Immer Handles Immutability](#how-immer-handles-immutability)
3. [How Actions Are Auto-Generated](#how-actions-are-auto-generated)
4. [Complete Working Example with Console Logs](#complete-working-example)

---

## useSelector & useDispatch

### 1. useSelector - Reading State from Redux

**Purpose:** Get data FROM Redux store

**When to use:**
- When you need to READ/ACCESS Redux state in a component
- To display data from Redux store in UI

**Basic Syntax:**
```javascript
const data = useSelector((state) => state.sliceName.property);
```

#### Scenario 1: Get Simple Value
```javascript
// Redux state:
{
  counter: {
    value: 5
  }
}

// Component:
import { useSelector } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  
  return <h1>Count: {count}</h1>;  // Shows: Count: 5
}
```

#### Scenario 2: Get Array
```javascript
// Redux state:
{
  todos: {
    items: [
      { id: 1, text: 'Buy milk' },
      { id: 2, text: 'Learn Redux' }
    ]
  }
}

// Component:
function TodoList() {
  const todos = useSelector((state) => state.todos.items);
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

#### Scenario 3: Get Object
```javascript
// Redux state:
{
  user: {
    profile: {
      name: 'John',
      email: 'john@example.com',
      age: 25
    }
  }
}

// Component:
function UserProfile() {
  const profile = useSelector((state) => state.user.profile);
  
  return (
    <div>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Age: {profile.age}</p>
    </div>
  );
}
```

#### Scenario 4: Get Multiple Values
```javascript
// Redux state:
{
  todos: {
    items: [...],
    filter: 'all',
    loading: false
  }
}

// Component:
function TodoApp() {
  // Option 1: Multiple useSelector calls
  const todos = useSelector((state) => state.todos.items);
  const filter = useSelector((state) => state.todos.filter);
  const loading = useSelector((state) => state.todos.loading);
  
  // Option 2: Get everything at once
  const { items, filter, loading } = useSelector((state) => state.todos);
  
  return (
    <div>
      {loading ? <p>Loading...</p> : <TodoList todos={items} />}
      <p>Filter: {filter}</p>
    </div>
  );
}
```

#### Scenario 5: Get Computed/Filtered Data
```javascript
function ActiveTodos() {
  // Filter data inside selector
  const activeTodos = useSelector((state) => 
    state.todos.items.filter(todo => !todo.completed)
  );
  
  return (
    <ul>
      {activeTodos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

---

### 2. useDispatch - Sending Actions to Redux

**Purpose:** Send actions TO Redux store (to update state)

**When to use:**
- When you need to UPDATE/CHANGE Redux state
- To trigger state changes from components

**Basic Syntax:**
```javascript
const dispatch = useDispatch();
dispatch(actionCreator(payload));
```

#### Scenario 1: Action with NO Payload
```javascript
// Slice:
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;  // No payload needed
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

// Component:
import { useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';

function Counter() {
  const dispatch = useDispatch();
  
  return (
    <div>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}

// What happens:
// dispatch(increment()) sends: { type: 'counter/increment' }
// dispatch(decrement()) sends: { type: 'counter/decrement' }
```

#### Scenario 2: Action with SIMPLE Payload (string, number)
```javascript
// Slice:
const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [] },
  reducers: {
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,  // payload is a string
        completed: false
      });
    },
    removeTodo: (state, action) => {
      state.items = state.items.filter(
        todo => todo.id !== action.payload  // payload is a number
      );
    },
  },
});

export const { addTodo, removeTodo } = todoSlice.actions;

// Component:
import { useDispatch } from 'react-redux';
import { addTodo, removeTodo } from './todoSlice';

function TodoApp() {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  
  const handleAdd = () => {
    dispatch(addTodo(text));  
    // Sends: { type: 'todos/addTodo', payload: 'Buy milk' }
  };
  
  const handleRemove = (id) => {
    dispatch(removeTodo(id));
    // Sends: { type: 'todos/removeTodo', payload: 123 }
  };
  
  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      <button onClick={() => handleRemove(123)}>Delete</button>
    </div>
  );
}
```

#### Scenario 3: Action with OBJECT Payload
```javascript
// Slice:
const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null },
  reducers: {
    setUser: (state, action) => {
      state.profile = action.payload;  // payload is an object
    },
    updateUser: (state, action) => {
      state.profile.name = action.payload.name;
      state.profile.email = action.payload.email;
    },
  },
});

export const { setUser, updateUser } = userSlice.actions;

// Component:
import { useDispatch } from 'react-redux';
import { setUser, updateUser } from './userSlice';

function UserForm() {
  const dispatch = useDispatch();
  
  const handleLogin = () => {
    dispatch(setUser({
      id: 1,
      name: 'John',
      email: 'john@example.com',
      age: 25
    }));
    // Sends: { 
    //   type: 'user/setUser', 
    //   payload: { id: 1, name: 'John', email: '...', age: 25 }
    // }
  };
  
  const handleUpdate = () => {
    dispatch(updateUser({
      name: 'John Updated',
      email: 'newemail@example.com'
    }));
  };
  
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
}
```

#### Scenario 4: Action with MULTIPLE Parameters
```javascript
// Slice:
const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [] },
  reducers: {
    editTodo: (state, action) => {
      // payload: { id: number, text: string }
      const todo = state.items.find(t => t.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
      }
    },
  },
});

export const { editTodo } = todoSlice.actions;

// Component:
import { useDispatch } from 'react-redux';
import { editTodo } from './todoSlice';

function TodoItem({ todo }) {
  const dispatch = useDispatch();
  
  const handleEdit = (newText) => {
    dispatch(editTodo({
      id: todo.id,
      text: newText
    }));
    // Sends: { 
    //   type: 'todos/editTodo', 
    //   payload: { id: 123, text: 'Updated text' }
    // }
  };
  
  return (
    <button onClick={() => handleEdit('New text')}>Edit</button>
  );
}
```

---

### Quick Reference Table

| Hook | Purpose | Usage | Returns |
|------|---------|-------|---------|
| `useSelector` | **Read** state | `useSelector(state => state.slice.property)` | The selected data |
| `useDispatch` | **Update** state | `useDispatch()` | The dispatch function |

### Payload Patterns

| Action Type | Payload | Example |
|-------------|---------|---------|
| **No payload** | `undefined` | `dispatch(increment())` |
| **String** | `"text"` | `dispatch(addTodo("Buy milk"))` |
| **Number** | `123` | `dispatch(removeTodo(123))` |
| **Boolean** | `true/false` | `dispatch(setLoading(true))` |
| **Object** | `{...}` | `dispatch(setUser({ name: 'John' }))` |
| **Array** | `[...]` | `dispatch(setTodos([...]))` |

---

## How Immer Handles Immutability

### The Problem Without Immer

In traditional Redux, you must update state immutably:

```javascript
// ❌ WRONG - Direct mutation
function reducer(state, action) {
  state.count = state.count + 1;  // Mutates original state
  return state;  // Redux won't detect change!
}

// ✅ CORRECT - Immutable update
function reducer(state, action) {
  return {
    ...state,
    count: state.count + 1
  };
}

// ❌ PAINFUL - Nested updates
function reducer(state, action) {
  return {
    ...state,
    user: {
      ...state.user,
      profile: {
        ...state.user.profile,
        address: {
          ...state.user.profile.address,
          city: action.payload  // Finally update!
        }
      }
    }
  };
}
```

### How Immer Works

Immer uses **Proxy objects** to track changes:

```javascript
import produce from 'immer';

const currentState = {
  count: 5,
  user: {
    name: 'John',
    address: {
      city: 'New York'
    }
  }
};

// With Immer
const nextState = produce(currentState, draft => {
  // Write code that LOOKS like mutation
  draft.count += 1;
  draft.user.address.city = 'Boston';
  // Immer handles immutability!
});

console.log('Current State:', currentState);
// { count: 5, user: { name: 'John', address: { city: 'New York' } } }

console.log('Next State:', nextState);
// { count: 6, user: { name: 'John', address: { city: 'Boston' } } }

console.log('Current state unchanged?', currentState.count === 5);  // true
console.log('New state created?', currentState !== nextState);  // true
```

### Immer's Magic Process

```
Step 1: Create Draft (Proxy)
────────────────────────────
currentState → [Immer] → draft (proxy object)

Step 2: Track Mutations
────────────────────────────
draft.count += 1;
↓
Immer records: "count property changed from 5 to 6"

Step 3: Produce New State
────────────────────────────
Immer creates new object with only changed parts copied:
{
  count: 6,           ← NEW (copied and modified)
  user: {             ← SAME reference (unchanged)
    name: 'John',
    address: {...}
  }
}
```

### RTK Auto-Wraps Reducers with Immer

```javascript
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [] },
  reducers: {
    // What you write:
    addTodo: (state, action) => {
      state.items.push(action.payload);  // Looks like mutation!
    },
    
    // What RTK does behind the scenes:
    addTodo: (state, action) => {
      return produce(state, draft => {
        draft.items.push(action.payload);
      });
    }
  }
});
```

### Immer Performance - Structural Sharing

```javascript
const state = {
  todos: [/* 1000 items */],
  user: { name: 'John' },
  settings: { theme: 'dark' }
};

// Update only todos
const nextState = produce(state, draft => {
  draft.todos.push({ id: 1001, text: 'New todo' });
});

// Result:
// todos: NEW array (copied + modified)
// user: SAME reference (not copied)
// settings: SAME reference (not copied)

console.log(state.user === nextState.user);  // true ✅
console.log(state.settings === nextState.settings);  // true ✅
console.log(state.todos === nextState.todos);  // false (changed)
```

### Two Valid Patterns in RTK

#### Pattern 1: Mutating Draft (Recommended)
```javascript
reducers: {
  addTodo: (state, action) => {
    state.items.push(action.payload);
    // No return needed!
  }
}
```

#### Pattern 2: Returning New State
```javascript
reducers: {
  addTodo: (state, action) => {
    return {
      ...state,
      items: [...state.items, action.payload]
    };
  }
}
```

#### ⚠️ DON'T Mix Both!
```javascript
// ❌ WRONG
reducers: {
  addTodo: (state, action) => {
    state.items.push(action.payload);  // Mutation
    return state;  // Don't return after mutating!
  }
}
```

---

## How Actions Are Auto-Generated

### Traditional Redux (Manual)

```javascript
// Step 1: Define action type
const ADD_TODO = 'todos/addTodo';

// Step 2: Create action creator
function addTodo(text) {
  return {
    type: ADD_TODO,
    payload: text
  };
}

// Step 3: Use in component
dispatch(addTodo('Buy milk'));
// Creates: { type: 'todos/addTodo', payload: 'Buy milk' }
```

### Redux Toolkit (Auto-Generated)

```javascript
import { createSlice } from '@reduxjs/toolkit';

const todoSlice = createSlice({
  name: 'todos',  // ← Used as action type prefix
  initialState: { items: [] },
  reducers: {
    // You ONLY write the reducer function
    addTodo: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

// RTK AUTO-GENERATES the action creator!
export const { addTodo } = todoSlice.actions;

// Use it the same way:
dispatch(addTodo('Buy milk'));
// Creates: { type: 'todos/addTodo', payload: 'Buy milk' }
```

### What createSlice Returns

```javascript
const todoSlice = createSlice({
  name: 'todos',
  initialState: { items: [] },
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    },
    removeTodo: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    },
  },
});

console.log(todoSlice);
/*
{
  name: 'todos',
  reducer: [Function],        // The combined reducer
  actions: {                  // ✨ AUTO-GENERATED action creators
    addTodo: [Function],
    removeTodo: [Function]
  },
  caseReducers: {            // Individual reducer functions
    addTodo: [Function],
    removeTodo: [Function]
  }
}
*/
```

### How Action Types Are Generated

```javascript
// Format: 'name/reducerKey'

const slice = createSlice({
  name: 'todos',  // ← Prefix
  reducers: {
    addTodo: ...,      // → 'todos/addTodo'
    removeTodo: ...,   // → 'todos/removeTodo'
    toggleTodo: ...,   // → 'todos/toggleTodo'
  }
});

// Different slice, same reducer name - no conflict!
const userSlice = createSlice({
  name: 'user',  // ← Different prefix
  reducers: {
    update: ...,  // → 'user/update'
  }
});

const productSlice = createSlice({
  name: 'product',
  reducers: {
    update: ...,  // → 'product/update' ✅ No conflict!
  }
});
```

---

## Complete Working Example with Console Logs

Here's a complete example with console.log statements to see everything in action:

```javascript
// ============ todoSlice.js ============
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: []
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      console.log('🎯 REDUCER CALLED: addTodo');
      console.log('📥 Current state:', JSON.stringify(state));
      console.log('📦 Action received:', action);
      console.log('📦 Payload:', action.payload);
      
      const newTodo = {
        id: Date.now(),
        text: action.payload,
        completed: false
      };
      
      state.items.push(newTodo);
      
      console.log('📤 State after mutation:', JSON.stringify(state));
      console.log('───────────────────────────────');
    },
    
    removeTodo: (state, action) => {
      console.log('🎯 REDUCER CALLED: removeTodo');
      console.log('📥 Current state:', JSON.stringify(state));
      console.log('📦 Action:', action);
      console.log('📦 Payload (ID to remove):', action.payload);
      
      state.items = state.items.filter(todo => todo.id !== action.payload);
      
      console.log('📤 State after mutation:', JSON.stringify(state));
      console.log('───────────────────────────────');
    },
    
    toggleTodo: (state, action) => {
      console.log('🎯 REDUCER CALLED: toggleTodo');
      console.log('📦 Payload (ID to toggle):', action.payload);
      
      const todo = state.items.find(t => t.id === action.payload);
      if (todo) {
        console.log('📝 Before toggle:', todo);
        todo.completed = !todo.completed;
        console.log('📝 After toggle:', todo);
      }
      console.log('───────────────────────────────');
    }
  }
});

// Log the auto-generated actions
console.log('✨ AUTO-GENERATED ACTIONS:', Object.keys(todoSlice.actions));
// Output: ['addTodo', 'removeTodo', 'toggleTodo']

export const { addTodo, removeTodo, toggleTodo } = todoSlice.actions;
export default todoSlice.reducer;


// ============ Component ============
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, removeTodo, toggleTodo } from './todoSlice';

function TodoApp() {
  const [text, setText] = useState('');
  
  // Get dispatch function
  const dispatch = useDispatch();
  console.log('🔧 Dispatch function:', typeof dispatch);  // 'function'
  
  // Get todos from Redux state
  const todos = useSelector((state) => {
    console.log('🔍 useSelector called');
    console.log('🔍 Full Redux state:', state);
    console.log('🔍 Todos slice:', state.todos);
    return state.todos.items;
  });
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (text.trim()) {
      console.log('👆 User clicked Add button');
      console.log('💭 Input text:', text);
      
      // Create action by calling action creator
      const action = addTodo(text);
      console.log('🎬 Action created:', action);
      console.log('🎬 Action type:', action.type);
      console.log('🎬 Action payload:', action.payload);
      
      // Dispatch the action
      console.log('📤 Dispatching action...');
      dispatch(action);
      
      // Or in one line (same result):
      // dispatch(addTodo(text));
      
      setText('');
    }
  };
  
  const handleRemove = (id) => {
    console.log('👆 User clicked Remove for ID:', id);
    const action = removeTodo(id);
    console.log('🎬 Action created:', action);
    dispatch(action);
  };
  
  const handleToggle = (id) => {
    console.log('👆 User clicked Toggle for ID:', id);
    dispatch(toggleTodo(id));
  };
  
  console.log('🎨 Component rendering with todos:', todos);
  
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Redux Toolkit Todo with Logs</h1>
      
      <form onSubmit={handleAdd}>
        <input 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter todo..."
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button type="submit">Add Todo</button>
      </form>
      
      <ul style={{ marginTop: '20px' }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ marginBottom: '10px' }}>
            <span 
              onClick={() => handleToggle(todo.id)}
              style={{ 
                cursor: 'pointer',
                textDecoration: todo.completed ? 'line-through' : 'none',
                marginRight: '10px'
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleRemove(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
        <strong>Open Console (F12) to see logs!</strong>
      </div>
    </div>
  );
}

export default TodoApp;
```

### Console Output When You Add a Todo:

```
👆 User clicked Add button
💭 Input text: Buy milk
🎬 Action created: {type: 'todos/addTodo', payload: 'Buy milk'}
🎬 Action type: todos/addTodo
🎬 Action payload: Buy milk
📤 Dispatching action...
🎯 REDUCER CALLED: addTodo
📥 Current state: {"items":[]}
📦 Action received: {type: 'todos/addTodo', payload: 'Buy milk'}
📦 Payload: Buy milk
📤 State after mutation: {"items":[{"id":1674567890,"text":"Buy milk","completed":false}]}
───────────────────────────────
🔍 useSelector called
🔍 Full Redux state: {todos: {items: [{…}]}}
🔍 Todos slice: {items: Array(1)}
🎨 Component rendering with todos: [{id: 1674567890, text: 'Buy milk', completed: false}]
```

---

## Summary

### useSelector
- ✅ **Purpose:** READ state from Redux
- ✅ **Usage:** `const data = useSelector(state => state.slice.property)`
- ✅ **Same for all cases:** Just change the path

### useDispatch
- ✅ **Purpose:** UPDATE state in Redux
- ✅ **Usage:** `dispatch(actionCreator(payload))`
- ✅ **Works with or without payload**

### Immer
- ✅ **Purpose:** Handle immutability automatically
- ✅ **How:** Wraps state in Proxy, tracks changes, produces new state
- ✅ **Benefit:** Write mutating code that's actually immutable

### Auto-Generated Actions
- ✅ **Purpose:** Eliminate boilerplate
- ✅ **How:** `createSlice` generates action creators from reducers
- ✅ **Format:** `'sliceName/reducerKey'`

**Key Takeaway:** Redux Toolkit makes Redux 70% simpler while keeping the same core principles!
