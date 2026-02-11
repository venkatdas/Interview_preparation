# Polling vs Pooling - JavaScript Real-Time Guide

## 📊 POLLING (JavaScript)

**Definition:** Repeatedly checking or querying for a status/change at regular intervals.

### Real-World Analogy
Like repeatedly asking "Are we there yet?" during a road trip.

---

## 🔴 Real-Time Use Cases of POLLING

### 1. **Live Chat Application - New Messages**
```javascript
// Polling for new messages every 3 seconds
let lastMessageId = 0;

function pollNewMessages() {
  setInterval(async () => {
    try {
      const response = await fetch(`/api/messages?since=${lastMessageId}`);
      const data = await response.json();
      
      if (data.messages.length > 0) {
        data.messages.forEach(msg => displayMessage(msg));
        lastMessageId = data.messages[data.messages.length - 1].id;
      }
    } catch (error) {
      console.error('Polling failed:', error);
    }
  }, 3000);
}

function displayMessage(message) {
  const chatBox = document.getElementById('chat-box');
  chatBox.innerHTML += `<div class="message">${message.text}</div>`;
}

pollNewMessages();
```

**Real-time scenario:** WhatsApp Web, Slack (fallback when WebSocket fails)

---

### 2. **Food Delivery App - Order Status Tracking**
```javascript
// Track order status in real-time
class OrderTracker {
  constructor(orderId) {
    this.orderId = orderId;
    this.pollInterval = null;
  }
  
  startTracking() {
    this.pollInterval = setInterval(async () => {
      const status = await this.checkOrderStatus();
      this.updateUI(status);
      
      // Stop polling when delivered
      if (status.state === 'DELIVERED') {
        this.stopTracking();
      }
    }, 5000); // Check every 5 seconds
  }
  
  async checkOrderStatus() {
    const response = await fetch(`/api/orders/${this.orderId}/status`);
    return await response.json();
  }
  
  updateUI(status) {
    // Update: Preparing → Out for Delivery → Delivered
    document.getElementById('order-status').textContent = status.state;
    document.getElementById('eta').textContent = status.estimatedTime;
  }
  
  stopTracking() {
    clearInterval(this.pollInterval);
    console.log('Order delivered!');
  }
}

// Usage
const tracker = new OrderTracker('ORD-12345');
tracker.startTracking();
```

**Real-time scenario:** Zomato, Swiggy, Uber Eats order tracking

---

### 3. **Stock Price Monitoring Dashboard**
```javascript
// Real-time stock price updates
class StockMonitor {
  constructor(symbols) {
    this.symbols = symbols; // ['AAPL', 'GOOGL', 'TSLA']
    this.prices = {};
  }
  
  startMonitoring() {
    // Poll every 10 seconds during market hours
    setInterval(async () => {
      for (const symbol of this.symbols) {
        const price = await this.fetchStockPrice(symbol);
        this.updatePrice(symbol, price);
      }
    }, 10000);
  }
  
  async fetchStockPrice(symbol) {
    const response = await fetch(`/api/stocks/${symbol}/price`);
    const data = await response.json();
    return data.currentPrice;
  }
  
  updatePrice(symbol, newPrice) {
    const oldPrice = this.prices[symbol];
    this.prices[symbol] = newPrice;
    
    // Update UI with color coding
    const element = document.getElementById(`price-${symbol}`);
    element.textContent = `$${newPrice}`;
    
    if (oldPrice) {
      element.className = newPrice > oldPrice ? 'price-up' : 'price-down';
    }
  }
}

const monitor = new StockMonitor(['AAPL', 'GOOGL', 'TSLA']);
monitor.startMonitoring();
```

**Real-time scenario:** Trading apps, financial dashboards

---

