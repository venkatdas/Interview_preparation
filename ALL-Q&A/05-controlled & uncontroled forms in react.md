**Controlled vs Uncontrolled**

1. Controlled Forms


- In controlled forms, form data is handled by the React component's state. React components act as the "single source of truth" for form data.
- This gives you full control over the form data and allows for real-time validation,formatting, dynamic field updates, and more.

**How Controlled Forms Work:**
- Each form element (like <input>, <textarea>, <select>) has a value attribute that is bound to a state variable.
- The onChange handler is used to update the state whenever the user makes changes to the input fields.


- Example

```js
import React, { useState } from "react";

const ControlledForms = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
 
  const handleSubmit = (e) => {
    e.preventDefault();
   
    console.log(formData);
  
    setFormData({ name: "", email: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


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
  );
};

export default ControlledForms;
```
