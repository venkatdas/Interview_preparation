## Props and State

1. Definition:


**Props (Properties):**

- Props are short for "properties" and are used to pass data from a parent component to a child component.
- They are read-only and immutable, meaning the child component receiving props cannot modify them directly.
- Props allow components to be reusable and configurable, making them flexible for different situations.
**State:**
- State is an object that holds data that can change over time and affects the rendering of a component.
- It is managed within the component (local to the component) and can be updated using setState (or useState in function components).
- State is mutable and allows components to manage and respond to user inputs, network responses, etc.
**2. Usage:**
**- Props:**
- Passed from a parent component to child components.
- Used for configuring or customizing the child component (like passing data, event handlers, etc.).
**Example:**
```js
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}
<Greeting name="Venkat" />
```


- Here, the name prop is passed to the Greeting component, and it is used to display dynamic content.
**State:**
- Used for dynamic data that the component can manipulate or respond to.
- Can be initialized and updated internally in the component using useState in function components or this.setState in class components.
Example:
```js
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```
- In this example, count is part of the state and is updated whenever the button is clicked.
**3. Who Manages Them:**
- Props: Managed by parent components and passed down to child components.
- State: Managed within the component where it is defined and can be updated locally.
**4. Immutability:**
- Props: Immutable – once a prop is passed to a child component, it cannot be modified by the child.
- State: Mutable – the component can update its own state using methods like setState (class) or useState (functional).
**5. Reusability:**
- Props: Used to make components reusable. You can pass different props to the same component to render different content.
- State: Specific to the component and does not make the component reusable in the same way props do.
**6. Where to Use:**
- Props: When you need to pass data or configurations between components.
- State: When the component needs to track and update its own data or behavior dynamically.
