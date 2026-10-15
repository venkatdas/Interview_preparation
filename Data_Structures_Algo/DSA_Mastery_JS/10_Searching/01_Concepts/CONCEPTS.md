# Binary Search

**Binary search** finds a target in a **sorted** collection by repeatedly cutting the search
space in half. Think of looking up a word in a paper dictionary: open to the middle, see
whether your word comes before or after, throw away the wrong half, repeat. With 1,000 pages
you need at most 10 looks; with 1,000,000 pages, 20. That is O(log n).

The bigger idea: binary search works on **anything monotonic**, not just sorted arrays. If
there is a yes/no question whose answers look like `NNNNYYYY` over some range, binary search
finds the boundary in O(log range) checks.

---

## Prerequisites

- [Arrays](../../03_Arrays/README.md) and [Sorting](../../11_Sorting/README.md): binary search needs sorted (or monotone) data.
- [Time Complexity](../../01_Complexity_Analysis/01_Time_Complexity/README.md): why halving gives O(log n).
- [Mathematics For DSA](../../00_Foundations/04_Mathematics_For_DSA/README.md): integer division and `Math.ceil` in feasibility checks.

---

## Why it matters / when to use

Signals in the problem statement:

- The input is **sorted** (or rotated-sorted, or "sorted in two parts")
- "Find the first / last position of ...", "the smallest x such that ...", "the largest x that still ..."
- "In O(log n)" is explicitly required
- "Minimize the maximum ..." / "maximize the minimum ..." with a huge answer range -> binary search on the answer
- "How many ... at most/at least" where a feasibility check is easy (can we ship in D days with capacity C?)
- Searching in a sorted 2D matrix, a monotonic function, square roots, "guess the number"
- `n` is up to 10^9 or 10^18: linear scans are out, log scans are in

---

## How it works

### The core idea

```
target = 7
index:   0  1  2  3  4  5  6  7
array:  [1, 3, 4, 7, 9, 12, 15, 20]
         lo          mid         hi      mid = 3, arr[3] = 7 === target -> found at 3

target = 10
        [1, 3, 4, 7, 9, 12, 15, 20]
         lo          ^           hi     mid=3 (7) < 10  -> lo = 4
                     [9, 12, 15, 20]
                      lo  ^       hi    mid=5 (12) > 10 -> hi = 4
                     [9]
                      lo/hi             mid=4 (9) < 10  -> lo = 5 > hi -> not found
```

Each step halves the range: n -> n/2 -> n/4 -> ... -> 1 takes log2(n) steps.

### Why `mid = left + ((right - left) >> 1)`

- `(left + right) / 2` can overflow in languages with fixed-size ints. In JS, numbers are
  doubles and safe up to 2^53, so overflow is not the real problem, BUT:
- `>> 1` (or `Math.floor`) is needed because `/ 2` gives a fraction. `(left + right) >> 1`
  converts to a **32-bit integer** first, so it silently breaks for indices above ~2^31.
  `left + ((right - left) >> 1)` keeps the difference small and is the habit interviewers
  recognise. Use `Math.floor((left + right) / 2)` if the values can be huge (binary search
  on the answer up to 10^18... well, 2^53 in JS).
- It rounds **down**, so `mid` is always `< right` when `left < right`. That matters for the
  `left < right` loop: `right = mid` always shrinks the range, `left = mid + 1` too.

### The three templates (memorise these)

#### Template 1: classic exact match (`left <= right`)

```js
function search(nums, target) {
  let left = 0, right = nums.length - 1;          // inclusive both ends
  while (left <= right) {                          // range [left, right] non-empty
    const mid = left + ((right - left) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;        // target is strictly right of mid
    else right = mid - 1;                          // target is strictly left of mid
  }
  return -1;                                       // left > right: range empty
}
```
**Invariant:** if target exists it is inside `[left, right]`. Loop ends when the range is
empty. Use when you only need "is it here, and where" and duplicates do not matter.

#### Template 2: left-most / lower bound (`left < right`)

