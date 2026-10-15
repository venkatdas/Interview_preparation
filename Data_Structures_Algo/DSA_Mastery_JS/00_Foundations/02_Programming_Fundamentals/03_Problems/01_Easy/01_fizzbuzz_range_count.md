# Count FizzBuzz in a Range

| | |
|---|---|
| **Topic** | Programming Fundamentals |
| **Difficulty** | Easy |
| **Pattern** | inclusive bounds + inclusion–exclusion |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise |
| **Solution file** | [01_fizzbuzz_range_count.js](../solutions/01_fizzbuzz_range_count.js) — open only after a real attempt |

## Problem

Given two integers lo and hi (both inclusive) and two positive divisors a and b,
return an object { fizz, buzz, fizzbuzz, plain } counting the numbers x in [lo, hi]:
  - fizzbuzz: x divisible by both a and b
  - fizz:     x divisible by a only
  - buzz:     x divisible by b only
  - plain:    x divisible by neither
The four counts must add up to the number of integers in the range.

## Examples

```
Input: lo = 1, hi = 15, a = 3, b = 5
Output: { fizz: 4, buzz: 2, fizzbuzz: 1, plain: 8 }
  fizz = 3,6,9,12  buzz = 5,10  fizzbuzz = 15  plain = the other 8
Input: lo = 10, hi = 10, a = 3, b = 5   Output: { fizz: 0, buzz: 1, fizzbuzz: 0, plain: 0 }
Input: lo = 5,  hi = 4,  a = 3, b = 5   Output: all zeros (empty range)
```

## Constraints & clarifying questions

```
- Are both ends inclusive? (yes)
- Can lo be greater than hi? (yes -> empty range, all zeros)
- Can the range contain 0 or negatives? (yes; 0 is divisible by everything)
- Can hi - lo be huge, like 1e15? (yes -> the loop is too slow, need a formula)
- Can a and b share factors, like 4 and 6? (yes -> "both" means divisible by lcm(a, b), not a*b)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *loop boundary* exercise: an inclusive range `[lo, hi]`. Read section 5.2 (loop-boundary rules) in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(hi - lo) time, O(1) space. Loop x from lo to hi INCLUSIVE (x <= hi, the classic off-by-one spot) and classify each number with two % checks.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The number of multiples of k in `[1, x]` is `Math.floor(x / k)`, so in `[lo, hi]` it is `floor(hi/k) - floor((lo-1)/k)`. Numbers divisible by both are multiples of `lcm(a, b)`; subtract them once from each single count (inclusion–exclusion).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- lo > hi                 -> all zeros (guard before computing hi - lo + 1)
- range containing 0      -> 0 counts as fizzbuzz
- negative lo             -> Math.trunc would be wrong; Math.floor is required
- a = 4, b = 6            -> both = multiples of 12, NOT 24
- a === b                 -> everything divisible is fizzbuzz
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(hi - lo) time, O(1) space

```
Loop x from lo to hi INCLUSIVE (x <= hi, the classic off-by-one spot) and classify
each number with two % checks.
```

### APPROACH 2 — Optimal (counting formula + inclusion–exclusion)   O(log min(a,b)) time, O(1) space

```
multiples(k) in [lo, hi] = floor(hi / k) - floor((lo - 1) / k)
  (Math.floor, not truncation, so it also works for negative numbers.)
both     = multiples(lcm(a, b))
fizz     = multiples(a) - both
buzz     = multiples(b) - both
plain    = (hi - lo + 1) - fizz - buzz - both

Dry run lo = 1, hi = 15, a = 3, b = 5:
  multiples(3)  = floor(15/3)  - floor(0/3)  = 5
  multiples(5)  = floor(15/5)  - floor(0/5)  = 3
  lcm = 15, both = floor(15/15) - 0 = 1
  fizz = 5 - 1 = 4, buzz = 3 - 1 = 2, plain = 15 - 4 - 2 - 1 = 8
```

### Edge cases

```
- lo > hi                 -> all zeros (guard before computing hi - lo + 1)
- range containing 0      -> 0 counts as fizzbuzz
- negative lo             -> Math.trunc would be wrong; Math.floor is required
- a = 4, b = 6            -> both = multiples of 12, NOT 24
- a === b                 -> everything divisible is fizzbuzz
```

### Common mistakes

```
- Writing x < hi (drops the last number) or starting at lo + 1.
- Using a * b instead of lcm(a, b).
- Using hi / k - lo / k (off by one when lo itself is a multiple).
```

Full JavaScript solution with tests: [01_fizzbuzz_range_count.js](../solutions/01_fizzbuzz_range_count.js). Run it with `node 01_fizzbuzz_range_count.js` from the solutions folder.

</details>

## Related follow-ups

- Count numbers in a range divisible by at least one of three divisors (inclusion–exclusion with 7 terms).
- LeetCode #412 Fizz Buzz (the classic print version).
- Sum (not count) of all multiples of 3 or 5 below n, in O(1).

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.
