# MongoDB Interview Questions — Beginner to Advanced

> **Complete reference for Senior/Lead MERN Developer interviews**
> Covers: Core concepts → Indexing → Aggregation → Replication → Sharding → Transactions → Performance → Security → Architecture

---

## Table of Contents

1. [What is MongoDB?](#1-what-is-mongodb)
2. [Beginner Questions](#beginner-questions)
3. [Intermediate Questions](#intermediate-questions)
4. [Advanced Questions](#advanced-questions)
5. [System Design / Architecture Questions](#system-design--architecture-questions)
6. [Quick-Fire Comparison Questions](#quick-fire-comparison-questions)

---

## 1. What is MongoDB?

MongoDB is an open-source, **document-oriented NoSQL database** built for scalability and developer flexibility. Instead of storing data in rows and columns like a relational database, MongoDB stores data as **BSON documents** (Binary JSON) inside **collections**.

### Core Characteristics

| Feature | Description |
|---|---|
| **Document Model** | Data stored as JSON-like BSON documents |
| **Schema-less** | Each document can have a different structure |
| **Horizontally Scalable** | Built-in sharding distributes data across nodes |
| **High Availability** | Replica sets provide automatic failover |
| **Rich Query Language** | Supports filtering, aggregation, geospatial, text search |
| **ACID Transactions** | Multi-document transactions since v4.0 |

### Key Terminology vs SQL

| SQL | MongoDB |
|---|---|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary Key | `_id` field |
| JOIN | `$lookup` (aggregation) |
| Index | Index |
| Stored Procedure | JavaScript function / Aggregation Pipeline |

---

## BEGINNER QUESTIONS

---

### Q1. What is a Document in MongoDB?

A **document** is the basic unit of data in MongoDB, equivalent to a row in SQL. It is stored in **BSON (Binary JSON)** format.

```json
{
  "_id": ObjectId("64a1f2c3e4b5d6e7f8a9b0c1"),
  "name": "Das",
  "age": 28,
  "skills": ["React", "Node.js", "MongoDB"],
  "address": {
    "city": "Hyderabad",
    "pincode": "500001"
  }
}
```

**Key points:**
- `_id` is automatically generated if not provided (type: `ObjectId`)
- Fields can hold arrays, nested documents (sub-documents), strings, numbers, booleans, dates, null, etc.
- Maximum document size is **16 MB**
- No two documents in a collection need the same structure (flexible schema)

---

### Q2. What is a Collection?

A **collection** is a group of MongoDB documents — analogous to a table in SQL. Collections do not enforce a schema by default, though you can add schema validation using **JSON Schema validators**.

```js
// Create collection explicitly
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email"],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+$" }
      }
    }
  }
});
```

Collections are created **implicitly** when you first insert a document into them.

---

### Q3. What is BSON?

**BSON** (Binary JSON) is the binary-encoded serialization format MongoDB uses internally to store documents.

**Why BSON over JSON?**
- Supports additional data types: `Date`, `ObjectId`, `Binary`, `Decimal128`, `Int32`, `Int64`
- More efficient to encode/decode compared to text-based JSON
- Supports ordered fields and rich type information

```
JSON:  { "date": "2024-01-01" }           ← string, needs parsing
BSON:  { "date": ISODate("2024-01-01") }  ← native Date type, efficient
```

---

### Q4. What is the `_id` field?

`_id` is the **primary key** of every MongoDB document. It must be unique within a collection.

- If not provided, MongoDB auto-generates an `ObjectId`
- You can set it manually: `{ _id: "custom-id", name: "Das" }`
- MongoDB creates an index on `_id` automatically

**ObjectId breakdown (12 bytes):**

```
| 4 bytes        | 3 bytes   | 2 bytes   | 3 bytes        |
| Unix timestamp | Machine ID| Process ID| Random Counter |
```

This makes ObjectIds **sortable by creation time** (`_id.getTimestamp()`).

---

### Q5. What are the basic CRUD operations?

#### Create
```js
// Insert one
db.users.insertOne({ name: "Das", age: 28 });

// Insert many
db.users.insertMany([
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 }
]);
```

#### Read
```js
// Find all
db.users.find({});

// Find with filter
db.users.find({ age: { $gte: 25 } });

// Find one
db.users.findOne({ name: "Das" });

// Projection (include/exclude fields)
db.users.find({}, { name: 1, age: 1, _id: 0 });
```

#### Update
```js
// Update one
db.users.updateOne(
  { name: "Das" },
  { $set: { age: 29 } }
);

// Update many
db.users.updateMany(
  { age: { $lt: 25 } },
  { $set: { isJunior: true } }
);

// Upsert (insert if not exists)
db.users.updateOne(
  { email: "das@example.com" },
  { $set: { name: "Das" } },
  { upsert: true }
);
```

#### Delete
```js
// Delete one
db.users.deleteOne({ name: "Das" });

// Delete many
db.users.deleteMany({ age: { $lt: 18 } });
```

---

### Q6. What are common Query Operators?

#### Comparison
| Operator | Meaning |
|---|---|
| `$eq` | Equals |
| `$ne` | Not equals |
| `$gt` / `$gte` | Greater than / Greater than or equal |
| `$lt` / `$lte` | Less than / Less than or equal |
| `$in` | Matches any value in array |
| `$nin` | Not in array |

#### Logical
```js
// $and
db.users.find({ $and: [{ age: { $gte: 18 } }, { isActive: true }] });

// $or
db.users.find({ $or: [{ city: "Hyderabad" }, { city: "Bangalore" }] });

// $not
db.users.find({ age: { $not: { $gte: 30 } } });

// $nor
db.users.find({ $nor: [{ age: { $lt: 18 } }, { isBanned: true }] });
```

#### Element
```js
// Check field exists
db.users.find({ phone: { $exists: true } });

// Check field type
db.users.find({ age: { $type: "int" } });
```

#### Array
```js
// $all — document must have all values
db.users.find({ skills: { $all: ["React", "Node.js"] } });

// $elemMatch — at least one element matches all conditions
db.orders.find({ items: { $elemMatch: { price: { $gt: 100 }, qty: { $gte: 2 } } } });

// $size — exact array length
db.users.find({ skills: { $size: 3 } });
```

---

### Q7. What is a Replica Set?

A **Replica Set** is a group of MongoDB servers (nodes) that maintain the same data, providing **high availability** and **automatic failover**.

```
Primary ──writes──> Secondary 1
        ──writes──> Secondary 2
Client reads ──> Primary (default) or any Secondary
```

**How it works:**
- **Primary** receives all write operations
- Writes are recorded in the **oplog** (operation log)
- **Secondaries** replicate the oplog asynchronously
- If the Primary fails, an **automatic election** picks a new Primary
- Minimum recommended nodes: **3** (1 Primary + 2 Secondaries, or 2 + 1 Arbiter)

**Read Preferences:**
```js
db.collection.find().readPref("secondaryPreferred")
// Options: primary, primaryPreferred, secondary, secondaryPreferred, nearest
```

---

### Q8. What is Sharding?

**Sharding** is MongoDB's method of **horizontal scaling** — distributing data across multiple machines called **shards**.

```
Client → mongos (Query Router) → Config Server → Shard 1 / Shard 2 / Shard 3
```

**Components:**
- **Shard** — holds a subset of the data (each shard is itself a replica set)
- **mongos** — query router; routes client requests to the correct shard
- **Config Server** — stores metadata and cluster configuration

**Shard Key** — the field used to distribute documents across shards:
```js
sh.shardCollection("mydb.orders", { customerId: 1 });
```

**Choosing a shard key is critical** — a poor key causes **hotspots** (uneven distribution).

---

## INTERMEDIATE QUESTIONS

---

### Q9. Explain the Aggregation Pipeline

The **Aggregation Pipeline** is MongoDB's data processing framework. Documents pass through a sequence of stages, each transforming the data.

```js
db.orders.aggregate([
  // Stage 1: Filter
  { $match: { status: "completed" } },

  // Stage 2: Group and sum
  { $group: {
    _id: "$customerId",
    totalSpent: { $sum: "$amount" },
    orderCount: { $sum: 1 }
  }},

  // Stage 3: Sort by totalSpent descending
  { $sort: { totalSpent: -1 } },

  // Stage 4: Limit results
  { $limit: 10 },

  // Stage 5: Shape the output
  { $project: {
    _id: 0,
    customerId: "$_id",
    totalSpent: 1,
    orderCount: 1
  }}
]);
```

**Common Pipeline Stages:**

| Stage | Purpose |
|---|---|
| `$match` | Filter documents (like WHERE) |
| `$group` | Group and aggregate (like GROUP BY) |
| `$project` | Shape output fields (like SELECT) |
| `$sort` | Order results |
| `$limit` / `$skip` | Pagination |
| `$lookup` | LEFT JOIN with another collection |
| `$unwind` | Deconstruct array into separate documents |
| `$addFields` | Add computed fields |
| `$facet` | Run multiple pipelines in parallel |
| `$bucket` | Group by range |
| `$out` / `$merge` | Write results to a collection |

---

### Q10. What is `$lookup`? How does it work?

`$lookup` performs a **LEFT OUTER JOIN** between two collections.

```js
// Orders collection: { _id, customerId, amount }
// Customers collection: { _id, name, email }

db.orders.aggregate([
  {
    $lookup: {
      from: "customers",         // Collection to join
      localField: "customerId",  // Field in orders
      foreignField: "_id",       // Field in customers
      as: "customerInfo"         // Output array field name
    }
  },
  { $unwind: "$customerInfo" }   // Flatten the array
]);
```

**Uncorrelated pipeline lookup (more powerful):**
```js
{
  $lookup: {
    from: "inventory",
    let: { productId: "$productId" },
    pipeline: [
      { $match: { $expr: { $eq: ["$_id", "$$productId"] } } },
      { $project: { stock: 1, warehouse: 1 } }
    ],
    as: "inventoryData"
  }
}
```

**Performance note:** Always `$match` first to reduce documents before `$lookup`. Create indexes on the join fields.

---

### Q11. What types of Indexes does MongoDB support?

Indexes are data structures that speed up queries. Without indexes, MongoDB does a **collection scan** (reads every document).

#### Single Field Index
```js
db.users.createIndex({ email: 1 });  // 1 = ascending, -1 = descending
```

#### Compound Index
```js
db.users.createIndex({ lastName: 1, firstName: 1 });
// Supports queries on: lastName, OR lastName + firstName
// Does NOT support queries on firstName alone (prefix rule)
```

#### Multikey Index (for arrays)
```js
db.users.createIndex({ skills: 1 });
// MongoDB creates an index entry for each array element
```

#### Text Index (full-text search)
```js
db.articles.createIndex({ content: "text", title: "text" });
db.articles.find({ $text: { $search: "mongodb aggregation" } });
```

#### Geospatial Index
```js
db.locations.createIndex({ coordinates: "2dsphere" });
db.locations.find({
  coordinates: {
    $near: { $geometry: { type: "Point", coordinates: [78.4867, 17.3850] }, $maxDistance: 5000 }
  }
});
```

#### TTL Index (auto-expiry)
```js
// Automatically delete documents after 1 hour
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });
```

#### Partial Index (index a subset of documents)
```js
db.orders.createIndex(
  { customerId: 1 },
  { partialFilterExpression: { status: "active" } }
);
// Smaller index, faster writes
```

#### Wildcard Index
```js
db.products.createIndex({ "attributes.$**": 1 });
// Indexes all fields under attributes — useful for dynamic schemas
```

#### Sparse Index
```js
db.users.createIndex({ phone: 1 }, { sparse: true });
// Only indexes documents where the phone field exists
```

---

### Q12. What is the ESR Rule for Compound Indexes?

The **ESR Rule** defines the optimal field order in a compound index:

**E → S → R**
- **E**quality fields first (fields used with `$eq`)
- **S**ort fields second (fields used in `.sort()`)
- **R**ange fields last (fields used with `$gt`, `$lt`, `$in`, etc.)

```js
// Query: find users in Hyderabad, aged 20-30, sorted by name
db.users.find({ city: "Hyderabad", age: { $gte: 20, $lte: 30 } }).sort({ name: 1 });

// Correct compound index (ESR):
db.users.createIndex({ city: 1, name: 1, age: 1 });
//                     ^E        ^S       ^R
```

Placing range fields before sort fields forces MongoDB to sort in memory (blocking `SORT` stage), degrading performance.

---

### Q13. What is the `explain()` method?

`explain()` shows how MongoDB executes a query — essential for performance tuning.

```js
db.users.find({ age: { $gt: 25 } }).explain("executionStats");
```

**Key fields to examine:**
```json
{
  "queryPlanner": {
    "winningPlan": {
      "stage": "IXSCAN",        // ✅ Index scan (good)
      "indexName": "age_1"
    }
  },
  "executionStats": {
    "executionTimeMillis": 2,
    "totalKeysExamined": 150,   // Index keys scanned
    "totalDocsExamined": 150,   // Documents read
    "nReturned": 150            // Documents returned
  }
}
```

**Stages to watch out for:**
| Stage | Meaning |
|---|---|
| `COLLSCAN` | ❌ Full collection scan — needs an index |
| `IXSCAN` | ✅ Index scan |
| `FETCH` | Fetching full documents from index results |
| `SORT_KEY_GENERATOR` | ❌ In-memory sort — index might help |
| `PROJECTION` | Applying projection |

**Rule of thumb:** `totalDocsExamined` should be close to `nReturned`. A large gap means the index isn't selective enough.

---

### Q14. What are MongoDB Transactions?

MongoDB supports **multi-document ACID transactions** since version 4.0 (replica sets) and 4.2 (sharded clusters).

```js
const session = client.startSession();

try {
  session.startTransaction({
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority" }
  });

  // All operations use the session
  await db.collection("accounts").updateOne(
    { _id: senderId },
    { $inc: { balance: -500 } },
    { session }
  );

  await db.collection("accounts").updateOne(
    { _id: receiverId },
    { $inc: { balance: +500 } },
    { session }
  );

  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}
```

**ACID in MongoDB:**
- **Atomicity** — all operations in a transaction succeed or all are rolled back
- **Consistency** — data remains valid per defined rules
- **Isolation** — transactions use snapshot isolation; operations see a consistent view
- **Durability** — committed transactions survive crashes (via journal)

**Important caveats:**
- Transactions have a **60-second** limit by default
- Transactions incur **performance overhead** — only use when needed
- For single-document operations, MongoDB is always atomic without transactions

---

### Q15. What is Write Concern and Read Concern?

#### Write Concern

Controls **acknowledgment level** for write operations.

```js
db.orders.insertOne(
  { item: "laptop", qty: 1 },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
);
```

| Option | Meaning |
|---|---|
| `w: 0` | No acknowledgment (fire and forget) |
| `w: 1` | Primary acknowledged (default) |
| `w: "majority"` | Majority of replica set acknowledged |
| `j: true` | Write is journaled to disk before acknowledgment |
| `wtimeout` | Max wait time in ms |

#### Read Concern

Controls **consistency level** for read operations.

| Level | Meaning |
|---|---|
| `local` | Returns most recent data on this node (default) |
| `available` | Like local but may return data not replicated yet |
| `majority` | Returns data acknowledged by majority (no dirty reads) |
| `linearizable` | Reflects all prior majority-acknowledged writes |
| `snapshot` | Snapshot of the data at a point in time (used in transactions) |

---

### Q16. What is the Aggregation `$unwind` stage?

`$unwind` **deconstructs an array field** — it outputs one document per array element.

```js
// Input document:
{ _id: 1, name: "Das", skills: ["React", "Node.js", "MongoDB"] }

db.users.aggregate([{ $unwind: "$skills" }]);

// Output (3 documents):
{ _id: 1, name: "Das", skills: "React" }
{ _id: 1, name: "Das", skills: "Node.js" }
{ _id: 1, name: "Das", skills: "MongoDB" }
```

**With options:**
```js
{ $unwind: {
  path: "$skills",
  includeArrayIndex: "skillIndex",   // Adds array index field
  preserveNullAndEmptyArrays: true   // Keep docs where field is null/missing
}}
```

**Common pattern — unwind then group:**
```js
// Count how many users have each skill
db.users.aggregate([
  { $unwind: "$skills" },
  { $group: { _id: "$skills", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);
```

---

### Q17. How does MongoDB handle schema design? Embed vs Reference?

This is one of the most important MongoDB design decisions.

#### Embedding (Denormalization)

Store related data **inside** the same document.

```json
{
  "_id": ObjectId("..."),
  "name": "Das",
  "address": {
    "street": "MG Road",
    "city": "Hyderabad",
    "pincode": "500001"
  },
  "orders": [
    { "item": "Laptop", "amount": 75000, "date": ISODate("2024-01-01") }
  ]
}
```

**Use embedding when:**
- Data is always accessed together
- One-to-few relationship (not one-to-millions)
- Child data doesn't change frequently
- No need to query child data independently

#### Referencing (Normalization)

Store related data in **separate collections** and link via IDs.

```json
// users collection
{ "_id": ObjectId("u1"), "name": "Das" }

// orders collection
{ "_id": ObjectId("o1"), "userId": ObjectId("u1"), "item": "Laptop", "amount": 75000 }
```

**Use referencing when:**
- Data is large or unbounded (many orders per user)
- Data is shared across multiple entities
- Need to query child data independently
- Frequent updates to child documents

#### The 16 MB Rule

A document has a **16 MB limit**. If embedding causes documents to grow unboundedly (e.g., embedding thousands of orders per user), use referencing.

---

## ADVANCED QUESTIONS

---

### Q18. Explain the WiredTiger Storage Engine

**WiredTiger** is the default storage engine in MongoDB since v3.2. It replaced MMAPv1.

**Key features:**

#### Document-Level Concurrency
- Uses **optimistic concurrency control** with no document-level locks
- Multiple clients can write to different documents in the same collection simultaneously

#### Compression
- **Snappy** (default) — fast compression, moderate ratio
- **zlib** — higher ratio, slower
- **zstd** (since v4.2) — best ratio + speed balance
- Reduces storage by up to **80%**

#### MVCC (Multi-Version Concurrency Control)
- Maintains multiple versions of a document for concurrent reads and writes
- Readers don't block writers; writers don't block readers

#### Cache
- WiredTiger keeps a **cache** in RAM (default: 50% of RAM or 1 GB, whichever is larger)
- Data is read from disk → cache → queries served from cache
- Dirty pages are flushed to disk periodically (checkpoint every 60s)

```js
// View WiredTiger stats
db.serverStatus().wiredTiger.cache
```

---

### Q19. What is the Oplog and how does Replication work internally?

The **oplog** (operations log) is a special **capped collection** in the `local` database that records all write operations applied to the primary.

```
Primary:
  - Receives write → Applies to data files → Appends to oplog

Secondary:
  - Tails the primary's oplog (like `tail -f`)
  - Replays each operation in its own data files
  - Runs async by default (small replication lag acceptable)
```

#### Oplog Entry Structure
```json
{
  "ts": Timestamp(1700000000, 1),  // Operation timestamp
  "op": "i",                        // i=insert, u=update, d=delete, c=command
  "ns": "mydb.users",              // Namespace
  "o": { "name": "Das", "age": 28 } // Operation document
}
```

#### Election Process (Raft-inspired)
1. Primary stops sending **heartbeats** (every 2 seconds)
2. A secondary waits `electionTimeoutMillis` (default 10s)
3. It **increments its term**, votes for itself, requests votes from peers
4. First node to get **majority votes** becomes the new Primary
5. Old primary (if it recovers) detects a higher term and steps down

---

### Q20. How does Sharding work internally? Explain Chunk Distribution.

#### Data Distribution via Chunks

MongoDB divides sharded collection data into **chunks** — contiguous ranges of the shard key.

```
Shard Key: { customerId: 1 }

Chunk 1: customerId [MinKey → "C"]  → Shard A
Chunk 2: customerId ["C" → "M"]    → Shard B
Chunk 3: customerId ["M" → MaxKey] → Shard C
```

#### Balancer

The **balancer** (runs on Config Server) monitors chunk counts per shard and **migrates chunks** to maintain even distribution.

```
Shard A: 50 chunks
Shard B: 50 chunks
Shard C: 20 chunks  ← Balancer migrates chunks here
```

#### Shard Key Strategies

**Ranged Sharding** (default):
- Documents with similar shard key values go to the same shard
- Good for range queries but risks hotspots (sequential inserts all go to one shard)

**Hashed Sharding:**
```js
sh.shardCollection("mydb.orders", { customerId: "hashed" });
```
- Distributes data evenly (hash randomizes placement)
- Range queries require hitting all shards (scatter-gather)

**Zone Sharding:**
- Pin specific ranges to specific shards (useful for geo-compliance or hardware tiers)

#### Targeted vs Scatter-Gather Queries
- **Targeted query**: filter includes shard key → `mongos` routes to ONE shard ✅
- **Scatter-gather query**: filter does NOT include shard key → `mongos` queries ALL shards, merges results ❌ (expensive)

---

### Q21. What is a Change Stream?

**Change Streams** allow applications to **subscribe to real-time changes** in MongoDB data using the aggregation framework. They use the oplog internally.

```js
// Node.js example
const changeStream = db.collection("orders").watch([
  { $match: { "fullDocument.status": "shipped" } }  // Optional filter
]);

changeStream.on("change", (event) => {
  console.log("Operation:", event.operationType);    // insert, update, delete
  console.log("Document:", event.fullDocument);
  console.log("Updated fields:", event.updateDescription?.updatedFields);
});
```

**Event types:** `insert`, `update`, `delete`, `replace`, `invalidate`, `drop`, `rename`

**Resume tokens:**
```js
// Store the resume token
let resumeToken = null;
changeStream.on("change", (event) => {
  resumeToken = event._id;
  // ... process event
});

// Resume after restart
const newStream = collection.watch([], { resumeAfter: resumeToken });
```

**Requirements:**
- Only works on **replica sets** and **sharded clusters** (not standalone)
- Requires `majority` read concern

**Use cases:** Real-time dashboards, event-driven microservices, cache invalidation, audit logs

---

### Q22. How do you optimize a slow MongoDB query?

**Step-by-step approach:**

#### 1. Identify slow queries
```js
// Enable profiler (level 2 = all, level 1 = slow only)
db.setProfilingLevel(1, { slowms: 100 });

// Query the profiler
db.system.profile.find().sort({ ts: -1 }).limit(10);

// Or use currentOp
db.currentOp({ "active": true, "secs_running": { $gte: 5 } });
```

#### 2. Analyze with `explain()`
```js
db.orders.find({ customerId: "u1", status: "pending" })
         .sort({ createdAt: -1 })
         .explain("executionStats");
```

Look for: `COLLSCAN`, high `totalDocsExamined`, in-memory `SORT`

#### 3. Add the right index
```js
// ESR: customerId (equality), createdAt (sort), status (range — but here it's equality too)
db.orders.createIndex({ customerId: 1, status: 1, createdAt: -1 });
```

#### 4. Use Covered Queries (avoid FETCH)
```js
// Index: { email: 1, name: 1 }
// Query projects only indexed fields → no document fetch needed
db.users.find({ email: "das@email.com" }, { name: 1, _id: 0 });
```

#### 5. Reduce returned data
```js
// Use projection to fetch only needed fields
db.users.find({}, { name: 1, email: 1, _id: 0 });

// Use limit
db.logs.find({}).sort({ ts: -1 }).limit(100);
```

#### 6. Aggregation pipeline optimization
- Put `$match` and `$limit` as **early** as possible
- `$match` before `$lookup` reduces join size dramatically
- Use indexes in `$match` stages

---

### Q23. What is the difference between `findAndModify`, `findOneAndUpdate`, and `updateOne`?

| Method | Returns | Atomicity |
|---|---|---|
| `updateOne` | Result metadata (matchedCount, modifiedCount) | Atomic on single document |
| `findOneAndUpdate` | The document (before or after update) | Atomic on single document |
| `findAndModify` | The document (legacy, lower-level) | Atomic on single document |

```js
// findOneAndUpdate — returns the NEW document
const updatedDoc = await db.collection("inventory").findOneAndUpdate(
  { sku: "ABC123", qty: { $gte: 1 } },
  { $inc: { qty: -1 } },
  { returnDocument: "after", upsert: false }
);
```

**Use case:** Implementing a **job queue** — atomically claim a task and get it back:
```js
const job = await db.collection("jobs").findOneAndUpdate(
  { status: "pending" },
  { $set: { status: "processing", claimedAt: new Date() } },
  { returnDocument: "after", sort: { createdAt: 1 } }
);
```

---

### Q24. Explain MongoDB's Concurrency Model

MongoDB uses different levels of locking depending on the operation and storage engine:

#### Intent Locks
MongoDB uses **intent locks** at the global, database, and collection levels to coordinate concurrent operations:

| Lock Type | Description |
|---|---|
| `IS` — Intent Shared | Will read data in child resource |
| `IX` — Intent Exclusive | Will write data in child resource |
| `S` — Shared | Read lock |
| `X` — Exclusive | Write lock |

#### WiredTiger: Document-Level Concurrency
WiredTiger uses **optimistic concurrency** — no document-level locks:
- Two writers on **different documents** proceed concurrently
- Two writers on the **same document** — one waits (detected via conflict)
- Readers never block writers (MVCC)

#### Operations that take global locks (brief):
- `db.createCollection()`
- `db.dropDatabase()`
- Index builds (since v4.2, index builds use optimized locking)

---

### Q25. What are Capped Collections?

**Capped collections** are fixed-size collections that automatically **overwrite the oldest documents** when they reach their size limit (circular buffer behavior).

```js
db.createCollection("logs", {
  capped: true,
  size: 10485760, // 10 MB (required)
  max: 1000       // Max 1000 documents (optional)
});
```

**Properties:**
- Documents are stored in **insertion order** — preserved forever
- No explicit `_id` index needed (though `_id` still exists)
- Cannot be sharded
- Cannot delete individual documents (only drop the whole collection)
- Very fast writes (no need to update indexes on old docs being overwritten)
- Supports **tailable cursors** — like `tail -f` on a file

```js
// Tailable cursor — stays open and returns new docs as they arrive
const cursor = db.logs.find({}, { tailable: true, awaitData: true });
```

**Use cases:** Logging, audit trails, event queues, oplog (MongoDB's own oplog is a capped collection)

---

### Q26. How do you implement Pagination in MongoDB?

#### Method 1: Skip/Limit (simple but slow at large offsets)
```js
const page = 3;
const pageSize = 10;

db.products.find({})
  .sort({ createdAt: -1 })
  .skip((page - 1) * pageSize)  // ← MongoDB scans and discards skipped docs
  .limit(pageSize);
```

**Problem:** `skip(10000)` requires scanning 10,000 documents to discard them.

#### Method 2: Cursor-based Pagination (keyset pagination — preferred)
```js
// First page
const firstPage = await db.products.find({})
  .sort({ _id: 1 })
  .limit(10)
  .toArray();

// Get last _id from results
const lastId = firstPage[firstPage.length - 1]._id;

// Next page — use _id as cursor
const nextPage = await db.products.find({ _id: { $gt: lastId } })
  .sort({ _id: 1 })
  .limit(10)
  .toArray();
```

**Advantages of cursor-based:**
- O(log n) — uses index directly, no scanning
- Handles real-time inserts correctly
- Consistent results even if data changes between pages

---

### Q27. What is GridFS?

**GridFS** is MongoDB's specification for **storing files larger than 16 MB** (the document size limit). It splits files into chunks and stores metadata separately.

```
fs.files collection:    { _id, filename, length, chunkSize, uploadDate, contentType, metadata }
fs.chunks collection:   { _id, files_id, n (chunk number), data (binary) }
```

Default chunk size: **255 KB**

```js
// Node.js with mongoose + gridfs-stream
const bucket = new mongodb.GridFSBucket(db, { bucketName: "uploads" });

// Upload
fs.createReadStream("./video.mp4").pipe(
  bucket.openUploadStream("video.mp4", { chunkSizeBytes: 1048576 })
);

// Download
bucket.openDownloadStreamByName("video.mp4").pipe(res);
```

**When to use GridFS:**
- Files > 16 MB
- Need to serve chunks of a file (video streaming with range requests)
- Want to store file metadata alongside the binary

**When NOT to use GridFS:**
- Files < 16 MB — just store as binary in a document
- High-performance file serving — use S3/CDN + store only the URL in MongoDB

---

## SYSTEM DESIGN / ARCHITECTURE QUESTIONS

---

### Q28. How would you design a MongoDB schema for a social media application?

**Collections:**

```json
// users
{
  "_id": ObjectId("u1"),
  "username": "das_dev",
  "email": "das@example.com",
  "profile": { "bio": "Senior Engineer", "avatar": "url" },
  "followerCount": 1500,
  "followingCount": 200,
  "createdAt": ISODate("2024-01-01")
}

// posts
{
  "_id": ObjectId("p1"),
  "authorId": ObjectId("u1"),
  "content": "MongoDB is awesome!",
  "mediaUrls": ["https://cdn.example.com/img1.jpg"],
  "likeCount": 250,
  "commentCount": 42,
  "tags": ["mongodb", "nosql"],
  "createdAt": ISODate("2024-06-01")
}

// comments
{
  "_id": ObjectId("c1"),
  "postId": ObjectId("p1"),
  "authorId": ObjectId("u2"),
  "text": "Great post!",
  "likeCount": 5,
  "createdAt": ISODate("2024-06-01")
}

// follows (for follow graph)
{
  "_id": ObjectId("f1"),
  "followerId": ObjectId("u2"),
  "followingId": ObjectId("u1"),
  "createdAt": ISODate("2024-06-01")
}

// notifications
{
  "_id": ObjectId("n1"),
  "userId": ObjectId("u1"),   // Recipient
  "type": "like",             // like, comment, follow, mention
  "actorId": ObjectId("u2"),
  "postId": ObjectId("p1"),
  "read": false,
  "createdAt": ISODate("2024-06-01")
}
```

**Key decisions:**
- **likeCount / commentCount** stored on posts as counters (avoid counting every time)
- Comments are **referenced** (not embedded) — unbounded growth
- Follows are a **separate collection** — queryable in both directions with indexes
- `{ followerId: 1, followingId: 1 }` — check if following
- `{ followingId: 1, createdAt: -1 }` — get all followers of a user

---

### Q29. How would you handle a high-write, high-read workload in MongoDB?

**Write optimization:**
- Use **bulk operations** (`bulkWrite`, `insertMany`) over individual writes
- Choose **write concern `w:1`** for high-throughput, non-critical writes
- Shard on a **hashed key** to distribute writes evenly
- Use **time-series collections** (since v5.0) for time-stamped data — highly optimized
- Disable journaling for non-critical caches (not recommended for production)

**Read optimization:**
- Route reads to **secondaries** with `readPreference: "secondaryPreferred"`
- Use **covered queries** (project only indexed fields)
- Implement **application-level caching** (Redis) for hot data
- Use **aggregation with `$facet`** to run multiple queries in one round-trip
- Avoid `$where` and `$regex` without anchored indexes

**Scaling:**
- **Vertical scaling** first (more RAM = larger working set in cache)
- **Horizontal scaling** via sharding for write-heavy workloads
- Use **connection pooling** (default pool size in Node.js Mongoose: 5, tune to 50-100)

---

### Q30. What are MongoDB Time-Series Collections?

Introduced in **MongoDB 5.0**, time-series collections are **optimized for storing measurements over time** (IoT, metrics, financial data).

```js
db.createCollection("sensorReadings", {
  timeseries: {
    timeField: "timestamp",     // Required: the date/time field
    metaField: "sensorId",      // Optional: groups related measurements
    granularity: "seconds"      // seconds | minutes | hours
  },
  expireAfterSeconds: 86400 * 30  // Auto-delete data older than 30 days
});

// Insert
db.sensorReadings.insertOne({
  timestamp: new Date(),
  sensorId: "sensor-001",
  temperature: 23.5,
  humidity: 60.2
});
```

**Why it's fast:**
- MongoDB internally **buckets** measurements by time + meta field
- Columnar compression within buckets (extremely space-efficient)
- Optimized for range scans on `timeField`
- Automatic indexes on `timeField` + `metaField`

**Benchmarks:** Up to **220x less storage** and **60x faster queries** than regular collections for time-series data.

---

## QUICK-FIRE COMPARISON QUESTIONS

---

### Q31. MongoDB vs MySQL — when to use which?

| Scenario | MongoDB | MySQL |
|---|---|---|
| Flexible/dynamic schema | ✅ | ❌ |
| Complex JOINs | ❌ | ✅ |
| Horizontal scale | ✅ (sharding) | ❌ (complex) |
| Strong ACID transactions | Supported but overhead | ✅ native |
| Document/JSON-heavy apps | ✅ | ❌ |
| Financial / banking | ❌ (use relational) | ✅ |
| Rapid iteration, startups | ✅ | ❌ |
| Reporting / Analytics | Use Atlas + BI connector | ✅ |

---

### Q32. What is the difference between `$match` in aggregation vs `find()`?

- `find()` always starts from the beginning of the collection (or index)
- `$match` in a pipeline can come at **any stage** — placed after `$unwind`/`$lookup` it filters the intermediate results
- **Performance tip:** A `$match` at the **very start** of a pipeline IS a `find()` under the hood — MongoDB optimizes it to use indexes

---

### Q33. `updateOne` vs `replaceOne`?

```js
// updateOne — MERGES changes (uses $set, $inc, etc.)
db.users.updateOne({ _id: id }, { $set: { age: 30 } });
// Result: other fields preserved

// replaceOne — REPLACES the entire document (keeps only _id)
db.users.replaceOne({ _id: id }, { name: "Das", age: 30 });
// Result: ALL other fields removed
```

---

### Q34. What is `$expr` in MongoDB?

`$expr` allows using **aggregation expressions inside query operators** — useful for comparing two fields within the same document.

```js
// Find orders where amount > budget
db.orders.find({
  $expr: { $gt: ["$amount", "$budget"] }
});

// Find docs where array length > 3
db.users.find({
  $expr: { $gt: [{ $size: "$skills" }, 3] }
});
```

---

### Q35. What is an Arbiter in a Replica Set?

An **Arbiter** is a replica set member that **holds no data** but participates in **elections** to break ties.

```
Primary + Secondary + Arbiter = 3 members, majority = 2
```

**Use case:** When you want 3-node election quorum but can't afford a 3rd full data node.

**Limitation:** Arbiters can't become Primary and don't serve reads — they're purely for voting.

---

### Q36. How does MongoDB ensure Durability?

**Journaling:**
- MongoDB writes operations to an **in-memory journal buffer** before writing to data files
- Journal is flushed to disk every **50 ms** by default (or on `j: true` write concern)
- On crash, MongoDB replays the journal on restart to recover uncommitted writes

**Checkpoints:**
- WiredTiger creates a **checkpoint** every 60 seconds (full consistent snapshot written to disk)
- Between checkpoints, the journal bridges the gap

---

### Q37. What is Atlas Search?

**Atlas Search** is MongoDB's built-in full-text search engine, powered by **Apache Lucene**, available in MongoDB Atlas.

```js
// Atlas Search aggregation stage
db.products.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "wireless headphones",
        path: ["name", "description"],
        fuzzy: { maxEdits: 1 }        // Typo tolerance
      }
    }
  },
  { $limit: 10 },
  { $project: { name: 1, price: 1, score: { $meta: "searchScore" } } }
]);
```

**Features:** Fuzzy matching, autocomplete, facets, highlighting, relevance scoring, synonyms, multi-language

---

### Q38. What is the difference between Embedded Documents and DBRef?

**Embedded documents** — store related data directly inside the parent document (preferred in MongoDB).

**DBRef** — a convention for referencing documents across collections using `{ $ref, $id, $db }`. **Rarely used today** — manual references (just storing the `ObjectId`) are simpler and `$lookup` handles joins in aggregation.

```js
// Manual reference (preferred)
{ orderId: ObjectId("..."), customerId: ObjectId("...") }

// DBRef (legacy, avoid)
{ customer: { $ref: "customers", $id: ObjectId("..."), $db: "mydb" } }
```

---

### Q39. What security features does MongoDB offer?

```
1. Authentication   → SCRAM-SHA-256, x.509 certificates, LDAP, Kerberos
2. Authorization    → Role-Based Access Control (RBAC)
3. Encryption       → TLS/SSL in-transit, Encrypted Storage Engine (at-rest)
4. Auditing         → Atlas Audit Logs, query/operation logging
5. Field-Level      → Client-Side Field Level Encryption (CSFLE) — encrypts specific fields
   Encryption         before sending to server (even DBA can't read)
6. Network          → IP allowlisting, VPC peering, PrivateLink
```

**Creating a user with RBAC:**
```js
db.createUser({
  user: "appUser",
  pwd: "securePassword",
  roles: [
    { role: "readWrite", db: "myapp" },
    { role: "read", db: "reporting" }
  ]
});
```

---

### Q40. What are the most common MongoDB performance anti-patterns?

| Anti-Pattern | Problem | Fix |
|---|---|---|
| No indexes on queried fields | Full collection scans | Create targeted indexes |
| Unbounded arrays | Document grows past 16MB | Reference instead of embed |
| Large `skip()` values | Slow at high offsets | Cursor-based pagination |
| `$where` with JavaScript | Slow, no index usage | Use native query operators |
| `$regex` without `^` anchor | Full scan even with index | Anchor regex: `/^prefix/` |
| `select *` (no projection) | Fetching unnecessary data | Project only needed fields |
| Not using `bulk` operations | N round-trips instead of 1 | Use `bulkWrite` / `insertMany` |
| Transactions everywhere | Performance overhead | Use only when ACID is required |
| Wrong shard key | Hotspots / scatter-gather | Choose high-cardinality, distributed key |
| Missing TTL indexes on temp data | Collections grow unbounded | Add TTL for sessions, logs, OTPs |

---

*End of MongoDB Interview Q&A — Das's Reference Handbook*
*Covers: Document Model → CRUD → Indexes → Aggregation → Replication → Sharding → Transactions → Performance → Security → Schema Design*
