# Rotate in Place

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Medium |
| **Pattern** | in-place mutation, triple reverse |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [04_rotate_in_place.js](../solutions/04_rotate_in_place.js) — open only after a real attempt |

## Problem

Rotate an array to the RIGHT by k steps, IN PLACE: the function must modify the
array it receives (the caller's variable sees the change) and use O(1) extra space.
Return the same array reference. k can be larger than the length, and can be
negative (negative k means rotate left by |k|).

## Examples

```
Input: [1, 2, 3, 4, 5], k = 2    Output: [4, 5, 1, 2, 3]
Input: [1, 2, 3],       k = 4    Output: [3, 1, 2]        (4 % 3 = 1)
Input: [1, 2, 3, 4],    k = -1   Output: [2, 3, 4, 1]     (left by 1)
Input: [],              k = 3    Output: []
```

## Constraints & clarifying questions

```
- n up to 1e5, k up to 1e9 -> moving one step at a time k times is far too slow.
- Must it be in place? (yes: arr = [...] inside the function does NOT change the caller's array)
- What does negative k mean? (rotate left)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *In-place mutation* and *k mod n*. Read sections 5.3 (functions, pass-by-sharing) and 8 (dry run) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * (k mod n)) time, O(1) space. Normalise k, then k times: pop the last element and unshift it to the front. Correct and in place, but each unshift shifts every element.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Rotating right by k moves the last k elements to the front without changing the order inside either block. Reverse the whole array, then reverse the first k, then the rest. Normalise with `((k % n) + n) % n` because JS `%` can be negative.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0          -> return immediately (k % 0 is NaN!)
- k = 0 or k = n -> unchanged
- k negative     -> ((k % n) + n) % n, because -1 % 5 is -1 in JS, not 4
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * (k mod n)) time, O(1) space

```
Normalise k, then k times: pop the last element and unshift it to the front.
Correct and in place, but each unshift shifts every element.
```

### APPROACH 2 — Optimal (triple reverse)   O(n) time, O(1) space

```
Normalise k = ((k % n) + n) % n (handles negative k and k >= n).
Rotating right by k moves the last k elements to the front, keeping each block's order.
  reverse the whole array        -> last block is now first, but both blocks are backwards
  reverse the first k elements   -> fix the first block's order
  reverse the remaining n - k    -> fix the second block's order

Dry run [1,2,3,4,5], k = 2:
  reverse all [0,4]   -> [5,4,3,2,1]
  reverse [0,1]       -> [4,5,3,2,1]
  reverse [2,4]       -> [4,5,1,2,3]
```

### Edge cases

```
- n = 0          -> return immediately (k % 0 is NaN!)
- k = 0 or k = n -> unchanged
- k negative     -> ((k % n) + n) % n, because -1 % 5 is -1 in JS, not 4
```

### Common mistakes

```
- arr = arr.slice(-k).concat(...) inside the function: only rebinds the local name; the caller sees nothing.
- Forgetting k % n (reverse ranges go out of bounds).
- Trusting % to be non-negative.
```

Full JavaScript solution with tests: [04_rotate_in_place.js](../solutions/04_rotate_in_place.js). Run it with `node 04_rotate_in_place.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #189 Rotate Array.
- Rotate a matrix 90 degrees in place (LeetCode #48).
- Rotate using cyclic replacements (juggling algorithm) and prove it visits every index once.

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
