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

 
