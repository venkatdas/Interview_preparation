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



