## Higher Order Component

- According to React’s documentation, a typical React HOC has the following definition:

- A higher-order component is a function that takes in a component and returns a new component.
- Essentially, HOCs are used to share common functionality between components without repeating code. They can be used for a variety of tasks such as data fetching, manipulating props, and state abstraction.


// HOC Component
 ```js
import { useState } from "react";

const Hoc = (Component) => {
  return function (props) {
    const [name, setName] = useState("Manas");

    const ResultFunc = (e) => {
      setName(e.target.value);
    };
    return (
      <div>
        <Component name={name} onChange={ResultFunc} {...props} />
      </div>
    );
  };
};

export default Hoc;

```

// Utilizing this HOC in App.js

```js
import "./App.css";
import Hoc from "./components/Hoc";
function App({ name, onChange }) {
  return (
    <div>
      <h1>Name:{name}</h1>
      <input value={name} onChange={onChange} />
    </div>
  )
}

export default Hoc(App);

```


