# Monotonic Structures (Stack & Deque)

> **Prerequisites:** [Stacks](../../16_Stacks/README.md), [Queues and Deques](../../17_Queues_And_Deques/README.md), [Sliding Window](../../07_Sliding_Window/README.md), [Arrays](../../03_Arrays/README.md).

A **monotonic stack** is a stack whose values are always sorted (increasing or decreasing)
from bottom to top. A **monotonic deque** is the same idea with removals allowed at the
front too, which makes it a **sliding window**. Think of a queue at a club where a bouncer
throws out anyone shorter than the newcomer: whoever is still standing is, by construction,
sorted by height, and the tallest person is always at the front.

You met both already (`../../16_Stacks/`, `../../17_Queues_And_Deques/`, `../../07_Sliding_Window/`).
This folder consolidates them into one toolkit: **previous/next smaller arrays**, the
**histogram family**, the **contribution technique**, and **sliding window max/min**.

---

## Why it matters / when to use

- "Next greater / next smaller / previous greater / previous smaller element"
- "How far can this bar extend?" → histogram problems (Largest Rectangle, Maximal Rectangle,
  Trapping Rain Water)
- "Sum over all subarrays of the min/max" → contribution technique
- "Span / days until warmer / stock span"
- "Maximum (or minimum) of every window of size k" → monotonic deque
- DP where `dp[i] = f(i) + max(dp[i-k..i-1])` → DP + deque (Jump Game VI, Constrained
  Subsequence Sum)
- "Remove k digits to make the smallest number" → greedy with a monotonic stack

The signal: you need the **nearest element in one direction satisfying an inequality**, or a
**running extreme over a moving range**. Each element enters and leaves once → O(n).

---

## How it works

### The invariant

```
increasing stack (bottom -> top):  values go up.  Before pushing x, pop every top >= x.
    The element left on top after popping is the PREVIOUS SMALLER of x.
    Each popped element has just found its NEXT SMALLER-OR-EQUAL: it is x.

nums = [3, 1, 4, 1, 5]

i=0 push 3            stack [3]
i=1 pop 3 (>= 1)      3's next smaller = index 1;  prev smaller of 1 = none (-1);  stack [1]
i=2 push 4            prev smaller of 4 = index 1 (value 1);                       stack [1, 4]
i=3 pop 4 (>= 1)      4's next smaller = index 3;  top is 1 (equal) -> pop too? depends on strictness
...
```

### Strict vs non-strict (duplicates)

| You want | Pop condition | Equal neighbour counts? |
|----------|---------------|-------------------------|
| previous strictly smaller (`<`) | pop while `top >= x` | no |
| previous smaller-or-equal (`<=`) | pop while `top > x` | yes |
| next strictly smaller | (scan from right) pop while `top >= x` | no |
| next smaller-or-equal | pop while `top > x` | yes |

For **counting** problems (Sum of Subarray Minimums) use strict on one side and non-strict
on the other so each subarray with tied minimums is credited exactly once. For **geometry**
problems (histogram) both non-strict is fine - equal bars just share the same span.

### Histogram family

```
heights = [2, 1, 5, 6, 2, 3]

      6
    5 #
    # #     3
2   # #   2 #
# 1 # #   # #
# # # #   # #
0 1 2 3   4 5

bar 2 (height 5): previous smaller = index 1, next smaller = index 4
                  width = 4 - 1 - 1 = 2, area = 5 * 2 = 10  <- answer
```
`area(i) = heights[i] * (nextSmaller[i] - prevSmaller[i] - 1)`. One pass with a sentinel
(`height 0` appended) resolves every bar as it is popped.

**Maximal Rectangle** = run the histogram per row, where `heights[c]` counts consecutive
ones ending at the current row.

### Contribution technique (Sum of Subarray Minimums)

Instead of "min of every subarray" ask "**how many subarrays is `arr[i]` the min of?**"

```
arr = [3, 1, 2, 4]
i=1 (value 1): prevSmaller = -1, nextSmallerOrEqual = 4
               starts in (-1, 1] -> 2 choices, ends in [1, 4) -> 3 choices
               1 * 2 * 3 = 6 subarrays have min 1 -> contributes 6
total = 3*1*1 + 1*2*3 + 2*1*2 + 4*1*1 = 17
```

### Monotonic deque: sliding window max

```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3    deque holds INDICES, values decreasing front -> back

i=0  push 0                       deque [0]          (values [1])
i=1  3 > 1: pop 0, push 1         deque [1]          ([3])
i=2  push 2                       deque [1, 2]       ([3, -1])      window full -> max = 3
i=3  push 3                       deque [1, 2, 3]    ([3, -1, -3])  max = 3
i=4  5 beats everything: pop 3,2,1; push 4   deque [4]              max = 5
i=5  push 5                       deque [4, 5]       ([5, 3])       max = 5
i=6  6 > 3, 6 > 5: pop both; push 6     deque [6]                   max = 6
i=7  pop 6; push 7                deque [7]                         max = 7
front index < i - k + 1  ->  drop from the front (it left the window)
```

