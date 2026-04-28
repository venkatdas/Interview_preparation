# Ascendion Interview — Questions & Senior-Level Answers
**Date:** 28-04-2026  
**Role Target:** Lead / Senior MERN Stack Developer

---

## Q1. How many years of experience do you have in React, and what is your background?

**Senior-Level Answer:**

I have around 6+ years of hands-on experience with React, working across enterprise-scale healthcare, fintech, and SaaS products. My background spans the full MERN stack — React on the frontend with TypeScript, Redux Toolkit, and RTK Query for state management; Node.js and Express on the backend for REST and GraphQL APIs; and MongoDB and PostgreSQL for data persistence.

At the senior/lead level, I've moved beyond just building features. I've been responsible for frontend architecture decisions — choosing the right rendering strategy (CSR vs SSR vs SSG with Next.js), defining folder structures and component design patterns, setting up CI/CD pipelines on GitHub Actions and Azure DevOps, and driving performance improvements measured through Core Web Vitals and Lighthouse scores.

---

## Q2. You mentioned GraphQL — what exactly did you do with it in your projects?

**Senior-Level Answer:**

I led a migration from REST APIs to GraphQL for an enterprise healthcare application at GE Healthcare. The key problem we were solving was over-fetching — dashboards were pulling 15+ REST calls on load, returning far more data than components needed.

Here's what I specifically did:

- **Schema Design:** Defined the GraphQL schema — types, queries, mutations — collaborating with backend engineers to align on data contracts.
- **Resolver Implementation:** Built resolvers in Node.js, connecting to MongoDB and third-party REST APIs where needed, using DataLoader for N+1 query prevention (batching).
- **Apollo Client on Frontend:** Integrated Apollo Client in React. Configured in-memory caching, `fetchPolicy`, and query variables to avoid redundant network calls.
- **Authorization Middleware:** Added JWT-based auth middleware at the GraphQL layer, enforcing field-level permissions.
- **Persisted Queries:** Implemented persisted queries in production to reduce payload and prevent schema introspection attacks.

Result: API payload reduced by ~40%, network requests down ~35%, and initial dashboard load time improved by over 50%.

---

## Q3. What steps do you follow to improve performance in a React application?

**Senior-Level Answer:**

I treat React performance as a layered problem — rendering, network, and bundle. My approach:

**Rendering Layer:**
- Use `React.memo` to prevent re-renders of pure presentational components.
- `useMemo` for expensive derived computations, `useCallback` for stable function references passed as props.
- Avoid creating new object/array references inside render — causes child re-renders even if data is the same.
- For large lists — use `react-window` or `react-virtual` for virtualization, rendering only visible rows.

**Bundle Layer:**
- Code-splitting with `React.lazy` + `Suspense` — routes load on demand.
- Tree-shaking — avoid wildcard imports (`import * as _`).
- Analyze bundle with `webpack-bundle-analyzer` to catch bloated dependencies.

**Network Layer:**
- RTK Query or React Query for server state — automatic caching, deduplication, background refetch.
- Debounce or throttle API calls triggered by user input.
- Prefetch data for predictable navigation paths.

**Measurement:**
- Always profile first — React DevTools Profiler to find render bottlenecks.
- Lighthouse for Core Web Vitals (LCP, FID/INP, CLS).
- Real User Monitoring (RUM) in production.

Result: Achieved 60% reduction in frontend latency and passed Core Web Vitals thresholds in production.

---

## Q4. To what extent did you implement accessibility (WCAG) in your projects?

**Senior-Level Answer:**

Accessibility was a first-class concern, not an afterthought. Here's the depth I went to:

- **WCAG 2.1 AA Compliance:** All interactive elements — buttons, inputs, modals, tabs — had correct ARIA roles, labels (`aria-label`, `aria-labelledby`), and live regions (`aria-live`) for dynamic content updates.
- **Keyboard Navigation:** Full keyboard operability — focus trapping inside modals, logical tab order, visible focus indicators (`:focus-visible`), skip-to-content links.
- **Screen Reader Testing:** Manually tested with NVDA (Windows) and VoiceOver (macOS/iOS) to verify that dynamic state changes (form errors, notifications) were announced correctly.
- **Automated Auditing:** Used `axe-core` (integrated into Jest tests via `jest-axe`), the `axe` browser extension, and WAVE for audit coverage. Lighthouse accessibility score targeted 95+.
- **Process Integration:** Accessibility checks were part of the code review checklist — no PR merged without verifying new components met WCAG AA.

Result: Improved compliance from ~60% to 95%+ on a complex dashboard, reduced accessibility-related bug reports by 50%.

---

## Q5. Have you used any screen reader tools?

**Senior-Level Answer:**

