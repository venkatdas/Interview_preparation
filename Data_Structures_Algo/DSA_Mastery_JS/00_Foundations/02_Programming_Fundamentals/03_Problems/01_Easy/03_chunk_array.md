# Chunk an Array

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | step loop, half-open slices |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [03_chunk_array.js](../solutions/03_chunk_array.js) — open only after a real attempt |

## Problem

Given an array and a positive integer size, split the array into consecutive
groups of `size` elements. The last group holds whatever is left (it may be
shorter). Do not modify the input array.

## Examples

```
Input: [1, 2, 3, 4, 5], size = 2   Output: [[1, 2], [3, 4], [5]]
Input: [1, 2, 3, 4],    size = 2   Output: [[1, 2], [3, 4]]       (no empty last chunk!)
Input: [1, 2],          size = 5   Output: [[1, 2]]
Input: [],              size = 3   Output: []
```

## Constraints & clarifying questions

```
- size < 1 or not an integer? (throw a RangeError)
- May I mutate the input (e.g. splice)? (no)
- Should chunks be copies or views? (copies, new arrays)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** A *step loop* over half-open ranges. Read the loop-boundary rules in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Walk element by element. Keep a "current" chunk; push each element into it, and when it reaches `size`, push it into the result and start a new one. After the loop, push the leftover chunk ONLY if it is non-empty.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Jump the start index by `size` each time and take `arr.slice(i, i + size)`. `slice` clamps the end, so the last partial chunk is automatic, and the condition `i < n` makes an empty trailing chunk impossible.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n divisible by size   -> no trailing empty chunk
- size > n              -> a single chunk with everything
- empty array           -> []
- size 0 / negative / 1.5 -> RangeError (size 0 would loop forever!)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Walk element by element. Keep a "current" chunk; push each element into it, and
when it reaches `size`, push it into the result and start a new one. After the
loop, push the leftover chunk ONLY if it is non-empty.
```

### APPROACH 2 — Optimal (step loop + slice)   O(n) time, O(n) space

```
Step the start index by size: for (let i = 0; i < n; i += size) out.push(arr.slice(i, i + size)).
slice clamps its end to n, so the last partial chunk needs no special case,
and the loop condition i < n guarantees no empty chunk is produced.
Number of chunks = ceil(n / size).

Dry run [1,2,3,4,5], size 2:
  i=0 -> slice(0,2) [1,2]
  i=2 -> slice(2,4) [3,4]
  i=4 -> slice(4,6) [5]      (end clamped to 5)
  i=6 -> 6 < 5 false, stop
```

### Edge cases

```
- n divisible by size   -> no trailing empty chunk
- size > n              -> a single chunk with everything
- empty array           -> []
- size 0 / negative / 1.5 -> RangeError (size 0 would loop forever!)
```

### Common mistakes

```
- i <= n in the loop condition -> extra empty chunk when n % size === 0.
- Using splice on the input (mutates the caller's data).
- Not validating size: i += 0 is an infinite loop.
```

Full JavaScript solution with tests: [03_chunk_array.js](../solutions/03_chunk_array.js). Run it with `node 03_chunk_array.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #2677 Chunk Array.
- Split an array into k chunks whose sizes differ by at most 1.
- Sliding windows of size k with step s (overlapping chunks).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
