## enable concurrent rendering


**The Concurrent rendering makes React apps to be more responsive by rendering component trees without blocking the main UI thread. 
It allows React to interrupt a long-running render to handle a high-priority event. i.e, When you enabled concurrent Mode, React will keep an eye on other tasks that need to be done, and if there's something with a higher priority it will pause what it is currently rendering and let the other task finish first. 
You can enable this in two ways,**

- To enable concurrent rendering in React, you can utilize features introduced in React 18 and later versions, such as concurrent mode.
- Concurrent mode allows React to work on multiple tasks simultaneously, improving the responsiveness and perceived performance of your application.


  **Here are the steps to enable concurrent rendering in React:**
  1) Upgrade to React 18:
  2) Enable Concurrent Mode: Concurrent mode is opt-in, meaning you need to explicitly enable it for your application. You can do this by wrapping your root component with the


```js
import { unstable_createRoot } from 'react';

const root = unstable_createRoot(document.getElementById('root'));
root.render(<App />);
```
 
