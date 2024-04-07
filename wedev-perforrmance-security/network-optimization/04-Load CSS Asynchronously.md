

## Load CSS asynchrnously

```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   

    <!-- PRELOADING STARTS -->
   <title>Load CSS Async</title>

    <link rel="stylesheet" href="nonCritical.css" />
    <link rel="stylesheet" href="style1.css" />
    <link rel="stylesheet" href="critical.css" />
  </head>
  <body>
    <!-- <a href="index3.html">index3.html</a> -->
  </body>
  <!-- USING JS -->
  <script src="script.js"></script>
</html>

```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/aa236897-753b-46d0-b4c4-87a795830d85)

- From above image crtical.css has loaded after some time , what if i want to load the critical.css before

_______________________

- if we want to load critical.css at first and load other .css files asynchronously

Note: By default media is all, we are providing media ="print" so that browser understands these are used for printing purpose, similarly onload we again wanted to change media as all



```js
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   

    <!-- PRELOADING STARTS -->
   <title>Load CSS Async</title>

   
<link rel="stylesheet" href="nonCritical.css" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="style1.css" media="print" onload="this.media='all'">


    <link rel="stylesheet" href="critical.css" />
  </head>
  <body>
    <!-- <a href="index3.html">index3.html</a> -->
  </body>
  <!-- USING JS -->
  <script src="script.js"></script>
</html>

```

- Using media="print": This tells the browser, "Hey, don't worry about loading this CSS right away; it's only for printing." The browser then focuses on everything else first, making the page ready to use faster because it's not waiting for these styles to load.

- The onload trick: After the browser has finished loading the page, it then goes, "Alright, now let's make the page prettier with those extra styles I set aside for later." The onload function changes the setting so these styles apply to everything, not just printing, but without slowing down the initial page load.


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/4e8c17fa-e47b-437a-9e3b-6cebd2d9d9fb)

## we can also use preload to load css asynchronously

```js
   <!-- PRELOAD and ASYNC -->
    <link
      href="style2.css"
      rel="preload"
      as="style"
      onload="this.rel='stylesheet'"
    />
```
- To consume this preload we have to make the onload as stylesheet.




