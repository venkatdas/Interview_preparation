# Render Props Pattern

## Description
The Render Props pattern is a technique for sharing logic between components using a prop whose value is a function. This allows components to dynamically determine what to render.

## Why Do We Need It?
1. **Reusability**: Share logic without duplicating code or using inheritance.
2. **Flexibility**: Provides dynamic rendering capabilities based on the logic provided.
3. **Alternative to HOCs**: Offers a cleaner approach to sharing logic compared to Higher-Order Components.

## Simple Example

### Render Props Component
```jsx
// DataFetcher.js
import React, { useEffect, useState } from 'react';

const DataFetcher = ({ render, url }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [url]);

  return <div>{render(data)}</div>;
};

export default DataFetcher;
```

### Using the Render Props Component
```jsx
// App.js
import React from 'react';
import DataFetcher from './DataFetcher';

const App = () => {
  return (
    <div>
      <h1>Users</h1>
      <DataFetcher 
        url="https://jsonplaceholder.typicode.com/users" 
        render={(data) => (
          data ? (
            <ul>
              {data.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )
        )}
      />
    </div>
  );
};

export default App;
```

## Real-Time Example
- **Authentication Status**: Render different UI based on whether a user is logged in.
- **Feature Flags**: Dynamically render components or features based on configuration.

### Authentication Example
```jsx
// AuthProvider.js
import React, { useState } from 'react';

const AuthProvider = ({ render }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <div>
      {render(isLoggedIn, toggleLogin)}
    </div>
  );
};

export default AuthProvider;
```

### Using AuthProvider
```jsx
// App.js
import React from 'react';
import AuthProvider from './AuthProvider';

const App = () => {
  return (
    <AuthProvider 
      render={(isLoggedIn, toggleLogin) => (
        <div>
          {isLoggedIn ? (
            <p>Welcome back! <button onClick={toggleLogin}>Logout</button></p>
          ) : (
            <p>Please log in. <button onClick={toggleLogin}>Login</button></p>
          )}
        </div>
      )}
    />
  );
};

export default App;
```

## Advantages
1. **Encapsulation**: Encapsulates state and behavior in one component while allowing customization of rendering.
2. **Dynamic Rendering**: Enables dynamic rendering logic to be passed as a function.
3. **Testability**: Simplifies testing by isolating logic from rendering.

## Where Is It Used in Real Time?
- **Tooltips**: Dynamically render tooltips based on mouse position.
- **Forms**: Share validation logic across multiple form fields while rendering different UI elements.
- **Charts**: Track user interactions like mouse movement to update chart data dynamically.
- **Authentication**: Dynamically render UI based on login status.

## Folder Structure
```
src/
  components/
    DataFetcher.js
    AuthProvider.js
  App.js
```