Use an array plus a `head` index for the deque: `shift()` is O(n), `head++` is O(1).

---

## Pseudocode

```
NEXT_GREATER(nums):                   # stack of indices, values decreasing
    res = [n] * n                     # n means "none to the right"
    st = []
    for i in 0..n-1:
        while st not empty and nums[st.top] < nums[i]:
            res[st.pop()] = i         # i is the answer for the popped index
        st.push(i)
    return res

LARGEST_RECTANGLE(h):                 # stack of indices, heights increasing
    best = 0; st = []
    for i in 0..n:                    # i == n acts as a height-0 sentinel
        cur = (i == n) ? 0 : h[i]
        while st not empty and h[st.top] >= cur:
            height = h[st.pop()]
            left = st.empty ? -1 : st.top
            best = max(best, height * (i - left - 1))
        st.push(i)
    return best

WINDOW_MAX(nums, k):                  # deque of indices, values decreasing
    for i in 0..n-1:
        pop back while nums[back] <= nums[i]; push i
        pop front if front <= i - k
        if i >= k - 1: emit nums[front]
```

---

## Operations & complexity

| Technique | Time | Space | Why |
|-----------|------|-------|-----|
| previous/next smaller/greater arrays | O(n) | O(n) | each index pushed once, popped at most once |
| largest rectangle in histogram | O(n) | O(n) | one pass + sentinel |
| maximal rectangle | O(rows · cols) | O(cols) | histogram per row |
| sum of subarray minimums | O(n) | O(n) | contribution technique |
| sliding window max/min | O(n) | O(k) | deque never holds more than k indices |
| DP + deque (`max dp over last k`) | O(n) | O(k) | same as window max |

The amortized argument to say out loud: *"Every index is pushed exactly once and popped at
most once, so the total work over the whole loop is O(n) even though one iteration may pop
many elements."*

---

## JavaScript implementation

Full helpers with randomized tests against nested loops: `monotonic.js`
(`previousSmaller`, `nextSmaller`, `previousGreater`, `nextGreater` with a `strict` flag,
`slidingWindowMax`, `slidingWindowMin`, `largestRectangleArea`). The two cores:

```js
function previousSmaller(nums) {                  // index of nearest smaller to the left, else -1
  const result = new Array(nums.length).fill(-1), stack = [];
  for (let i = 0; i < nums.length; i++) {
    while (stack.length && nums[stack[stack.length - 1]] >= nums[i]) stack.pop();
    if (stack.length) result[i] = stack[stack.length - 1];
    stack.push(i);
  }
  return result;
}

function slidingWindowMax(nums, k) {
  const result = [], deque = []; let head = 0;
  for (let i = 0; i < nums.length; i++) {
    if (head < deque.length && deque[head] <= i - k) head++;                           // left the window
    while (deque.length > head && nums[deque[deque.length - 1]] <= nums[i]) deque.pop(); // smaller can't win
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[head]]);
  }
  return result;
}
```

---

## Dry run

**Largest rectangle on `[2, 1, 5, 6, 2, 3]`** (stack holds indices; heights shown):

| i | cur | pops (height × width) | best | stack after (heights) |
|---|---|---|---|---|
| 0 | 2 | - | 0 | [2] |
| 1 | 1 | 2 × 1 = 2 | 2 | [1] |
| 2 | 5 | - | 2 | [1, 5] |
| 3 | 6 | - | 2 | [1, 5, 6] |
| 4 | 2 | 6 × 1 = 6, 5 × 2 = 10 | 10 | [1, 2] |
| 5 | 3 | - | 10 | [1, 2, 3] |
| 6 (sentinel 0) | 0 | 3 × 1 = 3, 2 × 4 = 8, 1 × 6 = 6 | **10** | [] |

---

## Patterns / variations

### 1. Next greater with wrap-around (circular)

Loop `i` from `0` to `2n - 1` and use `i % n`; push only during the first pass.

### 2. Stack of pairs (value, count) for spans

```js
let span = 1;
while (stack.length && stack.at(-1)[0] <= price) span += stack.pop()[1];
stack.push([price, span]);
```
Use when: Online Stock Span, "number of visible people".

### 3. Two-sided boundaries in one pass

While popping for the next-smaller, the new stack top is the previous-smaller: compute both
arrays in a single loop (see Sum of Subarray Minimums).

### 4. Greedy removal with a monotonic stack

