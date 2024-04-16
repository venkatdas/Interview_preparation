## redux

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/db78ec7b-2aef-40a4-97ce-23b51939b37b)

- Redux is a popular library for managing state in JavaScript applications, particularly useful with React, though it can be used with other frameworks too.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/7885fbe1-ea7f-4beb-92b7-dde14b66e44b)

**Core Concepts of Redux**

1) **Actions**

- Actions are JavaScript objects that describe what happened in the application. They must have a type property that indicates the type of action being performed. They can also have additional data fields, called the payload.
- In other words action test the reducer, what to do and how to manipulate the state.

- **Example Action: { type: 'ADD_TODO', text: 'Learn Redux' }**

2) **Reducers**
- Reducers are resposible for directly changing the state of aotr app, its basically a function that takes action and current state as arguments and returns new state reuslts.
- Reducers are pure functions that take the current state of the application and an action, and return a new state. They describe how the state changes in response to actions.
- Reducers must be pure functions—functions that return the exact same output for given inputs. They should not have side effects like API calls or routing transitions.
- Example Reducer: A reducer that handles the above action by adding a new todo to the state.


 3) **Store**

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
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice'; // createSlice and then imported here.

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});
```
- **Creating a slice with createSlice:**

```js
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    incremented: state => {
      state.value += 1;
    },
    decremented: state => {
      state.value -= 1;
    }
  }
});

export const { incremented, decremented } = counterSlice.actions;
export default counterSlice.reducer;
```

- **Using the slice in a React component:**

```js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { incremented, decremented } from './counterSlice';

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
import { createStore } from 'redux';

function rootReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
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

***Example of Accessing and Updating State

```js
console.log(store.getState()); // { count: 0 }

store.dispatch({ type: 'INCREMENT' });
console.log(store.getState()); // { count: 1 }

store.dispatch({ type: 'DECREMENT' });
console.log(store.getState()); // { count: 0 }

```
