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

--------------------------

# React.memo - Complete Guide

A comprehensive explanation of React.memo for functional components and its class-based equivalents.

---

## What is React.memo?

`React.memo` is a **Higher Order Component (HOC)** that **memoizes** a functional component. It prevents unnecessary re-renders by doing a **shallow comparison** of props.

### Simple Analogy

Think of it like a smart gatekeeper:
- **Without React.memo**: Every time parent renders, child renders (no questions asked)
- **With React.memo**: Gatekeeper checks "Did props change?" → If NO, skip re-render; If YES, allow re-render

---

## How React.memo Works Programmatically

```javascript
import { memo } from 'react';

// Regular component - re-renders every time parent renders
function RegularChild({ name, age }) {
  console.log('RegularChild rendered');
  return <div>{name} - {age}</div>;
}

// Memoized component - only re-renders when props change
const MemoizedChild = memo(function Child({ name, age }) {
  console.log('MemoizedChild rendered');
  return <div>{name} - {age}</div>;
});
```

### What React.memo Does Behind the Scenes

```javascript
// Pseudo-code of what React.memo does
function memo(Component) {
  return function MemoizedComponent(newProps) {
    // Compare previous props with new props
    if (shallowEqual(prevProps, newProps)) {
      // Props are the same, return cached result
      return cachedResult;
    } else {
      // Props changed, re-render component
      return <Component {...newProps} />;
    }
  };
}
```

---

## Example 1: Basic Usage

```javascript
import { useState, memo } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');

  console.log('Parent rendered');

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setName('Jane')}>Change Name</button>
      
      <RegularChild name={name} />
      <MemoizedChild name={name} />
    </div>
  );
}

// WITHOUT memo - renders every time Parent renders
function RegularChild({ name }) {
  console.log('RegularChild rendered');
  return <div>Regular: {name}</div>;
}

// WITH memo - only renders when 'name' prop changes
const MemoizedChild = memo(function Child({ name }) {
  console.log('MemoizedChild rendered');
  return <div>Memoized: {name}</div>;
});
```

**What happens when you click "Increment":**
- Parent re-renders ✅
- `RegularChild` re-renders ❌ (unnecessary!)
- `MemoizedChild` does NOT re-render ✅ (name didn't change!)

**What happens when you click "Change Name":**
- Parent re-renders ✅
- `RegularChild` re-renders ✅
- `MemoizedChild` re-renders ✅ (name changed!)

---

## Understanding Prop Types and React.memo

### The Key Question: Why Does React.memo Work Without useCallback Here?

```javascript
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {/* No useCallback needed! */}
      <MemoizedChild name={name} />
    </div>
  );
}

const MemoizedChild = memo(function Child({ name }) {
  console.log('MemoizedChild rendered');
  return <div>Memoized: {name}</div>;
});
```

**Answer:** Because `name` is a **primitive value (string)**, not a function or object!

---

## Primitive Props vs Reference Props

### Primitive Props (No useCallback/useMemo needed)

Primitives are compared by **VALUE**:

```javascript
// Primitive comparison
'John' === 'John' // true ✅
30 === 30 // true ✅
true === true // true ✅
null === null // true ✅

// React.memo works perfectly!
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');
  const [age, setAge] = useState(30);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      
      {/* ✅ All these work without useCallback/useMemo */}
      <MemoChild name={name} />
      <MemoChild age={age} />
      <MemoChild isActive={true} />
      <MemoChild score={100} />
    </div>
  );
}

const MemoChild = memo(({ name, age, isActive, score }) => {
  console.log('Child rendered'); // Only renders when props actually change!
  return <div>{name} - {age}</div>;
});
```

**When you click "Increment":**
- Parent re-renders
- `name`, `age`, `isActive`, `score` are all the same values
- React.memo compares: `'John' === 'John'`, `30 === 30`, `true === true`, `100 === 100`
- All comparisons pass ✅
- `MemoChild` does NOT re-render ✅

---

### Function Props (useCallback REQUIRED)

Functions are compared by **REFERENCE**:

```javascript
// Function comparison
const func1 = () => console.log('hi');
const func2 = () => console.log('hi');
func1 === func2 // false ❌ (different memory addresses)
```

**❌ WITHOUT useCallback (Fails):**

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  // Function recreated every render
  const handleClick = () => console.log('clicked');

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoChild onClick={handleClick} />
    </div>
  );
}

