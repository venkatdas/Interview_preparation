# Custom Hook Design Pattern in React

The **Custom Hook Design Pattern** in React allows you to extract reusable logic into separate functions, making your components cleaner and more maintainable. Custom hooks enable you to encapsulate stateful logic and side effects, and share it across multiple components without the need for higher-order components (HOCs) or render props.

## Key Benefits of Custom Hooks:
- **Reusability**: You can reuse the same logic across multiple components.
- **Separation of Concerns**: Logic is separated from the component’s UI, making the component simpler and focused on rendering.
- **Maintainability**: It’s easier to update and maintain logic in one place rather than in multiple components.

## Basic Structure of a Custom Hook

A custom hook follows the naming convention `use<something>`, and it typically uses React's built-in hooks like `useState`, `useEffect`, or `useReducer`. It can return any values, functions, or even other hooks that are needed by the component.

---

## Example 1: Custom Hook for Fetching Data

Let's create a custom hook that fetches data from an API and handles loading and error states.

```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Re-run when the URL changes

  return { data, loading, error };
}

export default useFetch;
```

### Usage in a Component

Now, let's use this custom hook in a component:

```jsx
import React from 'react';
import useFetch from './useFetch';

function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;
```

### Explanation:
1. **`useFetch` Custom Hook**:
   - It takes a URL as a parameter and fetches data from that URL.
   - It uses `useState` to manage `data`, `loading`, and `error` states.
   - The `useEffect` hook is used to trigger the data fetching when the component mounts or when the URL changes.
   - It returns the `data`, `loading`, and `error` states, which can be used in the component to render the UI accordingly.

2. **Using the Hook**:
   - In the `UserList` component, we use the `useFetch` hook to get data from an API.
   - The component displays different content based on whether the data is still loading, an error occurred, or the data is successfully fetched.

---

## Example 2: Custom Hook for Managing Form State

Here’s another example where we create a custom hook to manage form state and handle form submission.

```jsx
import { useState } from 'react';

function useForm(initialState) {
  const [values, setValues] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e, callback) => {
    e.preventDefault();
    callback(values);
  };

  return { values, handleChange, handleSubmit };
}

export default useForm;
```

### Usage in a Component

```jsx
import React from 'react';
import useForm from './useForm';

function ContactForm() {
  const { values, handleChange, handleSubmit } = useForm({
    name: '',
    email: '',
  });

  const submitForm = (data) => {
    console.log('Form Submitted:', data);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, submitForm)}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ContactForm;
```

### Explanation:
1. **`useForm` Custom Hook**:
   - Manages form state (`values`).
   - Provides `handleChange` to update form values and `handleSubmit` to submit the form.
   - The `handleSubmit` function takes a callback to process the form data when the form is submitted.

2. **Using the Hook**:
   - In the `ContactForm` component, we use the `useForm` hook to manage form input values.
   - The form submission is handled by `handleSubmit`, and the callback (`submitForm`) processes the form data.

---

## Example 3: Custom Hook for Local Storage

You can also create a custom hook for managing data in `localStorage`.

```jsx
import { useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
```

### Usage in a Component

```jsx
import React from 'react';
import useLocalStorage from './useLocalStorage';

function Counter() {
  const [count, setCount] = useLocalStorage('count', 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;
```

### Explanation:
1. **`useLocalStorage` Custom Hook**:
   - It manages state with `localStorage`. When the hook is first used, it checks if the key exists in `localStorage` and uses that value; otherwise, it uses the `initialValue`.
   - The `setValue` function updates both the state and `localStorage`.

2. **Using the Hook**:
   - In the `Counter` component, the count value is stored in `localStorage` and persists even after the page is reloaded.

---

## Conclusion

Custom hooks are a powerful feature in React, allowing you to encapsulate logic and reuse it across components. By following the **Custom Hook Design Pattern**, you can keep your code modular, maintainable, and easy to test. Whether it’s for managing form state, fetching data, or interacting with `localStorage`, custom hooks make it easy to share stateful logic without cluttering your components.
