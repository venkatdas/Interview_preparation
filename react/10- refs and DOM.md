## Ref , DOM

- In React, "refs" and the Document Object Model (DOM) play significant roles in managing and interacting with elements and components in a web application. 

- "Refs" in React provide a way to access DOM nodes or React elements created in the render method.
- They are used when you need direct access to a DOM element or a child component in order to manage focus, select text, or trigger animations. Refs can also be useful when integrating third-party DOM libraries.

**- When to use Refs**

- There are a few good use cases for refs:

- Managing state that should not trigger any re-render.

- Managing focus, text selection, or media playback.

- Triggering imperative animations.

- Integrating with third-party DOM libraries.


```js
import React, { useRef } from 'react';

function MyComponent() {
  const myRef = useRef(null);

  const focusTextInput = () => {
    myRef.current.focus();
  };

  return (
    <div>
      <input ref={myRef} type="text" />
      <button onClick={focusTextInput}>Focus the input</button>
    </div>
  );
}

```
