### Understanding CORS — Cross-Origin Resource Sharing

**Same-Origin Policy (SOP):**

- By default, web browsers enforce the Same-Origin Policy, which restricts web pages from making requests to a different origin (domain, protocol, or port) than the one that served the web page.
- This policy helps prevent malicious websites from making unauthorized requests on behalf of a user.

**CORS**

- CORS, or Cross-Origin Resource Sharing, is a SECURITY feature implemented by web browsers to restrict web pages from making requests to a different domain than the one that served the web page.
- This security measure helps prevent various types of cross-origin attacks, such as Cross-Site Request Forgery (CSRF) and Cross-Site Scripting (XSS).

**JavaScript can’t normally access resources on other origins is a good thing for Security.**

In this context, “other origins” means the URL being accessed differs from the location that the JavaScript is running from, by having:

- a different scheme (HTTP or HTTPS)
- a different domain
- a different port

- CORS — Cross-Origin Resource Sharing

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/48d1ef1d-861f-425f-82a9-7aaedd06d65f)


- Here’s a breakdown of the key aspects of CORS:

**Cross-Origin Requests:**

- When a web page makes a request to a different domain, it is considered a cross-origin request.
- Cross-origin requests are divided into two types: simple requests and preflighted requests.

**Simple Requests:**

- Simple requests are those that meet specific criteria and do not trigger a preflight request.
- Criteria for a simple request include using only the HTTP methods GET, POST, or HEAD, and not including certain types of headers.
- The browser automatically includes the Origin header in simple requests to indicate the origin of the requesting site.

**Preflighted Requests:**

- Preflighted requests are sent as an HTTP OPTIONS request before the actual request to check whether the server allows the actual request.
- Preflight requests include additional headers, such as Access-Control-Request-Method and Access-Control-Request-Headers, to inform the server about the actual request.

**CORS Headers:**

- The server must include specific HTTP headers in its response to inform the browser about which origins are allowed to access the resources.
- Common CORS headers include:
- Access-Control-Allow-Origin: Specifies which origins are allowed to access the resource.
- Access-Control-Allow-Methods: Indicates the HTTP methods (e.g., GET, POST) allowed when accessing the resource.
- Access-Control-Allow-Headers: Lists the headers that can be used when making the actual request.
- Access-Control-Allow-Credentials: Indicates whether the browser should include credentials (like cookies) when making the request.



**Credentials and Cookies:**

- By default, browsers do not include credentials (like cookies) in cross-origin requests. To enable this, the server must respond with the appropriate Access-Control-Allow-Credentials header, and the client must set the withCredentials property in the XMLHttpRequest or Fetch API.

**Wildcard (*) vs. Specific Origins:**

- The Access-Control-Allow-Origin header can be set to a specific origin or to the wildcard (*), which allows any origin to access the resource. However, when using credentials, the origin must be explicitly specified.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/2cd267e9-bff1-433d-b538-dd393ddef9b5)








