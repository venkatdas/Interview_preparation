## Portals in React

- Portal is a recommended way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.
- This is particularly useful for components like modals, tooltips, and dropdowns, which you might need to render in a different part of the DOM to prevent CSS overflow issues or to avoid unwanted parent styling.
- In React 16.0 version, React portals were introduced. Portals in React come up with a way to render children components into a DOM node which typically occurs outside the DOM hierarchy of the parent component.

- Before React Portals, It was very difficult to render the child component outside the hierarchy of its parent component. Every single React component in the React application falls under the root element.
- But, the React portal concept provides us the ability to break out of this dom tree and render a component onto a dom node that is not under this root element. Doing so breaks the convention where a component needs to be rendered as a new element and follows a parent-child hierarchy.
- **Portals are commonly used in modal dialog boxes, hover cards, loaders, and popup messages.**

**Syntax:**

`ReactDOM.createPortal(child, container)`

- Parameters:

- child: It can be a React element, string, or fragment
- container: It is a DOM node.


- In the syntax above, we have two parameters the first parameter is a child that can be a React element, string, or fragment and the second one is a container which is the DOM node (or location) lying outside the DOM hierarchy of the parent component at which our portal is to be inserted.


