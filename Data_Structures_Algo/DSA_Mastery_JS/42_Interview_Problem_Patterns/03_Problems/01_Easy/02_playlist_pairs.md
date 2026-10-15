# Playlist Pairs

| | |
|---|---|
| **Topic** | Interview Problem Patterns — "which pattern is this?" drill |
| **Difficulty** | Easy |
| **Pattern** | identify it yourself first (answer inside the walkthrough) |
| **Prerequisites** | [Pattern index](../../README.md) |
| **Source** | Original exercise |
| **Solution file** | [02_playlist_pairs.js](../solutions/02_playlist_pairs.js) — open only after a real attempt |

## Problem

A radio host has song lengths in seconds, **sorted** in non-decreasing order. An ad-break
slot fits two different songs (different positions) whose total length is **at most** `limit`.
Return how many index pairs `(i < j)` fit.

## Examples

```
Input: lengths = [60, 90, 120, 200], limit = 210   Output: 3   (60+90, 60+120, 90+120)
Input: lengths = [100, 100, 100], limit = 200       Output: 3   (every pair)
Input: lengths = [300], limit = 500                 Output: 0   (need two songs)
```

## Constraints & clarifying questions

```
- 0 <= n <= 10^5, input sorted ascending
- Pairs are by index: equal lengths at different positions count separately.
- The count can reach ~5 * 10^9 (still exact in a JS Number).
```

## Step 0: name the pattern before you code

Write these three lines down **before** opening any hint (give yourself 3 minutes):

1. **Pattern:** which of the 22 patterns in the [pattern index](../../README.md) is this? Which words in the statement told you?
2. **Target complexity:** given the constraints, what time and space should the optimal solution have?
3. **Brute force:** what is the simplest correct solution and its complexity?

Then check your guess:

<details><summary>Pattern and target complexity (check after writing yours)</summary>

**Pattern:** Two pointers (opposite ends) on sorted input. Lesson: [Two Pointers](../../01_Concepts/patterns/02_two_pointers.md).

**Target:** O(n) time, O(1) space.

</details>

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Recognition.** Clue words: "sorted", "pair", "sum at most". What does sortedness let you discard?

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force checks all n(n-1)/2 pairs: O(n^2). Too slow for 10^5.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Put one pointer at each end. If `a[left] + a[right] <= limit`, then `a[left]` fits with **every** index between left+1 and right: add `right - left` at once and move left. Otherwise move right down.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Edge cases: fewer than 2 songs, everything fits (n(n-1)/2), nothing fits.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force

Two nested loops over i < j. O(n^2) time, O(1) space.

### APPROACH 2 — Optimal (Two pointers (opposite ends) on sorted input)

```
left = 0, right = n - 1
while left < right:
  if a[left] + a[right] <= limit: count += right - left; left++
  else: right--
```

### Dry run

```
[60,90,120,200], limit 210
  l=0 r=3: 260 > 210 -> r=2
  l=0 r=2: 180 <= 210 -> count=2, l=1
  l=1 r=2: 210 <= 210 -> count=3, l=2
  stop -> 3
```

### Complexity

O(n) time (each pointer moves at most n times), O(1) space.

### Common mistakes

- Adding 1 instead of `right - left` when a pair fits (undercounts).
- Using `<=` in the loop condition: `left === right` would pair a song with itself.

Full JavaScript solution with tests: [02_playlist_pairs.js](../solutions/02_playlist_pairs.js). Run it with `node 02_playlist_pairs.js` from the solutions folder.

</details>

## Related follow-ups

- [statement](../../../06_Two_Pointers/03_Problems/02_Medium/03_two_sum_ii_sorted.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/03_two_sum_ii_sorted.js)
- [statement](../../../06_Two_Pointers/03_Problems/02_Medium/17_boats_to_save_people.md) · [solution](../../../06_Two_Pointers/03_Problems/solutions/17_boats_to_save_people.js)
- Pattern lesson: [Two Pointers](../../01_Concepts/patterns/02_two_pointers.md)

## After solving

- Did you name the pattern correctly in Step 0? If not, write down the clue you missed in your notes.
- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Log the attempt in `PROBLEM_TRACKER.md` and re-solve it in 3 days, then in 1 week.
