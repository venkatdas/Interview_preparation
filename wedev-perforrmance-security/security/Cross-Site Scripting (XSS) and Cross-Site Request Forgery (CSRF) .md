- Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) are two common web security vulnerabilities that target users and web applications.
- Though they both involve malicious web activity, they operate differently and exploit different types of weaknesses.

- - Both CSRF and XSS are client side attacks
 
**Cross-Site Scripting (XSS):**
- Cross-Site Scripting is a security vulnerability that allows an attacker to inject malicious scripts (usually written in JavaScript) into web pages viewed by other users.
- These scripts then execute in the context of the victim’s browser, potentially stealing sensitive information, hijacking user sessions, or performing other malicious actions.
- There are three main types of XSS attacks:

1) **Stored XSS**: The malicious script is stored on the web server and served to users who visit a particular page or view a specific message.
   For example, an attacker could inject a script into a blog post’s comments section that executes when other users view the comments.
2) **Reflected XSS:** The malicious script is embedded in a URL or another input field, and the victim is tricked into clicking on a crafted link.
 The script is then executed in the context of the victim’s session.
3) **DOM-based XSS:** The attack occurs entirely on the client side, manipulating the Document Object Model (DOM) of a web page.
 Attackers exploit client-side scripts that use unsanitized user input to modify the DOM and execute malicious code.

 - To prevent XSS attacks, developers should validate and sanitize user inputs, use output encoding,
 - and implement security headers like Content Security Policy (CSP) to restrict the sources of executable scripts


**Here’s how to prevent each type of XSS attack:**

**a. Preventing Stored XSS:**
- Stored XSS attacks occur when an attacker injects a malicious script into a web application’s data, such as comments or messages, which is then served to other users who view that data. To prevent stored XSS attacks:

1.Input Validation and Sanitization: Always validate and sanitize user-generated content before storing it in your database or rendering it to other users.
2.Content Security Policy (CSP): Implement CSP headers to restrict the sources from which scripts can be executed on your website. This can help mitigate the impact of XSS attacks by disallowing the execution of unauthorized scripts.
3. Output Encoding: When rendering user-generated content, ensure it is properly escaped or encoded to prevent browsers from interpreting it as executable code. Use encoding libraries or built-in functions for this purpose.
4. Contextual Output Encoding: Be aware of the context in which data is being used (e.g., in HTML, JavaScript, or as part of an attribute) and apply the appropriate encoding technique.
5. Session Management: Implement strong session management and authentication mechanisms to prevent attackers from gaining access to authenticated user sessions and exploiting them for XSS attacks.

**Preventing Reflected XSS:**
- Reflected XSS attacks occur when an attacker tricks a user into clicking on a crafted link containing a malicious script. To prevent reflected XSS attacks:


1. Input Validation: Validate and sanitize all user inputs, especially those that are used in generating dynamic content. Reject or sanitize inputs that contain potentially malicious code.
2. Output Encoding: When rendering dynamic content, ensure that it is properly encoded to prevent script execution. The encoding must be context-specific, considering the target output (e.g., HTML, JavaScript, or URL).
3. Contextual Output Encoding: As with stored XSS prevention, apply encoding techniques according to the context in which the data is used.
4. Content Security Policy (CSP): Implement CSP headers to limit script execution sources and reduce the impact of any potential reflected XSS vulnerabilities
5. Use Secure Cookies: Set the “HttpOnly” flag on cookies to prevent JavaScript from accessing them, reducing the risk of cookie theft in case of a successful XSS attack.

**c. Preventing DOM-based XSS:**

- DOM-based XSS attacks occur when malicious code manipulates the Document Object Model (DOM) of a web page on the client side.
- To prevent DOM-based XSS attacks:

1. Sanitize Client-Side Input: Avoid using unsanitized user input directly in client-side scripts. Ensure that user input is sanitized and validated on the server side before it is used in JavaScript.
2. Secure Data Flow: Be cautious when modifying the DOM dynamically. Always validate and sanitize user inputs before using them to update the DOM. Use safe APIs and libraries for DOM manipulation.
3. Avoid Using Dangerous Functions: Avoid using JavaScript functions that can lead to DOM-based XSS, such as eval() and document.write(). Use safer alternatives and follow best practices.
4. Input Validation and Contextual Output Encoding: Similar to the other XSS prevention methods, validate and encode data according to its usage context when manipulating the DOM.
5. Content Security Policy (CSP) to restrict script execution sources and help prevent DOM-based XSS.

## Cross-Site Request Forgery (CSRF or XSRF):

- Cross-Site Request Forgery is an attack that tricks a user into executing unwanted actions on a different website where the user is authenticated.
- The attacker typically sends malicious requests on behalf of the victim, exploiting the victim’s active session on a targeted site.
- This can lead to actions like changing passwords, making purchases, or modifying account settings without the user’s consent.