Yes. I used NVDA on Windows and VoiceOver on macOS as part of manual accessibility testing. The specific scenarios I tested:

- Verifying `aria-live` regions announce form validation errors without requiring focus change.
- Ensuring modal focus trap works — screen reader users can't navigate outside an open modal.
- Testing dynamic data updates (like a data table refreshing) to confirm role changes and content updates are announced.
- Validating that custom components (dropdowns, date pickers) built from `div`s had correct ARIA patterns matching WAI-ARIA Authoring Practices Guide (APG).

Automated tools catch only ~30-40% of accessibility issues — manual screen reader testing is essential for the rest.

---

## Q6. What is a void element in HTML?

**Senior-Level Answer:**

A void element is an HTML element that is self-closing — it has no content model and cannot have child nodes. It does not need (and cannot have) a closing tag.

Examples: `<img>`, `<input>`, `<br>`, `<hr>`, `<meta>`, `<link>`, `<area>`, `<base>`, `<col>`, `<embed>`, `<param>`, `<source>`, `<track>`, `<wbr>`.

In HTML5, these are written as `<img>` (no slash needed). In JSX (React), they must be self-closed: `<img />` — because JSX follows XML syntax rules.

---

## Q7. What is the difference between CSS and SCSS?

**Senior-Level Answer:**

CSS is the native styling language of browsers — selectors, properties, and values. It has no variables (before CSS custom properties), no nesting, no reusable logic.

SCSS (Sassy CSS) is a superset of CSS — every valid CSS file is valid SCSS. It compiles down to plain CSS via a preprocessor (Sass). Key additions:

| Feature | CSS | SCSS |
|---|---|---|
| Variables | `--color: red` (custom props) | `$color: red` |
| Nesting | Not supported | Fully supported |
| Mixins | Not supported | `@mixin` + `@include` |
| Inheritance | Not supported | `@extend` |
| Functions | Limited | `@function`, `darken()`, `lighten()` |
| Partials / Imports | Basic | `@use`, `@forward` for modular architecture |

In large codebases, SCSS dramatically improves maintainability — you can structure styles into partials (`_buttons.scss`, `_typography.scss`), import them into a master file, and share variables/mixins across the entire app.

---

## Q8. What is the use of mixins in SCSS?

**Senior-Level Answer:**

A mixin is a reusable block of SCSS declarations that can be included anywhere. It's like a function for CSS.

```scss
// Define a mixin for flex center
@mixin flex-center($direction: row) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: center;
}

// Use it
.card {
  @include flex-center(column);
}

.navbar {
  @include flex-center(); // defaults to row
}
```

Mixins are ideal for:
- Vendor prefix patterns (`transform`, `transition`).
- Responsive breakpoints (a `respond-to($breakpoint)` mixin).
- Theming tokens shared across components.

The difference from `@extend`: mixins output duplicate CSS at each use site (good for parameterized logic), while `@extend` merges selectors (good for simple shared base styles but can cause specificity issues in large codebases).

---

## Q9. What is the difference between `display: flex` and `display: grid`?

**Senior-Level Answer:**

**Flexbox** (`display: flex`) is a **one-dimensional** layout model — you control alignment along one axis at a time (row OR column). Items flow in a single direction and wrap to the next line.

**Grid** (`display: grid`) is a **two-dimensional** layout model — you define rows AND columns simultaneously, placing items at precise intersections.

**When to use which:**

| Use Case | Choose |
|---|---|
| Navigation bar (items in a row) | Flexbox |
| Centering a single item | Flexbox |
| Card component's internal layout | Flexbox |
| Page-level layout (header, sidebar, main, footer) | Grid |
| Dashboard with rows and columns of widgets | Grid |
| Asymmetric or overlapping layouts | Grid |

In practice, they complement each other — Grid defines the page/section structure, Flexbox handles alignment inside each cell/component.

---

## Q10. What is the Virtual DOM? What is the difference between Virtual DOM and Shadow DOM?

**Senior-Level Answer:**

**Virtual DOM:**
The Virtual DOM is React's in-memory representation of the UI. When state changes, React:
1. Re-renders the component tree to a new Virtual DOM tree (in memory — no real DOM writes).
2. Diffs the new tree against the previous one (the "reconciliation" algorithm — React Fiber).
3. Computes the minimal set of changes needed.
4. Applies only those changes to the real DOM in a single batch.

This batching prevents costly reflow/repaint cycles on every state change.

**Shadow DOM:**
Shadow DOM is a native browser API for encapsulating a subtree of DOM nodes and their styles. It's used in Web Components. Styles inside a shadow tree don't leak out, and external styles don't leak in.

**Key Differences:**

