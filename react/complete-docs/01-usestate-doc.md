# Complete Guide to useState Hook

## What is useState?

`useState` is a React Hook that lets you add a state variable to your component. State variables remember information between renders.

## Basic Syntax

```javascript
const [state, setState] = useState(initialState)
```

---

## Reference

### useState(initialState)

Call `useState` at the top level of your component to declare a state variable.

```javascript
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
}
```

**Naming Convention:** Use `[something, setSomething]` pattern with array destructuring.

#### Parameters

- **initialState**: The starting value for your state
  - Can be any type (number, string, object, array, etc.)
  - Special behavior: If you pass a function, React treats it as an initializer function
  - The initializer function should be pure, take no arguments, and return a value
  - This parameter is ignored after the first render

#### Returns

An array with exactly two values:

1. **Current state**: On first render, it matches the `initialState` you provided
2. **Set function**: Updates the state and triggers a re-render

#### Important Rules (Caveats)

- **Hook rules**: Only call `useState` at the top level of your component or custom Hooks
- **No loops or conditions**: You can't call it inside loops or if statements
- **Strict Mode**: React calls your initializer function twice in development to check for impurities (development only, doesn't affect production)

---

### Set Functions (setSomething)

The set function returned by `useState` updates the state and triggers a re-render.

```javascript
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');           // Direct value
  setAge(a => a + 1);          // Updater function
}
```

#### Parameters

- **nextState**: The new value you want the state to be
  - Can be any type
  - Special behavior: If you pass a function, it's treated as an updater function
  - Updater function must be pure, takes the current state as argument, returns next state

#### Returns

Nothing (no return value)

#### Important Rules (Caveats)

1. **Doesn't update immediately**: The set function only updates state for the NEXT render. Reading state after calling set still gives you the old value.

2. **Optimization**: React skips re-rendering if the new value equals the current state (uses `Object.is` comparison)

3. **Batching**: React batches state updates. The screen updates after all event handlers run and call their set functions. This prevents multiple re-renders in a single event.

4. **Stable identity**: The set function's identity never changes, so it's often safe to omit from Effect dependencies

5. **Rendering updates**: Calling set function during rendering is only allowed within the currently rendering component. React discards output and re-renders with new state immediately.

6. **Strict Mode**: React calls your updater function twice in development to find impurities (development only)

---

## Usage Guide

### 1. Adding State to a Component

Call `useState` at the top level to declare state variables.

```javascript
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  
  return (
    <button onClick={() => setName('Robin')}>
      Change name
    </button>
  );
}
```

**What happens:**
1. React stores the next state
2. Renders your component again with new values
3. Updates the UI

**Important:** Calling the set function doesn't change the current state in already executing code!

```javascript
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

It only affects what `useState` returns starting from the NEXT render.

#### Basic Examples

**Example 1: Counter (number)**
```javascript
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

**Example 2: Text field (string)**
```javascript
const [text, setText] = useState('hello');

<input 
  value={text}
  onChange={e => setText(e.target.value)}
/>
```

**Example 3: Checkbox (boolean)**
```javascript
const [liked, setLiked] = useState(true);

<input
  type="checkbox"
  checked={liked}
  onChange={e => setLiked(e.target.checked)}
/>
```

**Example 4: Form (two variables)**
```javascript
const [name, setName] = useState('Taylor');
const [age, setAge] = useState(42);
```

---

### 2. Updating State Based on Previous State

**The Problem:**

```javascript
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

After one click, age is only 43, not 45! This is because calling set function doesn't update the state variable in the running code. Each call becomes `setAge(43)`.

**The Solution: Use an Updater Function**

```javascript
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Here, `a => a + 1` is your updater function. It takes the pending state and calculates the next state.

**How it works:**
1. React puts your updater functions in a queue
2. During the next render, it calls them in order:
   - `a => a + 1` receives 42, returns 43
   - `a => a + 1` receives 43, returns 44
   - `a => a + 1` receives 44, returns 45
3. React stores 45 as the current state

**Naming convention:** Name the pending state argument with the first letter of the state variable (like `a` for `age`) or `prevAge`.

#### When to Use Updater Functions

**Use updater when:**
- You need to update state multiple times based on the previous value
- The next state depends on the previous state

**Comparison:**

**Passing updater function (CORRECT for multiple updates):**
```javascript
function increment() {
  setAge(a => a + 1);
}

// This button adds 3
<button onClick={() => {
  increment();
  increment();
  increment();
}}>+3</button>
```

**Passing next state directly (adds only 1, not 3):**
```javascript
function increment() {
  setAge(age + 1);
}

<button onClick={() => {
  increment();
  increment();
  increment();
}}>+3</button> // Still only adds 1!
```

---

### 3. Updating Objects and Arrays in State

State is **read-only**. You should **replace** it, not mutate it.

**Wrong - Don't mutate:**
```javascript
// 🚩 Don't do this:
form.firstName = 'Taylor';
```

**Correct - Replace with new object:**
```javascript
// ✅ Do this:
setForm({
  ...form,
  firstName: 'Taylor'
});
```

#### Example 1: Form (object)

```javascript
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
    </>
  );
}
```

The `{ ...form }` spread syntax ensures the state object is **replaced**, not mutated.

#### Example 2: Form (nested object)

For nested objects, you need to copy from the point where you want to update:

```javascript
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
  }
});

// Update nested property
setPerson({
  ...person,
  artwork: {
    ...person.artwork,
    city: 'New Delhi'
  }
});
```

#### Example 3: List (array)

```javascript
const [todos, setTodos] = useState([]);

// Add item
setTodos([...todos, newTodo]);

// Remove item
setTodos(todos.filter(todo => todo.id !== idToRemove));

// Replace item
setTodos(todos.map(todo => 
  todo.id === idToUpdate ? { ...todo, done: true } : todo
));
```

---

### 4. Avoiding Recreating the Initial State

**The Problem:**

```javascript
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // createInitialTodos() runs on EVERY render! 😱
}
```

Although `createInitialTodos()` result is only used for the initial render, you're still calling this function on every render. This wastes performance if it creates large arrays or does expensive calculations.

**The Solution: Pass an Initializer Function**

```javascript
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // createInitialTodos only runs once! 🎉
}
```

**Key difference:**
- `createInitialTodos()` - Calls the function (runs every render)
- `createInitialTodos` - Passes the function itself (runs only once)

#### Comparison

**Passing initializer function (CORRECT):**
```javascript
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');
  
  // Function only runs during initialization
}
```

**Passing initial state directly (WASTEFUL):**
```javascript
export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // Function runs on every render!
}
```

---

### 5. Resetting State with a Key

You can reset a component's state by passing a different `key` to it.

```javascript
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

**How it works:**
- When `key` changes, React re-creates the `Form` component (and all its children) from scratch
- This resets all state in `Form`

---

### 6. Storing Information from Previous Renders

Usually, you update state in event handlers. But in rare cases, you might need to adjust state in response to rendering (for example, when a prop changes).

**When you DON'T need this:**
- If the value can be computed from current props or state, remove redundant state (use `useMemo` if worried about recomputing)
- If you want to reset entire component tree's state, pass a different `key`
- If you can, update all relevant state in event handlers

**Example: Tracking if count increased or decreased**

```javascript
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

**Important rules for setting state during render:**
1. Must be inside a condition (like `prevCount !== count`)
2. Must have a call like `setPrevCount(count)` inside the condition
3. Otherwise, component re-renders in a loop until it crashes
4. Can only update state of currently rendering component
5. Should still update state without mutation

**Why this pattern is rarely needed:**
- Hard to understand
- Usually better alternatives exist
- But it's better than updating state in an effect

**How it works:**
- When you call set function during render, React re-renders that component immediately after it exits with a return statement
- Children don't need to render twice
- If your condition is below all Hook calls, you may add an early `return;` to restart rendering earlier

---

## Troubleshooting

### Problem 1: State Updated But Logging Shows Old Value

**Issue:**
```javascript
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

**Why:** State behaves like a snapshot. Updating state requests another render with the new state value, but doesn't affect the state variable in your already-running event handler.

**Solution:** Save the next state in a variable:
```javascript
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### Problem 2: State Updated But Screen Doesn't Update

**Issue:** React ignores your update if next state equals previous state (uses `Object.is` comparison).

**Common cause - Mutating object/array:**
```javascript
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

**Solution - Replace instead of mutate:**
```javascript
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### Problem 3: "Too many re-renders" Error

**Error message:** "Too many re-renders. React limits the number of renders to prevent an infinite loop."

**Common cause - Calling handler during render:**
```javascript
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

**How to debug:** Click the arrow next to the error in the console and look through the JavaScript stack to find the specific set function call responsible.

---

### Problem 4: Initializer or Updater Function Runs Twice

**Observation:**
```javascript
function TodoList() {
  // This component function runs twice for every render

  const [todos, setTodos] = useState(() => {
    // This initializer function runs twice during initialization
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function runs twice for every click
      return [...prevTodos, createTodo()];
    });
  }
}
```

**Why:** In Strict Mode, React calls some functions twice to help you find accidental impurities. This is **development-only** behavior and doesn't affect production.

**This is expected and shouldn't break your code.**

**Purpose:** Helps you keep components pure. React uses the result of one call and ignores the other.

**Example of catching a mistake:**

**Wrong (impure updater):**
```javascript
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
// You'll see todo added twice - helps you spot the bug!
```

**Correct (pure updater):**
```javascript
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
// Calling it twice doesn't change behavior
```

**What needs to be pure:**
- Component functions
- Initializer functions
- Updater functions

**What doesn't need to be pure:**
- Event handlers (React never calls them twice)

---

### Problem 5: Trying to Store a Function in State

**Issue:**
```javascript
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

