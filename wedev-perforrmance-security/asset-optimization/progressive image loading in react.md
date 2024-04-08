## Progressive image loading

- Implementing a progressive image in React involves loading a low-quality image placeholder first (LQIP) and then replacing it with a high-quality image once the larger image has fully loaded.
- This technique improves the perceived performance and user experience, especially on slow internet connections.

**How to acheive this**

```js
import React, { useEffect, useState } from 'react'

const ProgressiveImage = ({previewSrc, fullSrc,alt}) => {

    const [currentSrc,setCurrentSrc]= useState(previewSrc)
const [isLoading, setIsLoading] = useState(true);


  const customClass =
    previewSrc && fullSrc === previewSrc ? "loading" : "loaded";
    useEffect(()=>{
        const img = new Image();
        img.src= fullSrc
        img.onload=()=>{
          setTimeout(() => {
            setCurrentSrc(fullSrc);
            setIsLoading(false); // Set loading to false when the image is loaded
          }, 2000); // 2000 milliseconds = 2 seconds
        }
        return () => {
          img.onload = null; // Clear the onload event handler
          // If using setTimeout, clear it here as well
        };
    },[fullSrc])
  return (
    <div>
      <h1>ProgressiveImage</h1>
      <img
        src={currentSrc}
        alt={alt}
        className={customClass}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}

export default ProgressiveImage
```

```js
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProgressiveImage from './components/ProgressiveImage'

import mbHDQuality from "./images/mbHDQuality.jpg";
import mbSmallQuality from "./images/mbSmallQuality.jpg";

function App() {

  return (
    <>
      <ProgressiveImage previewSrc = {mbSmallQuality} fullSrc ={mbHDQuality} alt="maheshbabu" />
    </>
  );
}

export default App
```


```js
body {
  padding: 10px;
}

.loading {
  filter: blur(10px); /* applies a blur effect to the placeholder image, making it look out of focus. This is often used to make the low-quality aspect of the placeholder less noticeable. */
}

.loaded {
  /* removes the blur effect from the image once the high-quality version is loaded and applies a transition effect to the filter change. The transition: filter 0.5s linear; part means that the change in the filter (from blurred to un-blurred) will occur over 0.5 seconds in a linear fashion, creating a smooth visual transition. */
  filter: blur(0px);
  transition: filter 0.5s linear;
}
```



