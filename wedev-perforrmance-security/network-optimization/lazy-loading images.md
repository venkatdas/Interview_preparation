## Lazy Loading images

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/6668e013-83be-4fa9-bb91-8c1bca2f21d2)


- Here, we'll create a list of images with the loading="lazy" attribute. This attribute will instruct the browser to load the images lazily.

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lazy Loading Images Example</title>
    <style>
        /* Just adding some space between images */
        img {
            display: block;
            width: 100%;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>

<h2>Scroll Down to Load Images</h2>

<!-- Images with loading="lazy" attribute -->
<img src="placeholder.jpg" data-src="image1.jpg" alt="Image 1" loading="lazy">
<img src="placeholder.jpg" data-src="image2.jpg" alt="Image 2" loading="lazy">
<img src="placeholder.jpg" data-src="image3.jpg" alt="Image 3" loading="lazy">
<!-- Add as many images as you want -->

<script src="lazyload.js"></script>
</body>
</html>
```

- The loading="lazy" attribute for images and iframes is supported in most modern browsers.
- What it does when it encounters the loading attribute with the lazy value, so if that particular image is not in the viewport of the user, then it is not downloaded.

- The moment you are about to arrive on that image then only the network call happens and the image gets downloaded.

