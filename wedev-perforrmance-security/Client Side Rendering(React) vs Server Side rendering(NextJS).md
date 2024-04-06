**Client Side Rendering (CSR):**

- Client-side rendering is a powerful technique for building **dynamic and interactive web pages**.
- It can provide a better user experience, faster page loads, and easier scalability. However, it also has some drawbacks, including SEO challenges, performance issues, and complexity.
- When deciding whether to use client-side rendering, it’s important to weigh the benefits and drawbacks and choose the approach that best suits your project’s needs

- ![image](https://github.com/venkatdas/Interview_prep/assets/43024084/77a52f88-69ff-4eb7-9f91-7d0f671e08ba)


**How it works:** 
- In CSR, the browser gets a minimal HTML file as a response. Once loaded, JavaScript runs, makes calls to APIs, and then dynamically generates and displays the content in the browser.
**Let’s break down this process into smaller steps to understand even better how client-side rendering works:**

1) A user requests a page from a server. This could be a direct request to the server or a click on a link that triggers a request.
2) The server sends a minimal HTML page to the client (usually a loder image or similar to let the user know that something is happening under the hood.
3) Along with that initial HTML, the server sends any necessary JavaScript and CSS files.
4) The client’s browser loads the HTML page and executes the JavaScript code.
5) The JavaScript code makes a request to an API or other data source to fetch the data needed to render the page.
6) Once the data is fetched, the JavaScript code uses it to render the page in the browser.
7) At this point the page is fully loaded, visible and interactable: any subsequent interactions, such as clicks or form submissions, trigger further JavaScript code execution and data fetching as needed.


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/449c18a0-2377-43ce-987a-83e43d17c5da)

```js
1] Browser makes a request to the server.
2] Server responds with a minimal HTML file.
3] Browser renders this minimal HTML.
4] JavaScript is loaded and executed by the browser.
5] JavaScript makes API calls.
6] Once the data is received from the APIs, the content is dynamically generated and rendered in the browser.
```


```js
import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data').then(response => response.json()).then(setData);
  }, []);
  
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/d335304a-f373-4a76-80dd-a7e46dcd1f4a)

**PROS**

1. Dynamic Interactivity: Allows for rich, interactive web applications as subsequent views and interactions are rendered in the browser, offering a smooth user experience.
2. Improved User Experience: Client-side rendering can provide a better user experience by creating dynamic and interactive web pages that respond quickly to user input. This can result in a more engaging and satisfying user experience.
3. Faster Page Loads: Because the client only requests a minimal HTML file from the server, which contains the necessary JavaScript and CSS files, the page can load more quickly. This can be particularly beneficial for mobile users, who may have limited bandwidth.
4. Easier to Scale: Client-side rendering can be easier to scale than server-side rendering, since the server doesn’t have to generate the HTML for each page request. This can be particularly beneficial for high-traffic websites.


**CONS**

1. Slower Initial Load: Initial page load might be slower as the browser needs to download, parse, and execute the JavaScript before the content is rendered.
  - Performance Issues: Client-side rendering can create performance issues, particularly on slower devices or with large amounts of data. This can result in slower load times and a less responsive user interface.

2. SEO Challenges: Search engine crawlers may have difficulty crawling and indexing client-side rendered content, which can negatively impact SEO.

3. Requires JavaScript: Client-side rendering requires JavaScript to be enabled in the browser, which can be a problem for users with older browsers or accessibility needs.

4. Improved Security: Client-side rendering can also improve the security of your site by reducing the risk of server-side attacks. With server-side rendering, the server is responsible for processing and rendering the content, which means that it is more vulnerable to attacks such as SQL injection or cross-site scripting.


**Websites Using Client-Side Rendering Examples:**

- Facebook: Utilizes ReactJS for dynamic and responsive user interfaces. Hire reactjs developers today!
- Twitter: Employs client-side rendering to enable real-time updates and interactive features.
- Google Maps: Leverages Angular for interactive mapping experience.
- Gmail: Implements client-side rendering to offer a dynamic email interface.
- LinkedIn: Uses ReactJS for efficient client-side rendering, enhancing user interactions and profile updates.

**Server Side Rendering (SSR):**


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/51989f9c-62af-4220-90ef-e542328b17f5)

**How it works:**

- With SSR, the server processes the request, fetches the required data, renders the page into HTML, and sends this fully rendered HTML to the client.



 Browser                      Server                     API Server
    |                           |                            |
    |--- Request -------------->|                            |
    |                           |---> Fetch Data Request --->|
    |                           |<--- Fetch Data Response ---|
    |                           |                            |
    |                           |--- Render HTML with Data --|
    |                           |                            |
    |<-- Fully Rendered HTML ---|                            |
    |                           |                            |
    |--- Display Content -------|                            |




```js
import fetch from 'node-fetch';

function Page({ data }) {
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return {
    props: { data }
  };
}

export default Page;
```

**PROS**

1. Faster Initial Load: Users get a fully rendered page upon the initial request, often leading to a perception of faster page loads.
2. SEO Advantages: Better for SEO since search engine crawlers receive a fully rendered page, optimizing indexation.
3. Faster Largest Contentful Paint (LCP)


**CONS**

1. Increased server load since the server has to render content on every request.


**Websites Using Server-Side Rendering Examples:**

- Wikipedia: Prioritizes server-side rendering for efficient content delivery.
- New York Times: Implements server-side rendering to ensure faster initial page loads and improved SEO.
- Shopify: Utilizes server-side rendering for e-commerce pages for a reliable shopping experience.
- Booking.com: Prioritizes server-side rendering to deliver quick and efficient search results for users.
- GitHub: Leverages server-side rendering for efficient code rendering and project documentation.
