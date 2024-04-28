## synthetic events in react

- Synthetic events in React are objects that act as wrappers around the browser's native events. This system provides a consistent interface for handling events across different browsers,
- ensuring that your React components have a predictable behavior regardless of the underlying browser's implementation.

- Its API is same as the browser's native event, **including stopPropagation() and preventDefault(),** except the events work identically across all browsers.
- The native events can be accessed directly from synthetic events using nativeEvent attribute.

```js
function App() {
  const handleCLick=(e)=>{
    console.log("event",e);
    

  }
 return (
   <div>
     <h1>Synthetic events</h1>
     <button onClick={handleCLick}>CLICK ME</button>
   </div>
 );
}
```

___________________

- **In React, the term "pooling" refers to the practice of reusing objects, specifically event objects, to manage memory and performance more efficiently. When React handles an event, it creates a synthetic event object that wraps the native browser event. However, instead of creating a new synthetic event object for every event that occurs, React uses a pool of synthetic event objects.**

- **Pooling:** To improve performance, React reuses synthetic event objects in a pooling mechanism. Once the event callback has been executed, its properties are nullified and the event is returned to the pool. This can lead to bugs if you try to use the event asynchronously without calling event.persist() to remove the event from the pool.


```js
import React from 'react';

function EventExample() {
  const handleClick = (event) => {
    console.log(event.type); // This will work and log 'click'
    
    setTimeout(() => {
      console.log(event.type); // This might not work; it will log null
    }, 1000);
  };

  return (
    <button onClick={handleClick}>Click me</button>
  );
}

export default EventExample;
```

- In this example, handleClick logs the event type immediately when the button is clicked, which works fine. However, it also tries to log the event type after a delay (using setTimeout). Because React pools and reuses event objects, by the time the setTimeout callback executes, the event object's properties have already been cleared, and event.type returns null.

**How to fix this with event.persist()**

```js
import React from 'react';

function EventExample() {
  const handleClick = (event) => {
    event.persist(); // This removes the event from the pool
    console.log(event.type); // This will work and log 'click'
    
    setTimeout(() => {
      console.log(event.type); // This will now work as expected and log 'click'
    }, 1000);
  };

  return (
    <button onClick={handleClick}>Click me</button>
  );
}

export default EventExample;
```

- By calling event.persist(), the event is removed from the pool, and its properties are no longer nullified after the event handler finishes executing. This allows you to use the event object asynchronously without encountering issues due to React's event pooling.

