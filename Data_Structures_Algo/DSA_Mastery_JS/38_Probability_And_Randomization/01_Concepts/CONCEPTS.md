# Probability and Randomization

Randomness shows up in interviews in two ways:

1. **Algorithms that use randomness** to be simple or fast: shuffling, sampling, random pivots, random hash seeds.
2. **Problems that ask for a probability**: "what is the chance the knight is still on the board?" These are usually dynamic programming problems in disguise.

This guide covers both. Every section is tagged:

- **[Essential]**: expected in normal coding interviews (FAANG-style).
- **[Advanced — competitive programming]**: good to know, rarely required. Skip on a first pass.

All code lives in [`02_Implementations/randomization.js`](../02_Implementations/randomization.js). Run it with `node 02_Implementations/randomization.js`.

---

## 1. Prerequisites

- [Mathematics for DSA](../../00_Foundations/04_Mathematics_For_DSA/README.md): fractions, sums, modular arithmetic.
- [Searching](../../10_Searching/README.md): binary search (used by weighted random pick).
- [Hashing](../../05_Hashing/README.md): Map/Set (used by Insert Delete GetRandom).
- [Sorting](../../11_Sorting/README.md): quicksort and partitioning (used by randomized quickselect).
- [Dynamic Programming overview](../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md): probability DP is ordinary DP with fractions.

---

## 2. Intuition

**[Essential]**

Probability is just counting with fractions. If every outcome is equally likely,

```
P(event) = (number of outcomes in the event) / (number of all outcomes)
```

A fair die has 6 outcomes. "Roll is even" has 3 of them, so P = 3/6 = 1/2.

Randomized algorithms use a coin flip (or a die roll) to make a choice. The trick is to make the choice so that **the final answer is fair** (every allowed result equally likely) or **the running time is good on average for every input**.

Two words you will use all the time:

- **Uniform**: every allowed outcome has the same probability.
- **Expected value** (average): if you ran the experiment forever, the long-run average result.

---

## 3. Mental model / analogy

**[Essential]**

Think of a random generator as **a dart thrown at a ruler from 0 to 1**. It lands at a uniformly random spot.

```
0                                                      1
|------------------------------------------------------|
                 ^ rng() = 0.31
```

Almost every technique in this topic is "cut the ruler into pieces, then see which piece the dart hit":

```
Uniform pick from 4 items (each piece the same length):
0          0.25        0.5         0.75         1
|-----A-----|-----B-----|-----C-----|-----D-----|
                  ^ 0.31 -> B          index = floor(0.31 * 4) = 1

Weighted pick, weights [1, 3, 2] (piece length = weight):
0    1                4          6        (scale ruler by total = 6)
|-A--|-------B--------|----C-----|
              ^ 0.31 * 6 = 1.86 -> B

Rejection: the ruler has a "bad" piece. If the dart lands there, throw again.
|--1--|--2--|--3--|--4--|--5--|xxxxxxxx|      (rand5 from rand7: reject 6, 7)
```

Keep this picture in mind: **uniform = equal-length pieces; weighted = pieces sized by weight; rejection = throw again**.

---

## 4. Why it exists (what problem it solves)

**[Essential]**

| Problem | Why randomness helps |
|---|---|
| Shuffle a playlist, deal cards | Need a fair order; no deterministic rule is "fair" |
| Pick a random sample from a huge stream (logs, clicks) | You cannot store the stream; reservoir sampling needs O(k) memory |
| Load balancing, A/B test buckets, ad serving by weight | Weighted random pick |
| Quicksort / quickselect worst case | A random pivot makes "bad input" impossible for an attacker to construct |
| Hash tables attacked with crafted keys | A random seed makes collisions unpredictable |
| Testing | Random inputs find bugs hand-written tests miss (with a seed so failures are repeatable) |
| Questions like "probability the knight stays on the board" | Probability DP gives an exact answer where simulation is only approximate |

---

## 5. How it works, step by step

