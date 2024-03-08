## DOM Manipulation in js



         Document
             |
           <html>
           /    \
        <head>  <body>
         /         |     \
    <title>   <div>   <p>
                |         |
             <span>   "Text node"




- DOM manipulation in JavaScript refers to the process of dynamically changing the structure, style, or content of a web page.


- HTML page

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DOM Manipulation</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    
    <script src="./script.js"></script>
  </body>
</html>

```
**APPEND method**

- Addingg elements to the Page

- With Append metthod we can append strings, include elements like div, span
`
const body = document.body;
body.append("Hello World")`

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/4ef89770-1608-45bf-a373-35af2ae92740)



**appendChild**

- With appendChild, you can only append elements like div, span

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6831a086-9923-4193-bcb6-0d232b9b6523)

_____________________________________

## Creating elements

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/13692d66-2ad5-4b1d-b4cf-0f7f61f41f47)

- From the above image we just created `div` element and we haven't used that `div` element to the page , that is the reason we didn't get div tag in script section.
- - To get that we have to append to the page

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/0f4d2ce5-d62e-4843-acb6-364968eff62d)


___________________________________________
## Adding text to div element

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/fe94ea3e-bb72-41e3-a28a-d90f2eada9b0)



