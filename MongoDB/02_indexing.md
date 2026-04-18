# MongoDB Indexing — Complete Guide

## 📌 What is Indexing?

Indexing in MongoDB is a technique used to **improve query performance** by creating a data structure that allows fast lookup of documents.

Without an index:

* MongoDB performs a **COLLSCAN (Collection Scan)** → scans every document → slow

With an index:

* MongoDB uses a **B-Tree structure** → fast lookup → efficient queries

---

## 🧠 Why Indexing is Important

* 🚀 Faster read operations
* 🔍 Efficient searching and filtering
* 📊 Improves sorting performance

---

## ⚠️ Trade-offs

* ❌ Slower write operations (insert/update/delete)
* ❌ Additional storage usage
* ❌ Too many indexes can degrade performance

---

## 🔧 How to Create an Index

```js
db.collection.createIndex({ field: 1 })
```

* `1` → Ascending order
* `-1` → Descending order

---

## 🔍 Example

```js
db.users.createIndex({ name: 1 })
```

👉 This improves queries like:

```js
db.users.find({ name: "Das" })
```

---

## 🧱 Types of Indexes

### 1. Single Field Index

```js
db.users.createIndex({ age: 1 })
```

* Index on one field
* Most common

---

### 2. Compound Index

```js
db.users.createIndex({ name: 1, age: -1 })
```

* Index on multiple fields
* Order matters!

👉 Supports queries like:

```js
{ name: "Das", age: 25 }
```

---

### 3. Multikey Index

* Automatically created when indexing array fields

```js
db.users.createIndex({ skills: 1 })
```

Example:

```json
{ "skills": ["React", "Node"] }
```

---

### 4. Unique Index

```js
db.users.createIndex({ email: 1 }, { unique: true })
```

* Prevents duplicate values

---

### 5. Text Index

```js
db.articles.createIndex({ content: "text" })
```

Used for:

* Full-text search

```js
db.articles.find({ $text: { $search: "mongodb" } })
```

---

### 6. Hashed Index

```js
db.users.createIndex({ userId: "hashed" })
```

* Used for sharding
* Distributes data evenly

---

### 7. TTL Index (Time-To-Live)

```js
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })
```

* Automatically deletes documents after a time

---

## ⚙️ How Index Works Internally

* MongoDB uses a **B-Tree structure**
* Stores field values in sorted order
* Allows:

  * Fast search (O(log n))
  * Efficient range queries

---

## 🔍 Query Without Index

```js
db.users.find({ age: 25 })
```

👉 MongoDB scans all documents → slow

---

## 🚀 Query With Index

```js
db.users.createIndex({ age: 1 })
```

👉 MongoDB directly jumps to matching documents → fast

---

## 📊 Explain Plan (VERY IMPORTANT)

```js
db.users.find({ age: 25 }).explain("executionStats")
```

Check:

* `COLLSCAN` → bad (no index)
* `IXSCAN` → good (using index)

---

## 🔥 Covered Queries

A query is **covered** if:

* All required fields are in the index
* MongoDB does NOT need to read actual documents

Example:

```js
db.users.createIndex({ name: 1, age: 1 })

db.users.find({ name: "Das" }, { age: 1, _id: 0 })
```

---

## ⚡ Indexing Best Practices

### ✅ Do:

* Index frequently queried fields
* Use compound indexes for multiple filters
* Use indexes for sorting

### ❌ Avoid:

* Over-indexing
* Indexing rarely used fields
* Indexing large fields unnecessarily

---

## 🔥 Order Matters in Compound Index

```js
db.users.createIndex({ name: 1, age: 1 })
```

Supports:

* `{ name: "Das" }` ✅
* `{ name: "Das", age: 25 }` ✅
* `{ age: 25 }` ❌

👉 This is called **prefix rule**

---

## 🧠 Index vs Write Performance

| Operation | Impact    |
| --------- | --------- |
| Read      | Faster    |
| Write     | Slower    |
| Storage   | Increased |

---

## 🔄 Rebuilding Index

```js
db.collection.reIndex()
```

---

## ❌ Dropping Index

```js
db.collection.dropIndex({ name: 1 })
```

---

## 📈 Real-World Example

### Scenario:

Find users by email quickly

### Solution:

```js
db.users.createIndex({ email: 1 }, { unique: true })
```

👉 Ensures:

* Fast lookup
* No duplicate emails

---

## 🎯 Interview Key Points

* Index improves **read performance**
* Uses **B-Tree structure**
* Trade-off: **write overhead**
* Compound index order matters
* Use `.explain()` to verify usage

---

## 🧠 Final Interview Answer

“MongoDB indexing improves query performance by using a B-Tree data structure to quickly locate documents. While it speeds up reads, it adds overhead to writes and storage, so indexes should be used strategically based on query patterns.”

---
