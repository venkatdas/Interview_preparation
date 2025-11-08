# 🛡️ How to Prevent Double Payment if API Call Fails

## 🧠 The Problem: Double Payment Risk

When a client (like a browser or mobile app) sends a payment request to a server, anything can go wrong in between.

### 3 Scenarios

1. **Request never reaches the server** → The client retries safely (no harm, because the server never saw it).
2. **Server starts processing but fails midway** → Dangerous! You don't know if the payment was charged or not.
3. **Server processed successfully, but response failed to reach client** → Very dangerous! Client retries, and payment might happen twice.

---

## 💡 The Solution: Idempotency Keys

To solve this, we use something called an **idempotency key**.

Think of it as a **unique transaction fingerprint** shared between the client and server.

---

## 🧩 How It Works — Step by Step

### 1. Client generates or requests an Idempotency Key

- A unique key (UUID or random string).
- Can be generated on the client side or fetched from the server.
- Example:

```
idempotency-key: 9f4bda12-5c3b-4f1a-98a9-734af9b0cde7
```

### 2. Client includes the key in every request

```http
POST /api/payment
Content-Type: application/json
Idempotency-Key: 9f4bda12-5c3b-4f1a-98a9-734af9b0cde7
```

Body:

```json
{
  "amount": 500,
  "currency": "INR",
  "userId": "123"
}
```

### 3. Server checks if key already exists

When the server receives the request:

```javascript
if (redis.exists(idempotencyKey)) {
   return redis.get(idempotencyKey); // return previous response
}
```

If it does not exist, the server:
1. Processes the payment.
2. Stores the key along with the response (and maybe request body).
3. Returns the response to the client.

Example (pseudo-code):

```javascript
if (!redis.exists(idempotencyKey)) {
  const result = processPayment(request);
  redis.set(idempotencyKey, result, { EX: 3600 }); // store for 1 hour
  return result;
} else {
  return redis.get(idempotencyKey);
}
```

### 4. Key Expiration (TTL)

You don't want your Redis to store old transactions forever. So, you set a **TTL (time-to-live)** — typically a few hours or days depending on your business case.

Example:
- **Payments** → 24 hours
- **Orders** → 1 hour
- **OTP or temporary actions** → few minutes

---

## 🔄 Example Scenario in Action

Let's see how this prevents double payment 👇

### Case: Response Lost (Scenario 3)

1. **Client** → sends payment request with key `abc123`
2. **Server** → processes payment, saves response in Redis with key `abc123`
3. **Response fails to reach client** (network issue)
4. **Client retries** same request with key `abc123`
5. **Server sees** that key already exists → returns same response ✅ **No double payment!**

---

## ⚙️ Where to Store Idempotency Keys

You can use:
- **Redis** (most common, in-memory + TTL)
- **Database table** (if persistence needed)
- **External cache layer** (like Memcached)

---

## ✅ Benefits

| Benefit | Description |
|---------|-------------|
| 💰 **Prevents duplicate charges** | Even if client retries multiple times |
| ⚡ **Improves reliability** | Safe retries, no side effects |
| 🧾 **Easier auditing** | Every transaction linked to a unique key |
| 🔒 **Stateless clients** | The server handles all idempotency logic |

---

## 🧠 Quick Analogy

Think of the idempotency key like a **receipt number**:
- You can show it again and again.
- But the shopkeeper knows: *"Ah, this bill already exists — no need to charge again."*

---

## 💬 Real Example (Stripe does this)

Stripe's API requires:

```http
Idempotency-Key: <unique-key>
```

If you send the same key again within 24 hours, Stripe returns the exact same response, not a new charge.

That's exactly how global payment APIs prevent duplicate transactions.

---

## 📝 Summary

1. Client generates a unique **idempotency key**
2. Includes it in every API request
3. Server checks if key exists in cache (Redis)
4. If exists → return cached response
5. If not → process request, cache response with TTL
6. Client can safely retry without risk of duplicate operations

**Result:** Safe retries, no double payments! 🎉