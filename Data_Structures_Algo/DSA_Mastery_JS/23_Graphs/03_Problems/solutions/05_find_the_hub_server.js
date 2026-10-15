/**
 * 05. Find the Hub Server   (Original — Medium)
 *
 * PROBLEM
 *   n servers are numbered 0..n-1. sends[i][j] = 1 means server i sends data to
 *   server j (sends[i][i] is always 0). A HUB is a server that receives data from
 *   every other server and sends data to none. Return the hub's number, or -1.
 *   (There can be at most one hub: two hubs would each have to send to the other.)
 *
 * EXAMPLES
 *   [[0,1,1],
 *    [0,0,1],
 *    [0,0,0]]   -> 2   (0 and 1 both send to 2; 2 sends nothing)
 *   [[0,1],
 *    [1,0]]     -> -1  (both servers send)
 *   [[0]]       -> 0   (a single server trivially qualifies)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 *   - Is the matrix always square with a zero diagonal? (yes)
 *   - n = 0? (return -1)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 *   Compute in-degree and out-degree of every server from the matrix. The hub has
 *   in-degree n-1 and out-degree 0.
 *
 * APPROACH 2 — Optimal (elimination)   O(n) time, O(1) space
 *   One question eliminates one candidate. Keep `cand = 0`. For i = 1..n-1:
 *     if sends[cand][i] === 1, cand sends something, so cand is not the hub -> cand = i
 *     otherwise i does not receive from cand, so i is not the hub (keep cand).
 *   After the loop only cand can be the hub; verify its row is all 0 and its
 *   column is all 1 (except the diagonal) in O(n).
 *   Dry run on the first example:
 *     cand=0, i=1: sends[0][1]=1 -> cand=1
 *     cand=1, i=2: sends[1][2]=1 -> cand=2
 *     verify 2: row [0,0,0] ok; column: sends[0][2]=1, sends[1][2]=1 ok -> 2
 *
 * EDGE CASES
 *   n = 0 -> -1; n = 1 -> 0; a cycle -> -1; the verification step is required
 *   because elimination only proves "nobody else can be the hub".
 */
function bruteForce(sends) {
  const n = sends.length;
  for (let v = 0; v < n; v++) {
    let inDeg = 0, outDeg = 0;
    for (let u = 0; u < n; u++) { inDeg += sends[u][v]; outDeg += sends[v][u]; }
    if (inDeg === n - 1 && outDeg === 0) return v;
  }
  return -1;
}

function optimal(sends) {
  const n = sends.length;
  if (n === 0) return -1;
  let cand = 0;
  for (let i = 1; i < n; i++) {
    if (sends[cand][i] === 1) cand = i; // cand sends -> cannot be the hub
  }
  for (let i = 0; i < n; i++) {
    if (i === cand) continue;
    if (sends[cand][i] === 1 || sends[i][cand] === 0) return -1;
  }
  return cand;
}

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(optimal([[0, 1, 1], [0, 0, 1], [0, 0, 0]]), 2);
assert.strictEqual(optimal([[0, 1], [1, 0]]), -1);
assert.strictEqual(optimal([[0]]), 0);
assert.strictEqual(optimal([]), -1);
assert.strictEqual(optimal([[0, 0], [0, 0]]), -1);              // nobody receives everything
assert.strictEqual(optimal([[0, 0, 0], [1, 0, 0], [1, 1, 0]]), 0); // hub at index 0
let seed = 9;
const rand = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % k; };
for (let t = 0; t < 300; t++) {
  const n = rand(7);
  const m = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : rand(2))));
  if (n > 0 && rand(2) === 0) { // plant a hub half of the time
    const h = rand(n);
    for (let i = 0; i < n; i++) if (i !== h) { m[i][h] = 1; m[h][i] = 0; }
  }
  assert.strictEqual(optimal(m), bruteForce(m));
}
console.log('✓ 05_find_the_hub_server passed');
module.exports = { optimal, bruteForce };
