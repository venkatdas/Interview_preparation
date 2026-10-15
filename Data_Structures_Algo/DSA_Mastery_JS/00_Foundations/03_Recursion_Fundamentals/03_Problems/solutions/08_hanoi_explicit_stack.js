/**
 * 08. Tower of Hanoi, Iteratively   (Original — Hard)
 *
 * PROBLEM
 * Move n disks from peg 'A' to peg 'C' using peg 'B', one disk at a time, never
 * placing a larger disk on a smaller one. Return the list of moves as [disk, from, to].
 * First write the classic recursion. Then convert it MECHANICALLY into a loop with an
 * explicit stack of frames (no recursion at all) that produces exactly the same moves.
 * This is the general recursion -> iteration technique: the recursive version does
 * work BETWEEN its two calls, so a simple "push children" stack is not enough.
 *
 * EXAMPLES
 * Input: n = 1   Output: [[1,'A','C']]
 * Input: n = 2   Output: [[1,'A','B'], [2,'A','C'], [1,'B','C']]
 * Input: n = 3   Output: 7 moves, starting [1,'A','C'], [2,'A','B'], [1,'C','B'], [3,'A','C'] ...
 * Input: n = 0   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 20 -> 2^20 - 1 ~ 1e6 moves (output size dominates).
 * - Recursion depth is only n here, so the point of the exercise is the TECHNIQUE
 *   (the same technique rescues deep DFS / postorder traversals).
 *
 * APPROACH 1 — Brute force (classic recursion)   O(2^n) time, O(n) stack
 * hanoi(n, from, to, via):
 *   if n === 0 return
 *   hanoi(n-1, from, via, to)      // clear the way
 *   move disk n from -> to         // work BETWEEN the calls
 *   hanoi(n-1, via, to, from)      // put the small tower back on top
 *
 * APPROACH 2 — Optimal (explicit stack of frames with a stage)   O(2^n) time, O(n) heap
 * A frame = { n, from, to, via, stage }. Look at the TOP frame (do not pop yet):
 *   n === 0             -> pop (base case returns)
 *   stage 0 -> stage 1, push child frame (n-1, from, via, to)       ["first call"]
 *   stage 1 -> record move n from->to, stage 2, push (n-1, via, to, from) ["work + second call"]
 *   stage 2 -> pop                                                  ["return"]
 * This is exactly what the engine stores: arguments + where to resume.
 * (Optimisation: the second call is a tail call, so instead of stage 2 we could
 * replace the frame. Kept explicit here for clarity.)
 *
 * Dry run n = 2 (stack top on the right):
 *   [(2,A,C,B,s0)]                    -> s1, push (1,A,B,C)
 *   [(2,s1),(1,A,B,C,s0)]             -> s1, push (0,..)
 *   [(2,s1),(1,s1),(0)]               -> pop
 *   [(2,s1),(1,A,B,C,s1)]             -> move 1 A->B, s2, push (0)
 *   ... pop, pop (1 done)
 *   [(2,A,C,B,s1)]                    -> move 2 A->C, s2, push (1,B,C,A)
 *   (1,B,C,A) -> move 1 B->C; then everything pops
 *
 * EDGE CASES
 * - n = 0 -> no moves
 * - move count must be 2^n - 1
 * - every move must be legal (verified by simulating the pegs in the tests)
 *
 * COMMON MISTAKES
 * - Popping the frame before its second call (loses "where to resume").
 * - Pushing both child calls at once: the move between them then happens at the wrong time.
 * - Mixing up the roles of via/to in the child calls.
 */

function bruteForce(n) {
  const moves = [];
  (function hanoi(k, from, to, via) {
    if (k === 0) return;
    hanoi(k - 1, from, via, to);
    moves.push([k, from, to]);
    hanoi(k - 1, via, to, from);
  })(n, 'A', 'C', 'B');
  return moves;
}

function optimal(n) {
  const moves = [];
  const stack = [{ n, from: 'A', to: 'C', via: 'B', stage: 0 }];
  while (stack.length) {
    const f = stack[stack.length - 1];
    if (f.n === 0) { stack.pop(); continue; }
    if (f.stage === 0) {
      f.stage = 1;
      stack.push({ n: f.n - 1, from: f.from, to: f.via, via: f.to, stage: 0 });
    } else if (f.stage === 1) {
      moves.push([f.n, f.from, f.to]);
      f.stage = 2;
      stack.push({ n: f.n - 1, from: f.via, to: f.to, via: f.from, stage: 0 });
    } else {
      stack.pop();
    }
  }
  return moves;
}

function isLegal(n, moves) {
  const pegs = { A: Array.from({ length: n }, (_, i) => n - i), B: [], C: [] };
  for (const [disk, from, to] of moves) {
    if (pegs[from].pop() !== disk) return false;
    const top = pegs[to][pegs[to].length - 1];
    if (top !== undefined && top < disk) return false;
    pegs[to].push(disk);
  }
  return pegs.C.length === n;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(0), []);
  assert.deepStrictEqual(solve(1), [[1, 'A', 'C']]);
  assert.deepStrictEqual(solve(2), [[1, 'A', 'B'], [2, 'A', 'C'], [1, 'B', 'C']]);
  assert.deepStrictEqual(solve(3).slice(0, 4), [[1, 'A', 'C'], [2, 'A', 'B'], [1, 'C', 'B'], [3, 'A', 'C']]);
}
for (let n = 0; n <= 14; n++) {
  const m = optimal(n);
  assert.strictEqual(m.length, 2 ** n - 1);
  assert.ok(isLegal(n, m));
  assert.deepStrictEqual(m, bruteForce(n));
}
console.log('✓ 08_hanoi_explicit_stack passed');

module.exports = { optimal, bruteForce, isLegal };
