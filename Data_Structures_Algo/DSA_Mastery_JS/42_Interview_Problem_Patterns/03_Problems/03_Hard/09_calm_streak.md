# Calm Streak

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Hard |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [09_calm_streak.js](../solutions/09_calm_streak.js) — open only after a real attempt |

## Problem

`readings[i]` is a vibration sensor reading at minute `i`. A stretch of **consecutive** minutes is
"calm" if its largest reading minus its smallest reading is at most `d`. Return the length of the
longest calm stretch (`0` for no readings).

## Examples

```
Input: readings = [8, 2, 4, 7], d = 4          Output: 2   ([2,4] or [4,7])
Input: readings = [10, 1, 2, 4, 7, 2], d = 5    Output: 4   ([2,4,7,2])
Input: readings = [4, 4, 4], d = 0              Output: 3
```

## Constraints & clarifying questions

```
- 0 <= n <= 10^5, readings may be negative, 0 <= d <= 10^9
- "Consecutive" means a contiguous subarray.
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Sliding window (longest valid) + two monotonic deques for window max and min. Lesson: [Sliding Window](../../01_Concepts/patterns/03_sliding_window.md).

**Target:** O(n) time, O(n) space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 40 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "consecutive", "longest", a condition on the window. If a stretch is calm, is every shorter stretch inside it calm too?

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: for each start, extend while tracking running max and min; stop when max - min > d. O(n^2).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Use a variable sliding window. The hard part is the window max and min in O(1): keep two monotonic deques (decreasing for max, increasing for min) of indices.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** When shrinking, drop a deque front once its index is left of the window. Avoid `shift()` (O(n)); keep a head index. Test negatives and d = 0.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

Two loops with running max/min, break when invalid. O(n^2) time, O(1) space.

### APPROACH 2 — Optimal (Sliding window (longest valid) + two monotonic deques for window max and min)

```
for right: push right into maxQ (pop smaller from back) and minQ (pop bigger from back)
  while max - min > d: left++; drop fronts with index < left
  best = max(best, right - left + 1)
```

### Dry run

```
[8,2,4,7], d=4
  r=0 max 8 min 8          len 1
  r=1 max 8 min 2 (6>4) -> left=1, max 2      len 1
  r=2 max 4 min 2          len 2
  r=3 max 7 min 2 (5>4) -> left=2, min 4      len 2
  answer 2
```

### Complexity

O(n) time — every index enters and leaves each deque once. O(n) space.

### Common mistakes

- Using a heap: works but O(n log n) and needs lazy deletion.
- Recomputing `Math.max(...window)` each step: O(n^2).
- `deque.shift()` in a loop: hidden O(n).

Full JavaScript solution with tests: [09_calm_streak.js](../solutions/09_calm_streak.js). Run it with `node 09_calm_streak.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../07_Sliding_Window/03_Problems/03_Hard/12_sliding_window_maximum.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/12_sliding_window_maximum.js)
- [statement](../../../07_Sliding_Window/03_Problems/02_Medium/09_max_consecutive_ones_iii.md) · [solution](../../../07_Sliding_Window/03_Problems/solutions/09_max_consecutive_ones_iii.js)
- Pattern lesson: [Sliding Window](../../01_Concepts/patterns/03_sliding_window.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