### 4. **File Upload Progress Tracking**
```javascript
// Monitor file upload progress
async function uploadFileWithPolling(file) {
  // Start upload
  const uploadResponse = await fetch('/api/upload/start', {
    method: 'POST',
    body: JSON.stringify({ filename: file.name, size: file.size }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  const { uploadId } = await uploadResponse.json();
  
  // Upload file chunks...
  await uploadFileChunks(file, uploadId);
  
  // Poll for processing completion
  return new Promise((resolve, reject) => {
    const pollInterval = setInterval(async () => {
      try {
        const statusResponse = await fetch(`/api/upload/${uploadId}/status`);
        const status = await statusResponse.json();
        
        // Update progress bar
        updateProgressBar(status.progress);
        
        if (status.state === 'COMPLETED') {
          clearInterval(pollInterval);
          resolve(status.fileUrl);
        } else if (status.state === 'FAILED') {
          clearInterval(pollInterval);
          reject(new Error(status.error));
        }
      } catch (error) {
        clearInterval(pollInterval);
        reject(error);
      }
    }, 1000); // Check every second
  });
}

function updateProgressBar(progress) {
  document.getElementById('progress-bar').style.width = `${progress}%`;
  document.getElementById('progress-text').textContent = `${progress}%`;
}
```

**Real-time scenario:** Google Drive, Dropbox file uploads

---

### 5. **Live Sports Score Updates**
```javascript
// Poll live cricket/football scores
class LiveScoreBoard {
  constructor(matchId) {
    this.matchId = matchId;
    this.isLive = true;
  }
  
  startLiveUpdates() {
    const pollInterval = setInterval(async () => {
      const score = await this.fetchLiveScore();
      this.updateScoreboard(score);
      
      // Stop when match ends
      if (score.status === 'FINISHED') {
        clearInterval(pollInterval);
        this.isLive = false;
        this.showMatchResult(score);
      }
    }, 15000); // Update every 15 seconds
  }
  
  async fetchLiveScore() {
    const response = await fetch(`/api/matches/${this.matchId}/live`);
    return await response.json();
  }
  
  updateScoreboard(score) {
    document.getElementById('team1-score').textContent = score.team1.runs;
    document.getElementById('team2-score').textContent = score.team2.runs;
    document.getElementById('current-over').textContent = score.currentOver;
    document.getElementById('commentary').textContent = score.lastBall;
  }
  
  showMatchResult(score) {
    const banner = document.getElementById('result-banner');
    banner.textContent = score.result;
    banner.classList.add('show');
  }
}

const liveMatch = new LiveScoreBoard('IND-vs-AUS-2024');
liveMatch.startLiveUpdates();
```

**Real-time scenario:** ESPN, Cricbuzz, live score apps

---

### 6. **Email Inbox - New Mail Notifications**
```javascript
// Gmail-like polling for new emails
class EmailInbox {
  constructor() {
    this.lastCheckTime = Date.now();
    this.unreadCount = 0;
  }
  
  startPolling() {
    setInterval(async () => {
      const newEmails = await this.checkNewEmails();
      
      if (newEmails.length > 0) {
        this.showNotification(newEmails.length);
        this.addEmailsToInbox(newEmails);
      }
    }, 30000); // Check every 30 seconds
  }
  
  async checkNewEmails() {
    const response = await fetch(`/api/emails/new?since=${this.lastCheckTime}`);
    const emails = await response.json();
    this.lastCheckTime = Date.now();
    return emails;
  }
  
  showNotification(count) {
    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification(`You have ${count} new email(s)`);
    }
    
    // Update badge
    document.getElementById('email-badge').textContent = count;
    document.title = `(${count}) Inbox`;
  }
  
  addEmailsToInbox(emails) {
    const inbox = document.getElementById('email-list');
    emails.forEach(email => {
      inbox.insertAdjacentHTML('afterbegin', `
        <div class="email-item">
          <strong>${email.from}</strong>
          <p>${email.subject}</p>
        </div>
      `);
    });
  }
}

const inbox = new EmailInbox();
inbox.startPolling();
```

**Real-time scenario:** Gmail, Outlook web apps

---

