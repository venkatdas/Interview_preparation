# Brute Force (Systematic Enumeration)

**Brute force** means: list every candidate answer, check each one, keep the best (or count the good ones).
It sounds naive, but it is the most important *first step* in an interview: it proves you understand the problem,
it gives you something correct to optimize, and, in code, it becomes a **test oracle** that catches bugs in your clever solution.
This topic teaches you to enumerate **systematically** (all pairs, all subarrays, all subsets, all permutations) without missing or repeating anything,
and to use brute force as an automatic bug-finder.

---

## 1. Prerequisites (Essential)

- [How to Solve a Problem](../../01_How_To_Solve_A_Problem/README.md): the UMPIRE loop; brute force is the first half of "Plan".
- [Recursion Fundamentals](../../../00_Foundations/03_Recursion_Fundamentals/README.md): subsets and permutations are generated recursively.
- [Bitwise Fundamentals](../../../00_Foundations/05_Bitwise_Fundamentals/README.md): subsets as bitmasks.
- [Time Complexity](../../../01_Complexity_Analysis/01_Time_Complexity/README.md): counting how many candidates there are.

---

## 2. Intuition (Essential)

Every problem has a **search space**: the set of all things that *could* be the answer.

- "Find two numbers that..." → all pairs (i, j).
- "Find a contiguous piece that..." → all subarrays [i, j].
- "Choose some items such that..." → all subsets.
- "Arrange / order the items so that..." → all permutations.

Brute force walks the entire search space. Optimization (next topic) is the art of **not** walking all of it.
You cannot skip parts of a space safely until you can describe the whole space precisely.

---

## 3. Mental model / analogy + visuals (Essential)

**A combination lock.** If you do not know the code, you can try 000, 001, ..., 999. Slow but guaranteed: 1,000 tries, and you will never miss the code if you count in order.
"Systematic" means a fixed order that visits every candidate exactly once.

The four classic search spaces and their sizes for n = 4 items `[a, b, c, d]`:

```
pairs i < j          C(4,2) = 6         ab ac ad bc bd cd
subarrays i <= j     4·5/2  = 10        a ab abc abcd b bc bcd c cd d
subsets              2^4    = 16        {} a b ab c ac bc abc d ... abcd    (mask 0000 .. 1111)
permutations         4!     = 24        abcd abdc acbd ... dcba

         n = 10        n = 20          n = 100
pairs    45            190             4,950
subarr   55            210             5,050
subsets  1,024         1,048,576       1.3e30   (impossible)
perms    3,628,800     2.4e18 (impossible)
```

The **constraint on n tells you which space you can afford** to enumerate (see the table in [How to Solve a Problem](../../01_How_To_Solve_A_Problem/01_Concepts/CONCEPTS.md)): n ≤ 10 → permutations OK; n ≤ 20 → subsets OK; n ≤ 5,000 → pairs/subarrays OK.

---

## 4. Why it exists (what problem it solves) (Essential)

**Why brute force first, in an interview:**
1. It forces you to **define the answer precisely** (what exactly are we searching for?).
2. It gets **correct** code on the board, which is worth a lot if time runs out.
3. Its structure shows **where the repeated work is**: the inner loop or the recomputed sum is what you will optimize.
4. Interviewers *want* to see the progression brute force → bottleneck → optimal.

**Why brute force in your code:**
5. It is an **oracle**: a slow solution you trust because it is too simple to be wrong. Compare your fast solution against it on thousands of random small inputs. When they disagree, you have a bug *and* a concrete failing input. This is how every solution in this curriculum is tested.

---

## 5. How it works, step by step

### 5.1 The brute-force recipe (Essential)

```
1. Define a candidate:        what does one possible answer look like? (a pair? a subset? an order?)
2. Enumerate all candidates:  loops / recursion / bitmask, in a fixed order, no duplicates, no gaps
3. Check each candidate:      is it valid? what is its value?
4. Aggregate:                 keep the best / count / collect / return the first
5. Count the cost:            (#candidates) × (cost to check one)
```

### 5.2 All pairs (Essential)

