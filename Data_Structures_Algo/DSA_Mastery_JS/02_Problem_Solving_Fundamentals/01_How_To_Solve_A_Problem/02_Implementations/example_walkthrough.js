/**
 * Example walkthrough: Two Sum   (LeetCode 1 — Easy)
 *
 * This file shows ONE problem solved by walking through every UMPIRE step,
 * exactly as you would in an interview. Read the comments top to bottom.
 *
 * =========================== U: UNDERSTAND ===========================
 *
 * PROBLEM (restated in my own words)
 * I get an array of integers and a target number. I must return the indices of the
 * two different elements whose values add up to the target.
 *
 * EXAMPLES (worked by hand)
 * Input: nums = [2, 7, 11, 15], target = 9   Output: [0, 1]   Explanation: 2 + 7 = 9
 * Input: nums = [3, 2, 4],      target = 6   Output: [1, 2]   Explanation: 2 + 4 = 6 (NOT [0,0]: can't reuse index 0)
 * Input: nums = [3, 3],         target = 6   Output: [0, 1]   Explanation: duplicates are fine, different indices
 *
 * CLARIFYING QUESTIONS I WOULD ASK (and the usual answers)
 * - Is there always exactly one answer?            -> yes, exactly one
 * - Can I use the same element twice?              -> no
 * - Negative numbers? Zero?                        -> yes, both possible
 * - Is the array sorted?                           -> no (if it were, two pointers would work, see 06_Two_Pointers)
 * - How big is n?                                  -> up to 10^4, so O(n^2) = 10^8 is borderline; O(n) is the goal
 * - Does the order of the two indices matter?      -> no
 *
 * =========================== M: MATCH ===========================
 *
 * Signals: "two numbers that sum to a target", "find a pair". For each number x, I need to
 * know "have I seen target - x before, and where?". A "have I seen it" question is a
 * hash map / set question (05_Hashing).
 *
 * =========================== P: PLAN ===========================
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Try every pair (i, j) with i < j and check nums[i] + nums[j] === target.
 * Waste: for every i, the inner loop re-scans all the earlier elements looking for one value.
 *
 * APPROACH 2 — Optimal (hash map, one pass)   O(n) time, O(n) space
 * Replace the re-scan with a lookup. Walk the array once; keep a Map from value -> index
 * of everything seen so far. At element x, the partner I need is (target - x).
 *   1. complement = target - nums[i]
 *   2. if complement is in the map   -> return [map.get(complement), i]
 *   3. else store nums[i] -> i in the map
 * Storing AFTER checking guarantees I never pair an element with itself.
 *
 * Dry run on nums = [3, 2, 4], target = 6:
 *   i=0  x=3  complement=3  map={}         not found  -> map={3:0}
 *   i=1  x=2  complement=4  map={3:0}      not found  -> map={3:0, 2:1}
 *   i=2  x=4  complement=2  map={3:0,2:1}  FOUND at 1 -> return [1, 2]
 *
 * Note how at i=0 the complement 3 equals x itself, but the map was still empty, so we did
 * not wrongly return [0, 0]. That is why we check before we insert.
 *
 * =========================== I: IMPLEMENT ===========================
 */

function bruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) { // j starts at i + 1: never reuse an index
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }
  return []; // no answer (the problem promises one, but be safe)
}

function optimal(nums, target) {
  const indexOfValue = new Map(); // value -> index where we saw it

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (indexOfValue.has(complement)) {
      return [indexOfValue.get(complement), i];
    }
    indexOfValue.set(nums[i], i); // insert AFTER the check, so i never pairs with itself
  }
  return [];
}

/**
 * =========================== R: REVIEW ===========================
 *
 * Trace done above. Edge cases to check in tests:
 * - two elements only               [3, 3], 6     -> [0, 1]
 * - negatives                        [-1, -2, -3, -4, -5], -8 -> [2, 4]
 * - zero as target                   [0, 4, 3, 0], 0 -> [0, 3]
 * - answer uses first and last       [1, 5, 9, 2], 3 -> [0, 3]
 * - no answer                        [1, 2], 10   -> []
 * - empty                            [], 5        -> []
 *
 * =========================== E: EVALUATE ===========================
 *
 * Time:  O(n). One pass; Map.get / Map.set are O(1) on average.
 * Space: O(n). In the worst case the map stores every element.
 * Trade-off: we spend O(n) memory to turn O(n^2) time into O(n).
 * Follow-ups:
 *   - "What if the array is sorted?"        -> two pointers, O(n) time, O(1) space.
 *   - "What if I need ALL pairs?"           -> same map, collect instead of return early; mind duplicates.
 *   - "What about three numbers?"           -> 3Sum: sort + fix one + two pointers, O(n^2).
 *   - "What if the data does not fit in memory?" -> talk about streaming / external sort.
 */

// ---------- tests ----------
const assert = require('assert');

const testCases = [
  [[2, 7, 11, 15], 9, [0, 1]],
  [[3, 2, 4], 6, [1, 2]],
  [[3, 3], 6, [0, 1]],
  [[-1, -2, -3, -4, -5], -8, [2, 4]],
  [[0, 4, 3, 0], 0, [0, 3]],
  [[1, 5, 9, 2], 3, [0, 3]],
  [[1, 2], 10, []],
  [[], 5, []],
];

for (const solve of [bruteForce, optimal]) {
  for (const [nums, target, expected] of testCases) {
    assert.deepStrictEqual(solve(nums, target), expected);
  }
}
console.log('✓ example-walkthrough (Two Sum via UMPIRE) passed');

module.exports = { optimal, bruteForce };
