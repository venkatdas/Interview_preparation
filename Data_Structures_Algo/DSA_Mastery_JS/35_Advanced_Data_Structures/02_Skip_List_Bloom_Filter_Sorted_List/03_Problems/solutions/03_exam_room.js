/**
 * 03. Exam Room   (LeetCode 855 — Medium)
 *
 * PROBLEM
 * A row of n seats numbered 0..n-1. seat(): a student sits in the seat that maximises the
 * distance to the closest other student; on ties choose the LOWEST seat number. Return it.
 * leave(p): the student in seat p leaves.
 *
 * EXAMPLES
 * n = 10: seat() -> 0, seat() -> 9, seat() -> 4, seat() -> 2, leave(4), seat() -> 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^9, but at most 10^4 calls -> we must store only occupied seats, not all n
 * - leave(p) is only called for an occupied seat
 *
 * APPROACH 1 — Brute force   O(n) per seat()
 * Keep a boolean array of size n. For each empty seat compute the distance to the nearest
 * occupied seat; pick the best. Only works for small n.
 *
 * APPROACH 2 — Optimal (Sorted list of occupied seats)   O(m) per seat(), O(log m) leave()
 * Keep occupied seats sorted. The best seat is one of:
 *   - seat 0 if empty: distance = first occupied seat
 *   - the midpoint of each gap between neighbours a < b: distance = (b - a) / 2, seat a + dist
 *   - seat n - 1 if empty: distance = n - 1 - last occupied
 * Scan the gaps (m = number of students, m << n), choose the largest distance, lowest seat.
 * leave(p) = remove p from the sorted list (binary search + splice).
 * (A priority queue of gaps gives O(log m) seat(), but needs lazy deletion; the sorted
 * scan is what most people write and it passes.)
 *
 * Dry run, n = 10:
 *   seat(): empty -> 0                               seats [0]
 *   seat(): candidates: gap end: 9 (dist 9) -> 9     seats [0, 9]
 *   seat(): gap 0..9: dist 4, seat 4 -> 4            seats [0, 4, 9]
 *   seat(): gaps 0..4 -> seat 2 dist 2; 4..9 -> seat 6 dist 2; tie -> 2   seats [0,2,4,9]
 *   leave(4): seats [0, 2, 9]
 *   seat(): gaps 0..2 -> seat 1 dist 1; 2..9 -> seat 5 dist 3 -> 5
 *
 * EDGE CASES
 * - n = 1: seat() -> 0
 * - room empty again after leaves
 * - all seats full for small n (not called per problem statement)
 */

const { SortedList } = require('../../02_Implementations/sorted_list');

class ExamRoomBrute {
  constructor(n) {
    this.n = n;
    this.taken = new Array(n).fill(false);
  }
  seat() {
    let bestSeat = -1;
    let bestDist = -1;
    for (let s = 0; s < this.n; s++) {
      if (this.taken[s]) continue;
      let dist = Infinity;
      for (let o = 0; o < this.n; o++) if (this.taken[o]) dist = Math.min(dist, Math.abs(o - s));
      if (dist > bestDist) {
        bestDist = dist;
        bestSeat = s;
      }
    }
    this.taken[bestSeat] = true;
    return bestSeat;
  }
  leave(p) {
    this.taken[p] = false;
  }
}

class ExamRoom {
  constructor(n) {
    this.n = n;
    this.seats = new SortedList();
  }
  seat() {
    const occupied = this.seats.toArray();
    if (occupied.length === 0) {
      this.seats.add(0);
      return 0;
    }
    let bestSeat = 0;
    let bestDist = occupied[0];                     // sitting at 0, nearest is occupied[0]
    for (let i = 1; i < occupied.length; i++) {
      const a = occupied[i - 1];
      const b = occupied[i];
      const dist = Math.floor((b - a) / 2);
      if (dist > bestDist) {                        // strictly greater keeps the lowest seat on ties
        bestDist = dist;
        bestSeat = a + dist;
      }
    }
    const lastGap = this.n - 1 - occupied[occupied.length - 1];
    if (lastGap > bestDist) bestSeat = this.n - 1;
    this.seats.add(bestSeat);
    return bestSeat;
  }
  leave(p) {
    this.seats.remove(p);
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [ExamRoomBrute, ExamRoom]) {
  const room = new Cls(10);
  assert.strictEqual(room.seat(), 0);
  assert.strictEqual(room.seat(), 9);
  assert.strictEqual(room.seat(), 4);
  assert.strictEqual(room.seat(), 2);
  room.leave(4);
  assert.strictEqual(room.seat(), 5);
  const tiny = new Cls(1);
  assert.strictEqual(tiny.seat(), 0);
  tiny.leave(0);
  assert.strictEqual(tiny.seat(), 0);
}
for (let trial = 0; trial < 50; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const a = new ExamRoomBrute(n);
  const b = new ExamRoom(n);
  const seated = [];
  for (let op = 0; op < 30; op++) {
    if (seated.length < n && (seated.length === 0 || Math.random() < 0.6)) {
      const s = a.seat();
      assert.strictEqual(b.seat(), s);
      seated.push(s);
    } else {
      const idx = Math.floor(Math.random() * seated.length);
      const [p] = seated.splice(idx, 1);
      a.leave(p);
      b.leave(p);
    }
  }
}
console.log('✓ 03-exam-room passed');

module.exports = { ExamRoom, ExamRoomBrute, optimal: ExamRoom, bruteForce: ExamRoomBrute };