### 5.1 Basics: events, expectation, linearity **[Essential]**

- **Event**: a set of outcomes. "Die shows 5 or 6".
- **Independent events**: P(A and B) = P(A) * P(B). Two separate die rolls are independent.
- **Expected value**: E[X] = sum over outcomes of value * probability. A fair die: (1+2+3+4+5+6)/6 = 3.5.
- **Linearity of expectation**: E[X + Y] = E[X] + E[Y], **always**, even when X and Y are dependent. This is the single most useful fact in the topic.

Example: a random permutation of n items. How many items stay in their own position on average?
Let X_i = 1 if item i stays put. P(X_i = 1) = 1/n. So E[sum X_i] = n * (1/n) = **1**, for any n. No need to count permutations.

### 5.2 Geometric distribution: "try until success" **[Essential]**

If each try succeeds with probability p, independently, the number of tries until the first success has expected value

```
E[tries] = 1 / p
```

Why: E = 1 + (1 - p) * E (one try, and with probability 1 - p you are back at the start). Solve: E = 1/p.
A die until you see a 6: 1 / (1/6) = 6 rolls on average. Every rejection-sampling loop is geometric.

### 5.3 Simulation vs exact **[Essential]**

- **Simulation (Monte Carlo)**: run the random process N times and average. Error shrinks like 1 / sqrt(N): 100x more trials for 10x more accuracy. Great for checking an answer, too slow for 1e-5 precision.
- **Exact**: write the probability as a recurrence (probability DP) and compute it. Knight Probability, Soup Servings, New 21 Game all want this.

Rule of thumb: **use simulation to test your exact solution**, never as the solution itself unless the problem allows approximate answers.

### 5.4 Fisher–Yates shuffle and its proof **[Essential]**

```
for i from n-1 down to 1:
    j = random integer in [0, i]     // i INCLUDED
    swap a[i], a[j]
```

**Proof of uniformity.** Look at a fixed target permutation P.
- Step i = n-1 must place P's last element at position n-1. Exactly one of the i+1 = n choices of j does that: probability 1/n.
- Given that, step i = n-2 must place the correct element among the n-1 remaining: probability 1/(n-1).
- ... and so on down to 1/2 at i = 1.

Multiply: 1/n * 1/(n-1) * ... * 1/2 = **1/n!** for every permutation P. Uniform.

Counting view: there are n * (n-1) * ... * 2 = n! equally likely sequences of j values, and each gives a different permutation, so it is a bijection.

**Why the "naive" shuffle is wrong.** `for i in 0..n-1: swap a[i], a[rand(0, n-1)]` has n^n equally likely sequences. For n = 3 that is 27 sequences spread over 6 permutations. 27 is not divisible by 6, so some permutations get 5 sequences and others 4. Biased. The self-test in `randomization.js` catches this bias with a chi-square check.

### 5.5 Reservoir sampling and its proof **[Essential]**

Goal: choose k items uniformly from a stream whose length n you do not know, using O(k) memory.

```
keep the first k items in the reservoir
for the i-th item (1-based), i > k:
    j = random integer in [0, i-1]
    if j < k: reservoir[j] = item          // happens with probability k/i
```

**Proof (k = 1 first).** Item i is chosen when it arrives with probability 1/i. It survives item i+1 with probability i/(i+1), item i+2 with (i+1)/(i+2), ... up to item n with (n-1)/n. Multiply:

```
1/i * i/(i+1) * (i+1)/(i+2) * ... * (n-1)/n = 1/n        (telescoping product)
```

**General k (induction).** Claim: after i items, each has probability k/i to be in the reservoir.
True for i = k (all are in). Step to i+1: the new item enters with probability k/(i+1). An old item is in the reservoir with probability k/i, and is kicked out only if the new item enters (k/(i+1)) AND picks its slot (1/k), i.e. probability 1/(i+1). So it stays with probability

```
k/i * (1 - 1/(i+1)) = k/i * i/(i+1) = k/(i+1).      done
```

