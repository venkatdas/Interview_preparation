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
_______________________________

**Intersection observer (Lazy Loading)**
- Considering we have so many images like Flipkart and so much content to be loaded or so many visit that need to be loaded.
- In such cases, we can actually add some element at the end of certain (div container) which acts as a sentinel element
- So basically if we are scrolling and we encounter that particular element we can take a decision to load other items as well.
- So whenever your browser basically scroll intersect with that particular sentinel, you will get a callback and based on that callback you can take some certain decision

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/9ae4802e-6b89-4519-b2a9-b46704d68ee1)

- From the above image it is clear that, we don't want to load all the images right ?
- We just want to load first two images or three images and once you basically have these three images in your viewport and you want to load more images let's say..
- Then we can achieve this by adding a sentinel element after these two images (in your DOM)
- Once after scrolling, your sentinel elements come into the viewport, you will get a callback.
- Using that callback you can take a decision to make another set of a API call and get the images and add those images in your image list.


________________

Content Visibility (Lazy Loading)

- Anything that is not visible in my viewport, I will lazy rendering of that particular thing.
- By just adding content-visibility: auto, rendering time has been reduced significantly

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/2c2a6a29-3932-4dd7-ac6b-156ba70a4003)

```js
.story{
  content-visibility: auto;
  contain-intrinsic-size: 1000px; /*size of the content which is going to be loaded*/
}
```

_______________

**Serving critical CSS ( Lazy Loading)**

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/5ae78841-660f-44b0-b034-5713094ad105)

- Only the CSS that is critical that we should load and rest we can load afterwards.
- code

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/cb63d7b4-1838-4436-9a1e-f22c1bff467b)


- media type "print" says that this is not critical, load this once your web page is loaded, your JS is ready to execute just on load in that particular case.
- **all** means available for everyone or for all the use cases in the CSS, it is going to download and make it available for your next rendering and next set of things which are available below the fold

`<link rel="stylesheet" href="full.css" media='print' onload="this.media='all'"/>`




