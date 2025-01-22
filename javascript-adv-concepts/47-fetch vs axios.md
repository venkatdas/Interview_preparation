# Fetch vs Axios Asked in Interview

When interviewers ask about the difference between `fetch` and `axios`, they often want to assess your understanding of HTTP request libraries in JavaScript. Here's a detailed comparison that you can use to answer effectively:

---

### 1. **Introduction**
- **Fetch**: A built-in browser API to make HTTP requests. Available in most modern browsers without requiring external dependencies.
- **Axios**: A popular third-party library that simplifies making HTTP requests and provides additional features over `fetch`.

---

### 2. **Features**
| Feature                  | Fetch                           | Axios                             |
|--------------------------|----------------------------------|-----------------------------------|
| **Promise-based**       | Yes                             | Yes                              |
| **Default Support**     | Built-in                        | External library                 |
| **Request/Response Parsing** | Requires manual parsing (e.g., `.json()`) | Automatically parses JSON        |
| **Error Handling**      | Only rejects on network errors; HTTP errors (e.g., 404) need manual handling | Rejects on both network and HTTP errors |
| **Timeout**             | Not supported natively (requires custom implementation) | Built-in timeout configuration   |
| **Interceptors**        | Not supported                  | Supported for requests and responses |
| **Request Cancellation**| Not natively supported         | Supported using `CancelToken` or `AbortController` |
| **Browser Support**     | Native (modern browsers)       | Needs to be included in your project |

---

### 3. **Code Examples**
- **Fetch**:
  ```javascript
  fetch('https://api.example.com/data')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => console.log(data))
    .catch((error) => console.error('There has been a problem with your fetch operation:', error));
  ```

- **Axios**:
  ```javascript
  import axios from 'axios';

  axios.get('https://api.example.com/data')
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('There was an error!', error);
    });
  ```

---

### 4. **Key Differences**
- **Ease of Use**: Axios simplifies common tasks (like JSON parsing, handling timeouts, etc.), whereas `fetch` requires additional code for these tasks.
- **Error Handling**: Fetch only rejects promises for network errors, not for HTTP response errors (e.g., 404, 500). Axios handles both.
- **Browser Compatibility**: Fetch may need polyfills in older browsers (e.g., IE11), while Axios works in a wider range of environments.
- **File Uploads**: Axios handles file uploads (with FormData) more easily compared to `fetch`.

---

### 5. **When to Use**
- Use **Fetch**:
  - When you want a lightweight solution without adding dependencies.
  - For simple use cases that don't require advanced features like interceptors or timeouts.
  
- Use **Axios**:
  - For more complex applications with a lot of HTTP requests.
  - When you need features like interceptors, automatic JSON parsing, or built-in timeout handling.

---

By clearly explaining these points, you'll demonstrate your understanding of both tools and their practical use cases.

---

## What Are Interceptors?

In the context of HTTP request libraries like Axios, **interceptors** are functions that allow you to modify or act on requests or responses before they are sent or received by your application. They are a powerful feature for managing common logic across all HTTP requests or responses without repeating code.

### **How Interceptors Work**
- **Request Interceptors**: These are functions executed before the request is sent to the server. You can use them to:
  - Add or modify headers (e.g., add an authentication token).
  - Log the request for debugging.
  - Transform request data.

- **Response Interceptors**: These are functions executed when a response is received but before it is passed to the `.then` or `.catch` handlers. You can use them to:
  - Handle common response errors (e.g., automatically refresh a token on a 401 error).
  - Transform response data into a different format.
  - Log responses for debugging.

---

**Practical Use Case**
Imagine you're building a web app that requires authentication. Instead of adding the authentication token to every request manually, you can use a request interceptor:

Before the request is sent, the interceptor adds the token to the Authorization header.
If the token expires, the response interceptor can detect a 401 error and automatically refresh the token or redirect the user to the login page.


### **Code Example: Axios Interceptors**

#### **Request Interceptor**
```javascript
import axios from 'axios';

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Modify request config before the request is sent
    console.log('Request:', config);
    config.headers['Authorization'] = 'Bearer your-auth-token';
    return config; // Important to return the config, or the request won't proceed
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);
```

