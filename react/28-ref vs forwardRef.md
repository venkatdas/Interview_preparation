## ref and forardRef

- In React, the terms "ref" and "forward ref" refer to techniques used to directly access DOM nodes or React components from within the component tree.
- They're often used when you need to manage focus, select text, or perform animations


```js
import React, { useEffect } from "react";
import { useRef } from "react";

const UseRef = () => {
  const data = useRef(null);

  // const formSubmit =(e)=>{
  //   e.preventDefault();
  //   console.log(data.current.value);
    
  // }

  const buttonClick=()=>{
    data.current.focus()
  }



  // useEffect(()=>{
  //   data.current.focus()
  // },[])
  return (
    // <form onSubmit={formSubmit}>
    //   <center>
    //     <h1>UseRef</h1>
    //     <input ref={data} type="text" placeholder="Enter a name" />
    //     <br />
    //     <input type="submit" />
    //   </center>
    // </form>

    <div>
      <h1>useRef for Focusing Element</h1>

      <input type="text" ref={data} />
      <button onClick={buttonClick}>Focus the input</button>
    </div>
  );
};

export default UseRef;
``` 