### 7. **Job Queue Status Monitoring**
```javascript
// Monitor background job processing
class JobMonitor {
  constructor(jobId) {
    this.jobId = jobId;
    this.status = 'PENDING';
  }
  
  async waitForCompletion() {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(`/api/jobs/${this.jobId}`);
          const job = await response.json();
          
          console.log(`Job status: ${job.status} - ${job.progress}%`);
          
          if (job.status === 'COMPLETED') {
            clearInterval(pollInterval);
            resolve(job.result);
          } else if (job.status === 'FAILED') {
            clearInterval(pollInterval);
            reject(new Error(job.error));
          }
          
          // Update UI
          this.updateProgress(job.progress);
        } catch (error) {
          clearInterval(pollInterval);
          reject(error);
        }
      }, 2000);
    });
  }
  
  updateProgress(progress) {
    console.log(`Progress: ${progress}%`);
    document.getElementById('job-progress').value = progress;
  }
}

// Usage: Export large CSV file
async function exportData() {
  // Start export job
  const response = await fetch('/api/export/start', { method: 'POST' });
  const { jobId } = await response.json();
  
  // Monitor job completion
  const monitor = new JobMonitor(jobId);
  try {
    const result = await monitor.waitForCompletion();
    window.location.href = result.downloadUrl;
  } catch (error) {
    alert('Export failed: ' + error.message);
  }
}
```

**Real-time scenario:** Data exports, report generation, video processing

---

### 8. **Ride-Sharing App - Driver Location Updates**
```javascript
// Track driver location in real-time (Uber/Ola style)
class RideTracker {
  constructor(rideId) {
    this.rideId = rideId;
    this.map = null;
    this.driverMarker = null;
  }
  
  startTracking() {
    this.initMap();
    
    // Poll driver location every 5 seconds
    setInterval(async () => {
      const location = await this.getDriverLocation();
      this.updateDriverMarker(location);
      this.updateETA(location);
    }, 5000);
  }
  
  async getDriverLocation() {
    const response = await fetch(`/api/rides/${this.rideId}/driver-location`);
    return await response.json();
  }
  
  initMap() {
    // Initialize Google Maps
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: { lat: 0, lng: 0 }
    });
    
    this.driverMarker = new google.maps.Marker({
      map: this.map,
      icon: '/images/car-icon.png'
    });
  }
  
  updateDriverMarker(location) {
    const position = { lat: location.latitude, lng: location.longitude };
    this.driverMarker.setPosition(position);
    this.map.setCenter(position);
  }
  
  updateETA(location) {
    document.getElementById('eta').textContent = `${location.eta} min away`;
  }
}

const rideTracker = new RideTracker('RIDE-789');
rideTracker.startTracking();
```

**Real-time scenario:** Uber, Ola, Lyft ride tracking

---

## 🏊 POOLING (JavaScript)

**Definition:** Maintaining a reusable collection of resources to avoid the cost of creating/destroying them repeatedly.

### Real-World Analogy
Like a car rental service - instead of buying a new car every time, you borrow from a pool of available cars.

---

## 🔴 Real-Time Use Cases of POOLING

### 1. **Database Connection Pool (PostgreSQL with Node.js)**
```javascript
const { Pool } = require('pg');

// Create connection pool for PostgreSQL
const dbPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'ecommerce',
  user: 'dbuser',
  password: 'password',
  max: 20,                  // Maximum 20 connections
  min: 5,                   // Always keep 5 ready
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 2000
});

// API endpoint: Get user orders
app.get('/api/orders/:userId', async (req, res) => {
  const client = await dbPool.connect(); // Get connection from pool
  
  try {
    const result = await client.query(
      'SELECT * FROM orders WHERE user_id = $1',
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release(); // Return connection to pool (IMPORTANT!)
  }
});

// API endpoint: Create new order
app.post('/api/orders', async (req, res) => {
  const client = await dbPool.connect();
  
  try {
    await client.query('BEGIN'); // Start transaction
    
    const orderResult = await client.query(
      'INSERT INTO orders (user_id, total) VALUES ($1, $2) RETURNING id',
      [req.body.userId, req.body.total]
    );
    
    await client.query(
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
      [orderResult.rows[0].id, req.body.productId, req.body.quantity]
    );
    
    await client.query('COMMIT');
    res.json({ orderId: orderResult.rows[0].id });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});
```

**Real-time scenario:** Any backend API handling multiple simultaneous database requests

---

