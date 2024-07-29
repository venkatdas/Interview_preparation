## Node CRUD Operations

```js
const express = require("express");
const app = express();

const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the CRUD operations using node");
});

let books = []; // to hold the data, in real time it was a database

app.post("/books", (req, res) => {
  const { name } = req.body;

  const postItem = {
    id: books.length + 1,
    name,
  };

  books.push(postItem);

  res.status(201).json(postItem);
});

app.get('/books',(req,res)=>{
    res.json(books)
})

// reading a book by id
app.get('/books/:id',(req,res)=>{
  const bookId = books.find((book) => book.id === parseInt(req.params.id));
  console.log(bookId);
  // Yes, in the context of Express.js and many web frameworks, route parameters are always treated as strings. Even though the URL contains a number (e.g., GET /items/2), when this parameter is extracted by Express.js, it is handled as a string.
  if (!bookId) {
    return res.status(404).send("Book not found");
  }
  res.json(bookId);
})


app.put('/books/:id',(req,res)=>{
    const bookId = books.find((book)=>book.id === parseInt(req.params.id))

    if(!bookId){
        return res.status(404).send("Book not found")
    }

    const {name}= req.body
    bookId.name = name;
    res.json(bookId)

    // or 

    // item.name = req.body.name;
    // res.json(item);


})


app.delete('/books/:id',(req,res)=>{
  const bookIndex = books.findIndex(
    (book) => book.id === parseInt(req.params.id)
  );
  //The findIndex method is used to search the books array for an item with the matching id.
  console.log(bookIndex);

  if (bookIndex === -1) {
    return res.status(404).send("Book not found");
  }

  const deleteBook = books.splice(bookIndex, 1);
  res.json(deleteBook);
})



app.listen(port, () => {
  console.log(`server is listening on the ${port}`);
});

```

## OWASP: Explain some common security practices you follow to secure a Node.js application.

- Securing a Node.js application involves following best practices and guidelines to protect against various vulnerabilities and threats.
- Here are some common security practices to follow, inspired by the OWASP (Open Web Application Security Project) guidelines:


**"Securing a Node.js application involves a combination of best practices, tools, and proactive measures to protect against various vulnerabilities. Here are some key strategies I follow:

Secure Dependencies:

Regularly Update Dependencies: I use tools like npm audit to identify and fix vulnerabilities in dependencies, ensuring they are up-to-date.
Use Trusted Packages: I prefer packages from reputable sources and actively maintained by the community.
Input Validation and Sanitization:

Validate Input: Using libraries like joi or validator, I validate all user inputs to ensure they conform to expected formats and types.
Sanitize Input: To prevent injection attacks, I sanitize user inputs using libraries like validator.
Protection Against Cross-Site Scripting (XSS):

Content Security Policy (CSP): Implementing CSP via middleware like helmet helps restrict sources of content.
Escape Output: I ensure data is escaped before rendering it in the browser to prevent XSS attacks.
Prevent SQL Injection:

Parameterized Queries: I use parameterized queries or ORM libraries to prevent SQL injection vulnerabilities.
Secure Authentication:

Strong Password Hashing: Using bcrypt, I hash passwords securely before storing them.
Multi-Factor Authentication (MFA): Implementing MFA adds an extra layer of security to user authentication.
Secure Sessions:

Secure Cookies: Setting cookies with HttpOnly, Secure, and SameSite flags enhances their security.
Protection Against Cross-Site Request Forgery (CSRF):

CSRF Tokens: Using CSRF protection middleware like csurf helps validate requests.
Rate Limiting:

Prevent Brute Force Attacks: Implementing rate limiting with middleware like express-rate-limit helps prevent brute force attacks.
Error Handling:

Avoid Revealing Stack Traces: I ensure that stack traces and detailed error messages are not exposed to users.
Secure HTTP Headers:

Using Helmet: The helmet middleware sets various secure HTTP headers to enhance security.
Secure Configuration:

Environment Variables: I store sensitive configuration data in environment variables using libraries like dotenv.
        **OR**


