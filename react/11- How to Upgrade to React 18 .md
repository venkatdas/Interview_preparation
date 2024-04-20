## How to Upgrade to React 18

-  React 18 introduces features powered by our new concurrent renderer, with a gradual adoption strategy for existing applications.


**1. Installing** 

- To install the latest version of React:

`npm install react react-dom`



**2. Adopt New Root API**

- React 18 introduces a new root API which is necessary to take advantage of the new features like **concurrent rendering**. Replace the old root rendering code with the new createRoot API.

  **Before (React 17 and earlier):**

```js
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```

**After (React 18):**

```js
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

```


**3. Opt-In for Concurrent Features**

- React 18's concurrent features are opt-in and can be leveraged to improve performance.
- You can start experimenting with these features, like startTransition for updating state transitions without blocking user interactions.




**4. Test for Deprecated Features**
- React 18 deprecates certain features and patterns. Check the React 18 upgrade guide or release notes for specific deprecations.
- It's important to modify or remove deprecated code to ensure compatibility and functionality.


**5. Update Third-Party Libraries**
- Ensure all third-party libraries used in your project are updated and compatible with React 18.
- Incompatible libraries can cause issues with rendering or performance.

**6. Test Thoroughly**
- Before fully deploying React 18 in production, test your application thoroughly.
- Look for any runtime errors or deprecated warnings in the console.
- Testing can be done using unit tests, integration tests, or end-to-end tests to ensure everything works as expected.

**7. Consider Using New Features**

**8.Deploy**





Migration URL: https://medium.com/@shriharim006/step-by-step-guide-migrating-your-react-applications-to-version-18-46d4ebca5b02
