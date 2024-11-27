## synthetic events in react


**Why React needs Synthetic Events**

**What is a Synthetic Event?**
- React creates a SyntheticEvent to wrap around the browser's native event. This ensures that the events work consistently across all browsers.
- It mimics the native event's behavior while adding some optimizations.
- Browsers like Chrome, Firefox, or Safari handle events in slightly different ways.
- React wants to make your life easier, so it wraps the browser's native event (the original event) in a Synthetic Event.

- A SyntheticEvent:

- Simplifies event handling so React code works the same in all browsers.
- Optimizes performance so React can handle events efficiently


```js

import React from 'react';

function App() {
  const handleClick = (event) => {
    console.log("Button clicked!");
    console.log("Event type:", event.type); // 'click'
    console.log("Native event:", event.nativeEvent); // Original event
  };

  return (
    <div>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}

export default App;

```

### Output


- What happens here?
- You click the button.

- This triggers a browser event called a native event.
- React creates a SyntheticEvent.

- React takes the browser's event and "wraps" it in a SyntheticEvent.
- The event you see in the handleClick function is the SyntheticEvent.
- You use the SyntheticEvent.

- React gives you an easy-to-use event object. You can check details like the event type (click, keydown, etc.) or the button clicked


- Cross-browser Compatibility: You don’t need to worry about how different browsers handle events

_____________________________________________________________________

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

_____________________________________



**What is Event Pooling?**

- React reuses the same SyntheticEvent object across multiple events to improve performance.
- This is called event pooling. Instead of creating a brand-new event object every time, React resets and reuses the same object.


**Why Use Event Pooling?**
- Performance: Creating new objects for every single event (like clicks, inputs, etc.) can slow things down, especially in apps with a lot of interactions.
- Memory Efficiency: Reusing the event object reduces memory usage.