### 5.6 Weighted random pick (prefix sums + binary search) **[Essential]**

```
weights  [1, 3, 2]
prefix   [1, 4, 6]        total = 6
r = rng() * 6             r is in [0, 6)
answer = first index with prefix[i] > r
```

Index i owns the half-open interval [prefix[i-1], prefix[i]) whose length is w[i]. A uniform r falls in it with probability w[i] / total. Build O(n), each pick O(log n).

**[Advanced]** Vose's **alias method** gives O(1) per pick after O(n) build (`AliasTable` in the implementation). Use it only when you pick millions of times.

### 5.7 Rejection sampling (rand10 from rand7) **[Essential]**

You have a uniform source that is "too big" or "the wrong shape". Draw, and if the draw is outside the target, **throw it away and draw again**. Accepted draws are uniform over the accepted region because every accepted outcome had the same probability before rejection.

rand10 from rand7:

```
cell = (rand7() - 1) * 7 + rand7()        // uniform 1..49 (a 7x7 grid)
if cell <= 40: return 1 + (cell - 1) % 10 // 40 cells = 4 full copies of 1..10
else: retry
```

**Expected calls.** Acceptance probability p = 40/49. Rounds are geometric: E[rounds] = 49/40. Each round costs 2 calls: **E[calls] = 2 * 49/40 = 2.45**.

**[Advanced]** Re-using the rejected value (41..49 gives a uniform 1..9) lowers this to about 2.19 calls (`rand10FromRand7Reuse`).

Other uses: random point in a circle (draw in the square, reject outside the circle, acceptance pi/4), rand5 from rand7.

### 5.8 Randomized quickselect / quicksort **[Essential]**

Quickselect finds the k-th smallest by partitioning around a pivot and recursing into one side. With a **random pivot**:

- Call a pivot "good" if it lands in the middle half (rank between n/4 and 3n/4). Probability 1/2.
- A good pivot shrinks the problem to at most 3n/4.
- Expected number of tries to get a good pivot is 2 (geometric with p = 1/2).
- So expected work is at most 2n + 2(3n/4) + 2(3/4)^2 n + ... = 2n * 1/(1 - 3/4) = **8n = O(n)**.

The worst case is still O(n^2), but it needs bad luck on almost every pivot. No input can force it, because the randomness is ours, not the input's. Randomized quicksort has expected O(n log n) for **every** input by a similar argument.

Use a **three-way partition** (< pivot, = pivot, > pivot). With a two-way partition an array of equal values degrades to O(n^2) even with random pivots.

### 5.9 Hashing with random seeds **[Advanced — competitive programming]**

A fixed hash function can be attacked: someone who knows it can craft many keys with the same hash and turn O(1) lookups into O(n). Choosing the hash **base or seed at random at startup** makes any fixed pair of keys collide with tiny probability. Used in rolling hashes (Rabin–Karp), hash-map hardening, and the "random base polynomial hash" (`makeSeededStringHash`).

### 5.10 Monte Carlo vs Las Vegas **[Essential to name, Advanced in depth]**

| | Monte Carlo | Las Vegas |
|---|---|---|
| Running time | fixed / bounded | random (expected bound) |
| Answer | may be **wrong** with small probability | always **correct** |
| Examples | Miller–Rabin primality, estimating pi, random hashing equality checks | randomized quicksort/quickselect, rejection sampling, rand10 |
| Make it better by | repeating (error drops exponentially) | nothing needed; just wait |

Memory hook: Monte Carlo gambles with **correctness**, Las Vegas gambles with **time**.

### 5.11 Testing randomness: chi-square-ish bucket checks **[Essential for writing tests]**

You cannot assert "the output is random". You can assert "the counts look like the expected distribution":

```
run the random function N times, count results per bucket
stat = sum over buckets of (observed - expected)^2 / expected
```

With k buckets the statistic has mean about k - 1 (the degrees of freedom, df) and variance about 2 * df. Our helper `looksUniform` accepts when

