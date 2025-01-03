- Caching, in the world of computer systems, is a technique to store a copy of data or computational results that can be retrieved quickly.
- Imagine you’re watching your favorite movie. Instead of downloading it from the internet every time, you save it on your device. Now, you can watch it instantly without waiting.
- When you visit a website, your browser stores some parts of it, like images or scripts, in its cache. If you visit the site again, your browser can load these parts from the cache instead of downloading them again, making the website load faster.

## Benifits of Caching

1. Fault Tolerance and High Availability --> If the database is down, cached data can still be served to users, ensuring that the application remains functional even during outages.
2. Reduce Load on backend systems(servers, database, API's) --> A website that loads images and static content from the cache will appear faster to users, improving the perceived performance of the application
3. Faster Access
4. Cost Efficiency
5. Improved User Experience --> A website that loads images and static content from the cache will appear faster to users, improving the perceived performance of the application

- Types of Caching

1. Client side caching or brower caching
- Client-side caching refers to the process of storing data or resources on the client’s device (such as a web browser) so that they can be reused in subsequent requests without needing to be fetched from the server. This improves performance by reducing the number of server requests, speeding up load times, and decreasing network traffic
- When a user visits a website, the browser stores certain resources locally on the device, such as HTML files, images, CSS, JavaScript, and API responses. The next time the user visits the same site or page, the browser can use the cached resources instead of re-downloading them from the server.

- Client-side caching relies on caching mechanisms and cache-control headers to determine how long data should be stored and when it should be updated.
- Cache-Control: max-age=3600: Tells the browser to cache the resource for 1 hour.
- Cache-Control: no-cache: Instructs the browser to revalidate the resource before using it from the cache.
- Expires Header
- ETags (Entity Tags) --> An ETag is a unique identifier for a resource
2. Server caching

- Server-side caching refers to the process of storing data or resources on the server to reduce redundant processing and improve the efficiency of serving client requests. By caching data at the server level, the system can reduce the load on databases or backend services, decrease response times, and handle more requests effectively.
- Initial Request: When a client sends a request, the server processes it (e.g., querying a database or performing computations) and generates a response.
- Cache Storage: The server stores the response in a cache (e.g., in-memory store like Redis or Memcached, or disk-based cache).
- Subsequent Requests: For subsequent requests, the server checks the cache first. If the requested data is found (a cache hit), it is returned directly from the cache. If not (a cache miss), the server processes the request, stores the result in the cache, and then serves it to the client.
3. CDN caching
4. Database Caching
   i. Query level caching
   ii. Object level caching