Remove K Digits, Remove Duplicate Letters, Create Maximum Number: pop while the top is
worse than the current **and** you still have removals left.

### 5. DP + monotonic deque

`dp[i] = nums[i] + max(dp[i-k..i-1])` → keep a deque of indices with decreasing `dp`.
Use when: Jump Game VI, Constrained Subsequence Sum, Shortest Subarray with Sum at Least K
(deque over prefix sums).

### 6. Prefix-max / suffix-min instead of a stack

Shortest Unsorted Continuous Subarray: the stack version works, but "element smaller than
the running max is misplaced" gives the same answer in O(1) space.

---

## Alternatives (brute force vs optimized)

| Problem | Brute force | Monotonic structure | Other option |
|---|---|---|---|
| Next greater / smaller | Scan outward from each i: O(n²) | Stack: O(n) | - |
| Window max / min | Recompute each window: O(n·k) | Deque: O(n) | Heap with lazy deletion: O(n log n); sparse table: O(n log n) build, O(1) query |
| Largest rectangle | Every pair (i, j) with running min: O(n²) | Stack: O(n) | Divide and conquer: O(n log n) average |
| Sum of subarray mins | Every subarray: O(n²) | Contribution via prev/next smaller: O(n) | - |
| DP with "max of last k" | Scan k values per state: O(n·k) | Deque: O(n) | Heap: O(n log n) |

---

## Common mistakes & edge cases

- Storing **values** when you need **indices** (widths, distances, window membership).
- Getting `>=` vs `>` wrong with duplicates; write the pop condition down before coding.
- Forgetting the **sentinel** at the end of the histogram loop, leaving bars unresolved.
- Using `Array.shift()` for the deque front - O(n) per call; use a head pointer.
- Deque window check: drop the front when `deque[head] <= i - k` (index-based), not value-based.
- Sum of Subarray Minimums: take the modulo at every addition, not only at the end.
- Empty input (`[]`) in histogram → 0; `k = 1` in window problems → the array itself.

---

## When this does NOT apply

- **Arbitrary range queries** ("max of nums[l..r]" for many random l, r): use a sparse table or segment tree.
- **Values change after you've processed them**: the stack's one-pass invariant breaks; use a segment tree.
- **You need the k-th largest or a sorted view** of the window: use two heaps or an ordered structure.
- **Window aggregates like sum or count**: a running sum is enough.
- **The window is not contiguous** or does not move monotonically: the deque's expiry rule no longer holds.

---

## Interview tips

- State the invariant first: *"My stack stays increasing; when a smaller element arrives,
  everything larger on top is resolved - the newcomer is their next smaller."*
- Say the amortized O(n) argument unprompted.
- For histogram problems draw the bars and point at the previous/next smaller boundaries.
- For sum-over-subarrays problems say *"contribution technique"* - interviewers recognise it.
- For sliding window max, mention both the deque (O(n)) and that a sparse table / segment
  tree would also work for arbitrary ranges (`../34_Range_Query_Data_Structures/03_Sparse_Table/`).

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Online Stock Span | Medium | stack of (price, span) | 03_Problems/solutions/01_online_stock_span.js |
| 02 | Shortest Unsorted Continuous Subarray | Medium | monotonic stack vs prefix-max/suffix-min | 03_Problems/solutions/02_shortest_unsorted_continuous_subarray.js |
| 03 | Sum of Subarray Minimums | Medium | contribution technique, strict/non-strict | 03_Problems/solutions/03_sum_of_subarray_minimums.js |
| 04 | Largest Rectangle in Histogram | Hard | boundary arrays and one-pass sentinel | 03_Problems/solutions/04_largest_rectangle_in_histogram.js |
| 05 | Maximal Rectangle | Hard | histogram per row | 03_Problems/solutions/05_maximal_rectangle.js |
| 06 | Jump Game VI | Medium | DP + monotonic deque | 03_Problems/solutions/06_jump_game_vi.js |

---

## Practice more

Easy: Next Greater Element I (496), Final Prices With a Special Discount (1475)

Medium: Daily Temperatures (739), Next Greater Element II (503), Remove K Digits (402),
Remove Duplicate Letters (316), 132 Pattern (456), Car Fleet (853), Number of Visible People
in a Queue (1944), Sum of Subarray Ranges (2104), Constrained Subsequence Sum (1425),
Longest Continuous Subarray With Absolute Diff <= Limit (1438), Minimum Cost Tree From Leaf
Values (1130), Steps to Make Array Non-decreasing (2289)

Hard: Sliding Window Maximum (239), Trapping Rain Water (42), Shortest Subarray with Sum at
Least K (862), Maximum Score of a Good Subarray (1793), Count Subarrays With Fixed Bounds (2444),
Create Maximum Number (321)
