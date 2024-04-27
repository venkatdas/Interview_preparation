## Prevent double execution of useEffect

- To prevent a useEffect hook from running twice in React, especially in strict mode during development
- In React's strict mode, useEffect runs twice on mount to help identify side effects that don't correctly clean up after themselves.
- This behavior only occurs in development mode; in production, useEffect runs only once as expected.

- **Conditional Execution Inside useEffect:**
- If you're dealing with expensive operations and want to avoid them running twice during development, you can add a condition to check if the effect should run.
