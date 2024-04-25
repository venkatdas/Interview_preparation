- In React, a "pure component" is a specific type of component that optimizes performance by minimizing re-renders
- A React pure component only re-renders if the state or props have changed. This is determined by a shallow comparison of both props and state, making them more efficient in some scenarios.
- PureComponent is similar to Component but it skips re-renders for same props and state.
- Class components are still supported by React, but we don’t recommend using them in new code.

- PureComponent is a subclass of Component and supports all the Component APIs. Extending PureComponent is equivalent to defining a custom shouldComponentUpdate method that shallowly compares props and state.
- Example

```js
import React, { PureComponent } from 'react';

class UserProfile extends PureComponent {
  render() {
    console.log("Rendering UserProfile");
    const { name, age } = this.props;
    return (
      <div>
        <h1>User Profile</h1>
        <p>Name: {name}</p>
        <p>Age: {age}</p>
      </div>
    );
  }
}

class App extends React.Component {
  state = { name: 'John', age: 30 };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ age: 30 }); // This will not cause UserProfile to re-render
    }, 2000);
  }

  changeName = () => {
    this.setState({ name: 'Jane' });
  }

  render() {
    return (
      <div>
        <UserProfile name={this.state.name} age={this.state.age} />
        <button onClick={this.changeName}>Change Name</button>
      </div>
    );
  }
}

export default App;

```

**Functional component with react.memo**

- For functional components, React provides React.memo for a similar optimization. React.memo is a higher-order component that wraps a functional component, enabling it to only re-render when its props change.

```js
import React, { useState, useEffect } from 'react';

const UserProfile = React.memo(({ name, age }) => {
  console.log("Rendering UserProfile");
  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {name}</p>
      <p>Age: {age}</p>
    </div>
  );
});

function App() {
  const [name, setName] = useState('John');
  const [age, setAge] = useState(30);

  useEffect(() => {
    setTimeout(() => {
      setAge(30); // This will not cause UserProfile to re-render
    }, 2000);
  }, []);

  const changeName = () => {
    setName('Jane');
  };

  return (
    <div>
      <UserProfile name={name} age={age} />
      <button onClick={changeName}>Change Name</button>
    </div>
  );
}

export default App;

```
