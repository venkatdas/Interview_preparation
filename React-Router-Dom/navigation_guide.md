---
title: React Router Navigation Guide
description: Complete guide to Link, useNavigate, and Navigate in React Router
author: Developer Documentation
date: 2026-01-30
tags: [react, react-router, navigation, routing]
---

# React Router Navigation Guide

## Overview

React Router provides multiple ways to handle navigation in your application. Understanding when to use each approach is crucial for building maintainable React applications.

---

## The Three Navigation Approaches

### 1. `<Link>` Component

**What it is:** A declarative component that renders an accessible anchor tag (`<a>`) for navigation.

**When to use:**
- Standard navigation links in your UI
- Menu items, navigation bars, sidebars
- Any clickable element that navigates to a different route
- When you want SEO-friendly, crawlable links

**Example:**

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/data">Data</Link>
      <Link to="/users">Users</Link>
    </nav>
  );
}
```

**Key features:**
- Prevents full page reload
- Accessible by default (keyboard navigation, screen readers)
- Can be styled like any other element
- Supports relative and absolute paths

---

### 2. `useNavigate` Hook

**What it is:** A hook that returns a function to programmatically navigate.

**When to use:**
- After form submissions
- After API calls or async operations
- Inside event handlers (button clicks, etc.)
- Conditional navigation based on logic
- When you need to navigate imperatively, not declaratively

**Example:**

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser();
    
    if (success) {
      navigate('/dashboard'); // Navigate after successful login
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Login</button>
      <button type="button" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </form>
  );
}
```

**Key features:**
- `navigate('/path')` - Navigate to a path
- `navigate(-1)` - Go back one page
- `navigate(1)` - Go forward one page
- `navigate('/path', { replace: true })` - Replace current history entry
- `navigate('/path', { state: { data } })` - Pass state to next route

---

### 3. `<Navigate>` Component

**What it is:** A component that navigates when rendered.

**When to use:**
- Redirects based on conditions
- Protected routes (authentication checks)
- Route-level redirects
- When navigation should happen as part of rendering logic

**Example:**

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Usage in routes
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute isAuthenticated={isLoggedIn}>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

**Another common pattern:**

```jsx
function OldUserProfile() {
  // Redirect old route to new route
  return <Navigate to="/profile" replace />;
}

<Route path="/user-profile" element={<OldUserProfile />} />
<Route path="/profile" element={<Profile />} />
```

**Key features:**
- `replace` prop - Replaces history entry instead of adding new one
- `state` prop - Pass data to the destination route
- Declarative - navigation happens during render

---

## Quick Decision Guide

| Scenario | Use |
|----------|-----|
| Navigation menu | `<Link>` |
| Breadcrumbs | `<Link>` |
| After form submit | `useNavigate` |
| After API success/failure | `useNavigate` |
| Authentication redirect | `<Navigate>` |
| Route-level redirect | `<Navigate>` |
| Back/forward buttons | `useNavigate` |
| Conditional navigation in JSX | `<Navigate>` |

---

## Complete Example

```jsx
import { Link, useNavigate, Navigate, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Navigation Bar - using Link
function NavBar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/data">Data</Link>
      <Link to="/users">Users</Link>
    </nav>
  );
}

// Form Component - using useNavigate
function CreateUser() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveUser();
    navigate('/users', { state: { message: 'User created!' } });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Create</button>
      <button type="button" onClick={() => navigate(-1)}>Cancel</button>
    </form>
  );
}

// Protected Route - using Navigate
function ProtectedRoute({ isAuth, children }) {
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// App Routes
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </>
  );
}
```

---

## Best Practices

1. **Prefer `<Link>` for navigation UI elements** - It's more accessible and SEO-friendly
2. **Use `useNavigate` for programmatic navigation** - Form submissions, button clicks, after async operations
3. **Use `<Navigate>` for declarative redirects** - Authentication, route protection, old-to-new route redirects
4. **Always use `replace` for redirects** - Prevents users from getting stuck in redirect loops when using the back button
5. **Pass state carefully** - Only pass serializable data through navigation state

---

## Common Pitfalls

- **Don't use `useNavigate` inside render logic** - use `<Navigate>` instead
- **Don't use `<Link>` for actions that aren't navigation** - use buttons with `onClick` and `useNavigate`
- **Remember that `<Navigate>` triggers on every render** - use conditions carefully
- **Don't navigate in `useEffect` when `<Navigate>` would be clearer**

---

## Advanced Patterns

### Passing State Between Routes

```jsx
// Sending component
function UserList() {
  const navigate = useNavigate();
  
  const handleUserClick = (user) => {
    navigate('/user-details', { state: { user } });
  };
  
  return <div>{/* user list */}</div>;
}

// Receiving component
import { useLocation } from 'react-router-dom';

function UserDetails() {
  const location = useLocation();
  const user = location.state?.user;
  
  if (!user) {
    return <Navigate to="/users" replace />;
  }
  
  return <div>{user.name}</div>;
}
```

### Navigation with Query Parameters

```jsx
import { useNavigate, useSearchParams } from 'react-router-dom';

function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };
  
  const currentQuery = searchParams.get('q');
  
  return <div>{/* search interface */}</div>;
}
```

### Nested Routes Navigation

```jsx
import { Link, Outlet } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <nav>
        <Link to="overview">Overview</Link>
        <Link to="analytics">Analytics</Link>
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}

// Routes configuration
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="overview" element={<Overview />} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="settings" element={<Settings />} />
</Route>
```

---

## Summary

- **`<Link>`** → Declarative navigation for UI elements
- **`useNavigate`** → Imperative navigation for event handlers and logic
- **`<Navigate>`** → Declarative redirects in render logic

Choose the right tool based on **where** and **how** you need to navigate. When in doubt, use `<Link>` for UI and `useNavigate` for logic.
