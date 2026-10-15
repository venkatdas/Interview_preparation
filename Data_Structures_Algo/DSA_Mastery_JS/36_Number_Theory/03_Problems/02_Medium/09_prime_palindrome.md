# Prime Palindrome

| | |
|---|---|
| **Topic** | Number Theory (Essential) |
| **Difficulty** | Medium |
| **Pattern** | generate candidates + divisibility rule for 11 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #866 — https://leetcode.com/problems/prime-palindrome/ (statement paraphrased in our own words) |
| **Solution file** | [09_prime_palindrome.js](../solutions/09_prime_palindrome.js) — open only after a real attempt |

## Problem

Given n, return the smallest integer that is at least n and is both a prime and a palindrome (reads the same forwards and backwards). An answer below 2 * 10^8 always exists.

## Examples

```
Input: 6    Output: 7
Input: 8    Output: 11
Input: 13   Output: 101
```

## Constraints & clarifying questions

```
- 1 <= n <= 10^8
- Can I assume the answer fits in 32 bits? (yes, < 2e8)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Generate the rarer property (palindromes) and test the other (primality).

</details>

<details><summary>Hint 2</summary>

**Start simple.** x = n, n+1, ... test palindrome then prime. Starting near 1e7 this scans ~9e7 numbers.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Every palindrome with an EVEN number of digits is divisible by 11 (alternating digit sum is 0). So apart from 11, only odd-length palindromes can be prime. Build them from a root: 123 -> 12321.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** 8 <= n <= 11 -> 11. n <= 2 -> 2. Roots 1, 2, 3 ... give odd-length palindromes in increasing order.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(gap * sqrt(answer)) time, O(1) space

```
for x from n upward: if isPalindrome(x) and isPrime(x) return x
```

### APPROACH 2 — Optimal (odd-length palindrome generation)   about 1e4 roots * O(sqrt(answer)) time, O(1) space

```
if 8 <= n <= 11 return 11
for root = 1, 2, ...:
  s = String(root); pal = Number(s + reverse(s without its last char))
  if pal >= n and isPrime(pal) return pal
```

### Dry run

```
n = 13
roots 1..9  -> 1..9   all < 13
root 10     -> 101    >= 13 and prime -> 101
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| Scan every number | O(gap * sqrt(ans)) | O(1) |
| Generate odd palindromes | O(sqrt(N) * sqrt(ans)) | O(1) |

### Edge cases

```
- n = 1 or 2 -> 2
- n = 11 -> 11, n = 12 -> 101
- n near 1e7..1e8 -> 100030001 (no 8-digit prime palindrome exists)
```

### Common mistakes

- Generating even-length palindromes and wasting time (all divisible by 11).
- Forgetting 11 itself, the only even-length prime palindrome.

Full JavaScript solution with tests: [09_prime_palindrome.js](../solutions/09_prime_palindrome.js). Run it with `node 09_prime_palindrome.js` from the solutions folder.

</details>

## Related follow-ups

- Palindrome Number (Foundations)
- Find the Closest Palindrome (LeetCode 564)
- Divisibility rules for 3, 9, 11 (CONCEPTS)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
