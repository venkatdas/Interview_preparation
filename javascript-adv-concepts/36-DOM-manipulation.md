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

- Addingg elements to the Page
**- APPEND method**

- With Append metthod we can append strings, include elements like div, span
`
const body = document.body;
body.append("Hello World")`

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/4ef89770-1608-45bf-a373-35af2ae92740)



**- appendChild**

- With appendChild, you can only append elements like div, span

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6831a086-9923-4193-bcb6-0d232b9b6523)

