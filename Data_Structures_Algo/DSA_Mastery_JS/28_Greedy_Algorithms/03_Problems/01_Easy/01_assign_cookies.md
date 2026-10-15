# Assign Cookies

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Easy |
| **Pattern** | sort + two pointers |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #455 — https://leetcode.com/problems/assign-cookies/ |
| **Solution file** | [01_assign_cookies.js](../solutions/01_assign_cookies.js) — open only after a real attempt |

## Problem

Each child i has a greed factor g[i] (the smallest cookie that makes them happy).
Each cookie j has a size s[j]. A cookie can go to at most one child, and child i is content
only if s[j] >= g[i]. Return the maximum number of content children.

## Examples

```
Input: g = [1,2,3], s = [1,1]   Output: 1   Explanation: only the child with greed 1 can be fed
Input: g = [1,2], s = [1,2,3]   Output: 2
```

## Constraints & clarifying questions

```
- Can either array be empty? (yes -> 0)
- Can one child get two cookies? (no, at most one each)
- Are the arrays sorted? (no, we may sort them)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *sort + two pointers* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) / O(n!) time. Try every way of assigning cookies to children (backtracking) and keep the best count.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (sort + two pointers greedy)   O(n log n + m log m) time, O(1) extra. Sort both arrays.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- g = [], or s = []            -> 0
- all cookies too small        -> 0
- more cookies than children   -> at most g.length
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) / O(n!) time

```
Try every way of assigning cookies to children (backtracking) and keep the best count.
Only possible for tiny inputs; included to show what we are optimising.
```

### APPROACH 2 — Optimal (sort + two pointers greedy)   O(n log n + m log m) time, O(1) extra

```
Sort both arrays. Walk the cookies from smallest to largest. Give the current cookie to the
least greedy unfed child if it fits; otherwise this cookie fits nobody left, throw it away.
```

### WHY GREEDY WORKS

```
The least greedy child is the easiest to satisfy. Using the smallest cookie that satisfies
them "wastes" the least cookie size. Exchange argument: if an optimal answer gives that child
a bigger cookie, swap it with the smaller one that also fits - the count is unchanged and
the bigger cookie is now free for someone greedier.

Dry run on g = [1,2,3], s = [1,1]:
  sorted g = [1,2,3], s = [1,1], child = 0
  cookie 1 >= g[0]=1 -> feed, child = 1
  cookie 1 <  g[1]=2 -> skip cookie
  done -> 1
```

### Edge cases

```
- g = [], or s = []            -> 0
- all cookies too small        -> 0
- more cookies than children   -> at most g.length
```

Full JavaScript solution with tests: [01_assign_cookies.js](../solutions/01_assign_cookies.js). Run it with `node 01_assign_cookies.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to sort BOTH arrays - the greedy match only works on sorted greed and sizes.
- Advancing the child pointer when the cookie is too small (you should move to the next, bigger cookie instead).
- Using `sort()` without a comparator, which sorts numbers as strings.

## Related follow-ups

- [Boats to Save People](../02_Medium/08_boats_to_save_people.md)
- [Maximum Units on a Truck](../01_Easy/03_maximum_units_on_truck.md)
- Two City Scheduling (LeetCode #1029)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
