# JavaScript Exports: Default vs Named

The ONLY confusion is about the difference between **named exports** and **default exports**. Let me clear this cleanly, slowly, and permanently.

---

## 1️⃣ Default Export

### How it looks

```javascript
export default todoSlice.reducer;
```

### How you import it

```javascript
import todoReducer from "./todoSlice";
```

### 🔴 MOST IMPORTANT RULE

✅ **You can give ANY NAME while importing**

All of these are valid:

```javascript
import todoReducer from "./todoSlice";
import reducer from "./todoSlice";
import abc from "./todoSlice";
```

**Why?** Because there is only ONE default export per file.

### 🧠 Mental Model
> **Default export = "This file's main thing"**

---

## 2️⃣ Named Export

### How it looks

```javascript
export const todoReducer = todoSlice.reducer;
export const addTodo = todoSlice.actions.addTodo;
```

### How you import it

```javascript
import { todoReducer, addTodo } from "./todoSlice";
```

### 🔴 MOST IMPORTANT RULE

❌ **The name MUST match exactly**

This will ❌ break:

```javascript
import { reducer } from "./todoSlice"; // wrong name
```

### 🧠 Mental Model
> **Named export = "This file exposes multiple things by name"**

---

## Quick Comparison

| Aspect | Default Export | Named Export |
|--------|---------------|--------------|
| **Syntax** | `export default X` | `export const X` |
| **Import** | `import AnyName from "./file"` | `import { ExactName } from "./file"` |
| **Name flexibility** | ✅ Use any name | ❌ Must use exact name |
| **Per file** | Only ONE | Multiple allowed |
| **Curly braces** | NO `{}` | YES `{}` |

---

## Common Examples

### Example 1: Redux Slice

```javascript
// todoSlice.js

// Default export - the reducer
export default todoSlice.reducer;

// Named exports - the actions
export const { addTodo, removeTodo, toggleTodo } = todoSlice.actions;
```

```javascript
// Using it

// Default import - can name it anything
import todoReducer from "./todoSlice";
import todos from "./todoSlice";  // also valid

// Named imports - must match exact names
import { addTodo, removeTodo } from "./todoSlice";
```

### Example 2: React Component

```javascript
// Button.jsx

// Default export
export default function Button() {
  return <button>Click me</button>;
}

// Named export
export const buttonVariants = {
  primary: "bg-blue-500",
  secondary: "bg-gray-500"
};
```

```javascript
// Using it

// Any name works for default
import Button from "./Button";
import MyButton from "./Button";  // also valid
import Btn from "./Button";       // also valid

// Exact name required for named export
import { buttonVariants } from "./Button";
```

---

## The Key Difference (One More Time)

### Default Export
```javascript
// file.js
export default something;

// Can import with ANY name
import whatever from "./file";
import xyz from "./file";
import abc from "./file";
```

### Named Export
```javascript
// file.js
export const something = value;

// MUST use exact name
import { something } from "./file";
// OR rename with 'as'
import { something as xyz } from "./file";
```

---

## That's It!

The whole confusion boils down to:
- **Default** = any name, no curly braces
- **Named** = exact name, with curly braces

Everything else is just variations of this core concept.
