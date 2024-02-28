### Local vs Session vs Cookie

## Local.

```js
// Store data
localStorage.setItem('username', 'JohnDoe');

// Retrieve data
let username = localStorage.getItem('username');
console.log(username); // Outputs: JohnDoe

// Remove data
localStorage.removeItem('username');

// Clear all data
localStorage.clear();

```

## Session.

```js
// Store data
sessionStorage.setItem('sessionKey', '12345');

// Retrieve data
let sessionData = sessionStorage.getItem('sessionKey');
console.log(sessionData); // Outputs: 12345

// Remove data
sessionStorage.removeItem('sessionKey');

// Clear all data for the session
sessionStorage.clear();
```


**- To get all values that has been saved in the localStorage**

```js
localStorage.setItem("Name", "das");
localStorage.setItem("location","HYD")

let result = localStorage.getItem("Name");

for (let i = 0; i < localStorage.length; i++) {
  let key = localStorage.key(i);
  console.log((`${key}: ${localStorage.getItem(key)}`));
}
```

## Cookies.
- Cookies are data stored in small text files on the user's computer and are sent back to the server with every request.
- Cookies can be used for persistent local storage of small amounts of data.
-  They can be configured to expire after a set period or to persist indefinitely.

```js
// Set a cookie
document.cookie = "username=JaneDoe; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";

// Retrieve cookies
let cookies = document.cookie;
console.log(cookies); // Outputs all cookies as a string

// Deleting a cookie by setting its expiry date to the past
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
```

https://www.google.com/url?sa=i&url=https%3A%2F%2Fmedium.com%2F%40lancelyao%2Fbrowser-storage-local-storage-session-storage-cookie-indexeddb-and-websql-be6721ebe32a&psig=AOvVaw0IJDK8sOoTKsPP9gZZtdom&ust=1709199232807000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCLiVwrrdzYQDFQAAAAAdAAAAABAu
