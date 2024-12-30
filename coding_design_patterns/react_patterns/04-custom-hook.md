# Hooks Pattern

## What is the Hooks Pattern?

The Hooks pattern is a way to encapsulate reusable logic in React using functions. Hooks allow you to extract stateful logic and side effects into standalone, reusable functions, which can then be shared across multiple components.

---

## Why Do We Need It?

1. **Reusability**: Share stateful logic without duplicating code.
2. **Separation of Concerns**: Keep logic separate from the UI.
3. **Simplifies Class Components**: Avoid the complexity of lifecycle methods in class components by using functional components.

---

## Problem Statement

How can we reuse logic like fetching data, managing form state, or subscribing to events across multiple components without duplicating code or introducing unnecessary complexity?

The Hooks pattern solves this by allowing us to encapsulate such logic into custom hooks.

---

## Implementation from Scratch

### Example: Fetching Data with a Custom Hook

#### Creating the Hook

```jsx
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
```

#### Using the Hook

```jsx
import React from "react";
import useFetch from "./useFetch";

const App = () => {
  const { data, loading, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default App;
```

---

## Real-Time Example

### Form Validation with a Custom Hook

#### Creating the Hook

```jsx
import { useState } from "react";

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return { values, handleChange };
};

export default useForm;
```

#### Using the Hook

```jsx
import React from "react";
import useForm from "./useForm";

const LoginForm = () => {
  const { values, handleChange } = useForm({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={values.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
```

---

## Advantages

1. **Reusability**: Encapsulate logic in hooks and use them across multiple components.
2. **Readability**: Simplifies component logic by separating concerns.
3. **Testability**: Makes it easier to test isolated logic in hooks.

---

## Where Is It Used in Real Time?

1. **Data Fetching**: Create reusable hooks for API calls.
2. **Form Management**: Handle form state and validation.
3. **Authentication**: Manage login state and access tokens.
4. **Subscriptions**: Subscribe to events like WebSocket messages or window resize.

---

## Folder Structure

```
src/
  hooks/
    useFetch.js
    useForm.js
  components/
    App.js
    LoginForm.js
```
