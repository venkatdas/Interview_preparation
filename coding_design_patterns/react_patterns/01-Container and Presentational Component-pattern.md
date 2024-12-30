# Container and Presentation Pattern

## Description

The Container and Presentation pattern separates the concerns of logic (data fetching, state management) and UI rendering. This makes components easier to maintain, test, and reuse.

## Example Implementation

### Container Component

```jsx
// UserContainer.js
import React, { useEffect, useState } from "react";
import UserList from "./UserList";

const UserContainer = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return <UserList users={users} />;
};

export default UserContainer;
```

### Presentation Component

```jsx
// UserList.js
import React from "react";

const UserList = ({ users }) => (
  <ul>
    {users.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);

export default UserList;
```

## Advantages

1. **Separation of Concerns**: Logic and UI are decoupled, making the components more reusable.
2. **Testability**: Easier to test logic in isolation without rendering the UI.
3. **Reusability**: Presentation components can be reused in different contexts.

## Usage

1. Use the container component to handle data fetching, state, and business logic.
2. Use the presentation component to focus solely on rendering the UI.

## Folder Structure

```
src/
  components/
    UserContainer.js
    UserList.js
```
