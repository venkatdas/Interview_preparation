# Sliding Window

A **sliding window** is a contiguous range `[left, right]` over an array or string that
you move forward one step at a time, **reusing** the work from the previous position
instead of recomputing from scratch. Imagine looking at a long train through a fixed
window frame: as the train moves, one carriage enters your view and one leaves. You
don't re-count every carriage, you just adjust for the one that came in and the one that
went out.

It is a specialised form of two pointers where both pointers move in the **same direction**
and the thing you care about is the **range between them**.

---

## Prerequisites

- [Two Pointers](../../06_Two_Pointers/README.md): a window is two same-direction pointers.
- [Hashing](../../05_Hashing/README.md): most variable windows keep a frequency `Map`.
- [Arrays](../../03_Arrays/README.md) and [Strings](../../04_Strings/README.md).

---

## Why it matters / when to use

Reach for a sliding window when the problem mentions:

- "**Contiguous** subarray / substring" (the window is contiguous by definition)
- "of size k" / "exactly k consecutive" → **fixed** window
- "**longest** / **shortest** / **maximum** substring such that..." → **variable** window
- "at most K distinct", "at most K zeros", "at most K replacements" → variable window with a counter
- "contains all characters of", "permutation of", "anagram of" → window with a frequency map
- "maximum of each window" → monotonic deque
- "count subarrays with exactly K ..." → the "at most K" trick

The condition on the window must be **monotonic**: growing the window must only make it
"more" (bigger sum, more distinct, more zeros), and shrinking must only make it "less".
That's what lets us move `left` forward without ever needing to move it back.
With **negative numbers** a sum is not monotonic → use prefix sums + hash map instead
(`08_Prefix_Sums_And_Difference_Arrays`).

---

## How it works

### Fixed-size window (size k)

```
nums = [2, 1, 5, 1, 3, 2], k = 3     "max sum of 3 consecutive"

[2, 1, 5] 1  3  2    sum = 8
 2 [1, 5, 1] 3  2    sum = 8 - 2 + 1 = 7      (drop nums[0], add nums[3])
 2  1 [5, 1, 3] 2    sum = 7 - 1 + 3 = 9
 2  1  5 [1, 3, 2]   sum = 9 - 5 + 2 = 6
best = 9
```

Each slide: `sum += nums[right] - nums[right - k]`. O(1) per step, O(n) total.

### Variable-size window (expand / shrink)

```
"longest substring with at most 2 distinct", s = "eceba"

right=0 'e'   window "e"     {e:1}        distinct 1 ok   best 1
right=1 'c'   window "ec"    {e:1,c:1}    distinct 2 ok   best 2
right=2 'e'   window "ece"   {e:2,c:1}    distinct 2 ok   best 3
right=3 'b'   window "eceb"  {e:2,c:1,b:1} distinct 3 BAD
                 shrink: drop 'e' -> {e:1,c:1,b:1} still 3
                 shrink: drop 'c' -> {e:1,b:1} ok   window "eb"
right=4 'a'   window "eba"   {e:1,b:1,a:1} BAD
                 shrink: drop 'e' -> "ba" ok
best = 3
```

`right` moves n times. `left` moves at most n times total (it never goes backward).
So even with the inner `while`, total work is O(n), not O(n²). **That is the key fact
to say in an interview.**

### Two flavours of variable window

| Goal | Loop shape |
|------|-----------|
| **Longest** window that satisfies a condition | expand; `while (invalid) shrink`; then record `right - left + 1` |
| **Shortest** window that satisfies a condition | expand; `while (valid) { record; shrink }` |

### Monotonic deque (max of each window)

```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
deque holds indices, values decreasing from front to back; front = current max

right=0 (1):  deque [0]
right=1 (3):  3 >= 1, pop 0;  deque [1]
right=2 (-1): deque [1, 2]              window full -> max nums[1] = 3
right=3 (-3): deque [1, 2, 3]           -> 3
right=4 (5):  pop 3, 2, 1; deque [4]    -> 5
right=5 (3):  deque [4, 5]              -> 5
right=6 (6):  pop 5, 4; deque [6]       -> 6
right=7 (7):  pop 6; deque [7]          -> 7
```

