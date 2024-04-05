- Serialization and deserialization are fundamental concepts in web development, especially when it comes to client-server communication

- Serialization JavaScript objects into JSON strings

- **Serialization with JSON.stringify()**

```js
const person = {
    name: "Alice",
    age: 25,
    email: "alice@example.com"
};

const serializedPerson = JSON.stringify(person);
console.log(serializedPerson); // Output: {"name":"Alice","age":25,"email":"alice@example.com"}

```
- **Deserialization with JSON.parse()**

- To deserialize a JSON string back into a JavaScript object, you use JSON.parse(). This function converts JSON strings into JavaScript objects.

```js
const serializedPerson = '{"name":"Alice","age":25,"email":"alice@example.com"}';
const person = JSON.parse(serializedPerson);

console.log(person);
// Output: { name: 'Alice', age: 25, email: 'alice@example.com' }
```
