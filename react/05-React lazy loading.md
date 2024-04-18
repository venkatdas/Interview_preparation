## Lazy loading in react

- Lazy loading in a React application is a technique used to split your code into multiple bundles which are loaded on demand.
- This can significantly improve the performance of your app by reducing the initial load time, especially for large applications.

**1. Improves Initial Load Time**

- Lazy loading can significantly reduce the initial load time of applications by only loading the necessary pieces of content or code when they are actually required.
- This is particularly beneficial for large web applications and websites with lots of content or heavy scripts.


**2. Reduces Initial Bandwidth Usage**
- By loading only the required resources, lazy loading minimizes the amount of data transferred over the network initially.
- This can lead to reduced bandwidth usage which is especially important for users on limited or slow internet connections.

**3. Enhances User Experience**

- With faster load times and more responsive interactions from the start, users can begin interacting with the main content of an application or website more quickly.

**We can acheive this by React.lazy**

- React.lazy is a function that lets you load components lazily through dynamic imports. It works seamlessly with React.Suspense,
- which allows you to specify a loading indicator while waiting for the lazy component to load.

## 1. Dynamic Import


```js
import React from 'react'

const LazyLoad = () => {
  return (
    <div>LazyLoad Component , it will lazily loaded on to the screen</div>
  )
}

export default LazyLoad
```

```js
import React, { Suspense } from 'react';

//dynamic import
const LazyLoad= React.lazy(()=>import ('./components/LazyLoad'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyLoad />
    </Suspense>
  );
}

export default App;
```
## 2. Route-based Lazy Loading

- For applications using React Router, you can integrate lazy loading with routing. This is very effective as it loads components only when the route is accessed:

```js

const Home = () => {
  return (
    <div>Home</div>
  )
}

export default Home

//About.js

const About = () => {
  return (
    <div>About</div>
  )
}

export default About
```

```js
import React, {  Suspense } from "react";
import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


const Home = React.lazy(() => import("./components/Home"));
const About = React.lazy(() => import("./components/About"));


function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
```

