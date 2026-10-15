# Divide in Two, Linear Merge

| | |
|---|---|
| **Topic** | Big O, Omega, Theta |
| **Difficulty** | Medium |
| **Pattern** | master theorem case 2 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [06_divide_two_linear_merge.js](../solutions/06_divide_two_linear_merge.js) — open only after a real attempt |

## Problem

Below is merge sort with a counter of ELEMENT WRITES during merging. Write the
recurrence for the number of writes W(n), solve it with the master theorem, and
find an exact closed form that works for every n (not only powers of two).
Also state the space complexity.

  function sort(a) {
    if (a.length <= 1) return a;
    const mid = a.length >> 1;
    const L = sort(a.slice(0, mid)), R = sort(a.slice(mid));
    const out = []; let i = 0, j = 0;
    while (i < L.length || j < R.length) {       // each iteration writes one element
      writes++;
      if (j >= R.length || (i < L.length && L[i] <= R[j])) out.push(L[i++]); else out.push(R[j++]);
    }
    return out;
  }

## Examples

```
n = 1 -> 0 writes   n = 2 -> 2   n = 3 -> 5   n = 4 -> 8   n = 5 -> 12   n = 1024 -> 10240
```

## Constraints & clarifying questions

```
- Count only merge writes (slices also copy n elements per level: same order, ignore them here).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** *Write the recurrence*: two calls on halves plus linear merging. Sections 5.6 and 5.7 in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (run merge sort and count)   Θ(n log n). Run the code above and return the counter (and check the array is sorted).

</details>

<details><summary>Hint 3</summary>

**The key idea.** W(n) = W(⌊n/2⌋) + W(⌈n/2⌉) + n. a = 2, b = 2, d = 1 = log₂2 → case 2 → Θ(n log n): n writes per level, ⌈log₂ n⌉ levels. The exact count is `n·L − 2^L + n` with L = ⌈log₂ n⌉.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 or 1 -> 0 writes
- odd n: halves differ by one; the closed form still holds exactly
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (run merge sort and count)   Θ(n log n)

```
Run the code above and return the counter (and check the array is sorted).
```

### APPROACH 2 — Optimal (recurrence + closed form)   O(1)

```
Recurrence: W(n) = W(floor(n/2)) + W(ceil(n/2)) + n, W(1) = 0.
Master theorem: a = 2, b = 2, d = 1, log_2 2 = 1 = d -> case 2 -> Θ(n log n).
Recursion tree: every level writes n elements; there are ceil(log2 n) levels.
Exact for all n (let L = ceil(log2 n)):   W(n) = n·L - 2^L + n
Power of two n = 2^k: W = n·k - n + n = n·k = n log2 n.
Space: Θ(n) for the arrays alive at once (out + slices along one root-to-leaf path sum to ≤ 2n)
plus Θ(log n) recursion depth.
```

### EMPIRICAL CHECK

```
W(2n) / W(n) = 2(k+1)/k for n = 2^k -> 2.2 at n = 1024: "slightly more than 2" = n log n.
```

### Edge cases

```
- n = 0 or 1 -> 0 writes
- odd n: halves differ by one; the closed form still holds exactly
```

### Common mistakes

```
- Answering Θ(n) because "each level is linear" (forgetting the number of levels).
- Answering Θ(n log n) SPACE (arrays from finished calls are garbage, not alive simultaneously).
```

Full JavaScript solution with tests: [06_divide_two_linear_merge.js](../solutions/06_divide_two_linear_merge.js). Run it with `node 06_divide_two_linear_merge.js` from the solutions folder.

</details>

## Related follow-ups

- LeetCode #912 Sort an Array (implement merge sort).
- LeetCode #148 Sort List (merge sort on a linked list, O(1) extra space).
- Count inversions with merge sort (same recurrence).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
