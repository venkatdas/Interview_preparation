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