- **How Does CSRF Work?**

1. A user logs into www.example.com, which uses cookies for session management.
2. The user then visits a malicious website, www.malicious.com.
3. This malicious website contains a link, button, or some JavaScript that causes the user’s browser to make a request to www.example.com without the user's knowledge. Because the user is still authenticated with www.example.com (for instance, their session cookie is still valid), the browser also includes authentication credentials with this request.
4. www.example.com receives this request and assumes it's legitimate because the request comes with valid session credentials. It then performs whatever action the request dictates—like changing the email or password.

```js

--------------------------------------------------------------
1. User Login to Example Site:
--------------------------------------------------------------
[User]  --------------->  [www.example.com]
              Login
              
[User]  <---------------  [www.example.com]
            Set Authentication Cookie

--------------------------------------------------------------
2. Unknowing Visit to Malicious Site:
--------------------------------------------------------------
[User]  --------------->  [www.malicious.com]
            Innocent Visit

--------------------------------------------------------------
3. Malicious Action Triggered:
--------------------------------------------------------------
[User]  ----(Bait)---->  [www.example.com]
       Malicious Request to Example Site with Valid Session Cookie

--------------------------------------------------------------
4. Unintended Action Performed on Example Site:
--------------------------------------------------------------
[User]  <---------------  [www.example.com]
        Action Executed (e.g., Email Changed)

--------------------------------------------------------------


```


**How to Prevent CSRF:**

1. Use Anti-CSRF Tokens: The server sends a unique, unpredictable token to the client with every session. For any state-changing request, the client must send back this token. If the token is missing or incorrect, the server refuses the request. Attackers won’t have access to this token.

```js
/**

Step1
When a user logs in or requests a form, the server generates a random token:
Random Token = "ABC123"


Step2
The server sets this token as a cookie and also includes it within the 
form as a hidden field.

Set-Cookie: csrf_token=ABC123; Path=/; Secure; HttpOnly

<!-- Form Data -->
<form action="/submit" method="post">
    <input type="hidden" name="csrf_token" value="ABC123">
    ...
</form>

Step3
When the user submits the form, 
the browser will automatically send the cookie 
(because that's how cookies work) and the token in the form data

POST /submit HTTP/1.1
Host: www.example.com
Cookie: csrf_token=ABC123

csrf_token=ABC123&...other_form_data...


Step4
The server then checks if the token from the cookie matches the 
token sent in the form data.

if (request.cookie["csrf_token"] === request.body["csrf_token"]) {
    // Tokens match, process the request
} else {
    // Possible CSRF attack! Deny the request.
}

**/
```

**2. SameSite Cookie Attribute:**

- Modern browsers support setting the SameSite attribute on cookies. This attribute can have two values:
  - Strict: The cookie will only be sent in a first-party context, i.e., it will be sent to the site from which it originates during navigation.
  - Lax: The cookie is withheld on cross-site subrequests but sent when the user navigates to the URL from an external site, like from their email client.


```js
Set-Cookie: session=unique_session_id; SameSite=Strict; Secure; HttpOnly;
```


**3. Check the Referer Header:**

- Verify the Referer header of incoming requests to ensure that they originate from the same domain. While this header can be spoofed by attackers in some cases, it still provides an additional layer of security.
- Note that not all browsers consistently send the Referer header, so it should be considered an extra measure rather than the primary defense.

**4. Use HTTP-Only Cookies:**

- This prevents JavaScript from accessing these cookies, reducing the risk of cookie theft in case of a successful CSRF attack.
- When a user logs into a web application, the server may send an authentication cookie as part of its response. To set this cookie as HttpOnly, the server would include the HttpOnly attribute in the Set-Cookie HTTP header:

```js
HTTP/1.1 200 OK
Set-Cookie: session_id=12345abcdef; HttpOnly; Path=/; Secure

HttpOnly means the cookie cannot be accessed by JavaScript.
Path=/ restricts the cookie to the root path.
Secure ensures the cookie is only sent over HTTPS.
```

**5. Require Authentication for Sensitive Actions:** Ensure that sensitive actions or endpoints require user authentication. Unauthorized users should not be able to perform these actions even if a CSRF attack occurs.

**6. Session Timeout:** Set session timeouts to automatically log users out after a period of inactivity to reduce the risk of an active session being exploited


**Example 2: Social Media Post**

1. Scenario: Bob is logged into a social media platform.
2. Attack: He clicks on a link that leads him to a malicious site. This site contains a script that makes a request to the social media platform to post a message or send a message to all his contacts.
3. Result: If the social media platform doesn’t verify the authenticity of the request, it could result in spam or malicious messages being sent from Bob’s account.


