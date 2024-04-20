## Fragments and why it is useful

- React Fragments are a feature in React that allow you to group a list of children without adding extra nodes to the DOM.


  - Fragments in React can be declared in a few different ways:
**Using <React.Fragment>**

- This is the explicit syntax for defining a Fragment.
- It supports keys, which is useful when you need to render a list of items.
```js
<React.Fragment>
  <ChildA />
  <ChildB />
  <ChildC />
</React.Fragment>

```

**Using the Short Syntax**

```js
<>
  <ChildA />
  <ChildB />
  <ChildC />
</>

```
**Why Are Fragments Useful?**

1. Avoiding Extra DOM Nodes:
2.  Keyed Fragments:
3. Cleaner Component Trees:
4. Performance Improvement:  By reducing the number of nodes in the DOM, Fragments can help in minimizing the DOM footprint of an application. Fewer DOM nodes mean faster re-painting and re-flowing, improving the performance, especially in complex applications.



**Example**

```js
function Table() {
  return (
    <table>
      <tbody>
        <React.Fragment>
          <tr><td>Row 1</td></tr>
          <tr><td>Row 2</td></tr>
          <tr><td>Row 3</td></tr>
        </React.Fragment>
      </tbody>
    </table>
  );
}

```