| | Virtual DOM | Shadow DOM |
|---|---|---|
| Purpose | Performance optimization | Style/markup encapsulation |
| Managed by | JavaScript frameworks (React, Vue) | Native browser API |
| Styling | Global by default in React | Scoped by design |
| Relationship to real DOM | Mirrors it in memory | Creates isolated real DOM subtrees |

React does not use Shadow DOM. React's styles are global unless you use CSS Modules or CSS-in-JS.

---

## Q11. Does React provide isolated CSS by default?

**Senior-Level Answer:**

No. By default, React uses global CSS. If you import `styles.css` inside `Button.jsx`, those styles are injected globally and can affect any element on the page matching those selectors.

To achieve style isolation in React:

- **CSS Modules** (most common): `.module.css` files. Class names are hashed at build time (`Button_btn__3xY9z`), making them locally scoped. Zero runtime cost.
- **CSS-in-JS (styled-components / Emotion)**: Styles are written in JS, scoped to the component instance, support props-based dynamic styles and theming. Runtime cost.
- **Utility-first (Tailwind CSS)**: Avoids the scoping problem entirely — you compose utility classes, no custom class names needed.

In my projects, I use CSS Modules for component-level isolation and a global `_variables.scss` partial for shared tokens (colors, spacing, typography).

---

## Q12. What is `useEffect` and what are all its use cases?

**Senior-Level Answer:**

`useEffect` is React's escape hatch for side effects — operations that reach outside the React rendering pipeline.

**Signature:**
```javascript
useEffect(() => {
  // Effect logic
  return () => {
    // Cleanup (runs before next effect or on unmount)
  };
}, [dependency1, dependency2]); // Dependency array
```

**Dependency array behavior:**
- `[]` — runs once after initial mount (equivalent to `componentDidMount`).
- `[dep]` — runs after mount and whenever `dep` changes.
- Omitted — runs after every render (rarely what you want).

**All common use cases:**

1. **Data fetching** — fetch from API on mount or when filters change.
2. **Event listeners** — `window.addEventListener('resize', handler)` with cleanup `removeEventListener`.
3. **Subscriptions** — WebSocket connections, Firebase `onSnapshot`, RxJS observables.
4. **Timers** — `setInterval` / `setTimeout` with `clearInterval` cleanup.
5. **Document title / meta tags** — `document.title = pageTitle` after navigation.
6. **localStorage / sessionStorage** — persist user preferences after state change.
7. **Third-party library initialization** — D3, Chart.js, Google Maps that need a DOM node.
8. **Focus management** — programmatically focus an element after a modal opens.
9. **Aborting fetch requests** — use `AbortController`, cancel in cleanup to prevent state updates on unmounted components.
10. **Logging / analytics** — fire analytics events when a route or component mounts.

---

## Q13. What are dumb (presentational) and smart (container) components?

**Senior-Level Answer:**

This pattern (popularized by Dan Abramov) separates concerns within a component tree:

**Presentational Components (Dumb):**
- Concerned only with *how things look*.
- Receive all data and callbacks via props.
- No direct connection to Redux, Context, or APIs.
- Highly reusable and independently testable.
- Usually functional components with minimal or no local state.

```jsx
// Pure presentational component
const UserCard = ({ name, avatar, onFollow }) => (
  <div className={styles.card}>
    <img src={avatar} alt={name} />
    <h3>{name}</h3>
    <button onClick={onFollow}>Follow</button>
  </div>
);
```

**Container Components (Smart):**
- Concerned with *how things work*.
- Own state, fetch data, contain business logic.
- Connect to Redux/Context, handle side effects.
- Render presentational components, passing data via props.

```jsx
// Container component
const UserCardContainer = ({ userId }) => {
  const { data: user, isLoading } = useGetUserQuery(userId);
  const [follow] = useFollowUserMutation();

  if (isLoading) return <Spinner />;
  return <UserCard name={user.name} avatar={user.avatar} onFollow={() => follow(userId)} />;
};
```

**Modern note:** With hooks, this separation doesn't require two component files anymore. You can extract container logic into a custom hook (`useUserCard`) and keep a single component. But the principle of separating UI from data logic still applies.

---

## Q14. How do you handle synchronous errors in React?

**Senior-Level Answer:**

React provides **Error Boundaries** for catching rendering errors in the component tree. These are class components that implement `static getDerivedStateFromError()` (for state update) and `componentDidCatch()` (for logging).

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Send to monitoring service (Sentry, Datadog, etc.)
    errorMonitoring.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <Dashboard />
</ErrorBoundary>
```

**What Error Boundaries catch:**
- Errors thrown during rendering.
- Errors in lifecycle methods.
- Errors in constructors of child components.

**What they do NOT catch:**
- Async errors (inside `setTimeout`, `fetch().catch()`, event handlers).
- Errors inside the Error Boundary itself.

For async errors, use `try/catch` inside `useEffect` or async event handlers.

```javascript
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (!res.ok) throw new Error('Request failed');
      setData(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };
  fetchData();
}, []);
```

---

## Q15. How do you fetch and display API data in React using `useEffect` and `useState`?

**Senior-Level Answer:**

```jsx
import React, { useState, useEffect } from 'react';

