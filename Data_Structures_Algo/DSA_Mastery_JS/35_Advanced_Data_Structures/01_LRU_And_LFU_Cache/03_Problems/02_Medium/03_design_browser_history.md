# Design Browser History

| | |
|---|---|
| **Topic** | LRU and LFU Caches |
| **Difficulty** | Medium |
| **Pattern** | array + pointer (lazy truncation) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1472 — https://leetcode.com/problems/design-browser-history/ |
| **Solution file** | [03_design_browser_history.js](../solutions/03_design_browser_history.js) — open only after a real attempt |

## Problem

You start on `homepage`. Implement:
  - visit(url): go to url; this CLEARS all forward history
  - back(steps): go back at most `steps` pages (stop at the first page), return the url
  - forward(steps): go forward at most `steps` pages (stop at the last), return the url

## Examples

```
BrowserHistory("leetcode.com"); visit("google.com"); visit("facebook.com"); visit("youtube.com")
back(1) -> "facebook.com"; back(1) -> "google.com"; forward(1) -> "facebook.com"
visit("linkedin.com") (youtube is gone); forward(2) -> "linkedin.com"
back(2) -> "google.com"; back(7) -> "leetcode.com"
```

## Constraints & clarifying questions

```
- Up to 5000 calls -> even O(n) per call passes; interviewer wants clean O(1)-ish design
- steps can exceed the available history (clamp)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *array + pointer (lazy truncation)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (two stacks)   O(1) visit, O(steps) back/forward. backStack holds pages behind the current one, forwardStack pages ahead.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Array + current index + logical end)   O(1) for all three. Keep one array `pages`, a pointer `current`, and `last` = index of the last valid page.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- back/forward with steps larger than history (clamp)
- forward right after visit (nothing ahead -> stays)
- visiting the same url twice (still two entries)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (two stacks)   O(1) visit, O(steps) back/forward

```
backStack holds pages behind the current one, forwardStack pages ahead. back pops from
backStack onto forwardStack `steps` times; visit clears forwardStack. Also fine.
```

### APPROACH 2 — Optimal (Array + current index + logical end)   O(1) for all three

```
Keep one array `pages`, a pointer `current`, and `last` = index of the last valid page.
  visit: current++, pages[current] = url, last = current (overwrites forward history
         lazily; no need to truncate the array)
  back:  current = max(0, current - steps)
  forward: current = min(last, current + steps)

Dry run:
  start: pages = [leetcode], current 0, last 0
  visit google, facebook, youtube: pages = [leetcode, google, facebook, youtube], current 3, last 3
  back(1) -> current 2 -> facebook;  back(1) -> current 1 -> google
  forward(1) -> current 2 -> facebook
  visit linkedin: current 3, pages[3] = linkedin, last 3 (youtube overwritten)
  forward(2) -> min(3, 5) = 3 -> linkedin
  back(2) -> 1 -> google;  back(7) -> max(0, -6) = 0 -> leetcode
```

### Edge cases

```
- back/forward with steps larger than history (clamp)
- forward right after visit (nothing ahead -> stays)
- visiting the same url twice (still two entries)
```

Full JavaScript solution with tests: [03_design_browser_history.js](../solutions/03_design_browser_history.js). Run it with `node 03_design_browser_history.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that `visit` clears all forward history.
- Letting `back` / `forward` step past the ends instead of clamping to the first or last page.
- Physically deleting forward pages on every visit (O(n)); keeping an index plus a "last valid" pointer makes visit O(1).

## Related follow-ups

- [LRU Cache](01_lru_cache.md)
- [Stacks](../../../../16_Stacks/README.md) (two-stack version)
- Design Text Editor (LeetCode #2296)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
