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

**Same example we can modify into an authentication**



```js
import { useState } from "react";

const Hoc = (Component) => {
  return function (props) {
    const [login, setIslogin] = useState(true);
    return (
      <div>
        {login?<Component name="Hey Joe"/>:<h1>Logged Out</h1>}
      </div>
    );
  };
};

export default Hoc;
```

```js
import "./App.css";
import Hoc from "./components/Hoc";
function App({ name }) {
  return (
    <div>
     <h1>Welcome to the User {name}</h1>
    </div>
  )
}

export default Hoc(App);
```

- If login is false ; will get 
![image](https://github.com/venkatdas/Interview_preparation/assets/43024084/97892e18-c1c3-4a9b-8dc8-d72c2d89f98d)

- else will get result 

![image](https://github.com/venkatdas/Interview_preparation/assets/43024084/0e40b83c-4178-459a-ac3c-e2a3d1507fcf)