export default function CommentList() {
  const [comments, setComments] = useState([]);  // Stores fetched data
  const [loading, setLoading]   = useState(true); // Loading indicator
  const [error, setError]       = useState(null); // Error state

  useEffect(() => {
    // Use AbortController for cleanup — prevents state update on unmounted component
    const controller = new AbortController();

    const fetchComments = async () => {
      try {
        const res = await fetch(
          'https://jsonplaceholder.typicode.com/comments',
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        if (err.name !== 'AbortError') {   // Ignore cancellation errors
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();

    return () => controller.abort(); // Cleanup on unmount
  }, []); // Empty array = run once on mount

  if (loading) return <p>Loading...</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <ul>
      {comments.slice(0, 10).map(comment => (
        <li key={comment.id}>
          <strong>{comment.name}</strong>: {comment.body}
        </li>
      ))}
    </ul>
  );
}
```

**Why separate `useState` hooks, not one object:**
- Updating one doesn't risk overwriting others (no spread needed).
- Cleaner, more readable code.
- React batches multiple `setState` calls inside async functions in React 18 automatically.

---

## Q16. What is React Context and how do you use `createContext` and `Provider`?

**Senior-Level Answer:**

Context solves prop drilling — passing data through many component layers when only a leaf component needs it.

```jsx
import React, { createContext, useContext, useState } from 'react';

// 1. Create the context with a default value
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

// 2. Create a Provider component that owns the state
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () =>
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. Custom hook for consuming the context (encapsulates useContext)
export function useTheme() {
  return useContext(ThemeContext);
}

// 4. Usage in any nested component
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header data-theme={theme}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
}

// 5. Wrap at the appropriate level
function App() {
  return (
    <ThemeProvider>
      <Header />
    </ThemeProvider>
  );
}
```

**Common pitfalls (and interview-worthy points):**
- Every consumer re-renders when the context value changes. For large-scale apps, split contexts by update frequency (e.g., UserContext vs ThemeContext vs CartContext).
- For complex state, combine Context with `useReducer` instead of `useState` — similar to a lightweight Redux.
- Context is not a state management library — it solves distribution, not optimization. For high-frequency updates (animation, real-time data), use Zustand or Redux.

---

## Q17. How do you set up routing in React? How do you handle dynamic routes and query parameters?

**Senior-Level Answer:**

Using React Router v6:

**Basic Setup:**
```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/articles">Articles</Link>
      </nav>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/articles"   element={<ArticleList />} />
        <Route path="/articles/:id" element={<ArticleDetail />} /> {/* Dynamic */}
        <Route path="*"           element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Dynamic Route Parameters (`/articles/42`):**
```jsx
import { useParams } from 'react-router-dom';

function ArticleDetail() {
  const { id } = useParams(); // Reads ':id' from the URL path
  // Fetch article by id...
  return <div>Article ID: {id}</div>;
}
```

**Query Parameters (`/articles?page=2&sort=asc`):**
```jsx
import { useSearchParams } from 'react-router-dom';

function ArticleList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '1'; // Returns null if missing
  const sort = searchParams.get('sort') ?? 'desc';

  const nextPage = () =>
    setSearchParams({ page: String(Number(page) + 1), sort });

  return (
    <div>
      <p>Page: {page}, Sort: {sort}</p>
      <button onClick={nextPage}>Next Page</button>
    </div>
  );
}
```

**Key distinction:**
- `useParams` → reads path segments defined with `:param` in the route.
- `useSearchParams` → reads the query string (`?key=value`).

---

## Summary — Topics Covered

| # | Topic |
|---|---|
| 1 | Experience & Background |
| 2 | GraphQL — schema design, Apollo Client, resolvers, auth |
| 3 | React performance optimization |
| 4 | Accessibility (WCAG 2.1 AA) |
| 5 | Screen reader tools (NVDA, VoiceOver) |
| 6 | Void elements in HTML |
| 7 | CSS vs SCSS |
| 8 | SCSS Mixins |
| 9 | Flexbox vs CSS Grid |
| 10 | Virtual DOM vs Shadow DOM |
| 11 | CSS isolation in React |
| 12 | `useEffect` — all use cases |
| 13 | Presentational vs Container components |
| 14 | Error handling (Error Boundaries) |
| 15 | Data fetching with `useEffect` + `useState` |
| 16 | React Context API (`createContext`, `Provider`, `useContext`) |
| 17 | React Router v6 — static, dynamic routes, query params |
