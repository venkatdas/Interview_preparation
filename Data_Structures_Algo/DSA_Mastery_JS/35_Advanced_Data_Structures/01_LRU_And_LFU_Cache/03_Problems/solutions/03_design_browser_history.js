/**
 * 03. Design Browser History   (LeetCode 1472 — Medium)
 *
 * PROBLEM
 * You start on `homepage`. Implement:
 *   - visit(url): go to url; this CLEARS all forward history
 *   - back(steps): go back at most `steps` pages (stop at the first page), return the url
 *   - forward(steps): go forward at most `steps` pages (stop at the last), return the url
 *
 * EXAMPLES
 * BrowserHistory("leetcode.com"); visit("google.com"); visit("facebook.com"); visit("youtube.com")
 * back(1) -> "facebook.com"; back(1) -> "google.com"; forward(1) -> "facebook.com"
 * visit("linkedin.com") (youtube is gone); forward(2) -> "linkedin.com"
 * back(2) -> "google.com"; back(7) -> "leetcode.com"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 5000 calls -> even O(n) per call passes; interviewer wants clean O(1)-ish design
 * - steps can exceed the available history (clamp)
 *
 * APPROACH 1 — Brute force (two stacks)   O(1) visit, O(steps) back/forward
 * backStack holds pages behind the current one, forwardStack pages ahead. back pops from
 * backStack onto forwardStack `steps` times; visit clears forwardStack. Also fine.
 *
 * APPROACH 2 — Optimal (Array + current index + logical end)   O(1) for all three
 * Keep one array `pages`, a pointer `current`, and `last` = index of the last valid page.
 *   visit: current++, pages[current] = url, last = current (overwrites forward history
 *          lazily; no need to truncate the array)
 *   back:  current = max(0, current - steps)
 *   forward: current = min(last, current + steps)
 *
 * Dry run:
 *   start: pages = [leetcode], current 0, last 0
 *   visit google, facebook, youtube: pages = [leetcode, google, facebook, youtube], current 3, last 3
 *   back(1) -> current 2 -> facebook;  back(1) -> current 1 -> google
 *   forward(1) -> current 2 -> facebook
 *   visit linkedin: current 3, pages[3] = linkedin, last 3 (youtube overwritten)
 *   forward(2) -> min(3, 5) = 3 -> linkedin
 *   back(2) -> 1 -> google;  back(7) -> max(0, -6) = 0 -> leetcode
 *
 * EDGE CASES
 * - back/forward with steps larger than history (clamp)
 * - forward right after visit (nothing ahead -> stays)
 * - visiting the same url twice (still two entries)
 */

class BrowserHistoryBrute {
  constructor(homepage) {
    this.backStack = [];
    this.forwardStack = [];
    this.current = homepage;
  }
  visit(url) {
    this.backStack.push(this.current);
    this.current = url;
    this.forwardStack = [];
  }
  back(steps) {
    while (steps-- > 0 && this.backStack.length) {
      this.forwardStack.push(this.current);
      this.current = this.backStack.pop();
    }
    return this.current;
  }
  forward(steps) {
    while (steps-- > 0 && this.forwardStack.length) {
      this.backStack.push(this.current);
      this.current = this.forwardStack.pop();
    }
    return this.current;
  }
}

class BrowserHistory {
  constructor(homepage) {
    this.pages = [homepage];
    this.current = 0;
    this.last = 0;          // last valid index; entries beyond it are stale
  }
  visit(url) {
    this.current++;
    this.pages[this.current] = url;
    this.last = this.current;
  }
  back(steps) {
    this.current = Math.max(0, this.current - steps);
    return this.pages[this.current];
  }
  forward(steps) {
    this.current = Math.min(this.last, this.current + steps);
    return this.pages[this.current];
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [BrowserHistoryBrute, BrowserHistory]) {
  const h = new Cls('leetcode.com');
  h.visit('google.com');
  h.visit('facebook.com');
  h.visit('youtube.com');
  assert.strictEqual(h.back(1), 'facebook.com');
  assert.strictEqual(h.back(1), 'google.com');
  assert.strictEqual(h.forward(1), 'facebook.com');
  h.visit('linkedin.com');
  assert.strictEqual(h.forward(2), 'linkedin.com');
  assert.strictEqual(h.back(2), 'google.com');
  assert.strictEqual(h.back(7), 'leetcode.com');
  assert.strictEqual(h.forward(100), 'linkedin.com');
  const single = new Cls('a');
  assert.strictEqual(single.back(3), 'a');
  assert.strictEqual(single.forward(3), 'a');
}
for (let trial = 0; trial < 20; trial++) {
  const a = new BrowserHistoryBrute('home');
  const b = new BrowserHistory('home');
  for (let op = 0; op < 100; op++) {
    const r = Math.random();
    if (r < 0.4) {
      const url = 'p' + Math.floor(Math.random() * 20);
      a.visit(url);
      b.visit(url);
    } else if (r < 0.7) {
      const steps = Math.floor(Math.random() * 5);
      assert.strictEqual(b.back(steps), a.back(steps));
    } else {
      const steps = Math.floor(Math.random() * 5);
      assert.strictEqual(b.forward(steps), a.forward(steps));
    }
  }
}
console.log('✓ 03-design-browser-history passed');

module.exports = {
  BrowserHistory,
  BrowserHistoryBrute,
  optimal: BrowserHistory,
  bruteForce: BrowserHistoryBrute,
};
