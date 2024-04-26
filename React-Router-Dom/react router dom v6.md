## SPA

- A single web page that runs in the browser and looks and functions like a multiple page application.



## Routing

- Routing is the process of navigating users between different parts of the application when they visit a specific url.



## Routing features

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/cb22083e-41e9-4e57-ab64-1d95093db154)


**wHAT IS Route?**
- Instructs react router to create a new route and render specifc elements to the page whenever the current URL matches a given path.
- Routes component manages all the routes in the app.


```js
 <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Routes>
```

 
**Link vs NavLink**


**LINK**
- Purpose: The <Link> component is used to create links that allow users to navigate around the application. It's the basic component for routing without any extra features.
- Usage: It changes the URL and keeps the browser history in sync without reloading the page.


```js
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}

```
**NavLink**


- Purpose: <NavLink> is a special version of the <Link> that can apply active styling to the link when it matches the current route. This is particularly useful for navigation menus where you want to highlight the current active page or section.
- Active Styling: <NavLink> can take extra props like activeClassName or activeStyle to style the component when it matches the current route.
- Usage: Like <Link>, it changes the URL without reloading the page but adds the capability to style the active link.

**Outlet**

- In React Router, an Outlet is a component that renders whatever child route is currently active. It acts as a placeholder within a component's render output for any child routes defined in the routing configuration.
- Outlets are particularly useful in scenarios where you have nested routes, allowing you to set up a layout at a top level that persists across multiple child routes.































