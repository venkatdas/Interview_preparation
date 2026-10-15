# Badge Scan Repeat

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Easy |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [01_badge_scan_repeat.js](../solutions/01_badge_scan_repeat.js) — open only after a real attempt |

## Problem

An office door logs badge scans in order: `scans[i]` is a badge id (a string).
A "tailgating alert" happens when the same badge is scanned again within at most `k` positions
of its previous scan (`j - i <= k`). Return the index `j` of the **first** scan that triggers
an alert, or `-1` if none does.

## Examples

```
Input: scans = ["a7", "b2", "a7", "c1"], k = 2   Output: 2    (a7 at 0 and 2, distance 2)
Input: scans = ["a7", "b2", "c1", "a7"], k = 2   Output: -1   (distance 3 > 2)
Input: scans = ["x", "y", "y"], k = 1            Output: 2
```

## Constraints & clarifying questions

```
- 0 <= scans.length <= 10^5, 0 <= k <= 10^5
- Empty log -> -1. k = 0 -> never an alert.
- Ids are case-sensitive strings.
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Hash map (last-seen index). Lesson: [Hash Map & Frequency Counting](../../01_Concepts/patterns/01_hash_map_and_frequency_counting.md).

**Target:** O(n) time, O(n) space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Look for the clue words: "the same badge again", "within k positions". The input is not sorted and n is up to 10^5, so O(n^2) is too slow.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: for every j, look back at the previous k scans. That is O(n * k). What are you re-checking each time?

</details>

<details><summary>Hint 3</summary>

**The key idea.** You only need to know the **most recent** earlier index of each badge. A `Map` from id to last index answers that in O(1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Edge cases: empty log, k = 0, an id that repeats far apart first and close later (only the close one counts), ids like `"constructor"` (use `Map`, not `{}`).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

For each j, compare scans[j] with scans[j-k..j-1]. O(n * k) time, O(1) space.

### APPROACH 2 — Optimal (Hash map (last-seen index))

```
Walk left to right with lastSeen: Map<id, index>.
  if lastSeen has id and j - lastSeen.get(id) <= k -> return j
  else lastSeen.set(id, j)
Only the last occurrence matters: an older one is even farther away.
```

### Dry run

```
["a7","b2","a7","c1"], k=2
  j=0 a7 new         lastSeen {a7:0}
  j=1 b2 new         lastSeen {a7:0, b2:1}
  j=2 a7 2-0=2 <= 2  -> return 2
```

### Complexity

O(n) time, O(n) space for the map.

### Common mistakes

- Using a plain object: `{}` keys like "constructor" collide with prototype properties.
- Updating lastSeen before checking (you would compare a scan with itself).

Full JavaScript solution with tests: [01_badge_scan_repeat.js](../solutions/01_badge_scan_repeat.js). Run it with `node 01_badge_scan_repeat.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../05_Hashing/03_Problems/01_Easy/02_contains_duplicate_ii.md) · [solution](../../../05_Hashing/03_Problems/solutions/02_contains_duplicate_ii.js)
- [statement](../../../05_Hashing/03_Problems/01_Easy/01_two_sum.md) · [solution](../../../05_Hashing/03_Problems/solutions/01_two_sum.js)
- Pattern lesson: [Hash Map & Frequency Counting](../../01_Concepts/patterns/01_hash_map_and_frequency_counting.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