```js
for (let i = 0; i < n; i++)
  for (let j = i + 1; j < n; j++)   // j > i: each unordered pair once, no (i, i)
    check(i, j);
```
- Ordered pairs (i ≠ j both orders): start j at 0 and skip `j === i`. n(n−1) of them.
- Pairs *with* repetition (i ≤ j): start j at i. n(n+1)/2.

### 5.3 All subarrays (Essential)

```js
for (let i = 0; i < n; i++) {
  let sum = 0;                         // extend, don't recompute: O(1) per new subarray
  for (let j = i; j < n; j++) {
    sum += a[j];                       // sum of a[i..j]
    check(i, j, sum);
  }
}
```
The naive third loop (recompute the sum of a[i..j] from scratch) is O(n³). **Extending** the previous subarray makes it O(n²): the first, free optimization inside a brute force.
Subsequences (not contiguous) are *subsets*, not subarrays: 2^n of them.

### 5.4 All subsets (Essential)

**Bitmask:** number the items 0..n−1. Every integer `mask` in [0, 2^n) is a subset: item i is in it iff bit i is set.
```js
for (let mask = 0; mask < (1 << n); mask++) {     // n <= 30 (32-bit funnel!)
  const subset = [];
  for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(a[i]);
  check(subset);
}
```
**Recursion (include / exclude):**
```js
function rec(i, chosen) {
  if (i === n) { check([...chosen]); return; }
  rec(i + 1, chosen);                 // exclude a[i]
  chosen.push(a[i]); rec(i + 1, chosen); chosen.pop();   // include a[i]
}
```
Recursion makes **pruning** easy (stop when the partial sum already exceeds the target): that is [Backtracking](../../../13_Backtracking/README.md).

### 5.5 All permutations (Essential)

```js
function permute(a) {
  const out = [], used = new Array(a.length).fill(false), cur = [];
  (function rec() {
    if (cur.length === a.length) { out.push([...cur]); return; }
    for (let i = 0; i < a.length; i++) {
      if (used[i]) continue;
      used[i] = true; cur.push(a[i]); rec(); cur.pop(); used[i] = false;
    }
  })();
  return out;
}
```
n! results, each of length n → O(n·n!) time. With duplicates in the input, skip `a[i] === a[i-1] && !used[i-1]` after sorting to avoid repeated permutations.

### 5.6 Other enumerations (Advanced)

- **k-combinations** (subsets of size exactly k): C(n, k).
- **Cartesian product** (one choice from each list): Π |list_i|.
- **Grid cells / pairs of cells**: R·C cells, (R·C)² pairs.
- **Answer space** instead of input space: try every possible answer value (e.g. every speed 1..max) and check feasibility. This becomes "binary search on the answer" once you notice monotonicity.

### 5.7 Brute force as a test oracle (Essential)

The **random testing harness** (`02_Implementations/test_harness.js`):

```
repeat T times:
   input = random SMALL input (seeded PRNG, so failures are reproducible)
   if fast(input) != brute(input):
       shrink input (try removing elements / lowering values while it still fails)
       report the minimal failing input, both outputs, and the seed
```

Rules that make it work:
- **Small inputs** (n ≤ 8, values in [−5, 5]): the brute force stays fast, and edge cases (duplicates, negatives, zeros, empty) appear constantly.
- **Seeded randomness** (mulberry32): rerunning reproduces the exact failure.
- **Compare the right thing**: if several answers are valid, compare the *value* (or validate the output) instead of the exact array.
- **Shrinking**: a failing input of length 7 is hard to debug; length 2 is obvious.

---

## 6. Pseudocode

```
bruteForce(input):
  best = NONE
  for candidate in enumerate(input):        // pairs / subarrays / subsets / permutations / answers
    if valid(candidate):
      best = better(best, candidate)
  return best

randomTest(fast, brute, gen, T):
  for t in 1..T:
    x = gen(seededRandom)
    if fast(x) != brute(x): return shrink(x)    // minimal counterexample
  return OK
```

---

## 7. JavaScript implementation

