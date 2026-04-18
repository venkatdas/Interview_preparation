# MongoDB Data Modeling — Embedding vs Referencing

---

# 📌 What is Data Modeling in MongoDB?

Data modeling is how you **structure your data** in collections.

MongoDB provides two main approaches:

* **Embedding (Denormalization)**
* **Referencing (Normalization)**

---

# 🧠 1. Embedding (Denormalization)

## 🔹 Definition

Embedding means storing **related data inside the same document**.

---

## 📊 Example

```json id="uhv1g3"
{
  "_id": 1,
  "name": "Das",
  "orders": [
    { "product": "Laptop", "price": 50000 },
    { "product": "Phone", "price": 20000 }
  ]
}
```

---

## 🧠 How it works

* All related data is stored together
* No need for joins
* One query fetches everything

---

## ✅ Advantages

* Fast read performance
* No `$lookup` required
* Simple queries
* Better for read-heavy applications

---

## ❌ Disadvantages

* Data duplication
* Large document size (16MB limit)
* Hard to update nested data frequently

---

## 🎯 When to Use Embedding

* One-to-few relationships
* Data accessed together frequently
* Small datasets

---

# 🧠 2. Referencing (Normalization)

## 🔹 Definition

Referencing means storing related data in **separate collections** and linking them using IDs.

---

## 📊 Example

### users collection

```json id="8uqztg"
{ "_id": 1, "name": "Das" }
```

### orders collection

```json id="t96g2y"
{ "userId": 1, "product": "Laptop", "price": 50000 }
```

---

## 🧠 How it works

* Data stored separately
* Use `$lookup` to combine data

---

## 🔗 Example with `$lookup`

```js id="9rxw91"
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders"
    }
  }
])
```

---

## ✅ Advantages

* No data duplication
* Scalable for large datasets
* Easier updates

---

## ❌ Disadvantages

* Requires `$lookup` (join)
* Slower reads compared to embedding
* More complex queries

---

## 🎯 When to Use Referencing

* One-to-many or many-to-many relationships
* Large or growing datasets
* Data updated frequently

---

# ⚖️ Embedding vs Referencing

| Feature     | Embedding     | Referencing          |
| ----------- | ------------- | -------------------- |
| Storage     | Same document | Separate collections |
| Performance | Faster reads  | Slower (needs join)  |
| Complexity  | Simple        | Complex              |
| Scalability | Limited       | High                 |
| Duplication | Yes           | No                   |

---

# 🔥 Key Decision Rule (INTERVIEW GOLD)

👉 **“Design based on access pattern”**

---

## 🧠 Rule of Thumb

* Read together → **Embed**
* Grow large / update often → **Reference**

---

# 🚀 Real-World Example

## E-commerce

### ❌ Wrong (Embedding everything)

```json id="r3oz5h"
{
  "user": "Das",
  "orders": [1000 orders...]
}
```

👉 Too large ❌

---

### ✅ Correct (Referencing)

```json id="0xntcc"
users → basic info  
orders → separate collection  
```

👉 Scalable ✅

---

# 🧠 Final Interview Answer

**“Embedding stores related data within a single document for faster reads, while referencing stores data in separate collections and links them using IDs. The choice depends on access patterns, data size, and update frequency.”**

---

# ⚡ Final Summary

* Embedding → fast, simple
* Referencing → scalable, flexible
* Choose based on use case

---
