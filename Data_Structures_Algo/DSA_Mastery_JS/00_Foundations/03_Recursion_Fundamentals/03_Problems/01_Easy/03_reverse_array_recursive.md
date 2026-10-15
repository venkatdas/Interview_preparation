# Reverse an Array Recursively

| | |
|---|---|
| **Topic** | Recursion Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | two-index recursion, in place |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [03_reverse_array_recursive.js](../solutions/03_reverse_array_recursive.js) — open only after a real attempt |

## Problem

Reverse an array IN PLACE using recursion (no loops, no built-in reverse).
Return the same array. Also write the version that returns a NEW reversed array
without touching the input, and compare their costs.

## Examples

```
Input: [1, 2, 3, 4, 5]   Output: [5, 4, 3, 2, 1]
Input: [1, 2]            Output: [2, 1]
Input: [7]               Output: [7]
Input: []                Output: []
```

## Constraints & clarifying questions

```
- Length up to 2000 -> in-place recursion depth is n/2 = 1000, safe. (Measured: 10,000 elements
  already overflowed in one Node run, because frames with destructuring swaps are bigger
  than the tiny frames used to measure the ~10k limit. Frame size matters!)
- In place or new array? (in place for the optimal version)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Shrink from both ends*. Section 13 (patterns) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (head + recurse on the rest, building new arrays)   O(n^2) time. reversed(arr) = arr.length === 0 ? [] : [...reversed(arr.slice(1)), arr[0]]. Every level copies the rest of the array (slice) and the result (spread) -> quadratic, and depth is n (not n/2).

</details>

<details><summary>Hint 3</summary>

**The key idea.** Swap the two ends, then reverse the inside: `rev(lo + 1, hi - 1)`. Stop when `lo >= hi` (they meet on odd lengths and cross on even lengths).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty and single element: base case immediately
- even length: lo and hi cross (lo > hi) rather than meet
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (head + recurse on the rest, building new arrays)   O(n^2) time

```
reversed(arr) = arr.length === 0 ? [] : [...reversed(arr.slice(1)), arr[0]].
Every level copies the rest of the array (slice) and the result (spread) -> quadratic,
and depth is n (not n/2).
```

### APPROACH 2 — Optimal (swap the ends, recurse inward)   O(n) time, O(n) stack (n/2 frames)

```
rev(lo, hi): if lo >= hi stop; swap arr[lo], arr[hi]; rev(lo + 1, hi - 1).
This is the two-pointer loop written as recursion.

Dry run [1,2,3,4,5]:
  rev(0,4) swap -> [5,2,3,4,1]
  rev(1,3) swap -> [5,4,3,2,1]
  rev(2,2) lo >= hi stop
```

### Edge cases

```
- empty and single element: base case immediately
- even length: lo and hi cross (lo > hi) rather than meet
```

### Common mistakes

```
- Base case lo === hi (misses the crossing case on even lengths -> swaps back).
- Creating new arrays per call and calling it "in place".
```

Full JavaScript solution with tests: [03_reverse_array_recursive.js](../solutions/03_reverse_array_recursive.js). Run it with `node 03_reverse_array_recursive.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #344 Reverse String.
- LeetCode #206 Reverse Linked List (recursive).
- Reverse only the words of a sentence, recursively.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