const MemoChild = memo(({ onClick }) => {
  console.log('Child rendered'); // ❌ Logs every time Parent renders!
  return <button onClick={onClick}>Click</button>;
});
```

**What happens:**
```
1. Parent renders → handleClick created at memory 0x001
2. Click "Increment" → Parent re-renders
3. handleClick RECREATED at memory 0x002
4. React.memo compares: 0x001 !== 0x002 ❌
5. Child re-renders unnecessarily!
```

**✅ WITH useCallback (Works):**

```javascript
import { useState, memo, useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // Function cached
  const handleClick = useCallback(() => console.log('clicked'), []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoChild onClick={handleClick} />
    </div>
  );
}

const MemoChild = memo(({ onClick }) => {
  console.log('Child rendered'); // ✅ Only logs once on mount!
  return <button onClick={onClick}>Click</button>;
});
```

**What happens:**
```
1. Parent renders → handleClick created at memory 0x001
2. Click "Increment" → Parent re-renders
3. useCallback returns SAME function at 0x001
4. React.memo compares: 0x001 === 0x001 ✅
5. Child does NOT re-render!
```

---

### Object/Array Props (useMemo REQUIRED)

Objects and arrays are also compared by **REFERENCE**:

```javascript
// Object comparison
{ name: 'John' } === { name: 'John' } // false ❌
[1, 2, 3] === [1, 2, 3] // false ❌
```

**❌ WITHOUT useMemo (Fails):**

```javascript
function Parent() {
  const [count, setCount] = useState(0);

  // Object recreated every render
  const user = { name: 'John', age: 30 };

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoChild user={user} />
    </div>
  );
}

const MemoChild = memo(({ user }) => {
  console.log('Child rendered'); // ❌ Logs every time!
  return <div>{user.name}</div>;
});
```

**✅ WITH useMemo (Works):**

```javascript
import { useState, memo, useMemo } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // Object cached
  const user = useMemo(() => ({ name: 'John', age: 30 }), []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <MemoChild user={user} />
    </div>
  );
}

const MemoChild = memo(({ user }) => {
  console.log('Child rendered'); // ✅ Only logs once!
  return <div>{user.name}</div>;
});
```

---

## The Complete Rule for React.memo

| Prop Type | React.memo Works Alone? | What You Need |
|-----------|------------------------|---------------|
| **Primitive** (string, number, boolean, null) | ✅ YES | Just `React.memo` |
| **Function** | ❌ NO | `React.memo` + `useCallback` |
| **Object** | ❌ NO | `React.memo` + `useMemo` |
| **Array** | ❌ NO | `React.memo` + `useMemo` |

---

## Example: Custom Comparison Function

You can provide a custom comparison function for more control:

```javascript
const User = memo(
  ({ user }) => {
    console.log('User rendered');
    return <div>{user.name} - {user.age}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (allow re-render)
    return prevProps.user.id === nextProps.user.id;
  }
);

function App() {
  const [user, setUser] = useState({ id: 1, name: 'John', age: 30 });

  const updateAge = () => {
    // Even though age changes, component won't re-render
    // because id is the same!
    setUser({ id: 1, name: 'John', age: 31 });
  };

  return (
    <div>
      <button onClick={updateAge}>Update Age</button>
      <User user={user} />
    </div>
  );
}
```

---

## Class-Based Equivalent: PureComponent and shouldComponentUpdate

In **class components**, there are TWO ways to achieve the same optimization:

### 1. PureComponent (Automatic Shallow Comparison)

```javascript
import React, { PureComponent } from 'react';

// Functional component with memo
const FunctionalChild = React.memo(({ name, age }) => {
  console.log('Functional child rendered');
  return <div>{name} - {age}</div>;
});

// Class component with PureComponent
class ClassChild extends PureComponent {
  render() {
    console.log('Class child rendered');
    const { name, age } = this.props;
    return <div>{name} - {age}</div>;
  }
}

class Parent extends React.Component {
  state = { count: 0, name: 'John' };

  render() {
    return (
      <div>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Count: {this.state.count}
        </button>
        
        {/* Both behave the same way */}
        <FunctionalChild name={this.state.name} age={30} />
        <ClassChild name={this.state.name} age={30} />
      </div>
    );
  }
}
```

**What PureComponent does:**
- Automatically implements `shouldComponentUpdate`
- Does shallow comparison of props and state
- Same as `React.memo` for functional components

---

### 2. shouldComponentUpdate (Manual Comparison)

```javascript
class ClassChild extends React.Component {
  // Manual control over re-rendering
  shouldComponentUpdate(nextProps, nextState) {
    // Return true to allow re-render
    // Return false to prevent re-render
    
    // Only re-render if name prop changes
    return this.props.name !== nextProps.name;
  }

