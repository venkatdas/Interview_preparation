# Nth Magical Number

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Hard |
| **Pattern** | binary search on answer + inclusion–exclusion with lcm |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #878 — https://leetcode.com/problems/nth-magical-number/ (statement paraphrased in our own words) |
| **Solution file** | [11_nth_magical_number.js](../solutions/11_nth_magical_number.js) — open only after a real attempt |

## Problem

A positive integer is "magical" when it is divisible by a or by b. Return the n-th magical number in increasing order, modulo 1e9 + 7.

## Examples

```
Input: n=1, a=2, b=3   Output: 2
Input: n=4, a=2, b=3   Output: 6    (2, 3, 4, 6)
Input: n=5, a=2, b=4   Output: 10
```

## Constraints & clarifying questions

```
- 1 <= n <= 10^9, 2 <= a, b <= 4 * 10^4
- The true answer is <= n * min(a, b) <= 4e13 < 2^53, so it is exact as a Number; take mod at the end.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "k-th smallest" over a monotone count -> binary search on the answer.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Merge the two sequences a, 2a, 3a ... and b, 2b, ... with two pointers, skipping duplicates. O(n): too slow for 1e9, perfect for checking.

</details>

<details><summary>Hint 3</summary>

**The key idea.** count(x) = floor(x/a) + floor(x/b) - floor(x/lcm(a,b)) by inclusion–exclusion. Find the smallest x with count(x) >= n.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** lcm = a / gcd(a,b) * b (divide first). a === b, a divides b.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(1) space

```
pa = a, pb = b
repeat n times: cur = min(pa, pb); advance whichever equals cur (both if equal)
```

### APPROACH 2 — Optimal (binary search + inclusion–exclusion)   O(log(n * min(a,b))) time, O(1) space

```
L = lcm(a, b); lo = 1; hi = n * min(a, b)
while lo < hi:
  mid = floor((lo+hi)/2)
  if count(mid) >= n: hi = mid else lo = mid + 1
return lo % MOD
```

### Dry run

```
n=4, a=2, b=3, L=6, lo=1, hi=8
mid=4: 2+1-0 = 3 < 4  -> lo=5
mid=6: 3+2-1 = 4 >= 4 -> hi=6
mid=5: 2+1-0 = 3 < 4  -> lo=6
answer 6
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Two-pointer merge | O(n) | O(1) |
| Binary search | O(log(n * min(a,b))) | O(1) |
| Block formula (math) | O(log) | O(1) |

### Edge cases

```
- n = 1 -> min(a, b)
- a === b -> n * a
- largest case 1e9 * 4e4 = 4e13 still exact
```

### Common mistakes

- Taking mod inside the binary search (breaks the ordering).
- Forgetting to subtract multiples of the lcm (double counting).
- Using a*b instead of the lcm.

Full JavaScript solution with tests: [11_nth_magical_number.js](../solutions/11_nth_magical_number.js). Run it with `node 11_nth_magical_number.js` from the solutions folder.

</details>

## Related follow-ups

- Ugly Number III (LeetCode 1201) — three numbers, inclusion–exclusion over 3 sets
- Kth Smallest Number in Multiplication Table (LeetCode 668)
- Inclusion–exclusion in 37_Combinatorics

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
