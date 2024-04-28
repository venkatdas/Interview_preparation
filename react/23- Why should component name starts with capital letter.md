-  React uses the capitalization convention to distinguish between user-defined components and HTML or DOM tags. For example, <div> represents an HTML div element, while <MyComponent> indicates a custom component. This distinction helps React understand what it should render as a standard web element and what it should treat as a custom component.

- If you are rendering your component using JSX, the name of that component has to begin with a capital letter otherwise React will throw an error as an unrecognized tag.
- This convention is because only HTML elements and SVG tags can begin with a lowercase letter.

```js
function SomeComponent {
  // Code goes here
}
```
- You can define function component which name starts with lowercase letter, but when it's imported it should have capital letter. Here lowercase is fine:

```js
function myComponent {
  render() {
    return <div />;
  }
}

export default myComponent;
```

-  While when imported in another file it should start with capital letter:

`import MyComponent from "./myComponent";`