### 2. **Worker Thread Pool (CPU-Intensive Tasks)**
```javascript
const { Worker } = require('worker_threads');

// Worker Pool for image processing
class WorkerPool {
  constructor(workerScript, poolSize = 4) {
    this.workerScript = workerScript;
    this.poolSize = poolSize;
    this.workers = [];
    this.availableWorkers = [];
    this.taskQueue = [];
    
    // Create worker threads
    for (let i = 0; i < poolSize; i++) {
      this.createWorker();
    }
  }
  
  createWorker() {
    const worker = new Worker(this.workerScript);
    this.workers.push(worker);
    this.availableWorkers.push(worker);
    
    worker.on('message', (result) => {
      // Worker finished task, return to pool
      this.availableWorkers.push(worker);
      this.processQueue();
    });
  }
  
  async runTask(data) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject };
      
      if (this.availableWorkers.length > 0) {
        this.executeTask(task);
      } else {
        // No available workers, queue the task
        this.taskQueue.push(task);
      }
    });
  }
  
  executeTask(task) {
    const worker = this.availableWorkers.pop();
    
    const onMessage = (result) => {
      worker.off('message', onMessage);
      worker.off('error', onError);
      task.resolve(result);
    };
    
    const onError = (error) => {
      worker.off('message', onMessage);
      worker.off('error', onError);
      task.reject(error);
    };
    
    worker.once('message', onMessage);
    worker.once('error', onError);
    worker.postMessage(task.data);
  }
  
  processQueue() {
    if (this.taskQueue.length > 0 && this.availableWorkers.length > 0) {
      const task = this.taskQueue.shift();
      this.executeTask(task);
    }
  }
}

// Usage: Process multiple images concurrently
const imagePool = new WorkerPool('./image-worker.js', 4);

app.post('/api/images/process', async (req, res) => {
  try {
    const result = await imagePool.runTask({
      imagePath: req.body.imagePath,
      operation: 'resize',
      width: 800,
      height: 600
    });
    res.json({ processedImage: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Real-time scenario:** Image processing services, video encoding, data analysis

---

### 3. **Object Pool for Game Development (Bullet Pool)**
```javascript
// Reusable object pool for game entities
class GameObjectPool {
  constructor(createFn, resetFn, initialSize = 50) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.available = [];
    this.inUse = new Set();
    
    // Pre-create objects
    for (let i = 0; i < initialSize; i++) {
      this.available.push(this.createFn());
    }
  }
  
  acquire() {
    let obj;
    
    if (this.available.length > 0) {
      obj = this.available.pop();
    } else {
      // Pool exhausted, create new object
      obj = this.createFn();
      console.warn('Pool exhausted, creating new object');
    }
    
    this.inUse.add(obj);
    return obj;
  }
  
  release(obj) {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.resetFn(obj);
      this.available.push(obj);
    }
  }
  
  releaseAll() {
    this.inUse.forEach(obj => this.release(obj));
  }
}

// Bullet Pool for shooting game
const bulletPool = new GameObjectPool(
  // Create function
  () => ({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    active: false,
    element: document.createElement('div')
  }),
  // Reset function
  (bullet) => {
    bullet.active = false;
    bullet.element.style.display = 'none';
  },
  100 // Pre-create 100 bullets
);

// Game logic
function fireBullet(x, y, angle) {
  const bullet = bulletPool.acquire();
  bullet.x = x;
  bullet.y = y;
  bullet.velocityX = Math.cos(angle) * 10;
  bullet.velocityY = Math.sin(angle) * 10;
  bullet.active = true;
  bullet.element.style.display = 'block';
  
  return bullet;
}

function updateBullets() {
  bulletPool.inUse.forEach(bullet => {
    if (bullet.active) {
      bullet.x += bullet.velocityX;
      bullet.y += bullet.velocityY;
      
      // Remove if off-screen
      if (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 600) {
        bulletPool.release(bullet);
      }
      
      // Update position
      bullet.element.style.left = bullet.x + 'px';
      bullet.element.style.top = bullet.y + 'px';
    }
  });
}

