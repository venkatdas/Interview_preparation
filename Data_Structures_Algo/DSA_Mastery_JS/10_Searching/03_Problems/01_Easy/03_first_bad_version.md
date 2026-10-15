# First Bad Version

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Easy |
| **Pattern** | first true (boundary) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #278 — https://leetcode.com/problems/first-bad-version/ |
| **Solution file** | [03_first_bad_version.js](../solutions/03_first_bad_version.js) — open only after a real attempt |

## Problem

You have n versions [1, 2, ..., n]. At some point a bad version was released and
every version after it is also bad. You are given an API isBadVersion(version)
that returns a boolean. Find the FIRST bad version using as few API calls as possible.

## Examples

```
n = 5, bad = 4:  isBad(3)=false, isBad(5)=true, isBad(4)=true -> 4
n = 1, bad = 1:  -> 1
```

## Constraints & clarifying questions

```
- Is there always at least one bad version? (yes)
- n up to 2^31 - 1: (lo + hi) must not overflow in other languages; in JS use lo + ((hi - lo) >> 1)
  only if values < 2^31, else Math.floor - we use Math.floor to be safe
- Each API call is expensive: minimise calls -> O(log n)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *first true (boundary)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) API calls. Check 1, 2, 3, ...

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (first true in a monotonic predicate, Template 2)   O(log n) calls, O(1) space. The versions look like G G G B B B.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- first version is bad -> 1
- only the last version is bad -> n
- n = 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) API calls

```
Check 1, 2, 3, ... until isBadVersion returns true.
```

### APPROACH 2 — Optimal (first true in a monotonic predicate, Template 2)   O(log n) calls, O(1) space

```
The versions look like G G G B B B. We want the boundary (first B). Search [lo, hi]
with lo = 1, hi = n: if isBad(mid) the answer is mid or earlier (hi = mid); otherwise
it is strictly later (lo = mid + 1). Loop while lo < hi; lo is the answer.

Dry run n=5, first bad = 4:
  lo=1 hi=5 mid=3 isBad? no  -> lo=4
  lo=4 hi=5 mid=4 isBad? yes -> hi=4
  lo === hi === 4 -> 4
```

### Edge cases

```
- first version is bad -> 1
- only the last version is bad -> n
- n = 1
```

Full JavaScript solution with tests: [03_first_bad_version.js](../solutions/03_first_bad_version.js). Run it with `node 03_first_bad_version.js` from the solutions folder.

</details>

## Common mistakes

- Calling the API more than needed by checking `mid - 1` too.
- Overflow-prone `(lo + hi) / 2` in other languages; in JS it is fine, but say why.
- Using `hi = mid - 1` when mid is bad; mid could be the first bad version.

## Related follow-ups

- [Search Insert Position](02_search_insert_position.md) — the same first-true search
- [Koko Eating Bananas](../02_Medium/12_koko_eating_bananas.md) — first-true search on an answer range
- [Guess Number Higher or Lower](06_guess_number.md) — a three-way API instead of true/false

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
