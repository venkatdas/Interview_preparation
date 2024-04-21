## Class based components



- Class-based components in React are a way to create components using ES6 classes. Before the introduction of Hooks in React 16.8, class components were the primary method for creating components that could manage their own state and lifecycle. Here’s a deeper look into class-based components:

**1. Basic Structure**
- A class-based component in React extends React.Component and typically implements **at least a render() method,** which returns JSX. Here’s a basic example:


```js
import { Component } from "react";

class ClassBasedComponent  extends Component{
    render(){
        return(
            <h1>Basic Class Based component syntax</h1>
        )
    }
}

export default ClassBasedComponent
```


**2. State Management**

- Class components can have a local state to store data that affects the rendering of the component. The state is initialized in the constructor or as a class field, and can be modified using the setState method.


```js
import { Component } from "react";

class ClassBasedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default ClassBasedComponent;

```
