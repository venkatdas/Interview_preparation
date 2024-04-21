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