"First index whose value is >= target" (= insert position = `bisect_left`).

```js
function lowerBound(nums, target) {
  let left = 0, right = nums.length;              // right is EXCLUSIVE: answer may be n (append)
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) left = mid + 1;        // mid is too small, answer is right of it
    else right = mid;                              // mid could BE the answer, keep it
  }
  return left;                                     // left === right
}
```
**Invariant:** every index `< left` has value `< target`; every index `>= right` has value
`>= target`. The answer is always in `[left, right]`. When they meet, that is the answer.

#### Template 3: right-most / upper bound (`left < right`)

"First index whose value is > target" (`bisect_right`). The last occurrence of target is
`upperBound(target) - 1` (if that index holds target).

```js
function upperBound(nums, target) {
  let left = 0, right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] <= target) left = mid + 1;       // only difference: <= instead of <
    else right = mid;
  }
  return left;
}
```

Picture for `[1, 2, 2, 2, 5]`, target 2:
```
index:        0  1  2  3  4  5(end)
value:        1  2  2  2  5
lowerBound -> 1  (first 2)
upperBound -> 4  (first thing after the 2s)
count of 2s = upperBound - lowerBound = 3
last 2      = upperBound - 1 = 3
```

### Off-by-one guide

| Choice | Pair it with | Range meaning | Loop ends when |
|---|---|---|---|
| `right = n - 1`, `while (left <= right)` | `left = mid + 1`, `right = mid - 1` | inclusive `[left, right]` | `left > right` (empty) |
| `right = n`, `while (left < right)` | `left = mid + 1`, `right = mid` | half-open `[left, right)` | `left === right` (one candidate) |

Rules that prevent infinite loops:

- With `while (left < right)` and `mid` rounded **down**, you may set `right = mid` (safe:
  mid < right) and `left = mid + 1` (safe). Never `left = mid` - when `right = left + 1`,
  mid equals left and you loop forever.
- If you need `left = mid` (searching for the LAST element satisfying something), round
  **up**: `mid = left + ((right - left + 1) >> 1)` and pair with `right = mid - 1`.
- When the loop ends in Template 1, `left` is the insert position and `right = left - 1`.

Sanity check on paper with a 2-element array. If the loop terminates there, it terminates.

### Binary search on the answer (monotonic predicate)

Many problems are not "find x in an array" but "find the smallest value `x` for which
`canDo(x)` is true", where `canDo` is monotonic: once true it stays true.

```
x:        1  2  3  4  5  6  7  8  9  10
canDo(x): N  N  N  N  Y  Y  Y  Y  Y  Y        <- find the first Y: answer 5
```

```js
function searchOnAnswer(lo, hi, canDo) {         // smallest x in [lo, hi] with canDo(x) true
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (canDo(mid)) hi = mid;                      // mid works, maybe something smaller works too
    else lo = mid + 1;                             // mid fails, everything <= mid fails
  }
  return lo;                                       // assumes canDo(hi) is true
}
```

Recipe:
1. Identify the answer range `[lo, hi]` (e.g. Koko: speed 1..max(piles)).
2. Write the predicate `canDo(x)` in O(n) (e.g. "hours needed at speed x <= h").
3. Confirm it is monotonic (faster speed -> fewer hours: yes).
4. Binary search the boundary. Total O(n log range).

Classic examples: Koko Eating Bananas, Capacity to Ship Packages, Split Array Largest Sum,
Minimum Days to Make Bouquets, Sqrt(x), First Bad Version.

### Rotated sorted arrays

`[4, 5, 6, 7, 0, 1, 2]` is sorted then rotated. At any `mid`, **at least one half is sorted**
(compare `nums[left] <= nums[mid]`). Check whether the target lies inside the sorted half's
range; if yes go there, else go to the other half.

