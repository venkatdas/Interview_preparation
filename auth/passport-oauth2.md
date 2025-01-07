**Passport.js** is an authentication middleware for Node.js. It simplifies the process of authenticating users in a web application. Passport provides a clean and modular way to integrate authentication strategies like username/password, social logins (Google, Facebook), and more.

- It provides a core structure that supports different strategies, such as local username/password login or OAuth 2.0 for third-party logins.
- passport has lot of strategies like passport-local, passport-google-oauth20, passport-oauth2.0

**Passport.js:**

- A general authentication middleware framework.
- Provides the structure for managing authentication in Node.js.
- Does not perform authentication itself—it relies on strategies.

**passport-oauth2:**

- A specific strategy under the Passport.js framework.
- Implements the OAuth 2.0 protocol for authentication.
- Helps authenticate users via third-party services that comply with OAuth 2.0.

- Passport.js is the framework that provides the ability to manage multiple strategies in a unified way.
- passport-oauth2 is one of those strategies, focusing specifically on OAuth 2.0-based authentication.

- If the OAuth 2.0 provider you’re working with doesn’t have a ready-made Passport.js strategy (e.g., passport-google-oauth20 for Google), you can use passport-oauth2 as a generic solution.

---

- passport-oauth2 is a generic Passport.js strategy that provides a flexible implementation of the OAuth 2.0 protocol. It’s not tied to any specific provider like Google or Facebook, but instead allows you to connect with any OAuth 2.0-compliant service.

**When to Choose passport-oauth2?**
Provider-Specific Strategies (Preferred):

If the provider has a dedicated Passport strategy, use it (e.g., passport-google-oauth20 for Google).
These strategies handle provider-specific requirements like profile fetching and token handling.
**Generic OAuth 2.0 Providers:**

Use passport-oauth2 if the provider doesn’t have a specific strategy and follows standard OAuth 2.0.
Examples: Custom APIs, small services, or corporate single sign-on (SSO) systems.

---

**Definition of Passport-OAuth2:**

- Passport-OAuth2 is a generic strategy for Passport.js that implements the OAuth 2.0 protocol. It allows applications to authenticate users via any OAuth 2.0-compliant provider, such as Google, Facebook, GitHub, or custom providers.

- In Simple terms

- It handles the process of redirecting users to the provider's login page, obtaining authorization, exchanging tokens, and retrieving user information.
- It provides a flexible solution for integrating third-party logins or accessing protected APIs that follow the OAuth 2.0 standard.

**Example in Context:**

- Suppose you're building an application that needs to authenticate users via an organization's custom OAuth 2.0 service (e.g., a company’s internal SSO system). passport-oauth2 allows you to:

- Redirect users to the organization's login page.
- Exchange the received authorization code for an access token.
- Use the access token to fetch the user’s profile or perform authorized actions.

# Understanding an Organization's Custom OAuth 2.0 Provider

## What is an Organization's Custom Provider?

An **organization's custom provider** refers to a proprietary **OAuth 2.0 provider** developed by a company or organization to handle user authentication and authorization for its internal systems or services. This provider allows internal or third-party applications to securely access the organization's resources, such as user profiles, APIs, or other protected data, in compliance with the OAuth 2.0 protocol.

---

## Key Components of a Custom OAuth 2.0 Provider

1. **Authorization Server**:

   - Handles user login, authentication, and consent.
   - Issues tokens (e.g., access tokens, refresh tokens) to applications upon successful authentication.

2. **Resource Server**:

   - Hosts the protected resources (e.g., user data, APIs) that applications want to access.
   - Validates the access tokens issued by the authorization server.

3. **Client Applications**:

   - Internal or external applications that request access to the organization's resources.
   - Examples: Employee dashboards, customer portals, or mobile apps.

4. **Tokens**:
   - **Access Token**: Allows the client application to access specific resources on behalf of the user.
   - **Refresh Token**: Used to obtain a new access token without requiring the user to log in again.

---

## Why Build a Custom OAuth 2.0 Provider?

### 1. **Centralized Authentication**:

- Employees or users log in once and access multiple applications without needing separate credentials (Single Sign-On or SSO).

### 2. **Control Over Access**:

- Define custom scopes or permissions for internal applications. For example:
  - Application A can access employee profiles but not payroll data.
  - Application B can access payroll data but not organizational documents.

### 3. **Custom Business Needs**:

- Meet specific workflows or security requirements that generic third-party OAuth providers cannot fulfill.

### 4. **Enhanced Security and Compliance**:

- Ensure compliance with organizational security policies and regulations (e.g., GDPR, HIPAA).
- Avoid reliance on external providers for sensitive data.

---

## Example Use Case of a Custom OAuth 2.0 Provider

### Scenario:

**TechCorp** is a company with a suite of internal applications:

1. **Employee Portal**: A web app for managing tasks, HR records, and schedules.
2. **Internal APIs**: APIs exposing employee and organizational data.

Instead of having separate login systems for each app, **TechCorp** builds a custom OAuth 2.0 provider.

### Features of TechCorp's Custom Provider:

- **Authorization URL**: Handles login and consent (e.g., `https://auth.techcorp.com/oauth/authorize`).
- **Token URL**: Issues access and refresh tokens (e.g., `https://auth.techcorp.com/oauth/token`).
- **Resource Server**: Provides APIs to access user and organizational data (e.g., `https://api.techcorp.com/userinfo`).

---

## Workflow of a Custom OAuth 2.0 Provider

1. **Setup OAuth 2.0 Provider**:
   - The organization sets up the `authorizationURL`, `tokenURL`, and API endpoints.
2. **Application Requests Access**:

   - The client app (e.g., Employee Portal) redirects the user to the provider’s authorization server.
   - Example: `https://auth.techcorp.com/oauth/authorize`.

3. **User Logs In**:

   - The user logs in with their credentials and grants the app permission to access their data.

4. **Token Exchange**:

   - The application exchanges the authorization code for an access token via `https://auth.techcorp.com/oauth/token`.

5. **Access Protected Resources**:
   - The application uses the access token to fetch data (e.g., user profile) from `https://api.techcorp.com/userinfo`.

---

## Example Implementation with Passport-OAuth2

Here’s an example of integrating Passport-OAuth2 with a custom provider.

### Code:

```javascript
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://auth.techcorp.com/oauth/authorize",
      tokenURL: "https://auth.techcorp.com/oauth/token",
      clientID: "your_client_id",
      clientSecret: "your_client_secret",
      callbackURL: "http://localhost:3000/auth/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Fetch user profile from custom API
      const userProfile = fetchUserFromTechCorpAPI(accessToken);
      return done(null, userProfile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
```

---

## Advantages of a Custom OAuth 2.0 Provider

1. **Tailored to Organizational Needs**:

   - Built to handle the specific data and authentication needs of the organization.

2. **Enhanced Security**:

   - Ensures sensitive user and organizational data stays within internal systems.

3. **Improved User Experience**:

   - Provides a seamless login experience across multiple apps.

4. **Scalability**:
   - Can support multiple applications and APIs within the organization.

---

## Summary

An organization’s custom OAuth 2.0 provider is a centralized system for authentication and authorization, allowing internal or third-party applications to securely access organizational resources. It provides greater control, enhanced security, and compliance with business needs while following the OAuth 2.0 protocol.

Let me know if you need further clarifications or additional examples!



-------


- CODE

`npm install express passport passport-oauth2 express-session body-parser
`

----

```js
const express = require("express");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const session = require("express-session");

const app = express();

// Configure session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Define OAuth 2.0 Strategy
passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: "https://example.com/oauth/authorize", // Replace with provider's authorization URL
      tokenURL: "https://example.com/oauth/token", // Replace with provider's token URL
      clientID: "your_client_id", // Your app's client ID
      clientSecret: "your_client_secret", // Your app's client secret
      callbackURL: "http://localhost:3000/auth/callback", // Redirect URL after authentication
    },
    function (accessToken, refreshToken, profile, done) {
      // Mock user profile (In real implementation, fetch the user profile using accessToken)
      const userProfile = {
        id: "12345",
        name: "John Doe",
        email: "john.doe@example.com",
      };
      // Pass user profile and tokens to the application
      return done(null, { userProfile, accessToken, refreshToken });
    }
  )
);

// Serialize and deserialize user for session persistence
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Route to initiate OAuth 2.0 login
app.get("/auth", passport.authenticate("oauth2"));

// Callback route to handle provider response
app.get(
  "/auth/callback",
  passport.authenticate("oauth2", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    // On success, redirect to profile
    res.redirect("/profile");
  }
);

// Route to display the user's profile
app.get("/profile", ensureAuthenticated, (req, res) => {
  res.send(`
    <h1>Welcome, ${req.user.userProfile.name}</h1>
    <p>Email: ${req.user.userProfile.email}</p>
    <p>Access Token: ${req.user.accessToken}</p>
    <a href="/logout">Logout</a>
  `);
});

// Route to handle logout
app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth");
}

// Failure route
app.get("/auth/failure", (req, res) => {
  res.send("Authentication failed!");
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```
---------------------



Now let's do the flow for accessToken, refeshToken, expiresTime


Here’s a typical sequence of events:

User logs in → App gets accessToken and refreshToken.
App uses the accessToken to make API requests.
Access token expires → App uses the refreshToken to get a new access token.
Repeat the process until the user logs out or the refreshToken is revoked.