- [`02_Implementations/enumeration.js`](../02_Implementations/enumeration.js): `allPairs`, `allSubarrays`, `subsetsBitmask`, `subsetsRecursive`, `kCombinations`, `permutations` (with duplicate handling), `cartesianProduct`, each with its expected count checked in the self-test.
- [`02_Implementations/test_harness.js`](../02_Implementations/test_harness.js): `mulberry32`, input generators (`randomIntArray`, `randomString`), `compareWithOracle(fast, brute, gen, options)` that returns the seed, iteration and **shrunk** minimal failing input, and `shrinkArray`.

---

## 8. Dry run on a concrete example

Bitmask enumeration of subsets of `[5, 3, 8]` looking for sum = 11:

| mask (binary) | subset | sum | valid? |
|---|---|---|---|
| 000 | [] | 0 | no |
| 001 | [5] | 5 | no |
| 010 | [3] | 3 | no |
| 011 | [5, 3] | 8 | no |
| 100 | [8] | 8 | no |
| 101 | [5, 8] | 13 | no |
| 110 | [3, 8] | 11 | **yes** |
| 111 | [5, 3, 8] | 16 | no |

2^3 = 8 candidates, each checked in O(n): O(n·2^n).

Oracle harness catching a bug: fast = "Kadane with best initialised to 0", brute = all subarrays. Random input `[-3, 4, -1]` agrees (both 4), but `[-2, -5]`: fast says 0, brute says −2. Shrinking removes elements while it still fails → `[-2]`... and then lowers values → minimal failing input `[-1]`. The bug (empty subarray allowed) is now obvious.

---

## 9. Edge cases

- **Empty input**: zero pairs, one subarray? (no: zero non-empty subarrays), one subset (the empty set), one permutation (the empty order). Decide what the problem wants.
- **n = 1**: no pairs.
- **Duplicates**: permutations/subsets of `[1, 1, 2]` repeat unless you dedupe.
- **Bitmask width**: `1 << n` breaks for n ≥ 31 (and you could not enumerate 2^31 subsets anyway).
- **Ties**: "return the first" vs "return any": the enumeration order determines which one brute force finds.
- **Recursion depth** for permutations is only n; that is fine.

---

## 10. Complexity analysis

| Enumeration | #candidates | Time (incl. building each) | Extra space |
|---|---|---|---|
| all pairs | n(n−1)/2 | O(n²) | O(1) |
| all subarrays (extend sums) | n(n+1)/2 | O(n²) | O(1) |
| all subarrays (recompute sums) | n(n+1)/2 | O(n³) | O(1) |
| all subsets (bitmask) | 2^n | O(n·2^n) | O(n) per subset |
| all subsets (recursion) | 2^n | O(n·2^n) to copy each, O(2^n) to just visit | O(n) stack |
| k-combinations | C(n, k) | O(k·C(n, k)) | O(k) |
| all permutations | n! | O(n·n!) | O(n) |
| random harness | T runs | T × (brute + fast) on small n | O(n) |

---

## 11. Alternatives (trade-offs)

| Instead of plain brute force | When |
|---|---|
| prune while enumerating (backtracking) | many partial candidates are already invalid |
| meet in the middle | subsets with n ≈ 40: 2 × 2^20 instead of 2^40 |
| memoize overlapping subproblems (DP) | the same partial state is reached many ways |
| sort + two pointers / hashing | pairs with a sum/difference condition |
| prefix sums / sliding window | subarray sums |
| greedy | when an exchange argument proves one choice is always safe |

Brute force wins when n is tiny (n ≤ 8), when correctness matters more than speed (oracles, verifying a proof), or when the interviewer only wants the idea.

---

## 12. Common mistakes (and why they happen)

1. **Off-by-one in enumeration**: `j = i` instead of `j = i + 1` (pairs an element with itself) or `j < n - 1` (misses the last pair).
2. **Recomputing inside the innermost loop** (O(n³) subarray sums).
3. **Pushing the live `chosen` array** instead of a copy in recursive enumeration.
4. **Not undoing state** (`pop`, `used[i] = false`) after the recursive call.
5. **Duplicate results** when the input has repeated values.
6. **Comparing fast vs brute on huge inputs** (brute is too slow) or on outputs that legitimately differ (several valid answers).
7. **Unseeded `Math.random`** in tests: a failure you cannot reproduce.
8. **Stopping at brute force** in an interview without discussing the bottleneck.

