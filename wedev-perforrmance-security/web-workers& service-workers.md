## WEb VS SERVICE

- **Web Worker:** Provides another thread for your JavaScript code.
- JavaScript is single-threaded by default so long running code will block the main thread and lead to UI jank.
- So if you have a complex task like manipulating an image or parsing code, it makes sense to do that in a worker so it won't block your main-thread execution.
- But you can really use it for a lot of things, just many fast tasks will actually be slowed down by the thread hopping overhead.

- **Service Worker:** This is also a piece of code which runs in another thread,
- but for a very different purpose. Instead of communicating with it directly to do computations,
- this lives in the background and can proxy network requests to give you control over caching and enable offline access.
- It also opens the door to several powerful features such as push notifications, background sync and more.

- When you register a Service Worker, it runs as a background thread that intercepts network requests, handles caching, and manages offline capabilities without blocking the main thread:
- 


**SUMMARY**

- Separate Thread: Both Web Workers and Service Workers run in their own threads, independent of the main thread (UI thread). This means:

- They don't block or slow down the main thread.
- They can perform tasks in parallel with the main thread.
- No Direct DOM Access: Both are isolated from the DOM and must communicate with the main thread using postMessage.


**PUSH NOTIFIATIONS**

- Push notifications are messages or alerts that are sent to a user's device from a server or web service, even if the user is not actively using the application.
- They are commonly used in both mobile apps and websites to notify users about new content, events, or updates.



- News Websites: Alert users about breaking news or updates.
- E-commerce: Notify users about sales, new product arrivals, or abandoned cart reminders.
- Social Media: Let users know about new messages, comments, or friend requests.
- Weather: Alert users about severe weather conditions or important updates.
- Gaming: Inform players about new challenges, in-game events, or friend invites.
