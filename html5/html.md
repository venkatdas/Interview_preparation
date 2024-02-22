###Html

1 ) Html5 Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Title</title>
    <link rel="stylesheet" href="style.css">
    <script src="script.js"></script>
</head>
<body>
    <header>
        <h1>Website Title</h1>
        <nav>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>Section Title</h2>
            <p>Section content goes here.</p>
        </section>
        <article>
            <h2>Article Title</h2>
            <p>Article content goes here.</p>
        </article>
        <aside>
            <h2>Related Links</h2>
            <ul>
                <li><a href="#">Link 1</a></li>
                <li><a href="#">Link 2</a></li>
            </ul>
        </aside>
    </main>
    
    <footer>
        <p>Copyright © 2024. All rights reserved.</p>
    </footer>
</body>
</html>

```

2) Explain meta tag in html

<details>
    
<summary>Answer</summary>

The <meta> tag defines metadata about an HTML document. Metadata is data (information) about data. <meta> tags always go inside the <head> element, and are typically used to specify character set, page description, keywords, author of the document, and viewport settings.



Character Encoding: It specifies the character set used on the webpage, which is crucial for correctly displaying text, especially for languages with unique characters. A common practice is to set the character encoding to UTF-8, which supports most characters and symbols from all writing systems.

html
Copy code
<meta charset="UTF-8">
Viewport Configuration for Mobile Devices: It controls the viewport's size and scale, which is particularly important for creating responsive designs that work well on mobile devices. For example, setting the viewport width to device-width and the initial scale to 1 ensures that the page uses the device's width and scales properly.

html
Copy code
<meta name="viewport" content="width=device-width, initial-scale=1.0">
Page Description: It provides a brief description of the page's content, which search engines often display in search results. A well-crafted description can improve the chances of someone clicking on a link.

html
Copy code
<meta name="description" content="A brief description of the page">
Keywords: Although less significant for SEO now due to past abuse, it was traditionally used to specify keywords relevant to the page's content to improve search engine rankings.

html
Copy code
<meta name="keywords" content="HTML, CSS, JavaScript">
Author: It can specify the name of the author of the webpage.

html
Copy code
<meta name="author" content="John Doe">
Refresh and Redirection: It can be used to refresh the page or redirect to another page after a specified number of seconds.

html
Copy code
<meta http-equiv="refresh" content="30; url=http://example.com/">
Controlling Browser Caching: It can instruct the browser how to cache the page, although HTTP headers often handle this more effectively.

Social Media Integration and SEO: Meta tags such as Open Graph (used by Facebook) and Twitter Cards tags are used to control how content appears when shared on social media platforms, including specifying images, descriptions, and other elements for rich previews.
</details>

3) 