```
[4, 5, 6, 7, 0, 1, 2]  target 0
 lo       mid      hi      nums[lo]=4 <= nums[mid]=7 -> left half [4..7] is sorted
                           is 0 in [4, 7]? no -> go right: lo = mid + 1
             [0, 1, 2]     nums[lo]=0 <= nums[mid]=1 -> left half sorted, 0 in [0,1] -> hi = mid - 1
             [0]           found
```
With duplicates (`[1, 0, 1, 1, 1]`) the comparison can be a tie; then shrink both ends by one
(`left++`, `right--`) and continue - worst case degrades to O(n).

### 2D matrix

A matrix whose rows are sorted and each row starts after the previous row ends is just a
sorted array of length `rows * cols` in disguise. Index `i` maps to
`row = Math.floor(i / cols)`, `col = i % cols`. One binary search, O(log(m*n)).

### Real numbers (precision)

When the answer is a real number (square root to 6 decimals, "minimum speed as a float"),
loop a fixed number of times (100 iterations halves the range by 2^100, more than enough)
or until `hi - lo < 1e-9`. Do not use `===` on floats.

```js
let lo = 0, hi = Math.max(1, x);
for (let i = 0; i < 100; i++) {
  const mid = (lo + hi) / 2;
  if (mid * mid < x) lo = mid; else hi = mid;
}
return lo;
```

### bisect helpers in JS

JavaScript has no `bisect` module. Write `lowerBound` / `upperBound` (above) and keep them
in your toolbox; `02_Implementations/binary_search_templates.js` exports them with asserts.

```js
const insertAt = lowerBound(sortedArr, value);
sortedArr.splice(insertAt, 0, value);          // keep an array sorted: O(log n) find + O(n) insert
const count = upperBound(arr, v) - lowerBound(arr, v);   // how many copies of v
```

---

## Pseudocode

```
LOWER BOUND: first index i with a[i] >= target   (half-open [lo, hi))
lo <- 0; hi <- n
while lo < hi:
    mid <- lo + floor((hi - lo) / 2)
    if a[mid] < target: lo <- mid + 1    // mid and everything left of it are too small
    else:               hi <- mid        // mid could be the answer, keep it
return lo                                // n means "every element is smaller"

SEARCH ON THE ANSWER
lo <- smallest possible answer; hi <- largest possible answer
while lo < hi:
    mid <- lo + floor((hi - lo) / 2)
    if feasible(mid): hi <- mid else: lo <- mid + 1
return lo
```

---

## Dry run on a concrete example

`lowerBound([1, 3, 3, 5, 8], 3)`:

| step | lo | hi | mid | a[mid] | a[mid] < 3? | action |
|---|---|---|---|---|---|---|
| 1 | 0 | 5 | 2 | 3 | no | hi = 2 |
| 2 | 0 | 2 | 1 | 3 | no | hi = 1 |
| 3 | 0 | 1 | 0 | 1 | yes | lo = 1 |
| end | 1 | 1 | - | - | - | return 1 |

Index 1 is the first 3. `lowerBound(a, 4)` would return 3 (where 4 would be inserted), and `lowerBound(a, 4) - lowerBound(a, 3) = 2` counts the 3s.

---

## Operations & complexity

| Operation | Time | Space | Note |
|---|---|---|---|
| search in sorted array | O(log n) | O(1) | iterative; recursive is O(log n) stack |
| lowerBound / upperBound | O(log n) | O(1) | |
| search in rotated array | O(log n) | O(1) | O(n) worst with duplicates |
| search in sorted 2D (m x n) | O(log(mn)) | O(1) | |
| binary search on answer | O(n log R) | O(1) | R = size of the answer range, n = cost of the predicate |
| real-valued search | O(iterations * cost) | O(1) | ~50-100 iterations |

Prerequisite: sorted input. Sorting first costs O(n log n) (`11_Sorting`), so binary search
pays off when you search many times or the data is already sorted.

---

## JavaScript implementation

Full code with asserts: `02_Implementations/binary_search_templates.js` (`search`, `lowerBound`, `upperBound`,
`searchOnAnswer`, `searchLast`, `searchReal`). Core:

