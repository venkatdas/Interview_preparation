- The children prop in React is a special property that is used to pass components as data to other components, making it a powerful tool for creating reusable and composable components.
- just like any other prop you use. Component tree put between component's opening and closing tag will be passed to that component as children prop.

**Defining component with children**
```js
const Card = ({ children }) => {
    return <div className="card">{children}</div>;
};
```
**using the component**

```js
const App = () => {
    return (
        <Card>
            <h1>Title</h1>
            <p>This is some text inside a card.</p>
        </Card>
    );
};
```
