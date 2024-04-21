## Life cycle methods in react


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/ec52581a-dad3-4fce-bd0e-96f8b95cbf80)


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/40139aaf-4b8b-4cf6-8e6e-f7dea2cf0cac)


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/c29b3f76-68e6-4a15-93bb-6019a3959068)





- React components also follow a cycle. They are created (mounted), they are grown(updated), and they die (unmounting).This is nothing but called a component lifecycle.
- A React component has three different phases in its lifecycle, including mounting, updating, and unmounting.


## Mounting Phase

- The mounting phase is when a new component is created and it is inserted into the DOM
- or, in simple words, when the actual life of a React component begins.
- This happens once, and is often called “initial render.”
- To get through this phase, four lifecycle methods are called: constructor, static getDerivedStateFromProps, render, and componentDidMount.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/b2ce7d85-bef3-4a36-b8a8-d6334f8e5e0d)


**The Constructor Method()**

- The constructor method is the very first method called during the mounting phase.
- This method is mostly used for **initializing the state of the component and binding the event-handler methods** which will be used within the component.
- The constructor method is called when the component is initiated, but before it’s rendered.
- Note that if you want any state in your component, it’s important you call the super(props) function with the props as an argument passed to it within the constructor.

**The static getDerivedStateFromProps() method**
- getDerivedStateFromProps is invoked right before calling the render method, both on the initial mount and on subsequent updates. It should return an object to update the state, or null to update nothing.
- After initializing, the next function that is called is static getDerivedStateFromProps().
- This method allows a component to update its states based on changes to its props.
- It is very rarely used and should be used with caution as it can cause many errors. The general rule as a beginner, you probably don’t need it and should avoid using it.
- This method is used to modify the state value with any props value. The method static getDerivedStateFromProps() accepts two arguments: props and state, and returns an object, or null if no change is needed. 
- These values are passed directly to the method, so there’s no need for it to have access to the instance of the class (or any other part of the class) and thus is considered a static method.

**The Render Method()**
- The render method is the only required method for a class-based React component. It’s called after the getDerivedStateFromProps() method and actually renders or inserts all HTML into the DOM.
- Typically, the render method returns the JSX which will eventually be rendered, but it can also return other values.
- The render() function should be pure, meaning that it does not modify component state, it returns the same result each time it’s invoked, and it does not directly interact with the browser.  or any other kind of side effect like sending an HTTP request in the render method.
- Just think of it as writing HTML, but of course as JSX.

- **Note:** If you need to interact with the browser, perform your work in componentDidMount() or the other lifecycle methods instead.

**The componentDidMount() method**
 
- The componentDidMount() method is executed immediately after the component is rendered for the first time that is after the first render() cycle.
- This method is mostly used to handle all the network requests such as API calls or to set up all the major subscriptions of the application.
- Generally, componentDidMount() is a good place to do all the setup you couldn’t have done without the DOM.


**Example of Mounting phase**

```js
import { Component } from "react";


class LifeCycleMethods extends Component{

 constructor(props) {
      super(props);
      console.log('Constructor called');
      this.state = {
        count: 0
      };
    }
  
    static getDerivedStateFromProps(props, state) {
      console.log('getDerivedStateFromProps called');
      return null;
    }
  
    componentDidMount() {
      console.log('componentDidMount called');
    }
  
    incrementCount = () => {
      this.setState(prevState => ({
        count: prevState.count + 1
      }));
    };
  
    render() {
      console.log('render called');
      return (
        <div>
          <h1>Counter App</h1>
          <p>Count: {this.state.count}</p>
          <button onClick={this.incrementCount}>Increment</button>
        </div>
      );
    }

    
}

export default LifeCycleMethods
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/72b08731-8de7-41b2-999d-772b92b2592d)

- In this example, Notice my console is empty, as soon as I refresh the page, there are some console messages because the app is re-rendered. Following is the explanation,

1. First message to the console to indicate that the constructor has been called. It also initializes the component’s state with a count property set to 0.
2. Second message to the console to indicate that getDerivedStateFromProps has been called. However, in this particular example, it returns null, indicating that there are no updates to the state based on the props
3. The third message to the console to indicate that render has been called. It renders all HTML and displays the current count from the component’s state, and a button with an onClick event handler that calls the incrementCount method.
4. Fourth message to the console to indicate that componentDidMount has been called.
5. As you click the “Increment” button, the incrementCount method will update the state, triggering the updating phase of the React component lifecycle, which is a separate phase from the mounting phase, which also has methods like render and getDerivedStateFromProps.



## Updating phase

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/8d42f237-3bf8-4379-81bb-9b142b9c9634)

- The updating phase is when the component has any updates or it re-renders. This phase is triggered when the props or state are updated.
- It can also be triggered when a component consists of the following methods:
- static getDerivedStateFromProps(), shouldComponentUpdate(), render(), getSnapshotBeforeUpdate(), and componentDidUpdate().
- Since getDerivedStateFromProps() and render() they’ve been covered previously, this section focuses on the other three methods.
- 

**The shouldComponentUpdate method**


- This is also another rarely used lifecycle method. It’s specifically used for performance optimization.
- This method gives you control over whether or not a component should update due to a change in its props or state.
- By default, a component will always re-render when the state or prop is updated. This method can either return a true or false to determine if the component should be updated or not.
- Also, this method receives nextProps and nextState as arguments so you can always compare it with the component’s current prop and state values.

**The getSnapshotBeforeUpdate method**

- The getSnapshotBeforeUpdate() method is called right before the changes from the current update are applied to the DOM.
- The value you return from this method will be passed as the third parameter to the componentDidUpdate() method.
- This method is called after the render method, and before componentDidUpdate.This is also one of those methods that are rarely used.

**The componentDidUpdate Method**

- This method is the last one invoked in this phase. Like the previous method, it also receives the older props and state values as arguments but it also receives the return value getSnapshotBeforeUpdate() as a third argument (if present).
- It is typically used to make more fetch requests based on the condition of comparing the previous and current props and state values. Therefore, you may call setState but it should be within the conditional statement.


**Example**
- Let’s see a combined example of Updating phase. In this example, we will simply change the name of the Person from ‘India ’ to ‘USA’.


```js
import { Component } from "react";


class LifeCycleMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "India",
      changed: false,
    };
    console.log("Constructor called");
  }

  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps called");
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate called");
    return true;
  }

  getSnapshotBeforeUpdate(nextProps, nextState) {
    console.log("getSnapshotBeforeUpdate called");
    return null;
  }
  componentDidMount(){
    console.log("ComponentDidMount called");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate called");
  }

  changeName = () => {
    this.setState({
      name: "USA",
      changed: true,
    });
  };

  render() {
    console.log("render called");
    return (
      <div>
        <h1>Updating Example</h1>
        <div>
          Name{" "}
          {this.state.changed ? (
            <h3>{this.state.name}</h3>
          ) : (
            <p>{this.state.name}</p>
          )}
        </div>
        <button onClick={this.changeName}>Change Name</button>
      </div>
    );
  }
}

export default LifeCycleMethods
```