```js
function search(nums, target) {                  // Template 1
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1; else right = mid - 1;
  }
  return -1;
}
function lowerBound(nums, target) {              // Template 2
  let left = 0, right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) left = mid + 1; else right = mid;
  }
  return left;
}
```

---

## Patterns / variations

### 1. Exact match (Template 1)

Use when: "return the index of target or -1", values distinct or you do not care which copy.

### 2. Boundary search (Templates 2 and 3)

```js
const first = lowerBound(nums, target);
if (first === nums.length || nums[first] !== target) return [-1, -1];
const last = upperBound(nums, target) - 1;
return [first, last];
```
Use when: first/last occurrence, insert position, counting occurrences, "smallest >= x".

### 3. Search on the answer with a feasibility predicate

```js
function minEatingSpeed(piles, h) {
  const hoursNeeded = (speed) => piles.reduce((sum, p) => sum + Math.ceil(p / speed), 0);
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (hoursNeeded(mid) <= h) hi = mid; else lo = mid + 1;
  }
  return lo;
}
```
Use when: "minimum capacity / speed / days such that ...", "maximize the minimum distance".

### 4. Peak finding (compare with neighbour)

```js
while (left < right) {
  const mid = left + ((right - left) >> 1);
  if (nums[mid] < nums[mid + 1]) left = mid + 1;   // uphill to the right: a peak is there
  else right = mid;                                // downhill: mid or something left is a peak
}
```
Use when: Find Peak Element, mountain arrays, "local maximum". Works on unsorted data because
the predicate "slope goes up" is monotonic enough to guarantee a peak on one side.

### 5. Rotated array

Decide which half is sorted, then whether target is inside it. See problems 07, 08, 09.

### 6. Index parity trick

In `[1,1,2,3,3,4,4,8,8]` (every element twice except one), before the single element pairs
start at even indices; after it they start at odd. Binary search on "does the pair at mid
start at an even index". Problem 18.

### 7. Two-array search (Median of Two Sorted Arrays)

Binary search the partition point in the smaller array so that the left parts of both arrays
together form the lower half. O(log(min(m, n))). The hardest classic; problem 16.

---

## Alternatives and trade-offs

| Task | Binary search | Alternative | Trade-off |
|---|---|---|---|
| Find in a sorted array once | O(log n) | linear scan O(n) | scan is fine for tiny arrays |
| Many lookups, unsorted data | sort once O(n log n), then O(log n) each | `Set` / `Map` O(1) average | hashing cannot answer "next larger" |
| Minimise a max / find a threshold | search on the answer O(n log range) | DP or greedy | DP is often slower; greedy needs a proof |
| Dynamic insert + search | sorted array insert is O(n) | balanced BST / heap | BST keeps O(log n) for both |

---

## Common mistakes & edge cases

- Searching an **unsorted** array. Sort first or you get garbage.
- `while (left < right)` with `left = mid` -> infinite loop when two elements remain.
- Mixing templates: `right = nums.length` with `while (left <= right)` reads `nums[n]` (undefined).
- Returning `mid` when you need the boundary; returning `left` when you need exact match.
- Forgetting the "not found" check after a lower-bound search (`left === n` or `nums[left] !== target`).
- `(left + right) >> 1` with huge values -> 32-bit truncation. Use `left + ((right - left) >> 1)`
  or `Math.floor`.
- Binary search on the answer with a `hi` that is too small (the answer must be inside `[lo, hi]`).
- Predicate that is not monotonic -> binary search gives a wrong boundary silently.
- Empty array, single element, target smaller than all / larger than all, target at index 0 and n - 1.
- Floating-point search: never compare with `===`; loop a fixed count or use epsilon.

---

## When this does NOT apply

- **No monotone property.** Binary search needs a yes/no predicate that flips exactly once (false...false true...true). If you cannot state that predicate, it does not apply.
- **Unsorted data searched only once:** sorting costs O(n log n), more than a single O(n) scan.
- **Linked lists:** no O(1) random access, so finding `mid` is O(n).
- **Duplicates in rotated arrays** can force O(n) in the worst case.

---

## Interview tips

