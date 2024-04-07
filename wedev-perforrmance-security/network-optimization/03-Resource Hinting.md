

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

- Let's assume before resource hinting how our files will load let's take an example

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PRELOAD PREFETCH PRECONNECT</title>


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



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/b183795d-64b5-4c8f-8934-cbf87a4cbbc2)

- From above image we get to know that , index, style1.css, style2.css has highest priority,
- What if I want to load the script2.js and style2.css with highest priority may be these are containing core logic.
- How i can acheive this , now picture comes to the **preload**


```js
  <!-- PRELOADING STARTS -->
    <link rel="preload" as="script" href="script2.js">
    <link rel="preload" as="style" href="style2.css">
    <!-- PRELOADING ENDS -->
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/55d67fe2-3b1e-4258-81a8-a13249f267ba)



**Note**: If you preload something and don't consume it, then browser hints you a warning on the console


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/7df37f83-e9b2-475e-987d-76d2cbeefe38)

_______________________

**PREFETCH**

- If you want to load some html or script before you have actually been into that html file
- Loading index3.html file into index.html
- When the user go to the index3.html it shows those file/scripts are catched

```js
    <!-- PREFETCH START-->
    <link rel="prefetch" href="index3.html">
    <link rel="prefetch" as="script" href="script3.js">
    <!-- PREFETCH ENDS -->
```

- On Intial Load (index3.html is loaded before the user actually navigated to index3.html)
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/a16e5489-ece9-456e-ac35-f19ae16561a1)

- index3.html shows the cache (once index3.html is opened)

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/f1e1b6b4-2a43-4e37-83e1-3ddce4775edb)


## PRECONNECT

- preconnect may not be available in the all browsers, it recently started.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5bed2df9-091e-4869-a012-6b7211b008c5)

```js
<!-- PRECONNECT START-->
<link rel="preconnect" href="https://api.my-app.com/" />
<!-- PRECONNECT ENDS -->
```

- when you are actually loading some contents from other domain (let's say CDN).

- So when you are making a new connection with a new domain (which usually takes time)

- thereby preconnect helps to make this call beforehand between two different domains

- handshake happens only once per domain, so if the handshake is done already then going forward it no need to do the handshake again

## dns-prefetch
- makes a handshake and it is basically supported on the old browser
![image](https://github.com/venkatdas/Interview_prep/assets/43024084/9c8c4e6d-76fb-441c-9240-bcccf78a44d9)



## pre-render

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/21817ec0-8675-44eb-ba44-fc5080afa8c2)

- certain pages you are going to load next and you know that users are going to highly visiting.
- In that particular case you don't want user to click navigate, then start requesting then downloading
- This will create hidden tab content, it will load your page including your JS execution and it will throw the hidden tab away after a certain time Ex: Login page to dashboard page navigation



## module- preload

- going to load your ES module and it is going to download cache and it is going to compile your JS module code as soon as possible.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/8d83395f-0a69-4e29-ba78-a0c8629ac40d)


