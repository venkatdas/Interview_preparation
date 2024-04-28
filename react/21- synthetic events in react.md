## synthetic events in react

- Synthetic events in React are objects that act as wrappers around the browser's native events. This system provides a consistent interface for handling events across different browsers,
- ensuring that your React components have a predictable behavior regardless of the underlying browser's implementation.

- Its API is same as the browser's native event, **including stopPropagation() and preventDefault(),** except the events work identically across all browsers.
- The native events can be accessed directly from synthetic events using nativeEvent attribute.

```js
function App() {
  const handleCLick=(e)=>{
    console.log("event",e);
    

  }
 return (
   <div>
     <h1>Synthetic events</h1>
     <button onClick={handleCLick}>CLICK ME</button>
   </div>
 );
}
```
