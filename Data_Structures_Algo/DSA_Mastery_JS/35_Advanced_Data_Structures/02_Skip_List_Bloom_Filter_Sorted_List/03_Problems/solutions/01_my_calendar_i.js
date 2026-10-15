/**
 * 01. My Calendar I   (LeetCode 729 — Medium)
 *
 * PROBLEM
 * Implement MyCalendar with book(start, end) for the half-open interval [start, end).
 * Return true and add the booking if it does not overlap any existing booking,
 * otherwise return false and do not add it.
 *
 * EXAMPLES
 * book(10, 20) -> true
 * book(15, 25) -> false   (overlaps [10,20))
 * book(20, 30) -> true    (touching at 20 is fine)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 1000 calls -> O(n) per call passes; O(log n) is the "ordered map" answer
 * - Half-open intervals: [10,20) and [20,30) do not overlap
 * - start < end always
 *
 * APPROACH 1 — Brute force   O(n) per call
 * Keep a list of bookings; a new [s, e) overlaps [a, b) when s < b and a < e. Scan all.
 *
 * APPROACH 2 — Optimal (Sorted list of intervals by start + bisect)   O(log n) search + O(n) splice
 * Keep bookings sorted by start. For a new [s, e), only two neighbours can overlap:
 *   - the booking just BEFORE s (largest start < s): must end <= s
 *   - the booking just AFTER (smallest start >= s): must start >= e
 * Find them with binary search (bisect by start), check both, insert if clear.
 * In Java/C++ this is TreeMap.floorKey / ceilingKey; in JS we use SortedList from
 * ../sorted-list.js (sorted array + binary search).
 *
 * Dry run: bookings = [] ; book(10,20): no neighbours -> insert [[10,20]] -> true
 *   book(15,25): before = [10,20] (start 10 < 15), ends 20 > 15 -> false
 *   book(20,30): before = [10,20], ends 20 <= 20 ok; after = none -> insert -> true
 *   book(5,10): before = none; after = [10,20], starts 10 >= 10 ok -> true
 *
 * EDGE CASES
 * - first booking
 * - identical booking twice -> second is false
 * - touching intervals on both sides
 */

const { SortedList } = require('../../02_Implementations/sorted_list');

class MyCalendarBrute {
  constructor() {
    this.bookings = [];
  }
  book(start, end) {
    for (const [a, b] of this.bookings) {
      if (start < b && a < end) return false;
    }
    this.bookings.push([start, end]);
    return true;
  }
}

class MyCalendar {
  constructor() {
    this.list = new SortedList([], (x, y) => x[0] - y[0]);   // intervals sorted by start
  }
  book(start, end) {
    const probe = [start, 0];
    const before = this.list.lower(probe);     // largest start < start
    if (before && before[1] > start) return false;
    const after = this.list.ceiling(probe);    // smallest start >= start
    if (after && after[0] < end) return false;
    this.list.add([start, end]);
    return true;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [MyCalendarBrute, MyCalendar]) {
  const cal = new Cls();
  assert.strictEqual(cal.book(10, 20), true);
  assert.strictEqual(cal.book(15, 25), false);
  assert.strictEqual(cal.book(20, 30), true);
  assert.strictEqual(cal.book(5, 10), true);
  assert.strictEqual(cal.book(10, 20), false);     // duplicate
  assert.strictEqual(cal.book(0, 5), true);
  assert.strictEqual(cal.book(29, 31), false);
}
for (let trial = 0; trial < 30; trial++) {
  const a = new MyCalendarBrute();
  const b = new MyCalendar();
  for (let op = 0; op < 60; op++) {
    const start = Math.floor(Math.random() * 50);
    const end = start + 1 + Math.floor(Math.random() * 10);
    assert.strictEqual(b.book(start, end), a.book(start, end));
  }
}
console.log('✓ 01-my-calendar-i passed');

module.exports = { MyCalendar, MyCalendarBrute, optimal: MyCalendar, bruteForce: MyCalendarBrute };