// Game loop
setInterval(updateBullets, 16); // 60 FPS
```

**Real-time scenario:** Browser-based games, particle systems, animations

---

### 4. **HTTP Connection Pool (Axios with Keep-Alive)**
```javascript
const axios = require('axios');
const http = require('http');
const https = require('https');

// Create HTTP agents with connection pooling
const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,         // Max 50 concurrent connections
  maxFreeSockets: 10,     // Keep 10 idle connections
  timeout: 60000,
  keepAliveMsecs: 30000
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 10,
  timeout: 60000,
  keepAliveMsecs: 30000
});

// Create axios instance with pooled connections
const apiClient = axios.create({
  httpAgent,
  httpsAgent,
  timeout: 10000
});

// Make multiple API calls - connections are reused
async function fetchUserData(userIds) {
  const promises = userIds.map(id => 
    apiClient.get(`https://api.example.com/users/${id}`)
  );
  
  const results = await Promise.all(promises);
  return results.map(res => res.data);
}

// Instead of creating new connection for each request,
// connections are reused from the pool
fetchUserData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
```

**Real-time scenario:** Microservices communication, API gateways, data aggregation services

---

### 5. **WebSocket Connection Pool (Chat Application)**
```javascript
// Manage multiple WebSocket connections efficiently
class WebSocketPool {
  constructor(maxConnections = 100) {
    this.maxConnections = maxConnections;
    this.connections = new Map(); // userId -> WebSocket
    this.messageQueue = new Map(); // userId -> messages[]
  }
  
  addConnection(userId, ws) {
    // Check pool limit
    if (this.connections.size >= this.maxConnections) {
      // Remove oldest inactive connection
      this.evictInactiveConnection();
    }
    
    this.connections.set(userId, {
      socket: ws,
      lastActivity: Date.now(),
      userId
    });
    
    // Send queued messages
    if (this.messageQueue.has(userId)) {
      const messages = this.messageQueue.get(userId);
      messages.forEach(msg => ws.send(JSON.stringify(msg)));
      this.messageQueue.delete(userId);
    }
    
    ws.on('message', () => {
      this.connections.get(userId).lastActivity = Date.now();
    });
    
    ws.on('close', () => {
      this.connections.delete(userId);
    });
  }
  
  sendMessage(userId, message) {
    const connection = this.connections.get(userId);
    
    if (connection && connection.socket.readyState === 1) {
      connection.socket.send(JSON.stringify(message));
      connection.lastActivity = Date.now();
    } else {
      // Queue message if user offline
      if (!this.messageQueue.has(userId)) {
        this.messageQueue.set(userId, []);
      }
      this.messageQueue.get(userId).push(message);
    }
  }
  
  broadcast(message, excludeUserId = null) {
    this.connections.forEach((conn, userId) => {
      if (userId !== excludeUserId) {
        this.sendMessage(userId, message);
      }
    });
  }
  
  evictInactiveConnection() {
    let oldestTime = Date.now();
    let oldestUserId = null;
    
    this.connections.forEach((conn, userId) => {
      if (conn.lastActivity < oldestTime) {
        oldestTime = conn.lastActivity;
        oldestUserId = userId;
      }
    });
    
    if (oldestUserId) {
      const conn = this.connections.get(oldestUserId);
      conn.socket.close();
      this.connections.delete(oldestUserId);
    }
  }
}

// Usage in chat server
const wsPool = new WebSocketPool(1000);

wss.on('connection', (ws, req) => {
  const userId = req.headers['user-id'];
  wsPool.addConnection(userId, ws);
  
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    wsPool.broadcast(message, userId);
  });
});
```

**Real-time scenario:** Chat applications, live collaboration tools, multiplayer games

---

### 6. **Promise Pool (Concurrent API Requests with Limit)**
```javascript
// Control concurrent async operations
class PromisePool {
  constructor(concurrency = 5) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  async add(promiseFn) {
    while (this.running >= this.concurrency) {
      await this.waitForSlot();
    }
    
    this.running++;
    
    try {
      const result = await promiseFn();
      return result;
    } finally {
      this.running--;
      this.processQueue();
    }
  }
  
  waitForSlot() {
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }
  