- Say the magic word early: "The input is sorted, so I'm thinking binary search, O(log n)."
- Name the template you are using and state the invariant: "I keep the answer inside
  [left, right); when they meet, left is the first index with value >= target."
- For "minimize/maximize" problems with a feasibility check, say: "The predicate is monotonic,
  so I'll binary search on the answer and check feasibility in O(n)." Then explain WHY it
  is monotonic.
- Dry run on a 2-element and a 3-element array out loud; it catches off-by-ones before the
  interviewer does.
- Ask: duplicates? sorted ascending or descending? can target be absent? what to return then?
  integers or floats?
- Mention the O(n) fallback for rotated arrays with duplicates - it shows you know the limit.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Binary Search | Easy | template 1 exact | 03_Problems/solutions/01_binary_search.js |
| 02 | Search Insert Position | Easy | lower bound | 03_Problems/solutions/02_search_insert_position.js |
| 03 | First Bad Version | Easy | first true (boundary) | 03_Problems/solutions/03_first_bad_version.js |
| 04 | Find First and Last Position of Element | Medium | lower + upper bound | 03_Problems/solutions/04_first_and_last_position.js |
| 05 | Sqrt(x) | Easy | search on answer (last true) | 03_Problems/solutions/05_sqrt_x.js |
| 06 | Guess Number Higher or Lower | Easy | exact with an oracle | 03_Problems/solutions/06_guess_number.js |
| 07 | Search in Rotated Sorted Array | Medium | rotated, pick the sorted half | 03_Problems/solutions/07_search_rotated_sorted_array.js |
| 08 | Search in Rotated Sorted Array II | Medium | rotated with duplicates | 03_Problems/solutions/08_search_rotated_sorted_array_ii.js |
| 09 | Find Minimum in Rotated Sorted Array | Medium | compare mid with right | 03_Problems/solutions/09_find_minimum_rotated_sorted_array.js |
| 10 | Find Peak Element | Medium | slope predicate | 03_Problems/solutions/10_find_peak_element.js |
| 11 | Search a 2D Matrix | Medium | flattened index | 03_Problems/solutions/11_search_2d_matrix.js |
| 12 | Koko Eating Bananas | Medium | search on answer | 03_Problems/solutions/12_koko_eating_bananas.js |
| 13 | Capacity To Ship Packages Within D Days | Medium | search on answer | 03_Problems/solutions/13_capacity_to_ship_packages.js |
| 14 | Split Array Largest Sum | Hard | search on answer (minimize max) | 03_Problems/solutions/14_split_array_largest_sum.js |
| 15 | Time Based Key-Value Store | Medium | upper bound on timestamps | 03_Problems/solutions/15_time_based_key_value_store.js |
| 16 | Median of Two Sorted Arrays | Hard | partition search | 03_Problems/solutions/16_median_of_two_sorted_arrays.js |
| 17 | Find K Closest Elements | Medium | search the window start | 03_Problems/solutions/17_find_k_closest_elements.js |
| 18 | Single Element in a Sorted Array | Medium | index parity | 03_Problems/solutions/18_single_element_sorted_array.js |

---

## Practice more

Easy: Valid Perfect Square (367), Arranging Coins (441), Intersection of Two Arrays (349),
Kth Missing Positive Number (1539), Count Negative Numbers in a Sorted Matrix (1351)

Medium: Find Smallest Letter Greater Than Target (744), Peak Index in a Mountain Array (852),
Minimum Days to Make m Bouquets (1482), Magnetic Force Between Two Balls (1552),
Find the Smallest Divisor Given a Threshold (1283), Kth Smallest Element in a Sorted Matrix (378),
Search a 2D Matrix II (240), Longest Increasing Subsequence (300, patience + lower bound),
Minimum Speed to Arrive on Time (1870), Russian Doll Envelopes (354), Online Election (911)

Hard: Find in Mountain Array (1095), Minimize Max Distance to Gas Station (774),
Kth Smallest Number in Multiplication Table (668), Nth Magical Number (878),
Count of Range Sum (327)
