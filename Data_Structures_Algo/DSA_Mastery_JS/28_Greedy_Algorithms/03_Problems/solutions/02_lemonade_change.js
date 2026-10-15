/**
 * 02. Lemonade Change   (LeetCode 860 — Easy)
 *
 * PROBLEM
 * Lemonade costs $5. Customers queue up and pay with a $5, $10 or $20 bill, one at a time.
 * You start with no money. Return true if you can give every customer correct change.
 *
 * EXAMPLES
 * Input: [5,5,5,10,20]   Output: true
 *   Explanation: collect 5,5,5; give 5 back for the 10; give 10+5 back for the 20
 * Input: [5,5,10,10,20]  Output: false
 *   Explanation: after the two 10s we hold 10,10; a 20 needs 15 but we only have 10s
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only 5, 10, 20 bills? (yes)
 * - Do we start with any change? (no)
 *
 * APPROACH 1 — Brute force   O(2^n) time
 * For a $20 bill, change can be given as 10+5 or 5+5+5. Try both options recursively and
 * see if any path survives. Exponential, but shows what the greedy choice is replacing.
 *
 * APPROACH 2 — Optimal (counting greedy)   O(n) time, O(1) space
 * Keep counts of fives and tens. For a 20, prefer giving 10+5 over 5+5+5.
 *
 * WHY GREEDY WORKS
 * A $5 bill is more "flexible" than a $10 (it can make change for both a 10 and a 20; a 10
 * only helps with a 20). So when both options exist, spend the less flexible 10 first and
 * keep as many 5s as possible. Exchange argument: any valid plan that gave 5+5+5 when a 10 was
 * available can be rewritten to give 10+5 instead, which leaves a strictly better (more
 * flexible) set of bills for the future.
 *
 * Dry run on [5,5,10,10,20]:
 *   5  -> fives=1
 *   5  -> fives=2
 *   10 -> need a 5: fives=1, tens=1
 *   10 -> need a 5: fives=0, tens=2
 *   20 -> need 15: 10+5? no fives. 5+5+5? no. -> false
 *
 * EDGE CASES
 * - first customer pays 10 or 20 -> false immediately
 * - empty queue -> true
 */

function bruteForce(bills) {
  function go(index, fives, tens) {
    if (index === bills.length) return true;
    const bill = bills[index];
    if (bill === 5) return go(index + 1, fives + 1, tens);
    if (bill === 10) return fives > 0 && go(index + 1, fives - 1, tens + 1);
    // bill === 20: try both ways of making 15
    if (tens > 0 && fives > 0 && go(index + 1, fives - 1, tens - 1)) return true;
    if (fives >= 3 && go(index + 1, fives - 3, tens)) return true;
    return false;
  }
  return go(0, 0, 0);
}

function optimal(bills) {
  let fives = 0;
  let tens = 0;
  for (const bill of bills) {
    if (bill === 5) {
      fives++;
    } else if (bill === 10) {
      if (fives === 0) return false;
      fives--;
      tens++;
    } else {
      // $20: prefer 10 + 5 (keeps the flexible 5s), fall back to 5 + 5 + 5
      if (tens > 0 && fives > 0) {
        tens--;
        fives--;
      } else if (fives >= 3) {
        fives -= 3;
      } else {
        return false;
      }
    }
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([5, 5, 5, 10, 20]), true);
  assert.strictEqual(solve([5, 5, 10, 10, 20]), false);
  assert.strictEqual(solve([10]), false);
  assert.strictEqual(solve([]), true);
  assert.strictEqual(solve([5, 5, 5, 5, 20, 20]), false);
  assert.strictEqual(solve([5, 5, 5, 20, 5, 5, 5, 20]), true);
  assert.strictEqual(solve([5, 10, 5, 20]), true);
}
console.log('✓ 02-lemonade-change passed');

module.exports = { optimal, bruteForce };
