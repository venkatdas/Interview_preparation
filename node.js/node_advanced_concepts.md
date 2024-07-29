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