  processQueue() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    }
  }
}

// Usage: Scrape 1000 URLs but only 5 at a time
const pool = new PromisePool(5);

async function scrapeWebsites(urls) {
  const results = [];
  
  for (const url of urls) {
    const result = await pool.add(async () => {
      const response = await fetch(url);
      return await response.text();
    });
    results.push(result);
  }
  
  return results;
}

// Only 5 requests run concurrently, rest wait in pool
scrapeWebsites(['url1', 'url2', /* ... 1000 URLs */]);
```

**Real-time scenario:** Web scraping, batch API calls, data migration

---

### 7. **Canvas Rendering Pool (Animation/Graphics)**
```javascript
// Pool of off-screen canvases for rendering
class CanvasPool {
  constructor(width, height, initialSize = 10) {
    this.width = width;
    this.height = height;
    this.available = [];
    this.inUse = new Set();
    
    for (let i = 0; i < initialSize; i++) {
      this.available.push(this.createCanvas());
    }
  }
  
  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
  }
  
  acquire() {
    let canvasObj;
    
    if (this.available.length > 0) {
      canvasObj = this.available.pop();
    } else {
      canvasObj = this.createCanvas();
    }
    
    this.inUse.add(canvasObj);
    return canvasObj;
  }
  
  release(canvasObj) {
    if (this.inUse.has(canvasObj)) {
      // Clear canvas
      canvasObj.ctx.clearRect(0, 0, this.width, this.height);
      this.inUse.delete(canvasObj);
      this.available.push(canvasObj);
    }
  }
}

// Usage in animation framework
const canvasPool = new CanvasPool(800, 600, 20);

function renderFrame(sprites) {
  sprites.forEach(sprite => {
    const { canvas, ctx } = canvasPool.acquire();
    
    // Draw sprite on off-screen canvas
    ctx.drawImage(sprite.image, 0, 0);
    ctx.globalAlpha = sprite.opacity;
    
    // Copy to main canvas
    mainCtx.drawImage(canvas, sprite.x, sprite.y);
    
    // Return to pool
    canvasPool.release({ canvas, ctx });
  });
}
```

**Real-time scenario:** Game engines, data visualization, animation libraries

---

## 🔄 Quick Comparison Table

| Aspect | Polling | Pooling |
|--------|---------|---------|
| **What it does** | Repeatedly checks for updates | Reuses expensive resources |
| **Action** | "Is it ready yet?" (asking) | "Give me one from pool" (borrowing) |
| **Timing** | Periodic intervals (every X seconds) | On-demand (when needed) |
| **Purpose** | Get real-time updates | Improve performance |
| **Resource Usage** | Can waste bandwidth | Saves CPU/memory |
| **Example** | Check new emails every 30s | Reuse DB connections |

---

## 💡 Memory Tricks

**POLLING** = **POLL** (survey/election) → Keep asking/checking repeatedly
- "Poll the server every 5 seconds"
- Think: Repeatedly asking "Are we there yet?"

**POOLING** = **POOL** (swimming pool) → Collection you dip into
- "Get connection from pool, use it, return it"
- Think: Rental cars - borrow, use, return

---

## 🎯 Interview Answer Template

### If asked "What is Polling?"

*"Polling is when you repeatedly check for updates at regular intervals. For example, in a chat app, instead of using WebSockets, you could poll the server every 3 seconds to check for new messages. The downside is it wastes bandwidth if there are no updates, but it's simple to implement and works with any server."*

### If asked "What is Pooling?"

*"Pooling is about reusing expensive resources instead of creating them repeatedly. For example, database connections are expensive to create, so we maintain a pool of 10-20 connections and reuse them. When a request needs a DB connection, it borrows one from the pool, uses it, and returns it. This dramatically improves performance."*

### If asked "Difference between Polling and Pooling?"

*"They're completely different concepts. Polling is about checking for updates repeatedly - like refreshing a page to see new content. Pooling is about resource reuse - like maintaining a pool of database connections instead of creating a new one for each request. Polling is about timing and updates, pooling is about performance and efficiency."*Polling vs Pooling - JavaScript Real-Time Guide