#### **Response Interceptor**
```javascript
// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // Any status code in the range of 2xx triggers this function
    console.log('Response:', response);
    return response; // Pass the response to the next handler
  },
  (error) => {
    // Any status codes outside the range of 2xx trigger this function
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized! Redirecting to login...');
      // Logic to handle 401 errors, e.g., redirect to login
    }
    return Promise.reject(error);
  }
);
```

---

### **Why Use Interceptors?**
1. **Centralized Logic**:
   - You can handle common tasks like attaching headers, logging, or error handling in one place, instead of duplicating the logic in multiple API calls.

2. **Dynamic Updates**:
   - For example, if your app uses a token-based authentication system, you can dynamically attach the token to every outgoing request in a request interceptor.

3. **Error Handling**:
   - Centralize error handling for all requests, such as redirecting users when a specific error (e.g., 401 Unauthorized) occurs.

4. **Response Transformation**:
   - You can process or clean up the response data before it reaches your business logic.

---

### Without Interceptors vs. With Interceptors

#### Without Interceptors:
```javascript
axios.get('/api/resource', {
  headers: {
    Authorization: 'Bearer your-auth-token'
  }
});
```
You have to add the `Authorization` header manually in every request.

#### With Interceptors:
```javascript
axios.interceptors.request.use((config) => {
  config.headers['Authorization'] = 'Bearer your-auth-token';
  return config;
});

axios.get('/api/resource'); // The token is added automatically.
```

This approach avoids repetitive code and makes your application easier to maintain.

---

## Implementing an Example from Scratch

Here's a step-by-step example of implementing Axios interceptors from scratch in a simple project.

---

### **Scenario**: 
- We will create a mock application where:
  1. We make an API call to fetch user data.
  2. We attach an `Authorization` token to every request using a **request interceptor**.
  3. We handle any `401 Unauthorized` errors globally using a **response interceptor**.

---

### **Steps**

#### **1. Setup**
Ensure you have Node.js installed and create a new project:
```bash
mkdir axios-interceptors-example
cd axios-interceptors-example
npm init -y
npm install axios express
```

#### **2. Create a Mock API with Express**
Create a file `server.js` for a mock backend that requires an authorization token:
```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Mock endpoint
app.get('/user', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== 'Bearer valid-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ name: 'John Doe', age: 30 });
});

app.listen(PORT, () => console.log(`Mock API running on http://localhost:${PORT}`));
```

Start the server:
```bash
node server.js
```

#### **3. Create a Client File**
Create a file `client.js` for making requests with Axios and setting up interceptors.

#### **4. Add Axios Code with Interceptors**
```javascript
const axios = require('axios');

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request Interceptor:', config.url);
    // Add Authorization token to every request
    config.headers['Authorization'] = 'Bearer valid-token'; // Replace with your token logic
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response Interceptor:', response.status);
    // You can modify the response here
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized! Redirecting to login...');
      // Handle 401 errors globally
    }
    return Promise.reject(error);
  }
);

// Make a request
apiClient
  .get('/user')
  .then((response) => {
    console.log('User Data:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error.response ? error.response.data : error.message);
  });
```

---

### **How It Works**
1. **Request Interceptor**:
   - Every request will pass through the request interceptor before being sent.
   - It adds the `Authorization` header with a token to every request.

2. **Response Interceptor**:
   - Every response (or error) will pass through the response interceptor.
   - If the server responds with a `401 Unauthorized`, we log a message and could implement further logic (e.g., redirecting to a login page).

---

### **Run the Client**
Run the client script:
```bash
node client.js
```

---

### **Expected Output**
- When the token is valid (`Bearer valid-token`):
  ```
  Request Interceptor: /user
  Response Interceptor: 200
  User Data: { name: 'John Doe', age: 30 }
  ```

- When the token is invalid (e.g., change it to `Bearer invalid-token`):
  ```
  Request Interceptor: /user
  Unauthorized! Redirecting to login...
  Error: { error: 'Unauthorized' }
  ```

---

### **Key Takeaways**
1. **Request Interceptor**: Adds headers or modifies request config globally.
2. **Response Interceptor**: Handles common response behaviors, like errors, globally.
3. This pattern centralizes logic, reducing redundancy and improving maintainability.