1. Secure Dependencies
Keep Dependencies Updated
Regularly update your dependencies to the latest versions to mitigate known vulnerabilities.
Use tools like npm audit to identify and fix security issues in your dependencies.
bash
Copy code
npm audit
npm audit fix
Use Trusted Packages
Only use packages from trusted sources and maintainers.
Avoid using packages that have not been updated in a long time or lack proper documentation and community support.
2. Input Validation and Sanitization
Validate Input
Always validate user input to ensure it meets the expected format and type.
Use libraries like validator or joi for input validation.
javascript
Copy code
const Joi = require('joi');
const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});
Sanitize Input
Sanitize user input to prevent injection attacks.
Use libraries like validator to sanitize input.
javascript
Copy code
const validator = require('validator');
const sanitizedInput = validator.escape(userInput);
3. Protect Against Cross-Site Scripting (XSS)
Use Content Security Policy (CSP)
Implement CSP to control the sources from which content can be loaded.
javascript
Copy code
const helmet = require('helmet');
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "trustedscripts.com"],
  },
}));
Escape Output
Always escape data before rendering it in the browser to prevent XSS attacks.
javascript
Copy code
const escapeHtml = require('escape-html');
const safeOutput = escapeHtml(userInput);
4. Prevent SQL Injection
Use Parameterized Queries
Use parameterized queries or ORM libraries to prevent SQL injection.
javascript
Copy code
const mysql = require('mysql');
const connection = mysql.createConnection({ /* config */ });
const userId = 1;
connection.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
  if (error) throw error;
  console.log(results);
});
5. Secure Authentication
Use Strong Password Hashing
Use strong password hashing algorithms like bcrypt to store passwords securely.
javascript
Copy code
const bcrypt = require('bcrypt');
const saltRounds = 10;
bcrypt.hash('myPlaintextPassword', saltRounds, (err, hash) => {
  if (err) throw err;
  // Store hash in the database
});
Implement Multi-Factor Authentication (MFA)
Implement MFA to add an extra layer of security for user authentication.
6. Secure Sessions
Use Secure Cookies
Set cookies with the HttpOnly, Secure, and SameSite flags to enhance security.
javascript
Copy code
app.use(session({
  secret: 'yourSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, sameSite: 'strict' }
}));
7. Protect Against Cross-Site Request Forgery (CSRF)
Use CSRF Tokens
Implement CSRF protection by using tokens that validate requests.
javascript
Copy code
const csrf = require('csurf');
app.use(csrf());
app.get('/form', (req, res) => {
  res.render('send', { csrfToken: req.csrfToken() });
});
8. Implement Rate Limiting
Prevent Brute Force Attacks
Implement rate limiting to prevent brute force attacks.
javascript
Copy code
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
9. Error Handling
Avoid Revealing Stack Traces
Do not expose stack traces or detailed error messages to users.
javascript
Copy code
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});
10. Secure HTTP Headers
Use Helmet
Use the helmet middleware to set secure HTTP headers.
javascript
Copy code
const helmet = require('helmet');
app.use(helmet());
11. Secure Configuration
Environment Variables
Store sensitive configuration data (e.g., database credentials, API keys) in environment variables.
javascript
Copy code
require('dotenv').config();
const dbPassword = process.env.DB_PASSWORD;






-----------------

## Error handling node js both synchronous  and asynchronous


- Error handling is crucial in Node.js to ensure that our application can gracefully handle and recover from unexpected situations, providing a better user experience and maintaining stability. In Node.js, we handle errors for both synchronous and asynchronous code using different techniques.
- 


**Synchronous error**

- try/catch block

**Asynchrnous error**

- Callback-based Error Handling Example:
  - "In callback-based asynchronous code, the convention is to pass an error object as the first argument to the callback."
```js
const fs = require('fs');

fs.readFile('nonexistentFile.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error occurred:', err.message);
    // Handle the error
    return;
  }
  console.log(data);
});

```

- Promise-based Error Handling Example:
  - "When using promises, we handle errors using the .catch method."

```js
const fs = require('fs').promises;

fs.readFile('nonexistentFile.txt', 'utf8')
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.error('Error occurred:', err.message);
    // Handle the error
  });
```

- async/await Error Handling Example:
  - "For async/await, we use try...catch blocks to handle errors in asynchronous code."

```js

const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('nonexistentFile.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Error occurred:', err.message);
    // Handle the error
  }
}

readFile();
```