**Why this doesn't work:** React assumes `someFunction` is an initializer function and `someOtherFunction` is an updater function, so it tries to call them and store the result.

**Solution - Wrap functions with arrow function:**
```javascript
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```

Now React will store the functions you pass instead of calling them.

---

## Quick Reference Card

### Basic Usage
```javascript
const [state, setState] = useState(initialValue);
```

### Update State
```javascript
setState(newValue);              // Direct value
setState(prev => prev + 1);      // Based on previous
```

### Common Patterns
```javascript
// Number
const [count, setCount] = useState(0);
setCount(count + 1);

// String
const [name, setName] = useState('');
setName(e.target.value);

// Boolean
const [isOn, setIsOn] = useState(false);
setIsOn(!isOn);

// Object
const [form, setForm] = useState({ name: '', age: 0 });
setForm({ ...form, name: 'Taylor' });

// Array
const [items, setItems] = useState([]);
setItems([...items, newItem]);
```

### Key Rules
1. ✅ Call at top level only
2. ✅ Replace objects/arrays, don't mutate
3. ✅ Use updater function for multiple updates
4. ✅ Pass function (not call) for expensive initialization
5. ❌ Don't call in loops or conditions
6. ❌ Don't expect immediate state updates

---

## Summary

**useState** is your tool for remembering information between renders. It gives you:
- A state variable that persists
- A function to update it and trigger re-renders

**Key concepts:**
- State updates are asynchronous
- Always replace, never mutate objects/arrays
- Use updater functions when next state depends on previous
- Pass initializer function (not call) for expensive initialization
- State behaves like a snapshot within each render

**Remember:** State only updates for the NEXT render, not immediately!