Each index is pushed once and popped once → O(n).

### Window vs two-pointer vs prefix-sum: how to tell

| Question | Use |
|----------|-----|
| Contiguous range, condition is monotonic (all positive, counts, distinct) | **Sliding window** |
| Pair / triplet from a sorted array; pointers start at opposite ends | **Two pointers** |
| Contiguous range but condition is NOT monotonic (negatives, "sum equals k", "divisible by k") | **Prefix sum (+ hash map)** |
| Range-sum queries asked many times | **Prefix sum array** |

Quick test: "If I add a positive number to the window, does the condition only get
'worse' in one direction?" Yes → window. No → prefix sums.

---

## Pseudocode

```
FIXED SIZE k                               VARIABLE SIZE (longest valid window)
sum <- sum of a[0..k-1]; best <- sum       left <- 0; best <- 0
for right in k..n-1:                       for right in 0..n-1:
    sum += a[right] - a[right - k]             add a[right] to window state
    best <- max(best, sum)                     while window is invalid:
return best                                        remove a[left] from state; left += 1
                                               best <- max(best, right - left + 1)
                                           return best
```

For the *shortest* valid window, flip it: shrink **while the window is valid** and record the answer inside that loop.

---

## Dry run on a concrete example

Longest substring without repeating characters on `"abcabcbb"` (window state is a `Set`):

| right | char | shrink steps | left | window | best |
|---|---|---|---|---|---|
| 0 | a | - | 0 | a | 1 |
| 1 | b | - | 0 | ab | 2 |
| 2 | c | - | 0 | abc | 3 |
| 3 | a | remove a | 1 | bca | 3 |
| 4 | b | remove b | 2 | cab | 3 |
| 5 | c | remove c | 3 | abc | 3 |
| 6 | b | remove a, b | 5 | cb | 3 |
| 7 | b | remove c, b | 7 | b | 3 |

Each index enters once and leaves at most once, so the total work is O(n) even with the inner `while`.

---

## Operations & complexity

| Pattern | Time | Space | Note |
|---------|------|-------|------|
| Fixed window (sum/avg) | O(n) | O(1) | |
| Fixed window with counts | O(n) | O(k) distinct | anagram / permutation checks |
| Variable window (longest / shortest) | O(n) | O(1) or O(k) | left moves at most n times total |
| "At most K" counting | O(n) | O(k) | run twice for "exactly K" |
| Monotonic deque max/min | O(n) | O(k) | each index pushed & popped once |
| Brute force all subarrays | O(n²) or O(n³) | | what the window replaces |

---

## JavaScript implementation

Full runnable templates with tests: `02_Implementations/sliding_window_templates.js`. The three shapes:

```js
// FIXED size k
let windowSum = 0;
for (let right = 0; right < nums.length; right++) {
  windowSum += nums[right];
  if (right >= k) windowSum -= nums[right - k];       // element leaving on the left
  if (right >= k - 1) best = Math.max(best, windowSum); // window is full
}

// VARIABLE, longest valid
let left = 0;
for (let right = 0; right < n; right++) {
  add(nums[right]);                                   // expand
  while (!valid()) { remove(nums[left]); left++; }    // shrink until valid
  best = Math.max(best, right - left + 1);
}

// VARIABLE, shortest valid
let left = 0;
for (let right = 0; right < n; right++) {
  add(nums[right]);
  while (valid()) {                                   // shrink while STILL valid
    best = Math.min(best, right - left + 1);
    remove(nums[left]); left++;
  }
}
```

---

## Patterns / variations

### 1. Fixed window with a running sum

```js
function maxAverage(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i++) sum += nums[i];
  let best = sum;
  for (let right = k; right < nums.length; right++) {
    sum += nums[right] - nums[right - k];
    best = Math.max(best, sum);
  }
  return best / k;
}
```
Use when: "size k", "k consecutive". Also works for products, counts of a specific char.

