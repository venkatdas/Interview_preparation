# MongoDB Sharding — Complete Guide

---

# 📌 What is Sharding?

Sharding in MongoDB is a **horizontal scaling technique** where data is split and distributed across multiple servers (called *shards*).

👉 Instead of storing all data on one server, MongoDB distributes it across many machines.

---

## 🧠 Simple Definition

**“Sharding is the process of distributing large datasets across multiple servers to improve performance and scalability.”**

---

# 🔥 Why Sharding is Needed

When your application grows:

* 📈 Data becomes very large
* ⚡ Queries become slow
* 💾 Single server reaches storage limit
* 🚫 CPU and memory become bottlenecks

👉 Vertical scaling (adding more RAM/CPU) is limited and expensive

👉 Solution: **Sharding (horizontal scaling)**

---

# 🧱 How Sharding Works

MongoDB divides data into smaller pieces called **chunks** and distributes them across shards.

---

## 🔹 Components of Sharded Cluster

### 1. **Shard**

* Stores actual data
* Each shard is usually a **replica set**

---

### 2. **Config Server**

* Stores metadata (where data is located)

---

### 3. **Query Router (`mongos`)**

* Entry point for client requests
* Routes queries to correct shard

---

## 🔄 Flow

```text id="o4co7s"
Client → mongos → (decides shard) → Shard → Response
```

---

# 🔑 What is a Shard Key?

A **shard key** determines how data is distributed.

```js id="a7b6py"
{ userId: 1 }
```

👉 MongoDB uses this field to decide:

* Which shard stores the document
* How data is split

---

# 🧠 Types of Sharding

---

## 🔹 1. Range-Based Sharding

```text id="39zwzm"
1–100 → Shard1  
101–200 → Shard2  
```

### ✅ Pros:

* Efficient for range queries

### ❌ Cons:

* Can cause uneven distribution (hotspot)

---

## 🔹 2. Hash-Based Sharding

```js id="ndm4rx"
{ userId: "hashed" }
```

### ✅ Pros:

* Even data distribution

### ❌ Cons:

* Poor for range queries

---

# ⚡ Example

### Data:

```json id="pnr8je"
{ "userId": 101 }
{ "userId": 205 }
```

### Sharding:

* userId 101 → Shard1
* userId 205 → Shard2

---

# 🚀 When to Use Sharding

---

## ✅ Use Sharding When:

### 1. Large Dataset

* Data size exceeds single server capacity

---

### 2. High Traffic / High Throughput

* Too many read/write operations

---

### 3. Performance Issues

* Queries are slow due to large data

---

### 4. Need Horizontal Scaling

* System must scale across multiple machines

---

# ❌ When NOT to Use Sharding

---

## ❌ Avoid Sharding When:

* Small dataset
* Low traffic
* Simple applications
* Can scale vertically (add RAM/CPU)

---

# 🔥 Sharding vs Replication

| Feature  | Sharding             | Replication       |
| -------- | -------------------- | ----------------- |
| Purpose  | Scale data           | High availability |
| Data     | Split across servers | Same data copied  |
| Writes   | Distributed          | Primary only      |
| Use case | Large datasets       | Fault tolerance   |

---

# ⚡ Advantages of Sharding

* Horizontal scalability
* Improved performance
* Handles big data
* Load distribution

---

# ❗ Challenges

* Complex setup
* Requires good shard key design
* Query routing overhead

---

# 🧠 Best Practices

* Choose a **good shard key**
* Avoid hotspots (uneven load)
* Use hashed sharding for uniform distribution
* Monitor performance regularly

---

# 🎯 Real-World Example

👉 E-commerce system:

* Millions of users
* Huge orders data

### Solution:

* Shard by `userId`

👉 Each shard stores subset of users → faster queries

---

# 🧠 Final Interview Answer

“Sharding in MongoDB is a horizontal scaling technique where data is distributed across multiple servers using a shard key. It is used when datasets become large or when a single server cannot handle the load, enabling better performance and scalability.”

---

# ⚡ Final Summary

* Sharding = distribute data
* Uses shard key
* Improves scalability
* Used for large-scale systems

---
