`## DOM Manipulation in js



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


- we can acheive that by `div.textContent ="hello world"`

- Then what is the difference between innerText vs textContent.

- **Here is the Example**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5849489d-ed3c-44a7-a36c-c917ce7b35f9)


This is the difference
- innerText displays the content only if it is visible otherwise it won't.
- textContent will display entire text even spaces and all things. All of the content inside the `div`

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/f36c49d1-369f-4b17-a252-805755116997)


___________________________

## Render html inside div or any element (Modifying element html)

- using innerHTML
- this example returns bold type of `Hello World2`

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/a4a42716-1074-4ddd-9e0c-05c1eca282aa)

- using that innerHTML it could be malicious instead of tht we can use like this.

  ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/784b03d7-e740-4c06-9153-0ef1deb3e8e2)


_____________________________________________

## Removing elements from dom

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="script.js" defer></script>
  </head>
  <body>
    <div>
      <span id="hi">Hello</span>
      <span id="bye">Bye</span>
    </div>
  </body>
</html>
```

- script.js

```js
//script.js
const body = document.body;
const div = document.querySelector('div');
const spanHi = document.queerySelector('#hi');
const spanBye = document.queerySelector('#bye');

spanBye.remove(); // removes the element
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/76d4c3ef-474f-46a1-a1b7-702dc06965c4)

- removes `Bye` text from dom.
- - to append again use `div.append(spanBye)` // Hello Bye
 

## 2) Another way of removing element

```js

div.removeChild(spanHi) //Bye

//or

spanHi.remove()
```

______________________________________________________________________

## Modifying Element Attributes.

- **Adding titile Attribure and how o access that in JS**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="script.js" defer></script>
  </head>
  <body>
    <div>
      <span title="hello" id="hi">Hello</span>
      <span id="bye">Bye</span>
    </div>
  </body>
</html>
```

- script.js

```js
//script.js
const body = document.body;
const div = document.querySelector('div');
const spanHi = document.querySelector('#hi');
const spanBye = document.querySelector('#bye');

console.log(spanHi.getAttribute('id')); // prints out the id which is "hi"
console.log(spanHi.getAttribute('title')); // prints out the tile which is "hello"

// We can also use below instead of getAttribute()
console.log(spanHi.id);
console.log(spanHi.title);

// Similary we can setAttribute
spanHi.setAttribute('id', 'sdfsdfsd');

// We can also use below instead of setAttribute()
spanHi.id = 'sdfsdfsd';
```
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/cf890356-11b9-4497-a9e2-a308f90f7d42)

- To remove attribute use this code

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/15885561-f8f9-4365-a7ee-f890749e41bd)




_________________________________________________

## Manipulating elements with Data Attributes.

- just like normal attributes
- To create a data attribute in HTML we just need to add a custom attribute to our HTML element that starts with **data-**.

- We are adding two attributes and those are
  - data-test="this is test"
  - data-longer-name="sdffsdfsd"
 
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/7f399b64-27f5-429f-948f-703f0700fbd7)




- To access the individual Data attributte

```js
// longerName access from the DOM
console.log(spanHi.dataset.longerName); //sdfsdf

```

- To set a new Property

```js

spanHi.dataset.newName= 'hi' //hi
```
like below picture


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/ca61a4dc-7b06-4883-9b86-caa80e996521)

____________________________________________________

## Modifying class elements

```js

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="script.js" defer></script>
  </head>
  <body>
    <div>
      <span title="hello" id="hi" class="hi1 hi2">Hello</span>
      <span id="bye">Bye</span>
    </div>
  </body>
</html>
```

```js
//script.js
const body = document.body;
const div = document.querySelector('div');
const spanHi = document.querySelector('#hi');
const spanBye = document.querySelector('#bye');

spanHi.classList.add('new-class'); //add
spanHi.classList.remove('hi1'); //remove

// removes hi2 if it is there, otherwise it adds hi2
spanHi.classList.toggle('hi2'); //toggle

// automatically removes if false is passed
spanHi.classList.toggle('hi2', false); //toggle

// automatically add the class if true is passed
spanHi.classList.toggle('hi2', true); //toggle
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/243e7bd5-bd7d-4d91-bd1b-d4a1fc062513)

________________________

## Modifying element style

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5a478e33-98d6-4270-8c81-927720a98001)

_______________________

- To know more aboout data attributes
- blog is here
- https://blog.webdevsimplified.com/2020-10/javascript-data-attributes/



