## JWT


Definition of JWT
JWT (JSON Web Token) is a compact, URL-safe token format that is widely used to securely transmit information between parties.
It consists of three parts: Header, Payload, and Signature:
Header: Contains the type of token (JWT) and signing algorithm (e.g., HS256).
Payload: Holds the user’s data or claims (e.g., userId, roles, etc.).
Signature: Ensures the integrity and authenticity of the token, generated by hashing the header and payload with a secret key.
2. Purpose of JWT
Authentication: JWTs are most commonly used in stateless authentication to identify and authorize users. Once authenticated, a user is given a token which they can use to access protected routes or resources.
Authorization: After logging in, the token can contain permissions or roles that dictate what actions a user can perform.
Secure Data Transfer: Since JWTs are signed, the data they contain is protected from tampering, ensuring integrity.
3. JWT Flow
Here’s a typical JWT authentication flow:

User Login:

The user provides credentials (e.g., username and password) to the server.
The server validates these credentials and, if valid, generates an access token (short-lived) and a refresh token (longer-lived).
The access token is returned to the frontend, often stored in memory or local storage, while the refresh token is stored securely, often as an HTTP-only cookie.
Accessing Protected Resources:

The client includes the access token in the Authorization header (Bearer <token>) with each request to protected routes.
The server verifies the token’s signature and expiration; if valid, it allows access to the resource.
Token Expiration and Refresh:

When the access token expires, the client uses the refresh token (sent to the server in a secure cookie) to request a new access token.
If the refresh token is valid, the server issues a new access token, extending the user’s session without requiring them to log in again.
4. Why Use JWT?
Statelessness: JWTs make it easier to scale applications as they don't require server-side session storage, which is crucial for stateless microservices.
Decentralized Security: JWTs can be verified by any server that has the signing key, so they work well in distributed or multi-service architectures.
Flexibility: JWTs allow embedding custom claims, so you can include user roles, permissions, or other metadata directly in the token, reducing additional database lookups.
