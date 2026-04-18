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

# MongoDB Aggregation Stages — Complete Guide

---

# 📌 What is Aggregation?

Aggregation is a **pipeline of stages** where each stage processes data and passes it to the next stage.

```text
Input → Stage1 → Stage2 → Stage3 → Output
```

---

# 🧠 Core Rule

👉 **Order matters**
Each stage works on the output of the previous stage.

---

# 🚀 All Important Aggregation Stages

---

## 🔹 1. `$match` — Filter Data

```js
{ $match: { age: { $gt: 20 } } }
```

* Works like SQL `WHERE`
* Filters documents early

---

## 🔹 2. `$project` — Select / Transform Fields

```js
{ $project: { name: 1, age: 1, _id: 0 } }
```

* Select specific fields
* Rename or compute fields

---

## 🔹 3. `$group` — Aggregate Data

```js
{
  $group: {
    _id: "$userId",
    total: { $sum: "$amount" }
  }
}
```

* Performs calculations
* Used for sum, count, avg

---

## 🔹 4. `$sort` — Sort Data

```js
{ $sort: { age: -1 } }
```

* `1` → ascending
* `-1` → descending

---

## 🔹 5. `$limit` — Limit Results

```js
{ $limit: 5 }
```

---

## 🔹 6. `$skip` — Skip Documents

```js
{ $skip: 10 }
```

---

## 🔹 7. `$lookup` — Join Collections

```js
{
  $lookup: {
    from: "orders",
    localField: "_id",
    foreignField: "userId",
    as: "orders"
  }
}
```

* Joins another collection
* Returns array

---

## 🔹 8. `$unwind` — Flatten Arrays

```js
{ $unwind: "$orders" }
```

* Converts array → multiple documents

---

## 🔹 9. `$addFields` / `$set` — Add Fields

```js
{ $addFields: { isAdult: { $gte: ["$age", 18] } } }
```

* Adds computed fields

---

## 🔹 10. `$unset` — Remove Fields

```js
{ $unset: "password" }
```

* Removes fields

---

## 🔹 11. `$count` — Count Documents

```js
{ $count: "totalUsers" }
```

---

## 🔹 12. `$facet` — Multiple Pipelines

```js
{
  $facet: {
    data: [{ $limit: 5 }],
    total: [{ $count: "count" }]
  }
}
```

* Runs multiple pipelines in parallel

---

## 🔹 13. `$replaceRoot` / `$replaceWith`

```js
{ $replaceRoot: { newRoot: "$user" } }
```

* Replaces document structure

---

## 🔹 14. `$bucket` — Group into Ranges

```js
{
  $bucket: {
    groupBy: "$age",
    boundaries: [0, 20, 40, 60],
    default: "Other"
  }
}
```

* Used for ranges

---

## 🔹 15. `$bucketAuto` — Auto Bucketing

```js
{
  $bucketAuto: {
    groupBy: "$price",
    buckets: 5
  }
}
```

* Automatically creates buckets

---

## 🔹 16. `$sortByCount` — Group + Count

```js
{ $sortByCount: "$category" }
```

* Shortcut for group + sort

---

## 🔹 17. `$sample` — Random Documents

```js
{ $sample: { size: 3 } }
```

---

## 🔹 18. `$merge` — Save Results

```js
{
  $merge: {
    into: "outputCollection"
  }
}
```

* Writes results to collection

---

## 🔹 19. `$out` — Output to Collection

```js
{ $out: "newCollection" }
```

* Replaces collection

---

## 🔹 20. `$redact` — Filter Sensitive Data

```js
{
  $redact: {
    $cond: {
      if: { $eq: ["$role", "admin"] },
      then: "$$KEEP",
      else: "$$PRUNE"
    }
  }
}
```

---

# 🧠 Recommended Order (Best Practice)

```text
$match → $lookup → $unwind → $group → $project → $sort → $limit
```

---

# ⚡ Example Full Pipeline

```js
db.orders.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: "$userId",
      total: { $sum: "$amount" }
    }
  },
  { $sort: { total: -1 } },
  { $limit: 5 }
])
```

---

# 🔥 Interview Key Points

* Aggregation = pipeline
* Order matters
* `$match` early improves performance
* `$group` used for calculations
* `$lookup` used for joins

---

# 🎯 Final Summary

Aggregation stages are building blocks used to:

* Filter
* Transform
* Group
* Analyze

👉 Each stage processes data step-by-step.

---

