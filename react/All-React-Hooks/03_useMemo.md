## useMemo 

- This is the custom hook in react.
- useMemo is a React hook that memoizes the result of a function. It's part of React's Hooks API, introduced in React 16.8,
- which allows you to use state and other React features without writing a class.
- useMemo is used to optimize performance by memoizing expensive calculations.

Simply

- when same task repeated again and again , it will cache the result .

- How useMemo Works
- useMemo takes two arguments:

**Create function:** A function that returns the value you want to memoize.
**Dependencies array:** An array of dependencies that, when changed, will cause the memoized value to be recalculated.




