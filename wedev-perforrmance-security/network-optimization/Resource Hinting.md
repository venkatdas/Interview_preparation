

## Resource Hinting

- Resource hinting is a technique used in web development to help browsers prioritize and manage the loading of resources in a way that can improve page load times and overall performance. It involves providing hints to the browser about how it should handle certain resources (like scripts, stylesheets, images, and fonts) before they are actually needed. These hints can help the browser make more efficient use of its resources, reducing load times and improving the user experience.


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/718cdc40-fa95-48c1-b370-59b5f0a5eb90)




```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PRELOAD PREFETCH PRECONNECT</title>

    <!-- PRELOADING STARTS -->
    <link rel="preload" as="script" href="script2.js">
    <link rel="preload" as="style" href="style2.css">
    <!-- PRELOADING ENDS -->

    <!-- PREFETCH START-->
    <link rel="prefetch" href="index3.html">
    <link rel="prefetch" as="script" href="script3.js">
    <!-- PREFETCH ENDS -->


    <!-- PRECONNECT START-->
    <!-- <link rel="preconnect" href="https://api.my-app.com/" /> -->
    <!-- PRECONNECT ENDS -->

    <!-- USING STYLES -->
    <link rel="stylesheet" href="style1.css">
    <link rel="stylesheet" href="style2.css">
</head>
<body>
    <a href="index3.html">index3.html</a>
</body>
<!-- USING JS -->
<script src="script1.js"></script>
<script src="script2.js"></script>
</html>
```