### 2. Longest window with a counter budget

```js
// Max Consecutive Ones III: flip at most k zeros
function longestOnes(nums, k) {
  let left = 0, zeros = 0, best = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeros++;
    while (zeros > k) { if (nums[left] === 0) zeros--; left++; }
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```
Use when: "at most k replacements / deletions / zeros / distinct". The counter is the
thing you're allowed to have a budget of.

### 3. Window with a frequency Map (character counts)

```js
// Longest Repeating Character Replacement: window is valid if
// (window length - count of most frequent char) <= k
let maxFreq = 0;
for (let right = 0; right < s.length; right++) {
  counts[s[right]] = (counts[s[right]] ?? 0) + 1;
  maxFreq = Math.max(maxFreq, counts[s[right]]);
  if (right - left + 1 - maxFreq > k) { counts[s[left]]--; left++; }
}
```
Use when: anagram windows, "contains all letters of t", "replace at most k letters".
Trick: track a `matched` / `formed` counter so you never compare whole maps.

### 4. "At most K" → "exactly K"

```js
exactly(k) = atMost(k) - atMost(k - 1)
```
Every window valid for "at most k" ending at `right` adds `right - left + 1` subarrays.
Use when: "exactly k distinct", "exactly k odd numbers" (Nice Subarrays), "sum exactly k"
with only 0/1 values (Binary Subarrays With Sum).

### 5. Shortest window covering a requirement

Minimum Window Substring: expand until the window has every needed character (`formed ===
required`), then shrink from the left while it still does, recording the best.

### 6. Monotonic deque for window max / min

See the diagram above and `03_Problems/solutions/12_sliding_window_maximum.js`. Keep indices; pop from
the back while the new value is bigger (for max); pop from the front when it leaves the window.

### 7. Lazy / deferred shrink (window never shrinks)

For "longest" problems you can skip the `while` and move `left` by exactly one when the
window becomes invalid. The window then never gets smaller than the best so far, and the
final `right - left + 1` is the answer. Fewer lines, same O(n), but harder to explain, so
prefer the explicit `while` in interviews.

---

## Alternatives and trade-offs

| Problem shape | Sliding window | Alternative | Why choose one |
|---|---|---|---|
| Fixed-size window sums | O(n), O(1) | prefix sums O(n) build, O(1) per query | prefix sums answer *many* arbitrary ranges |
| Longest / shortest subarray with a monotone condition | O(n) | brute force over all subarrays O(n^2) | window needs "adding makes it worse, removing makes it better" |
| Subarray sum = k with negatives | does not work | prefix sum + hash map O(n) | negatives break monotonicity |
| Max of every window | monotonic deque O(n) | heap O(n log k) | deque is optimal; heap is easier to get right |
| Exactly k distinct | atMost(k) - atMost(k-1) | prefix-count map (for 0/1 style counts) | both O(n) |

---

## Common mistakes & edge cases