```
stat <= df + 6 * sqrt(2 * df)
```

That is a **very wide band** (about 6 standard deviations), so a correct generator essentially never fails. A real bias makes the statistic grow **proportionally to N**, so with tens of thousands of draws even a small bias goes far past the band. The naive shuffle scores in the hundreds where the limit is about 24.

### 5.12 Seeded PRNG (mulberry32) for reproducible tests **[Essential for writing tests]**

`Math.random()` cannot be seeded, so a failing random test may never fail again. Use a tiny seeded generator:

```js
function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Every function in this topic takes an optional `rng` parameter that defaults to `Math.random`. Production uses the default; tests pass `mulberry32(seed)`. Same seed means the same sequence, so a failure is reproducible. Not secure: for passwords or tokens use `crypto.getRandomValues`.

---

## 6. Pseudocode

```
FISHER_YATES(a):
  for i = n-1 down to 1:
    j = randInt(0, i)
    swap a[i], a[j]

RESERVOIR(stream, k):
  R = []
  i = 0
  for x in stream:
    i = i + 1
    if |R| < k: append x to R
    else:
      j = randInt(0, i-1)
      if j < k: R[j] = x
  return R

WEIGHTED_PICK(prefix, total):
  r = rng() * total
  return first index i with prefix[i] > r      // binary search

RAND10(rand7):
  loop:
    c = (rand7() - 1) * 7 + rand7()
    if c <= 40: return 1 + (c - 1) mod 10

QUICKSELECT(a, k):
  loop:
    p = a[random index in current range]
    split range into  < p | = p | > p
    if k in "< p" part: narrow to it
    else if k in "> p" part: narrow to it
    else return p
