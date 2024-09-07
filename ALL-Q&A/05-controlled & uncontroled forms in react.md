**Controlled vs Uncontrolled**

1. Controlled Forms


- In controlled forms, form data is handled by the React component's state. React components act as the "single source of truth" for form data.
- This gives you full control over the form data and allows for real-time validation,formatting, dynamic field updates, and more.

**How Controlled Forms Work:**
- Each form element like input,textarea,select has a value attribute that is bound to a state variable.
- The onChange handler is used to update the state whenever the user makes changes to the input fields.






```js
import React, { useState } from "react";

const ControlledForms = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  //   const [name, setName] = useState("");
  //   const [show, setShow] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(e);
    console.log(formData);
    // formData("");
    setFormData({ name: "", email: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  //   const handleButtonClick = () => {
  //     setShow(name);
  //   };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="">
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label htmlFor="">
        Email:{" "}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
    // <div>
    //   <input
    //     type="text"
    //     name="name"
    //     value={name}
    //     onChange={(e) => setName(e.target.value)}
    //   />

    //   <button onClick={handleButtonClick}>submit</button>
    //   {show && (
    //     <div>
    //       <h3>Submitted Text:</h3>
    //       <p>{show}</p>
    //     </div>
    //   )}
    // </div>
  );
};

export default ControlledForms;
```



**Uncontrolled Forms**

- Uncontrolled forms are those where form data is handled by the DOM itself, instead of being fully controlled by React.
- In this case, React references the form elements directly and uses refs to access their current values.

```js
import React, { useRef } from 'react';

const UncontrolledForm = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    console.log('Form submitted:', { name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        ref={nameRef}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        ref={emailRef}
        placeholder="Email"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UncontrolledForm;
```
