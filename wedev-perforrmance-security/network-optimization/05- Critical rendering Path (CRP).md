## CRP

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5dcc9e5e-9cfb-4884-abed-b09f834e7785)


- The Critical Rendering Path is the sequence of steps the browser goes through to convert the HTML, CSS, and JavaScript into pixels on the screen.

- Optimizing the critical render path improves render performance. The critical rendering path includes the Document Object Model (DOM), CSS Object Model (CSSOM), render tree and layout.
- focusing on the process that browsers go through to convert HTML, CSS, and JavaScript into a visual display on the screen - essentially, how a webpage is constructed and displayed to the user

- The document object model is created as the HTML is parsed. The HTML may request JavaScript, which may, in turn, alter the DOM.
- The HTML includes or makes requests for styles, which in turn builds the CSS object model.
- The browser engine combines the two to create the Render Tree.
- Layout determines the size and location of everything on the page. Once layout is determined, pixels are painted to the screen. 