- **Window size** is `right - left + 1`, not `right - left`. Off-by-one here is the #1 bug.
- Recording the answer **before** shrinking in a "longest" problem (you'd record an invalid window).
- Shrinking with `if` instead of `while` when more than one element must leave.
- Forgetting to **update the counter** when an element leaves (`counts[s[left]]--`, delete at 0).
- Using a window for sums with **negative numbers** - the condition is not monotonic. Use prefix sums.
- Deque: comparing values but storing indices (or vice versa); use `<=` when popping to
  handle duplicates correctly.
- `k` larger than the array, `k = 0`, empty input, all elements identical, single element.
- Minimum Window Substring: `formed` must count distinct characters that reached their
  required count, not total characters.

---

## When this does NOT apply

- **Negative numbers with a sum condition.** Adding an element can make the sum smaller, so "shrink when too big" is no longer safe. Use [prefix sums](../../08_Prefix_Sums_And_Difference_Arrays/README.md).
- **Subsequences** (elements need not be contiguous). Windows only describe contiguous ranges.
- **"Exactly k" conditions** cannot be shrunk directly; convert to at-most differences.
- **Validity that is not monotone** (a bigger window can become valid again after being invalid). The window idea relies on monotonicity.

---

## Interview tips

- Say: "The window stays contiguous, and because the condition is monotonic I never have
  to move `left` backward. `left` and `right` each move at most n times, so it's O(n)."
- Name the invariant: "After the while loop, the window is always valid" (longest) or
  "Inside the while loop the window is valid, so I record it" (shortest).
- Before coding, decide: fixed or variable? longest or shortest? what state do I need
  (sum, Map of counts, number of zeros, `formed` counter)?
- If the interviewer says "the numbers can be negative", switch to `08_Prefix_Sums_And_Difference_Arrays`.
- Related: `05_Hashing` (frequency maps), `06_Two_Pointers` (same-direction pointers),
  `08_Prefix_Sums_And_Difference_Arrays` (non-monotonic conditions), `17_Queues_And_Deques` (deque implementation).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Maximum Average Subarray I | Easy | fixed window | 03_Problems/solutions/01_maximum_average_subarray.js |
| 02 | Max Sum Subarray of Size K | Easy | fixed window | 03_Problems/solutions/02_max_sum_subarray_size_k.js |
| 03 | Longest Substring Without Repeating Characters | Medium | variable, Set | 03_Problems/solutions/03_longest_substring_without_repeating.js |
| 04 | Longest Repeating Character Replacement | Medium | variable, counts + maxFreq | 03_Problems/solutions/04_longest_repeating_character_replacement.js |
| 05 | Minimum Size Subarray Sum | Medium | variable, shortest | 03_Problems/solutions/05_minimum_size_subarray_sum.js |
| 06 | Permutation in String | Medium | fixed, counts | 03_Problems/solutions/06_permutation_in_string.js |
| 07 | Find All Anagrams in a String | Medium | fixed, counts | 03_Problems/solutions/07_find_all_anagrams.js |
| 08 | Fruit Into Baskets | Medium | variable, at most 2 distinct | 03_Problems/solutions/08_fruit_into_baskets.js |
| 09 | Max Consecutive Ones III | Medium | variable, budget of k | 03_Problems/solutions/09_max_consecutive_ones_iii.js |
| 10 | Longest Subarray of 1's After Deleting One Element | Medium | variable, budget of 1 | 03_Problems/solutions/10_longest_subarray_of_ones_after_deleting.js |
| 11 | Subarrays with K Different Integers | Hard | at most K trick | 03_Problems/solutions/11_subarrays_with_k_different_integers.js |
| 12 | Sliding Window Maximum | Hard | monotonic deque | 03_Problems/solutions/12_sliding_window_maximum.js |
| 13 | Count Number of Nice Subarrays | Medium | at most K trick | 03_Problems/solutions/13_count_nice_subarrays.js |
| 14 | Minimum Window Substring | Hard | variable, shortest, counts | 03_Problems/solutions/14_minimum_window_substring.js |
| 15 | Minimum Number of K Consecutive Bit Flips | Hard | window of flips + lazy toggle | 03_Problems/solutions/15_min_k_consecutive_bit_flips.js |

---

## Practice more

Easy: Contains Duplicate II (219), Maximum Number of Vowels in a Substring of Given Length
(1456), Defuse the Bomb (1652), Minimum Difference Between Highest and Lowest of K Scores (1984)

Medium: Longest Substring with At Most K Distinct Characters (340), Binary Subarrays With Sum
(930), Max Consecutive Ones II (487), Number of Substrings Containing All Three Characters
(1358), Minimum Swaps to Group All 1's Together (1151), Grumpy Bookstore Owner (1052),
Maximum Points You Can Obtain from Cards (1423), Frequency of the Most Frequent Element
(1838), Longest Nice Subarray (2401), Replace the Substring for Balanced String (1234)

Hard: Substring with Concatenation of All Words (30), Shortest Subarray with Sum at Least K
(862, needs deque + prefix), Subarrays with K Different Integers (992), Count Subarrays With
Fixed Bounds (2444)
