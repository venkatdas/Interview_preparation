## React Portal

- React portal Is a feature provided by React that enables you to render components in a DOM node that exists outside the DOM hierarchy of the parent component .
- This is particularly useful for certain UI elements like modals, tooltips, popovers, or dropdowns.
- that need to visually break out of their parent container for styling or positioning purposes but still need to be logically part of the React component tree.
- This is particularly useful for when you need child components to break out of the DOM tree and be managed independently.

**Syntax**
- To create a React Portal, you use the ReactDOM.createPortal method, which takes two arguments:

- Child Component: The React component or JSX you want to render.
- Target DOM Node: A DOM element where the child should be rendered outside of its parent.


```js

// src/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null; // If the modal is not open, render nothing

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          Close
        </button>
        {children} {/* Render any content passed as children */}
      </div>
    </div>,
    document.getElementById('modal-root') // Target DOM node outside of normal hierarchy
  );
};

export default Modal;

```


```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Portal Modal Example</title>
  </head>
  <body>
    <div id="root"></div> <!-- Main React app will mount here -->
    <div id="modal-root"></div> <!-- This is the target node for our portal -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```


```js
// src/App.jsx
import React, { useState } from 'react';
import Modal from './Modal'; // Import the Modal component
import './App.css'; // Import the CSS styles for the app

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleOpenModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="App">
      <h1>Normal Modal Example</h1>
      <button onClick={handleOpenModal}>Open Modal</button>

      {/* Use the Modal component */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2>This is a Modal without using React Portal!</h2>
        <p>Modal content goes here.</p>
      </Modal>
    </div>
  );
};

export default App;
```

```js
/* src/Modal.css */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

.close-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  float: right;
}
```