  render() {
    console.log('Class child rendered');
    const { name, age } = this.props;
    return <div>{name} - {age}</div>;
  }
}
```

**This is equivalent to React.memo with custom comparison:**

```javascript
const FunctionalChild = React.memo(
  ({ name, age }) => {
    console.log('Functional child rendered');
    return <div>{name} - {age}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (OPPOSITE of shouldComponentUpdate!)
    return prevProps.name === nextProps.name;
  }
);
```

⚠️ **Important difference:**
- `shouldComponentUpdate`: return `true` to **allow** re-render
- `React.memo` comparison: return `true` to **prevent** re-render (opposite!)

---

## Comparison Table: Functional vs Class

| Feature | Functional Component | Class Component |
|---------|---------------------|-----------------|
| **Basic memoization** | `React.memo(Component)` | `extends PureComponent` |
| **Custom comparison** | `React.memo(Component, compareFn)` | `shouldComponentUpdate()` |
| **Comparison logic** | Return `true` to skip render | Return `false` to skip render |
| **What's compared** | Props only | Props AND state |
| **Modern approach** | ✅ Recommended | ❌ Legacy |

---

## Complete Example: Functional vs Class

```javascript
// ==================== FUNCTIONAL APPROACH ====================
import { useState, memo, useCallback } from 'react';

function FunctionalParent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('John');

  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoizedChild name={name} onClick={handleClick} />
    </div>
  );
}

const MemoizedChild = memo(({ name, onClick }) => {
  console.log('Memoized child rendered');
  return <button onClick={onClick}>{name}</button>;
});

// ==================== CLASS APPROACH ====================
class ClassParent extends React.Component {
  state = { count: 0, name: 'John' };

  // Need to bind or use arrow function
  handleClick = () => {
    console.log('Clicked!');
  };

  render() {
    return (
      <div>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Count: {this.state.count}
        </button>
        <PureChild name={this.state.name} onClick={this.handleClick} />
      </div>
    );
  }
}

class PureChild extends PureComponent {
  render() {
    console.log('Pure child rendered');
    const { name, onClick } = this.props;
    return <button onClick={onClick}>{name}</button>;
  }
}
```

---

## Common Pitfalls

### Pitfall 1: Inline Objects/Arrays

```javascript
// ❌ BAD - Object recreated every render
function Parent() {
  return <MemoChild user={{ name: 'John' }} />;
}

// ✅ GOOD - Use useMemo
function Parent() {
  const user = useMemo(() => ({ name: 'John' }), []);
  return <MemoChild user={user} />;
}
```

### Pitfall 2: Inline Functions

```javascript
// ❌ BAD - Function recreated every render
function Parent() {
  return <MemoChild onClick={() => console.log('click')} />;
}

// ✅ GOOD - Use useCallback
function Parent() {
  const handleClick = useCallback(() => console.log('click'), []);
  return <MemoChild onClick={handleClick} />;
}
```

### Pitfall 3: Children Prop

```javascript
// ❌ BAD - Children are recreated every render
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <MemoWrapper>
      <ExpensiveChild />
    </MemoWrapper>
  );
}

const MemoWrapper = memo(({ children }) => {
  console.log('Wrapper rendered'); // Still renders every time!
  return <div>{children}</div>;
});
```

---

## When to Use React.memo

✅ **USE when:**
- Component renders often with same props
- Component is expensive to render (heavy calculations, large lists)
- Parent re-renders frequently but child props rarely change
- Component receives props that are primitives (strings, numbers, booleans)

❌ **DON'T USE when:**
- Props change frequently
- Component is already fast
- Premature optimization
- Component always renders with different props

---

## Visual Summary

```
✅ WORKS - Primitive prop
const MemoChild = memo(({ name }) => <div>{name}</div>);
<MemoChild name="John" />

❌ DOESN'T WORK - Function prop without useCallback
const MemoChild = memo(({ onClick }) => <button onClick={onClick}>Click</button>);
<MemoChild onClick={() => console.log('hi')} />

✅ WORKS - Function prop with useCallback
const handleClick = useCallback(() => console.log('hi'), []);
<MemoChild onClick={handleClick} />

❌ DOESN'T WORK - Object prop without useMemo
<MemoChild user={{ name: 'John' }} />

✅ WORKS - Object prop with useMemo
const user = useMemo(() => ({ name: 'John' }), []);
<MemoChild user={user} />
```

---

## Key Takeaways

1. **React.memo prevents re-renders** by comparing props
2. **Primitive props work automatically** (strings, numbers, booleans)
3. **Function props need useCallback** (to maintain same reference)
4. **Object/Array props need useMemo** (to maintain same reference)
5. **PureComponent is the class equivalent** of React.memo
6. **Always combine properly:** React.memo + useCallback/useMemo for optimization

**Remember:** You only need `useCallback` when passing **FUNCTIONS** as props, and `useMemo` when passing **OBJECTS/ARRAYS** as props!

