/**
 * 11. My Calendar I   (LeetCode 729 — Medium)
 *
 * PROBLEM
 * Implement MyCalendar with book(start, end) for the half-open interval [start, end).
 * Return true and add the booking if it does not overlap any existing booking (a "double
 * booking"); otherwise return false and do not add it.
 *
 * EXAMPLES
 * book(10,20) -> true
 * book(15,25) -> false   Explanation: 15 is inside [10,20)
 * book(20,30) -> true    Explanation: touching at 20 is fine
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Half-open intervals (touching ok)? (yes)
 * - How many calls? (up to 1000 -> O(n) per call is accepted; O(log n) is nicer)
 *
 * APPROACH 1 — Brute force   O(n) per book, O(n) space
 * Keep an unsorted list. For each new booking check every existing one with the overlap
 * formula start < other.end && other.start < end.
 *
 * APPROACH 2 — Optimal (sorted list + binary search)   O(log n) search + O(n) insert, O(n) space
 * Keep bookings sorted by start. Binary search for the first booking whose start >= the new
 * start. The new booking can only collide with that one (it must start before its start...
 * i.e. end > its start) or with the one just before it (which must end after the new start).
 * Check those two neighbours only, then splice in. In languages with a TreeMap the insert
 * is O(log n) too; in JS the splice is O(n) but with a tiny constant.
 *
 * Dry run: book(10,20), book(20,30), book(15,25):
 *   [10,20] -> list [[10,20]]
 *   [20,30] -> idx=1 (no start >= 20 except none); prev [10,20] ends 20 <= 20 ok -> insert
 *   [15,25] -> idx=1 (first start >= 15 is [20,30]); next starts 20 < 25 -> conflict -> false
 *
 * EDGE CASES
 * - first booking always succeeds
 * - booking identical to an existing one -> false
 * - booking that would swallow an existing one ([5,50] over [10,20]) -> false
 */

class MyCalendarBrute {
  #bookings = [];
  book(start, end) {
    for (const [s, e] of this.#bookings) {
      if (start < e && s < end) return false;
    }
    this.#bookings.push([start, end]);
    return true;
  }
}

class MyCalendar {
  #bookings = []; // sorted by start, pairwise non-overlapping

  book(start, end) {
    // binary search: first index whose start >= `start`
    let lo = 0;
    let hi = this.#bookings.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.#bookings[mid][0] < start) lo = mid + 1;
      else hi = mid;
    }
    const next = this.#bookings[lo];      // starts at or after `start`
    const prev = this.#bookings[lo - 1];  // starts before `start`
    if (next && next[0] < end) return false;   // we would run into the next booking
    if (prev && prev[1] > start) return false; // the previous booking runs into us
    this.#bookings.splice(lo, 0, [start, end]);
    return true;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Calendar of [MyCalendarBrute, MyCalendar]) {
  const cal = new Calendar();
  assert.strictEqual(cal.book(10, 20), true);
  assert.strictEqual(cal.book(15, 25), false);
  assert.strictEqual(cal.book(20, 30), true);
  assert.strictEqual(cal.book(10, 20), false);   // duplicate
  assert.strictEqual(cal.book(5, 50), false);    // swallows existing
  assert.strictEqual(cal.book(0, 10), true);     // touching on the left
  assert.strictEqual(cal.book(30, 31), true);
  assert.strictEqual(cal.book(29, 30), false);
}
console.log('✓ 11-my-calendar-i passed');

module.exports = { optimal: MyCalendar, bruteForce: MyCalendarBrute, MyCalendar, MyCalendarBrute };
