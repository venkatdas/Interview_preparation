# Interview Q&A — 23 April 2026

> Exported from ParakeetAI | Cleaned & formatted for Obsidian / Notion / VS Code

---

## Table of Contents

1. [Self Introduction](#1-self-introduction)
2. [HTML5 Features](#2-html5-features)
3. [Semantic HTML](#3-semantic-html)
4. [The `<aside>` Tag](#4-the-aside-tag)
5. [CSS Preprocessors](#5-css-preprocessors)
6. [CSS Variables](#6-css-variables)
7. [CSS Box Model](#7-css-box-model)
8. [JavaScript — Hoisting](#8-javascript--hoisting)
9. [Arrow Functions vs Regular Functions](#9-arrow-functions-vs-regular-functions)
10. [Debouncing](#10-debouncing)
11. [Throttling](#11-throttling)
12. [ES6 Features](#12-es6-features)
13. [Events — Bubbling & Capturing](#13-events--bubbling--capturing)
14. [Web Workers](#14-web-workers)
15. [Generator Functions](#15-generator-functions)
16. [Event Loop — Output Order](#16-event-loop--output-order)
17. [JavaScript Execution Model](#17-javascript-execution-model)
18. [Coding — Invert User-to-Games Object](#18-coding--invert-user-to-games-object)
19. [React — Class vs Functional Components](#19-react--class-vs-functional-components)
20. [React Lifecycle → Hooks Mapping](#20-react-lifecycle--hooks-mapping)
21. [React Stopwatch — Bug Fix (useRef)](#21-react-stopwatch--bug-fix-useref)
22. [React Stopwatch — timerId.current === null](#22-react-stopwatch--timeridcurrent--null)
23. [Module Federation](#23-module-federation)
24. [Redux in Micro-Frontend Architecture](#24-redux-in-micro-frontend-architecture)
25. [Sharing Data Between Micro-Frontends](#25-sharing-data-between-micro-frontends)

---

## 1. Self Introduction

**Q: Please introduce yourself.**

**A:**
- Senior Software Engineer with over 6.5 years of experience building scalable, high-performance enterprise web applications.
- Core expertise in React.js, TypeScript, JavaScript, Node.js, MongoDB, and GraphQL.
- Led frontend architecture, built reusable component libraries, and designed REST and GraphQL APIs for large-scale products serving tens of thousands of users.
- Strong track record in performance optimization, accessibility (100% WCAG 2.1 AA compliance), and improving business metrics.
- Mentored developers, driven technical decisions, and led sprint planning across cross-functional teams.
- Experience spans domains like loan automation, healthcare analytics, and mutual fund processing — recognized with awards for delivery excellence and code quality.

---

## 2. HTML5 Features

**Q: What do you know about HTML5? What new features were added?**

**A:**
- HTML5 is the latest major version of HTML for structuring web content.
- New **semantic elements**: `<header>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<main>`.
- Native **multimedia** support: `<audio>` and `<video>` tags — no plugins needed.
- `<canvas>` for 2D drawing and SVG for vector graphics.
- New **form input types**: `email`, `date`, `number`, `range`, `color`; new attributes: `placeholder`, `required`, `autofocus`, `pattern`.
- **Offline storage**: `localStorage`, `sessionStorage`.
- **Geolocation API**: access user location (with permission).
- **Drag-and-Drop API**: native drag-and-drop in the browser.
- **Web Workers**: run JavaScript in the background without blocking the UI.
- `data-*` custom attributes for embedding extra information in HTML elements.

---

## 3. Semantic HTML

**Q: What is semantic HTML? Can you name some semantic tags?**

**A:**
- Semantic HTML means using tags that clearly describe their meaning and role in the page structure.
- Helps browsers, search engines, and assistive technologies (screen readers) understand content.
- Improves **accessibility**, **SEO**, and **code readability**.

**Common semantic tags:**

| Tag | Purpose |
|---|---|
| `<header>` | Header section of a page or section |
| `<footer>` | Footer section |
| `<nav>` | Navigation links |
| `<main>` | Main content of the document |
| `<section>` | Groups related content |
| `<article>` | Self-contained piece of content |
| `<aside>` | Related but non-essential content (sidebars, callouts) |
| `<figure>` / `<figcaption>` | Images with captions |
| `<mark>` | Highlighted text |
| `<time>` | Specific time or date |

---

## 4. The `<aside>` Tag

**Q: What does the `<aside>` tag mean in semantic HTML?**

**A:**
- Used for content that is **related to the main content but not essential** to it.
- Common uses: sidebars, pull quotes, advertisements, related links, recent posts.
- Helps accessibility and clarifies structure for users and search engines.

---

## 5. CSS Preprocessors

**Q: Do you know about CSS preprocessors? Can you explain how they work?**

**A:**
- CSS preprocessors let you write CSS with extra features before it is compiled to standard CSS.
- Popular options: **SASS/SCSS**, **LESS**, **Stylus**.
- Key features: **variables**, **nesting**, **mixins**, **functions**, **imports**.
- You write in the preprocessor syntax → a build step compiles it into regular CSS → the browser only sees the final CSS.
- Helps organize and maintain large stylesheets, reduces repetition, and improves maintainability.

---

## 6. CSS Variables

**Q: Can we create variables in CSS / SASS? Give a real-world example.**

**A:**
- **Plain CSS** (CSS Custom Properties):
  ```css
  :root {
    --main-color: #3498db;
  }
  .button {
    background-color: var(--main-color);
  }
  ```
- **SASS**: `$primary-color: #3498db;`
- **LESS**: `@primary-color: #3498db;`

**Real-world example:**
- Define `$primary-color` once and use it across all buttons, headers, and links.
- If the brand color changes, update only the variable — it updates everywhere.
- Useful for **theming** (light/dark mode) and **consistent spacing** (`$spacing-unit: 16px;`).

---

## 7. CSS Box Model

**Q: Can you explain the CSS box model?**

**A:**
- Every HTML element is treated as a **rectangular box** in CSS.
- The box model has four parts:

```
┌───────────────────────────┐
│           Margin          │
│  ┌─────────────────────┐  │
│  │       Border        │  │
│  │  ┌───────────────┐  │  │
│  │  │    Padding    │  │  │
│  │  │  ┌─────────┐  │  │  │
│  │  │  │ Content │  │  │  │
│  │  │  └─────────┘  │  │  │
│  │  └───────────────┘  │  │
│  └─────────────────────┘  │
└───────────────────────────┘
```

| Part | Description |
|---|---|
| **Content** | Actual text or image |
| **Padding** | Space between content and border |
| **Border** | Line around padding and content |
| **Margin** | Space outside the border |

---

## 8. JavaScript — Hoisting

**Q: What is hoisting in JavaScript?**

**A:**
- Hoisting is a JavaScript mechanism where **variable and function declarations are moved to the top of their scope** before code execution.
- **Function declarations** are fully hoisted — you can call them before their definition.
- **`var`** declarations are hoisted but initialized as `undefined` until the assignment line is reached.
- **`let` and `const`** are hoisted but NOT initialized — accessing them before declaration throws a `ReferenceError` (Temporal Dead Zone).

> **One-liner:** Hoisting means declarations are moved to the top of their scope before code runs.

---

## 9. Arrow Functions vs Regular Functions

**Q: What are arrow functions? What is the basic difference between a regular function and an arrow function?**

**A:**

| Feature | Regular Function | Arrow Function |
|---|---|---|
| Syntax | `function foo() {}` | `const foo = () => {}` |
| `this` | Own `this` (depends on call context) | Inherits `this` from parent scope (lexical) |
| Constructor | Can use `new` | Cannot use `new` |
| `arguments` object | Has its own | Does not have |
| `prototype` | Has it | Does not have |

**When to use arrow functions:**
- Callbacks, `.map()`, `.filter()`, `.reduce()`.
- When you need `this` to refer to the parent scope (e.g., inside class methods).

> **One-liner:** Arrow functions inherit `this` from their parent scope; regular functions create their own `this`.

---

## 10. Debouncing

**Q: What is debouncing? Give a real-world example.**

**A:**
- Debouncing is a technique to **delay function execution** until a specified time has passed since the last invocation.
- No matter how many times the event fires, the function runs only after the user stops triggering it.

**Real-world example:**
- Search bar on Amazon — instead of making an API call on every keystroke, debouncing waits until the user stops typing (e.g., 300ms), then triggers one API call.
- Reduces unnecessary API calls and DOM updates.

> **One-liner:** Debouncing delays a function call until a quiet period has elapsed after the last event.

---

## 11. Throttling

**Q: What is throttling?**

**A:**
- Throttling ensures a function is **executed at most once in a specified time interval**, regardless of how many times the event fires.
- Unlike debouncing (waits for quiet), throttling **guarantees regular execution** at a set rate.

**Real-world example:**
- Window scroll or resize events — throttle to fire a handler at most every 100ms.

> **One-liner:** Throttling means the function runs once per set time interval no matter how often the event fires.

---

## 12. ES6 Features

**Q: What are some important ES6 features?**

**A:**

| Feature | Example |
|---|---|
| `let` / `const` | Block-scoped variables |
| Arrow functions | `const fn = () => {}` |
| Template literals | `` `Hello ${name}` `` |
| Destructuring | `const { a, b } = obj` |
| Default parameters | `function foo(x = 10) {}` |
| Rest / Spread | `...args`, `...arr` |
| Classes | `class Foo extends Bar {}` |
| Promises | `new Promise((res, rej) => {})` |
| Modules | `import` / `export` |
| `Map` and `Set` | New data structures |
| `for...of` | Iterate over iterables |

---

## 13. Events — Bubbling & Capturing

**Q: What is event bubbling? What is event capturing? How do you enable capturing?**

**A:**

### Event Bubbling
- When an event fires on a child element, it **propagates upward** through parent elements up to the root.
- Default behavior for most DOM events.
- Use `event.stopPropagation()` to stop it.

**Example issue if NOT stopped:** Clicking inside a modal could trigger the modal's close handler on the parent, closing it unintentionally.

### Event Capturing
- The event starts at the **root and travels DOWN** to the target element before bubbling begins.
- Allows a parent to handle the event before the child.

### Enabling Capturing
```javascript
element.addEventListener('click', handler, true); // true = capturing phase
element.addEventListener('click', handler, false); // false = bubbling (default)
```

### `addEventListener` Parameters

| Param | Description |
|---|---|
| `eventType` | `'click'`, `'keydown'`, etc. |
| `handler` | Function to run |
| `options` | Boolean or `{ capture, once, passive }` |

---

## 14. Web Workers

**Q: What are Web Workers in JavaScript?**

**A:**
- Web Workers let you run JavaScript **in a background thread**, separate from the main browser thread.
- Prevent heavy computation from **blocking the UI**.
- Cannot access the DOM directly.
- Communicate with the main thread via `postMessage` / `onmessage`.

**Use cases:** Large data processing, image manipulation, CPU-intensive calculations.

> **One-liner:** Web Workers run JS off the main thread, keeping the UI smooth during heavy tasks.

---

## 15. Generator Functions

**Q: What is a generator function? How does it work?**

**A:**
- A special function that can **pause and resume** its execution.
- Declared with `function*` syntax; uses the `yield` keyword to pause.
- Returns an **iterator object**; call `.next()` to advance it.

```javascript
function* myGenerator() {
  yield 1;   // Pause, return { value: 1, done: false }
  yield 2;   // Pause, return { value: 2, done: false }
  yield 3;   // Pause, return { value: 3, done: false }
}

const gen = myGenerator();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }
```

**Use cases:** Lazy sequences, custom iterators, async control flow.

---

## 16. Event Loop — Output Order

**Q: What is the output order of this code?**

```javascript
console.log('Script start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve()
  .then(() => { console.log('Promise 1'); })
  .then(() => { console.log('Promise 2'); });

console.log('Script end');
```

**A:**

```
Script start
Script end
Promise 1
Promise 2
setTimeout
```

**Why:**

| Priority | Type | Examples |
|---|---|---|
| 1st | Synchronous code | `console.log` |
| 2nd | Microtasks | `Promise.then()` |
| 3rd | Macrotasks | `setTimeout`, `setInterval` |

- **Synchronous** code runs first, line by line.
- **Microtasks** (Promises) drain completely after synchronous code.
- **Macrotasks** (setTimeout) run only after the microtask queue is empty.

---

## 17. JavaScript Execution Model

**Q: Who manages JavaScript execution order? Is JavaScript synchronous or asynchronous?**

**A:**
- JavaScript is **single-threaded** — one call stack, synchronous by nature.
- The **V8 engine** (Chrome, Node.js) executes the code.
- The **Event Loop** manages synchronous code, microtasks, and macrotasks.
- Asynchronous behavior is provided by the browser/Node.js runtime (Web APIs, libuv).

**Execution flow:**
1. Code is parsed → memory/creation phase.
2. Execution phase → call stack runs synchronous code.
3. Async callbacks (setTimeout, Promises) are deferred to their respective queues.
4. Event loop picks from **microtask queue** first, then **macrotask queue**, when the call stack is empty.

---

## 18. Coding — Invert User-to-Games Object

**Q: Given an object mapping users to games, produce an object mapping games to users.**

**Input:**
```javascript
const obj = {
  'AA': ['carroms', 'chess', 'hockey'],
  'BB': ['chess', 'hockey'],
  'CC': ['carroms']
};
```

**Expected Output:**
```javascript
{ carroms: ['AA', 'CC'], chess: ['AA', 'BB'], hockey: ['AA', 'BB'] }
```

**A:**

```javascript
function invertMapping(obj) {
  const output = {};

  for (const user in obj) {           // Loop each user
    obj[user].forEach((game) => {     // Loop each game for that user
      if (!output[game]) {            // If game not yet a key
        output[game] = [];            // Create empty array
      }
      output[game].push(user);        // Add user to that game's list
    });
  }

  return output;
}

console.log(invertMapping(obj));
// { carroms: ['AA', 'CC'], chess: ['AA', 'BB'], hockey: ['AA', 'BB'] }
```

**Complexity:**
- Time: O(N) — N = total number of user-game pairs.
- Space: O(M) — M = total unique games × users.

---

## 19. React — Class vs Functional Components

**Q: Why did we shift from class components to functional components?**

**A:**

| Aspect | Class Components | Functional Components |
|---|---|---|
| Syntax | `class Foo extends Component` | Plain function |
| State | `this.state` / `this.setState` | `useState` hook |
| Lifecycle | `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` | `useEffect` |
| Render | Explicit `render()` method required | `return` statement IS the render |
| `this` issues | Common bugs with `this` binding | Not applicable |
| Boilerplate | Higher (`constructor`, `super(props)`) | Minimal |
| Code reuse | HOCs / Render Props (complex) | Custom Hooks (clean) |

**Key reasons for migrating:**
- React Hooks introduced in **React 16.8** made state and side effects manageable in functions.
- Less boilerplate, better readability, fewer bugs.
- Custom hooks enable clean logic reuse without HOC complexity.

---

## 20. React Lifecycle → Hooks Mapping

**Q: What replaces `render()` in functional components? How do lifecycle methods map to hooks?**

**A:**

| Class Lifecycle | Functional Hook Equivalent |
|---|---|
| `render()` | The function's `return` statement |
| `componentDidMount` | `useEffect(() => { ... }, [])` |
| `componentDidUpdate` | `useEffect(() => { ... }, [dep])` |
| `componentWillUnmount` | `useEffect(() => { return () => cleanup(); }, [])` |

```jsx
useEffect(() => {
  // componentDidMount logic here

  return () => {
    // componentWillUnmount cleanup here
  };
}, []); // Empty array = runs only on mount/unmount

useEffect(() => {
  // componentDidUpdate — runs when `dep` changes
}, [dep]);
```

**Why no explicit `render()` in functional components?**
- In class components, `render()` is a required lifecycle method — React calls it explicitly.
- In functional components, **the function itself IS the render** — whatever you `return` is displayed.

---

## 21. React Stopwatch — Bug Fix (`useRef`)

**Q: What is the bug in this React stopwatch, and how do you fix it?**

**Buggy Code:**
```jsx
let timerId; // ❌ Resets on every render

const startTimer = () => {
  timerId = setInterval(() => setSeconds(s => s + 1), 1000);
};
const stopTimer = () => {
  clearInterval(timerId); // ❌ timerId is undefined after re-render
};
```

**Problem:** `timerId` is a local variable — it resets on every render, so `clearInterval` cannot find the interval to stop.

**Fix — use `useRef`:**

```jsx
import React, { useState, useRef, useEffect } from 'react';

function Stopwatch() {
  const [seconds, setSeconds] = useState(0);
  const timerId = useRef(null); // ✅ Persists across renders

  const startTimer = () => {
    if (timerId.current !== null) return; // Prevent multiple intervals
    timerId.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerId.current); // ✅ Always has the right ID
    timerId.current = null;
  };

  const resetTimer = () => {
    setSeconds(0);
    stopTimer();
  };

  useEffect(() => {
    return () => stopTimer(); // Cleanup on unmount
  }, []);

  return (
    <div>
      <h1>Time: {seconds}s</h1>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}
```

**Why `useRef`?**
- `useRef` stores a mutable value that **persists across renders** without causing re-renders.
- Perfect for storing interval/timeout IDs.

---

## 22. React Stopwatch — `timerId.current === null`

**Q: What does `timerId.current === null` mean?**

**A:**
- `timerId` is a ref created with `useRef(null)`.
- Its `.current` holds the **interval ID** when the timer is running, or `null` when stopped.
- `timerId.current === null` → no active interval is running → safe to start a new one.

| State | `timerId.current` value |
|---|---|
| Timer not started / stopped | `null` |
| Timer running | Interval ID (a number) |

- On `startTimer`: only create a new interval if `timerId.current === null`.
- On `stopTimer`: clear the interval and set `timerId.current = null`.

---

## 23. Module Federation

**Q: What is Module Federation and how is it used?**

**A:**
- A **Webpack 5 feature** that lets multiple independently built and deployed applications (micro-frontends) share code and dependencies **at runtime**.
- Architecture:
  - **Shell (Host)** — the main app that loads and orchestrates remote modules.
  - **Remotes** — individual micro-frontends exposed via `remoteEntry.js` files.
- Enables **independent deployments** — different teams can release without rebuilding the whole project.
- Shared libraries (e.g., React) can be declared as **singletons** to avoid version conflicts.
- Benefits: reduced duplication, faster load times, true micro-frontend isolation.

**Example use case:** An e-commerce site with Product, Cart, and Checkout as separate apps — each deployed independently, sharing common UI via Module Federation.

---

## 24. Redux in Micro-Frontend Architecture

**Q: Can we have multiple Redux stores in a micro-frontend / Module Federation setup?**

**A:**
- Yes — technically each MFE can have its own Redux store for isolation.
- **Challenges:** state sharing and coordination between MFEs becomes harder with multiple stores.

**Strategies for shared state:**

| Strategy | When to use |
|---|---|
| **Shared store via Module Federation** | Global state (auth, theme, user session) — expose from the shell |
| **Custom Browser Events** | `window.dispatchEvent` / `window.addEventListener` for loose coupling |
| **Shell as mediator** | Shell collects from MFE1 and passes as props to MFE2 |
| **Server-side state** | Persist to backend, let MFEs fetch independently |

**Best practice:** Keep local state in each MFE, share global state (user/session) via the shell's store.

---

## 25. Sharing Data Between Micro-Frontends

**Q: How do you transfer user input from one MFE to another (e.g., button in MFE2 needs data entered in MFE1)?**

**A:**

### Option 1 — Shared Redux Store (via Module Federation)
- Shell exposes a common Redux store.
- Both MFE1 and MFE2 connect to it — MFE1 dispatches actions, MFE2 reads state.

### Option 2 — Custom Browser Events
```javascript
// MFE1 — dispatch event with data
window.dispatchEvent(new CustomEvent('userInputChanged', { detail: { value: 'data' } }));

// MFE2 — listen for the event
window.addEventListener('userInputChanged', (e) => {
  console.log(e.detail.value); // 'data'
});
```

### Option 3 — Shell as Mediator
- Shell receives data from MFE1 and passes it as props to MFE2.

### Option 4 — URL Params
- Pass data via query strings when navigation is involved.

### Option 5 — Server-Side State
- MFE1 saves to API; MFE2 fetches when needed.

**Recommended approach for real-time UX:** Shared Redux store + Custom Events for cross-MFE communication.

---

*Generated from ParakeetAI interview transcript — 23 April 2026*
