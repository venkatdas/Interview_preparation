/**
 * 12. My Calendar II   (LeetCode 731 — Medium)
 *
 * PROBLEM
 * Like My Calendar I, but DOUBLE bookings are allowed and TRIPLE bookings are not.
 * book(start, end) returns true and records the event if adding it never makes three events
 * overlap at the same time; otherwise false (and nothing is recorded).
 *
 * EXAMPLES
 * book(10,20) -> true
 * book(50,60) -> true
 * book(10,40) -> true    (double booking on [10,20))
 * book(5,15)  -> false   (would be a triple on [10,15))
 * book(5,10)  -> true
 * book(25,55) -> true    (double on [25,40) and [50,55))
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Half-open intervals? (yes)
 * - Up to 1000 calls -> O(n) per call fine
 *
 * APPROACH 1 — Brute force   O(n^2) per book
 * Store all bookings. For a new one, for every pair of existing bookings check if all
 * three share a point: max of the three starts < min of the three ends.
 *
 * APPROACH 2 — Optimal (keep a list of double-booked ranges)   O(n) per book, O(n) space
 * Keep two lists: `singles` (every booking) and `doubles` (every range already covered by
 * two bookings). A new booking is a triple iff it overlaps something in `doubles`. If it is
 * allowed, every overlap between it and a single becomes a new double range.
 * (The general "k bookings" version uses a sweep line over a sorted map of +1/-1 events -
 * My Calendar III.)
 *
 * Dry run: book(10,20), book(10,40), book(5,15):
 *   [10,20]: doubles empty -> ok; singles [[10,20]]
 *   [10,40]: no doubles; overlap with [10,20] -> doubles [[10,20]]; singles + [10,40]
 *   [5,15] : overlaps double [10,20] (5 < 20 && 10 < 15) -> false
 *
 * EDGE CASES
 * - three identical bookings -> third is false
 * - touching bookings never count as overlapping
 * - a booking that overlaps two DIFFERENT singles that do not overlap each other -> fine
 */

class MyCalendarTwoBrute {
  #bookings = [];
  book(start, end) {
    const all = this.#bookings;
    for (let i = 0; i < all.length; i++) {
      for (let j = i + 1; j < all.length; j++) {
        const lo = Math.max(start, all[i][0], all[j][0]);
        const hi = Math.min(end, all[i][1], all[j][1]);
        if (lo < hi) return false; // three intervals share [lo, hi)
      }
    }
    all.push([start, end]);
    return true;
  }
}

class MyCalendarTwo {
  #singles = [];
  #doubles = [];

  book(start, end) {
    for (const [s, e] of this.#doubles) {
      if (start < e && s < end) return false;       // would create a triple
    }
    for (const [s, e] of this.#singles) {
      if (start < e && s < end) {                    // overlap -> that region is now double
        this.#doubles.push([Math.max(start, s), Math.min(end, e)]);
      }
    }
    this.#singles.push([start, end]);
    return true;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Calendar of [MyCalendarTwoBrute, MyCalendarTwo]) {
  const cal = new Calendar();
  assert.strictEqual(cal.book(10, 20), true);
  assert.strictEqual(cal.book(50, 60), true);
  assert.strictEqual(cal.book(10, 40), true);
  assert.strictEqual(cal.book(5, 15), false);
  assert.strictEqual(cal.book(5, 10), true);
  assert.strictEqual(cal.book(25, 55), true);
  assert.strictEqual(cal.book(20, 25), true);   // touching only
  assert.strictEqual(cal.book(30, 35), false);  // [10,40],[25,55] already double there
}
console.log('✓ 12-my-calendar-ii passed');

module.exports = { optimal: MyCalendarTwo, bruteForce: MyCalendarTwoBrute, MyCalendarTwo, MyCalendarTwoBrute };
