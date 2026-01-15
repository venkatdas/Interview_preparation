#### usecallback

# Understanding useCallback in React

A comprehensive guide to understanding how `useCallback` caches function definitions between re-renders.

---

## Understanding "Cache a Function Definition Between Re-renders"

Let me show you what happens WITHOUT and WITH `useCallback`:

### WITHOUT useCallback - Function is Recreated Every Time

```javascript
import { useState } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // This function is RECREATED on EVERY render
  const handleClick = () => {
    console.log('Button clicked');
  };

  console.log('Parent rendered');

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Type your name"
      />
      
      <Child onClick={handleClick} />
    </div>
  );
}

function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Child Button</button>;
}
```

#### What happens programmatically:

1. **First render:** `handleClick` function is created → Memory address: `0x001`
2. **You type in input (name changes):** Parent re-renders
   - `handleClick` is created AGAIN → New memory address: `0x002`
   - Even though the function does the same thing, it's a NEW function in memory
3. **You click increment:** Parent re-renders
   - `handleClick` is created AGAIN → New memory address: `0x003`

**Every time Parent re-renders, a NEW function is created in memory!**

Think of it like this:

```javascript
// Render 1
const handleClick = () => { console.log('clicked'); }; // 0x001

// Render 2 (after state change)
const handleClick = () => { console.log('clicked'); }; // 0x002 (NEW!)

// Render 3 (after another state change)
const handleClick = () => { console.log('clicked'); }; // 0x003 (NEW!)
```

In JavaScript, even if two functions look identical, they are NOT equal:

```javascript
const func1 = () => { console.log('hi'); };
const func2 = () => { console.log('hi'); };

console.log(func1 === func2); // false! (different memory addresses)
```

---

### WITH useCallback - Function is Cached (Same Reference)

```javascript
import { useState, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // This function is CACHED - same reference unless dependencies change
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // Empty dependencies = never changes

  console.log('Parent rendered');

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Type your name"
      />
      
      <Child onClick={handleClick} />
    </div>
  );
}

function Child({ onClick }) {
  console.log('Child rendered');
  return <button onClick={onClick}>Child Button</button>;
}
```

#### What happens programmatically:

1. **First render:** `handleClick` function is created → Memory address: `0x001`
2. **You type in input (name changes):** Parent re-renders
   - useCallback checks dependencies: `[]` (empty, nothing changed)
   - Returns SAME function → Memory address: `0x001` (CACHED!)
3. **You click increment:** Parent re-renders
   - useCallback checks dependencies: `[]` (still nothing changed)
   - Returns SAME function → Memory address: `0x001` (CACHED!)

```javascript
// Render 1
const handleClick = useCallback(() => { console.log('clicked'); }, []); // 0x001

// Render 2 (after state change)
// useCallback returns the SAME function from render 1 → 0x001

// Render 3 (after another state change)
// useCallback returns the SAME function from render 1 → 0x001
```

---

## Now Enter React.memo - Why Does This Matter?

`React.memo` is a Higher Order Component that **prevents re-rendering if props haven't changed**.

### WITHOUT React.memo and WITHOUT useCallback

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    console.log('clicked');
  };
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleClick} />
    </div>
  );
}

function Child({ onClick }) {
  console.log('Child rendered'); // This runs EVERY time Parent renders
  return <button onClick={onClick}>Child Button</button>;
}
```

**Result:** Every time you click the count button, Child re-renders even though it doesn't use `count` at all!

---

### WITH React.memo but WITHOUT useCallback (Still Re-renders!)

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    console.log('clicked');
  };
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleClick} />
    </div>
  );
}

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered'); // STILL runs every time!
  return <button onClick={onClick}>Child Button</button>;
});
```

#### Why does Child still re-render?

React.memo does this check:

```javascript
// Pseudo-code of what React.memo does
if (prevProps.onClick === newProps.onClick) {
  // Props are same, skip re-render
} else {
  // Props changed, re-render
}
```

But since `handleClick` is recreated every time:

- Render 1: `onClick` = function at memory `0x001`
- Render 2: `onClick` = function at memory `0x002` (NEW!)
- `0x001 !== 0x002` → React thinks props changed → Child re-renders!

---

### WITH React.memo AND useCallback (Optimization Works!)

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  
  // Function is cached with same reference
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <Child onClick={handleClick} />
    </div>
  );
}

const Child = React.memo(({ onClick }) => {
  console.log('Child rendered'); // Only renders once on mount!
  return <button onClick={onClick}>Child Button</button>;
});
```

**Now React.memo works:**

- Render 1: `onClick` = function at memory `0x001`
- Render 2: `onClick` = function at memory `0x001` (SAME! Thanks to useCallback)
- `0x001 === 0x001` → Props haven't changed → Child DOESN'T re-render! ✅

---

## Visual Summary

```
WITHOUT useCallback:
Parent renders → New function created (0x001)
Parent renders → New function created (0x002) ← Different!
Parent renders → New function created (0x003) ← Different!

WITH useCallback:
Parent renders → Function created (0x001)
Parent renders → Same function returned (0x001) ← Same!
Parent renders → Same function returned (0x001) ← Same!
```

---

## Key Takeaway

**The key:** `useCallback` ensures the function keeps the **same reference (memory address)** across re-renders, which allows `React.memo` to properly detect that props haven't changed and skip unnecessary re-renders.


