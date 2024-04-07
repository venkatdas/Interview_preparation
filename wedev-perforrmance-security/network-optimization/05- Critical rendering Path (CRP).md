## CRP

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5dcc9e5e-9cfb-4884-abed-b09f834e7785)


- The Critical Rendering Path is the sequence of steps the browser goes through to convert the HTML, CSS, and JavaScript into pixels on the screen.

- Optimizing the critical render path improves render performance. The critical rendering path includes the Document Object Model (DOM), CSS Object Model (CSSOM), render tree and layout.
- focusing on the process that browsers go through to convert HTML, CSS, and JavaScript into a visual display on the screen - essentially, how a webpage is constructed and displayed to the user

- The document object model is created as the HTML is parsed. The HTML may request JavaScript, which may, in turn, alter the DOM.
- The HTML includes or makes requests for styles, which in turn builds the CSS object model.
- The browser engine combines the two to create the Render Tree.
- Layout determines the size and location of everything on the page. Once layout is determined, pixels are painted to the screen. 


**Document Object Model**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/c842bae4-6d29-4863-9383-10500c57bfda)



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/2a031890-baa8-45be-8a27-607344e1b1ef)


- DOM construction is incremental. The HTML response turns into tokens which turns into nodes which turn into the DOM Tree.
- A single DOM node starts with a startTag token and ends with an endTag token. Nodes contain all relevant information about the HTML element.
- The information is described using tokens. Nodes are connected into a DOM tree based on token hierarchy.
- If another set of startTag and endTag tokens come between a set of startTag and endTags, you have a node inside a node, which is how we define the hierarchy of the DOM tree.

- The greater the number of nodes, the longer the following events in the critical rendering path will take

**CSS Object Model**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/59956e20-d481-4759-bdd3-6dbe2857fd2c)

- The DOM contains all the content of the page. The CSSOM contains all the information on how to style the DOM. CSSOM is similar to the DOM, but different. While the DOM construction is incremental, CSSOM is not.
- **CSS is render blocking:** the browser blocks page rendering until it receives and processes all the CSS. CSS is render blocking because rules can be overwritten, so the content can't be rendered until the CSSOM is complete.
- CSS has its own set of rules for identifying valid tokens. Remember the C in CSS stands for 'Cascade'. CSS rules cascade down. As the parser converts tokens to nodes, descendant nodes will inherit some of the styles of the parent.

**Render Tree**

- The render tree captures both the content and the styles: the DOM and CSSOM trees are combined into the render tree. To construct the render tree, the browser checks every node, starting from root of the DOM tree, and determines which CSS rules are attached.

- The render tree only captures visible content. The head section (generally) doesn't contain any visible information, and is therefore not included in the render tree. If there's a display: none; set on an element, neither it, nor any of its descendants, are in the render tree.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/e8fcfd10-6a58-4d78-beee-c209069de49a)



**Layout**

- Once the render tree is built, layout becomes possible. Layout is dependent on the size of screen.
- The layout step determines where and how the elements are positioned on the page, determining the width and height of each element, and where they are in relation to each other.
- The viewport meta tag defines the width of the layout viewport, impacting the layout.
- Without it, the browser uses the default viewport width, which on by-default full screen browsers is generally 960px. On by-default full screen browsers, like your phone's browser, by setting <meta name="viewport" content="width=device-width">, the width will be the width of the device instead of the default viewport width.
- The device-width changes when a user rotates their phone between landscape and portrait mode. Layout happens every time a device is rotated or browser is otherwise resized.

**Paint**

- The last step is painting the pixels to the screen. Once the render tree is created and layout occurs, the pixels can be painted to the screen.
- On load, the entire screen is painted. After that, only impacted areas of the screen will be repainted, as browsers are optimized to repaint the minimum area required.
- Paint time depends on what kind of updates are being applied to the render tree.