---

## 13. Patterns / variations with templates

**Best over all pairs**
```js
let best = -Infinity;
for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) best = Math.max(best, score(i, j));
```

**Count subarrays satisfying a condition (extend)**
```js
let count = 0;
for (let i = 0; i < n; i++) { let s = 0; for (let j = i; j < n; j++) { s += a[j]; if (ok(s)) count++; } }
```

**Subset search with a bitmask**
```js
for (let mask = 0; mask < 1 << n; mask++) { let s = 0; for (let i = 0; i < n; i++) if (mask >> i & 1) s += a[i]; /* use s */ }
```

**Oracle test (from the harness)**
```js
const { compareWithOracle, randomIntArray } = require('../02_Implementations/test_harness');
const result = compareWithOracle(fast, brute, rnd => randomIntArray(rnd, 0, 8, -5, 5), { runs: 2000, seed: 42 });
if (!result.ok) console.log(result.minimal, result.fastOut, result.bruteOut);
```

---

## 14. Recognition clues

**Brute force is the actual answer when:**
- n ≤ 8–10 and the problem asks for an order (permutations);
- n ≤ 20 and the problem asks for a selection (subsets, bitmask);
- the problem is "find any valid configuration" with tiny bounds (Sudoku cells, 4 cards to 24).

**Brute force is only the starting point when:**
- n is 10^3 or more: name its complexity, find the repeated work, then optimize ([Optimization](../../03_Optimization/README.md)).

**Brute force does NOT apply directly when:**
- the search space is infinite or continuous (needs math or binary search on the answer);
- even the smallest valid enumeration is exponential with large n (needs DP, greedy, or a structural insight).

---

## 15. Interview application

**Talk track:**
- "The answer is a pair of indices, so the search space is all n(n−1)/2 pairs. Brute force checks each in O(1): O(n²). With n up to 10^5 that's 5·10^9, too slow, so let's see what the inner loop repeats."
- "n is at most 15, so 2^15 = 32,768 subsets is fine; I'll enumerate with a bitmask."
- "Before I optimize, I'll keep this brute force as a reference to test the fast version."

**What to clarify:** constraints on n (decides which space you can enumerate), whether order matters (subset vs permutation), contiguous vs not (subarray vs subsequence), duplicates in input and in output.

---

## 16. Problems in this topic

| # | Problem | Difficulty | Search space |
|---|---|---|---|
| 01 | [Pairs with Sum Divisible by K](../03_Problems/01_Easy/01_pairs_divisible_by_k.md) | Easy | all pairs |
| 02 | [Subarrays with Sum in a Range](../03_Problems/02_Medium/02_subarrays_sum_in_range.md) | Medium | all subarrays |
| 03 | [Next Larger Digit Arrangement](../03_Problems/02_Medium/03_next_larger_arrangement.md) | Medium | all permutations |
| 04 | [Plus-Minus Signs to a Target](../03_Problems/02_Medium/04_plus_minus_target.md) | Medium | all subsets (sign choices) |
| 05 | [Oracle Bug Hunt](../03_Problems/02_Medium/05_oracle_bug_hunt.md) | Medium | brute force as a test oracle |
| 06 | [Closest Subset Sum (n ≤ 36)](../03_Problems/03_Hard/06_closest_subset_sum.md) | Hard | subsets → meet in the middle |

**Practice more (LeetCode):** 78 Subsets, 90 Subsets II, 46 Permutations, 47 Permutations II, 77 Combinations, 1 Two Sum (start brute), 560 Subarray Sum Equals K (start brute), 1010 Pairs of Songs With Total Durations Divisible by 60, 31 Next Permutation, 494 Target Sum, 1755 Closest Subsequence Sum, 679 24 Game.
