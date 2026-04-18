# MongoDB Aggregation — End-to-End (Theory + Data + Process)

---

# 📌 1. What is Aggregation (Deep Understanding)

Aggregation is a **data processing pipeline** in MongoDB where:

* You take raw data
* Pass it through multiple stages
* Transform it step-by-step
* Produce a final result

---

## 🧠 Real Meaning

👉 “Aggregation is not just querying — it is **processing + transforming + analyzing data**.”

---

## 🔄 Pipeline Concept

```text
Raw Data → Filter → Transform → Group → Sort → Final Output
```

Each step is called a **stage**

---

# 🧱 2. Real-World Scenario

👉 You are building an **e-commerce system**

You want to answer:

> “Which users spent the most on completed orders?”

---

# 📊 3. Raw Data (Input)

## 👤 users collection

```json
[
  { "_id": 1, "name": "Das" },
  { "_id": 2, "name": "Ravi" }
]
```

---

## 📦 orders collection

```json
[
  { "userId": 1, "amount": 1000, "status": "completed" },
  { "userId": 1, "amount": 2000, "status": "completed" },
  { "userId": 2, "amount": 1500, "status": "pending" },
  { "userId": 2, "amount": 3000, "status": "completed" }
]
```

---

# 🧠 4. How to Think Before Writing Aggregation

Break the problem into steps:

1. Only consider **completed orders**
2. Combine users with their orders
3. Calculate **total spending per user**
4. Sort users by highest spending

---

# ⚙️ 5. Aggregation Pipeline (Process)

```js
db.orders.aggregate([

  // Step 1: Filter completed orders
  {
    $match: { status: "completed" }
  },

  // Step 2: Group by userId and calculate total
  {
    $group: {
      _id: "$userId",
      totalSpent: { $sum: "$amount" }
    }
  },

  // Step 3: Join with users collection
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },

  // Step 4: Flatten user array
  {
    $unwind: "$user"
  },

  // Step 5: Shape final output
  {
    $project: {
      userName: "$user.name",
      totalSpent: 1,
      _id: 0
    }
  },

  // Step 6: Sort by totalSpent
  {
    $sort: { totalSpent: -1 }
  }

])
```

---

# 🔍 6. Step-by-Step Execution (What Happens Internally)

---

## 🔹 Step 1: `$match`

```json
[
  { "userId": 1, "amount": 1000 },
  { "userId": 1, "amount": 2000 },
  { "userId": 2, "amount": 3000 }
]
```

👉 Removed pending orders

---

## 🔹 Step 2: `$group`

```json
[
  { "_id": 1, "totalSpent": 3000 },
  { "_id": 2, "totalSpent": 3000 }
]
```

👉 Summed amount per user

---

## 🔹 Step 3: `$lookup`

```json
[
  {
    "_id": 1,
    "totalSpent": 3000,
    "user": [{ "_id": 1, "name": "Das" }]
  }
]
```

👉 Joined user data

---

## 🔹 Step 4: `$unwind`

```json
{
  "_id": 1,
  "totalSpent": 3000,
  "user": { "_id": 1, "name": "Das" }
}
```

👉 Flattened array

---

## 🔹 Step 5: `$project`

```json
{
  "userName": "Das",
  "totalSpent": 3000
}
```

👉 Clean output

---

## 🔹 Step 6: `$sort`

```json
[
  { "userName": "Das", "totalSpent": 3000 },
  { "userName": "Ravi", "totalSpent": 3000 }
]
```

👉 Sorted result

---

# ⚡ 7. Why Order Matters (Critical)

👉 Each stage depends on previous output

---

### ❌ Wrong Example

* Doing `$project` before `$match`
* Removing fields before using them

---

### ✅ Correct Flow

```text
Filter → Group → Join → Transform → Sort
```

---

# 🧠 8. Mental Model (Most Important)

Before writing aggregation, always think:

1. What data do I need?
2. What should I remove first?
3. What calculations are required?
4. What should final output look like?

---

# 🚀 9. Performance Insights

* `$match` early → reduces data
* `$lookup` is expensive → use carefully
* Use indexes for `$match`
* Avoid unnecessary stages

---

# 🎯 10. Final Interview Answer

“Aggregation in MongoDB is a pipeline-based data processing approach where documents pass through multiple stages such as filtering, grouping, joining, and sorting. Each stage transforms the data, and the order is important because each stage operates on the result of the previous stage.”

---

# ⚡ Final Summary

* Aggregation = step-by-step processing
* Uses pipeline
* Order matters
* Used for analytics and transformations

---
