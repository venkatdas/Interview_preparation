# Balanced L/R Substrings

| | |
|---|---|
| **Set** | [Mixed Set 01](README.md) — problem 02 of 5 |
| **Difficulty** | Easy |
| **Time box** | 15 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [02_balanced_lr_substrings.js](solutions/02_balanced_lr_substrings.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A dance routine is written as a string of 'L' (step left), 'R' (step right) and '.'
(pause). A non-empty substring is "balanced" if it has the same number of 'L' as 'R'
(pauses do not matter, so "..", "L.R" and "RL" are all balanced).
Return how many balanced substrings the routine has (count every start/end pair).

## Examples

```
Input: "LR"     Output: 1   Explanation: only "LR"
Input: "L.R"    Output: 2   Explanation: "L.R" and "."
Input: "LRLR"   Output: 4   Explanation: "LR" (x2), "RL", "LRLR"
Input: "LLL"    Output: 0
```

## Constraints & clarifying questions

```
- Only 'L', 'R', '.' characters. Length up to 10^5, so O(n^2) is too slow.
- Overlapping and repeated substrings count separately (count positions, not text).
- The answer can exceed 2^31 for long strings, but stays below 2^53.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 15 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Prefix sums + a hash map that counts equal prefix values. See [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) and [Hashing](../../../05_Hashing/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: fix a start, extend the end and track balance = #L − #R; count every time it is 0.

</details>

<details><summary>Hint 3</summary>

**The key idea.** A substring is balanced exactly when the prefix balance before it equals the prefix balance at its end. Count pairs of equal prefixes.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- ""             -> 0 (no non-empty substring)
- "...."         -> every substring is balanced: n*(n+1)/2
- only L's       -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Fix a start i, extend the end j one character at a time while tracking
balance = #L - #R. Each time balance is 0, count one.
```

### APPROACH 2 — Optimal (prefix sum + hash map of counts)   O(n) time, O(n) space

```
Let P[j] = (#L - #R) in the first j characters (P[0] = 0). Substring s[i..j-1] is
balanced exactly when P[i] === P[j]. So walk once, and for each new prefix value
add "how many earlier prefixes had the same value", then record it.

Dry run on "L.R":
  start          bal=0  seen{0:1}               total=0
  'L'  bal=1     seen has 0 of 1 -> +0          seen{0:1,1:1}      total=0
  '.'  bal=1     seen has 1 of 1 -> +1 (".")    seen{0:1,1:2}      total=1
  'R'  bal=0     seen has 1 of 0 -> +1 ("L.R")  seen{0:2,1:2}      total=2
  answer 2
```

### Edge cases

```
- ""             -> 0 (no non-empty substring)
- "...."         -> every substring is balanced: n*(n+1)/2
- only L's       -> 0
```

### Common mistakes

```
- Forgetting to seed the map with {0: 1}: misses substrings that start at index 0.
- Adding the current prefix to the map BEFORE counting it: counts the empty substring.
```

Full JavaScript solution with tests: [02_balanced_lr_substrings.js](solutions/02_balanced_lr_substrings.js). Run it with `node solutions/02_balanced_lr_substrings.js` from this folder.

</details>

## Related follow-ups

- Return the longest balanced substring instead of the count
- Three letters L, R, U: balanced when all three counts are equal (use a pair of differences as the key)
- Count substrings whose balance is exactly k

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.