```

---

## 7. JavaScript implementation

Short version of the two most common pieces. The full, commented file with self-tests is [`02_Implementations/randomization.js`](../02_Implementations/randomization.js).

```js
function fisherYates(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

class WeightedPicker {
  constructor(weights, rng = Math.random) {
    this.prefix = [];
    let total = 0;
    for (const w of weights) this.prefix.push((total += w));
    this.total = total;
    this.rng = rng;
  }
  pick() {
    const r = this.rng() * this.total;
    let lo = 0, hi = this.prefix.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.prefix[mid] > r) hi = mid; else lo = mid + 1;
    }
    return lo;
  }
}
```

Exports: `mulberry32, randInt, fisherYates, naiveBiasedShuffle, reservoirSample, WeightedPicker, AliasTable, makeRand7, rand10FromRand7, rand10FromRand7Reuse, rejectionSample, randomPointInCircle, partition3, quickselect, randomizedQuicksort, makeSeededStringHash, monteCarloPi, expectedTrialsUntilSuccess, simulateMean, chiSquare, looksUniform, bucketCounts`.

---

## 8. Dry run on a concrete example

**Fisher–Yates on `[A, B, C, D]`** with random draws giving j = 1, 2, 0:

| step | i | range for j | j | swap | array after |
|---|---|---|---|---|---|
| start | | | | | A B C D |
| 1 | 3 | [0, 3] | 1 | a[3] and a[1] | A D C **B** |
| 2 | 2 | [0, 2] | 2 | a[2] with itself | A D **C** B |
| 3 | 1 | [0, 1] | 0 | a[1] and a[0] | D **A** C B |

Bold = position now final. Note step 2: swapping with itself is allowed and necessary (it is how C gets to "stay").

**Reservoir sampling, k = 1, stream `[7, 3, 9, 4]`**:

| i | item | keep prob 1/i | random roll | kept? | answer |
|---|---|---|---|---|---|
| 1 | 7 | 1 | any | yes | 7 |
| 2 | 3 | 1/2 | 0.80 | no | 7 |
| 3 | 9 | 1/3 | 0.20 | yes | 9 |
| 4 | 4 | 1/4 | 0.55 | no | 9 |

**Weighted pick, weights `[1, 3, 2]`, prefix `[1, 4, 6]`, r = 4.0**:

| lo | hi | mid | prefix[mid] | prefix[mid] > 4.0? | action |
|---|---|---|---|---|---|
| 0 | 2 | 1 | 4 | no | lo = 2 |
| 2 | 2 | | | | return 2 |

r = 4.0 is the boundary between B's piece [1, 4) and C's piece [4, 6); half-open intervals put it in C.

---

## 9. Edge cases

**[Essential]**

- `rng()` returns values in **[0, 1)**: 0 is possible, 1 is not. `Math.floor(rng() * n)` is in [0, n-1].
- Off-by-one in Fisher–Yates: `j` must range over `[0, i]` (inclusive). Using `[0, i-1]` gives Sattolo's algorithm (only cyclic permutations: never leaves an element in place).
- Empty or single-element arrays: shuffle and sampling should do nothing, not crash.
- Reservoir with k >= n: return everything.
- Weighted pick with zero weights: they must never be picked (half-open intervals of length 0). All-zero weights is invalid input.
- Prefix-sum boundaries: use strict `>` when searching for "first prefix > r".
- Rejection loops have no worst-case bound; mention that the expected count is what matters and the chance of 100 rejections in a row is astronomically small.
- Floating point: probabilities like 1e-30 are fine in doubles; sums of probabilities may come out as 0.9999999999 instead of 1. Compare with a tolerance.

---

## 10. Complexity analysis

| Operation | Time | Space | Why |
|---|---|---|---|
| Fisher–Yates shuffle | O(n) | O(1) extra | one swap per position |
| "Draw from a hat" shuffle with splice | O(n^2) | O(n) | splice shifts elements |
| Reservoir sampling (k items) | O(n) | O(k) | one pass, fixed-size buffer |
| Weighted pick build / pick | O(n) / O(log n) | O(n) | prefix sums + binary search |
| Alias method build / pick [Advanced] | O(n) / O(1) | O(n) | two-outcome columns |
| rand10 from rand7 | expected O(1) (2.45 calls) | O(1) | geometric number of rounds |
| Randomized quickselect | expected O(n), worst O(n^2) | O(1) iterative | problem shrinks geometrically on average |
| Randomized quicksort | expected O(n log n), worst O(n^2) | O(log n) expected stack | expected balanced splits |
| Insert / delete / getRandom set | O(1) average each | O(n) | array + Map + swap-remove |
| Probability DP (knight) | O(k * n^2 * 8) | O(n^2) | states x transitions |
| Monte Carlo with N trials | O(N * cost per trial) | O(1) | error about 1/sqrt(N) |

---

## 11. Alternatives (brute force vs optimized, trade-offs)

| Task | Brute force | Better | Trade-off |
|---|---|---|---|
| Shuffle | Sort by random keys: O(n log n). `arr.sort(() => rng() - 0.5)` is **wrong** (biased, comparator inconsistent) | Fisher–Yates O(n) | Sorting by a random key *stored per element* is correct but slower |
| Random pick of target index | Map value -> indices, O(n) memory, O(1) pick | Reservoir: O(1) memory, O(n) pick | memory vs time per call |
| Weighted pick | Expand into an array with w[i] copies (memory = total weight) or linear scan O(n) | prefix + binary search O(log n) | alias O(1) if picks dominate |
| rand10 | combine rand2 and rand5 (~2.57 calls) | 7x7 grid rejection (2.45) | reuse leftovers (~2.19), more code |
| Probability questions | simulation (approximate, slow to converge) | probability DP (exact) | DP needs a small state space |
| Large state probability DP | huge DP | spot convergence (Soup Servings: answer -> 1) | requires a math insight |

---

## 12. Common mistakes (and why they happen)

**[Essential]**

1. **Naive shuffle** (`j` from the whole array each time). Feels random; n^n is not divisible by n!, so it cannot be uniform.
2. **`array.sort(() => Math.random() - 0.5)`**. Sort algorithms assume a consistent comparator; results are biased and engine dependent.
3. **Fisher–Yates with `rng() * i` instead of `rng() * (i + 1)`**. Forgets that an element may stay put.
4. **`rand7() * rand7()` or `rand7() + rand7()`** to build a bigger range. Products and sums are not uniform (a sum of 14 happens one way, 7+7, while a sum of 8 happens seven ways: 1+7, 2+6, ..., 7+1). Use `(rand7() - 1) * 7 + rand7()`, a base-7 number.
5. **Picking a rectangle uniformly, then a point** (Random Point in Rectangles). Small rectangles get too many picks. Weight by point count.
6. **Area instead of point count**: a rectangle from x=1 to x=1 has area 0 but 1 integer point. Use (x2 - x1 + 1) * (y2 - y1 + 1).
7. **Swap-remove order bug** in Insert Delete GetRandom: deleting `val` from the Map before updating `last`'s index breaks when `val` is the last element.
8. **Using `<=` in the weighted binary search**, sending boundary values to the wrong bucket (and making a zero-weight item pickable).
9. **Asserting exact counts in random tests**, or using `Math.random` in tests. Tests must be seeded and use tolerance bands.
10. **Two-way partition in quickselect with many duplicates**: O(n^2) even with random pivots.

---

## 13. Patterns / variations with templates

### Pattern A — Uniform choice from a known collection **[Essential]**
```js
const pick = arr[Math.floor(rng() * arr.length)];
```

### Pattern B — Uniform choice from an unknown-length stream (reservoir, k = 1) **[Essential]**
```js
let count = 0, answer;
for (const x of stream) {
  if (!matches(x)) continue;
  count++;
  if (Math.floor(rng() * count) === 0) answer = x; // keep with prob 1/count
}
```
Problems: Random Pick Index, Linked List Random Node.

### Pattern C — Weighted choice (prefix + binary search) **[Essential]**
Problems: Random Pick with Weight, Random Point in Non-overlapping Rectangles (weight = number of points), Random Pick with Blacklist (map the blacklist away).

### Pattern D — Rejection sampling **[Essential]**
```js
for (;;) {
  const x = drawFromBiggerUniformSpace();
  if (inTarget(x)) return mapToAnswer(x);
}
```
Problems: Implement Rand10() Using Rand7(), Generate Random Point in a Circle.

### Pattern E — O(1) random access + O(1) delete (array + index map + swap-remove) **[Essential]**
Problems: Insert Delete GetRandom O(1), and its duplicates-allowed version.

### Pattern F — Probability DP **[Essential]**
```
dp[state] = probability of being in state
next[target] += dp[state] * P(transition)       // forward ("push")
or
f(state) = sum over transitions P(t) * f(next) // backward ("pull", memoized)
```
Problems: Knight Probability in Chessboard (forward), Soup Servings (backward + convergence cutoff), New 21 Game (forward + sliding-window sum).

### Pattern G — Expected value with linearity **[Essential]**
Break a complicated quantity into indicator variables (0/1), find each probability, add them up.

### Pattern H — Randomize to beat adversarial worst cases **[Essential]**
Random pivot (quickselect, quicksort), random hash seed, random restarts.

---

## 14. Recognition clues

**Use these techniques when you see:**

- "return a random ...", "each ... equally likely", "uniformly at random" -> Patterns A, B, D
- "probability proportional to weight / area / count" -> Pattern C
- "stream", "length unknown", "cannot store" + random -> reservoir (Pattern B)
- "only rand7 is available" -> rejection sampling
- "getRandom in O(1)" with insert/delete -> array + Map
- "return the probability that ..." with small states -> probability DP
- "expected number of ..." -> linearity of expectation or E = 1/p
- "k-th largest" with tight average-time expectations -> randomized quickselect

**It does NOT apply when:**

- The answer must be deterministic and reproducible (use a seed, or don't randomize).
- Security is involved (passwords, tokens): use `crypto.getRandomValues`, never `Math.random` or mulberry32.
- The problem asks for an exact probability with high precision: simulation is not enough, write the DP.
- A guaranteed worst-case bound is required: randomized quickselect has a bad worst case; use median-of-medians (rarely asked) or a heap.

---

## 15. Interview application (talk track)

1. **Clarify the distribution.** "Uniform over what exactly? Over points, or over rectangles? Over indices, or over values?" This one question prevents the most common bug.
2. **State the trade-off.** "Do we pick once or many times? If many, I'll precompute (prefix sums / index map). If memory is tight, reservoir sampling."
3. **Prove fairness in one sentence.** Fisher–Yates: "each step picks uniformly among the remaining elements, so each permutation has probability 1/n!". Reservoir: "the survival probabilities telescope to 1/n". rand10: "40 equally likely cells, 4 copies of each answer".
4. **Give expected complexity** and name the distribution: "rejection rounds are geometric with p = 40/49, so 49/40 rounds, 2.45 calls on average."
5. **Testing.** "I'd make the random source injectable, seed it in tests, and check bucket counts against expected counts with a wide tolerance."
6. **For probability problems**, say "this is DP over states with probabilities as values", define the state, transitions, and base cases, then verify on the small example by hand.

---

## 16. Problems in this topic

| # | Problem | Difficulty | Pattern | Level | Solution |
|---|---|---|---|---|---|
| 01 | Shuffle an Array | Medium | Fisher–Yates | Essential | [01_shuffle_an_array.js](../03_Problems/solutions/01_shuffle_an_array.js) |
| 02 | Random Pick Index | Medium | reservoir sampling | Essential | [02_random_pick_index.js](../03_Problems/solutions/02_random_pick_index.js) |
| 03 | Linked List Random Node | Medium | reservoir sampling | Essential | [03_linked_list_random_node.js](../03_Problems/solutions/03_linked_list_random_node.js) |
| 04 | Random Pick with Weight | Medium | prefix sums + binary search | Essential | [04_random_pick_with_weight.js](../03_Problems/solutions/04_random_pick_with_weight.js) |
| 05 | Implement Rand10() Using Rand7() | Medium | rejection sampling | Essential | [05_rand10_using_rand7.js](../03_Problems/solutions/05_rand10_using_rand7.js) |
| 06 | Random Point in Non-overlapping Rectangles | Medium | weighted pick by point count | Essential | [06_random_point_in_rectangles.js](../03_Problems/solutions/06_random_point_in_rectangles.js) |
| 07 | Insert Delete GetRandom O(1) | Medium | array + Map, swap-remove | Essential | [07_insert_delete_getrandom.js](../03_Problems/solutions/07_insert_delete_getrandom.js) |
| 08 | Knight Probability in Chessboard | Medium | probability DP (forward) | Essential | [08_knight_probability.js](../03_Problems/solutions/08_knight_probability.js) |
| 09 | Soup Servings | Hard (curriculum) | memoized probability DP + convergence | Advanced | [09_soup_servings.js](../03_Problems/solutions/09_soup_servings.js) |
| 10 | New 21 Game | Hard (curriculum) | probability DP + sliding window | Advanced | [10_new_21_game.js](../03_Problems/solutions/10_new_21_game.js) |

### Practice more

- LeetCode 381 — Insert Delete GetRandom O(1) - Duplicates allowed
- LeetCode 478 — Generate Random Point in a Circle (rejection or polar with sqrt)
- LeetCode 710 — Random Pick with Blacklist
- LeetCode 519 — Random Flip Matrix
- LeetCode 215 — Kth Largest Element in an Array (randomized quickselect)
- LeetCode 912 — Sort an Array (randomized quicksort)
- LeetCode 1227 — Airplane Seat Assignment Probability
- LeetCode 1467 — Probability of a Two Boxes Having The Same Number of Distinct Balls (Advanced)
- LeetCode 1230 — Toss Strange Coins (probability DP)
