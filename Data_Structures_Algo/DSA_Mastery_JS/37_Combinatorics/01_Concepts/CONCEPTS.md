# Combinatorics — Counting Without Listing

> Basic nCr, Pascal's row and factorials are covered in
> [Mathematics for DSA](../../00_Foundations/04_Mathematics_For_DSA/01_Concepts/CONCEPTS.md).
> This guide assumes you know what C(n, k) means and goes deeper: exact counting in JavaScript,
> counting modulo a prime, stars and bars, Catalan numbers, inclusion–exclusion, derangements,
> ranking permutations, and counting with DP.
>
> Labels: **[Essential]** = expected in interviews. **[Advanced — competitive programming]** = contests and
> online assessments that say "return the answer modulo 1e9+7".

---

## 1. Prerequisites

- [Mathematics for DSA](../../00_Foundations/04_Mathematics_For_DSA/01_Concepts/CONCEPTS.md): factorials, basic nCr, fast power, why 1e9+7.
- [Number Theory](../../36_Number_Theory/README.md): modular inverse (Fermat's little theorem), the 2^53 multiplication trap.
- [Backtracking](../../13_Backtracking/README.md): generating permutations/subsets — the brute force that counting replaces.
- [Dynamic Programming overview](../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md): counting DP builds on the same "states and transitions" idea.

---

## 2. Intuition

Many questions ask "**how many** ways …?" and not "**list** all the ways". Listing is exponential:
there are 10! = 3,628,800 orderings of 10 items and 2^50 subsets of 50 items. Counting can be
instant if you can describe each object as a sequence of **independent choices** and multiply the
number of options, or as a **choice of positions** and use C(n, k).

The whole topic is a toolbox of re-descriptions:

- "A grid path" = "a word of D's and R's" = "choose which positions are D" → C(m+n-2, m-1).
- "A sorted string" = "how many of each letter" = "stars and bars".
- "A BST shape" = "root splits into two smaller shapes" = Catalan numbers.
- "No one gets their own coat" = "all orderings minus the bad ones" = inclusion–exclusion.

---

## 3. Mental model / analogy

Think of counting as **filling slots on a form**. If slot 1 has a options and slot 2 has b options
regardless of slot 1, the form can be filled in a × b ways (**product rule**). If you must pick ONE of
two separate forms, it's a + b ways (**sum rule**).

```
Product rule: shirt (3) x pants (2) = 6 outfits

  shirt:  S1      S2      S3
          / \     / \     / \
  pants: P1  P2  P1  P2  P1  P2      <- 6 leaves = 3 * 2

Stars and bars: 5 identical candies into 3 kids  ->  arrange 5 stars and 2 bars
  * * | * | * *     -> (2, 1, 2)
  | * * * * * |     -> (0, 5, 0)
  7 positions, choose where the 2 bars go: C(7, 2) = 21

Pascal's triangle: each number = the two above it
            1
          1   1
        1   2   1
      1   3   3   1
    1   4   6   4   1        row 4 = C(4,0..4)
```

---

## 4. Why it exists

- **Speed.** An O(2^n) or O(n!) enumeration becomes O(1), O(n) or O(n^2).
- **Huge answers.** C(100, 50) ≈ 1e29. Problems either want an exact BigInt or the value modulo a prime.
- **Probability.** Probability = favourable count / total count, so counting is the engine behind
  [Probability and Randomization](../../38_Probability_And_Randomization/README.md).
- **Proving a DP is right.** A closed formula is a great cross-check for a counting DP (and vice versa).

---

## 5. How it works, step by step

### 5.1 Counting principles **[Essential]**

- **Product rule:** independent stages multiply. Passwords of 4 digits: 10^4.
- **Sum rule:** disjoint cases add. Strings of length 1 or 2 over {a,b}: 2 + 4 = 6.
- **Complement:** count = total − bad. "At least one repeated digit" = 10^4 − 10·9·8·7.
- **Division (symmetry):** if every object is counted exactly s times, divide by s.
  Arrangements of "AAB": 3!/2! = 3, because swapping the two A's does not change the string.
- **Bijection:** if two sets match one-to-one, they have the same size. That's how grid paths
  become words, and sorted strings become stars and bars.

### 5.2 Permutations and combinations **[Essential]**

| Kind | Order matters? | Repetition? | Formula | Example |
|---|---|---|---|---|
| Permutation | yes | no | P(n,k) = n!/(n−k)! | podium of 3 from 10 runners: 720 |
| Permutation with repetition | yes | yes | n^k | 4-digit PIN: 10^4 |
| Combination | no | no | C(n,k) = n!/(k!(n−k)!) | 3-card hand from 10: 120 |
| Combination with repetition (multiset) | no | yes | C(n+k−1, k) | 3 scoops from 5 flavours: 35 |
| Arrangements of a multiset | yes | fixed counts | n!/(c1!·c2!·…) (multinomial) | "MISSISSIPPI": 34650 |

### 5.3 Computing C(n, k) exactly in JavaScript **[Essential]**

Plain numbers are exact only up to 2^53 − 1 ≈ 9.007e15. 20! ≈ 2.4e18 is already too big, so
`factorial(n) / (factorial(k) * factorial(n-k))` silently goes wrong. Two safe ways:

1. **Multiplicative formula with BigInt** (any size):
   `res = res * (n − k + i) / i` for i = 1..k. After step i, `res` equals C(n−k+i, i), an integer, so
   the division is exact. Use k = min(k, n−k) for fewer steps.
2. **Pascal's rule** C(n,k) = C(n−1,k−1) + C(n−1,k): only additions, fine while values < 2^53
   (about row 56).

### 5.4 nCr mod p with factorial tables **[Advanced — competitive programming]**

When the problem says "modulo p = 1e9+7" (a prime) and asks many C(n, k) with n up to ~10^6:

```
fact[0] = 1;          fact[i]    = fact[i-1] * i            mod p
invFact[N] = fact[N]^(p-2) mod p                             (Fermat: a^(p-2) = a^(-1) mod p)
invFact[i-1] = invFact[i] * i                                mod p   (walk DOWN, no more powMod)
C(n, k) = fact[n] * invFact[k] * invFact[n-k]                mod p   (O(1) per query)
```

Why the downward walk works: 1/(i−1)! = i / i!. One powMod plus O(N) multiplications.

**The 2^53 trap.** Two residues can each be ~1e9, so their product is ~1e18 > 2^53 and
`(a * b) % p` loses the low digits **without any error**. Fix it with BigInt, or split one factor:

```js
function mulMod(a, b, m) {           // a, b < m < 2^30
  const bHi = Math.floor(b / 65536), bLo = b % 65536;
  return (((a * bHi) % m) * 65536 + a * bLo) % m;   // every partial product < 2^47
}
```

`combinatorics.js` shows `(MOD-1)*(MOD-2) % MOD` giving a different (wrong) answer from BigInt.

### 5.5 Stars and bars **[Essential]**

Number of ways to write n = x1 + x2 + … + xk with every xi ≥ 0 (n identical items into k distinct bins):
**C(n + k − 1, k − 1)**. Lay out n stars and k−1 bars in a row; every arrangement is one distribution.
If every bin needs at least 1: give one to each first → C(n − 1, k − 1).
Lower bounds xi ≥ li: subtract them first. Upper bounds: use inclusion–exclusion (5.7).

### 5.6 Catalan numbers **[Essential]**

Cat(n) = C(2n, n) / (n + 1) = C(2n, n) − C(2n, n+1): 1, 1, 2, 5, 14, 42, 132, …
Recurrence: Cat(0) = 1, Cat(n) = Σ Cat(i)·Cat(n−1−i). Ratio: Cat(n+1) = Cat(n)·2(2n+1)/(n+2).

Where they appear (all the same number for the same n):
- structurally different BSTs / binary trees with n nodes (LeetCode #96)
- valid strings of n pairs of parentheses (LeetCode #22)
- monotone grid paths from (0,0) to (n,n) that never cross the diagonal
- ways to triangulate a convex polygon with n+2 sides
- ways to fully parenthesize a product of n+1 factors
- stack-sortable permutations / valid push-pop sequences of n items

Recognition: "split around a root/first element into two independent smaller parts of total size n−1".

### 5.7 Inclusion–exclusion **[Essential idea, Advanced at scale]**

|A ∪ B| = |A| + |B| − |A ∩ B|. For k "bad" properties:
**good = Σ over subsets S of bad properties (−1)^|S| · (count violating at least everything in S)**.
With k properties that is 2^k terms — fine for k ≤ 20, and often symmetric so only k+1 distinct terms.

Example (problem 05): x1+x2+x3 = n with each xi ≤ L. Bad property i: xi ≥ L+1.
good = Σ_j (−1)^j C(3, j) C(n − j(L+1) + 2, 2).

### 5.8 Derangements **[Essential]**

!n = permutations with no fixed point. D(0)=1, D(1)=0, **D(n) = (n−1)(D(n−1) + D(n−2))**.
Inclusion–exclusion gives D(n) = Σ (−1)^i n!/i!, so D(n) ≈ n!/e: about 36.8% of random
permutations are derangements.

### 5.9 Pigeonhole principle **[Essential]**

If n+1 items go into n boxes, some box gets ≥ 2. Generally some box gets ≥ ⌈items/boxes⌉.
Uses: "Find the Duplicate Number" (n+1 values in 1..n must repeat), "among any 13 people two share
a birth month", "some prefix sum mod k repeats among k+1 prefixes" (subarray sum divisible by k).
It proves existence; it never tells you where.

### 5.10 Next permutation and k-th permutation **[Essential]**

**Next permutation** (LeetCode #31), O(n):
1. From the right, find the first i with a[i] < a[i+1] (the rightmost ascent). None → last permutation.
2. From the right, find the first j with a[j] > a[i]; swap.
3. Reverse the suffix after i (it was descending; now it is the smallest).

**k-th permutation** (factorial number system): with m items left, each choice of the first item owns
(m−1)! permutations, so index = ⌊k/(m−1)!⌋ (k 0-indexed), then k %= (m−1)!.

### 5.11 Counting with DP **[Essential]**

When no clean formula exists, define a state that captures "what the rest of the count depends on":
- Grid paths with obstacles: ways[r][c] = ways[r−1][c] + ways[r][c−1].
- Music playlists (problem 09): dp[length][distinct songs used].
- Sorted strings: dp[length][last letter].
Rule: each object must be counted by **exactly one** path through the DP (no double counting).

---

## 6. Pseudocode

```
nCrExact(n, k):                       # BigInt
  if k < 0 or k > n: return 0
  k = min(k, n - k); res = 1
  for i in 1..k: res = res * (n - k + i) / i
  return res

buildTables(N, p):
  fact[0] = 1; for i in 1..N: fact[i] = fact[i-1] * i mod p
  invFact[N] = pow(fact[N], p - 2, p)
  for i in N..1: invFact[i-1] = invFact[i] * i mod p

nCrMod(n, k): return fact[n] * invFact[k] * invFact[n-k] mod p   (0 if k out of range)

kthPermutation(n, k):
  pool = [1..n]; k = k - 1
  for m in n..1: idx = k / (m-1)!; output pool.remove(idx); k = k mod (m-1)!
```

---

## 7. JavaScript implementation

Full, tested code: [02_Implementations/combinatorics.js](../02_Implementations/combinatorics.js)
(`node 02_Implementations/combinatorics.js`). The heart of it:

```js
class ModCombinatorics {
  constructor(maxN, mod = 1_000_000_007) {
    this.mod = mod;
    this.fact = [1];
    for (let i = 1; i <= maxN; i++) this.fact[i] = mulMod(this.fact[i - 1], i, mod);
    this.invFact = new Array(maxN + 1);
    this.invFact[maxN] = powMod(this.fact[maxN], mod - 2, mod);      // Fermat
    for (let i = maxN; i >= 1; i--) this.invFact[i - 1] = mulMod(this.invFact[i], i, mod);
  }
  nCr(n, k) {
    if (k < 0 || k > n) return 0;
    return mulMod(mulMod(this.fact[n], this.invFact[k], this.mod), this.invFact[n - k], this.mod);
  }
}
```

The file also has `nCrExact`, `nPrExact`, `starsAndBars`, `multinomialExact`, `catalanExact`,
`derangementsExact/Mod`, `inclusionExclusion`, `nextPermutation`, `kthPermutation`, and a self-test that
compares everything with brute force on seeded random inputs.

---

## 8. Dry run

**Build tables for N = 5, p = 7** (a tiny prime so you can check by hand):

| i | fact[i] = fact[i−1]·i mod 7 | invFact[i] | check fact·invFact mod 7 |
|---|---|---|---|
| 0 | 1 | 1 | 1 |
| 1 | 1 | 1 | 1 |
| 2 | 2 | 4 | 8 mod 7 = 1 |
| 3 | 6 | 6 | 36 mod 7 = 1 |
| 4 | 3 (24 mod 7) | 5 | 15 mod 7 = 1 |
| 5 | 1 (15 mod 7) | 1 = 1^(7−2) | 1 |

invFact is filled bottom-up from invFact[5] = 1: invFact[4] = 1·5 = 5, invFact[3] = 5·4 = 20 mod 7 = 6,
invFact[2] = 6·3 = 18 mod 7 = 4, invFact[1] = 4·2 = 8 mod 7 = 1, invFact[0] = 1·1 = 1.

C(5, 2) mod 7 = fact[5]·invFact[2]·invFact[3] = 1·4·6 = 24 mod 7 = 3. Real C(5,2) = 10, 10 mod 7 = 3 ✓.

**k-th permutation, n = 4, k = 9** (0-indexed rank 8):

| m | block (m−1)! | idx = rank / block | picked | rank after | pool after |
|---|---|---|---|---|---|
| 4 | 6 | 1 | 2 | 2 | [1,3,4] |
| 3 | 2 | 1 | 3 | 0 | [1,4] |
| 2 | 1 | 0 | 1 | 0 | [4] |
| 1 | 1 | 0 | 4 | 0 | [] |

Answer "2314".

---

## 9. Edge cases

- C(n, k) with k < 0 or k > n → 0 (not an error). C(n, 0) = C(n, n) = 1. C(0, 0) = 1.
- Empty objects count as one: 0! = 1, Cat(0) = 1, D(0) = 1, stars and bars with n = 0 → 1.
- Stars and bars with k = 0 bins: 1 way if n = 0, else 0.
- Tables mod p need p > N (otherwise fact[p] = 0 and has no inverse) → Lucas' theorem is the fix.
- Inclusion–exclusion terms with negative arguments must be 0, not a formula evaluated on negatives.
- Plain numbers: factorials past 18!, C(n, k) past ~C(56, 28), Catalan past ~Cat(30) need BigInt.

---

## 10. Complexity analysis

| Operation | Time | Space | Why |
|---|---|---|---|
| C(n,k) multiplicative (BigInt) | O(min(k, n−k)) big-int ops | O(1) | one multiply and divide per step |
| Pascal's triangle up to row n | O(n^2) | O(n^2) (or O(n) for one row) | each cell is one addition |
| Build fact/invFact to N | O(N + log p) | O(N) | one powMod, then linear walks |
| C(n,k) mod p after tables | O(1) | O(1) | three lookups, two multiplies |
| Catalan via ratio | O(n) | O(1) | one step per index |
| Derangements D(n) | O(n) | O(1) | two-term recurrence |
| Inclusion–exclusion over k properties | O(2^k · cost) | O(1) | every subset once |
| Next permutation | O(n) | O(1) | two scans and a reverse |
| k-th permutation | O(n^2) (O(n log n) with a Fenwick tree) | O(n) | splicing from the pool |

---

## 11. Alternatives

| Approach | When it wins | Trade-off |
|---|---|---|
| Enumerate (backtracking) | n ≤ ~10, need the actual objects, or as a test oracle | exponential |
| Counting DP | constraints that break formulas (obstacles, "k songs apart") | O(states × transitions) |
| Closed formula | clean structure (grid, sorted strings, BSTs) | must prove the bijection |
| BigInt exact | answer must be exact, n modest | slower, cannot mod-free on huge n |
| Factorial tables mod p | many queries, n ≤ ~10^7, prime p | O(N) memory, p must exceed N |
| Lucas' theorem **[Advanced]** | n ≥ p (small prime p) | digit-by-digit in base p |

Best practice: write the brute force, then the formula, then **compare them on random small inputs**.

---

## 12. Common mistakes

- **(a * b) % MOD in JavaScript.** Residues up to 1e9 multiply to 1e18 > 2^53: silently wrong. Use `mulMod` or BigInt.
- **Computing n! / (k!(n−k)!) with plain numbers.** Overflows at n = 19. Use the multiplicative formula.
- **Dividing mod p.** `a / b % p` is meaningless. Multiply by the modular inverse.
- **Order vs no order.** Ask: "is {A,B} the same as {B,A}?" Mixing P and C is the most common counting bug.
- **Double counting.** Counting "at least one ace" by "pick an ace, then anything" counts hands with two aces twice. Use the complement.
- **Off by one in stars and bars.** n items into k bins → C(n+k−1, k−1), not C(n+k, k).
- **Forgetting k−1** in k-th permutation (1-indexed input).
- **G(0) = 0 instead of 1** in Catalan-style recurrences — all products become zero.

---

## 13. Patterns and templates

**A. "Choose positions"** → C(total, chosen). Grid paths, binary strings with exactly k ones.

**B. "How many of each"** → stars and bars C(n+k−1, k−1).

**C. "Split into two independent halves around a pivot"** → Catalan.

**D. "Total minus bad, bad overlaps"** → inclusion–exclusion:
```js
let good = 0n;
for (let mask = 0; mask < 1 << k; mask++) {
  const sign = popcount(mask) % 2 ? -1n : 1n;
  good += sign * countViolatingAtLeast(mask);
}
```

**E. "Arrangements with repeated items"** → multinomial n!/(c1!·c2!·…), mod p with invFact.

**F. "New vs reused"** → counting DP: dp[i][j] = dp[i−1][j−1]·(new choices) + dp[i−1][j]·(reuse choices).

**G. "k-th object in sorted order"** → skip whole blocks whose size you can count (factorial number system).

---

## 14. Recognition clues

**Use combinatorics when:**
- the question says "how many ways", "number of distinct …", "count …", especially with "modulo 1e9+7";
- n is large (10^5–10^9) but the structure is simple — enumeration is impossible;
- the answer for small n is a famous sequence (1, 2, 5, 14 → Catalan; 0, 1, 2, 9, 44 → derangements);
- the objects are fixed by a choice of positions or by counts.

**It does NOT apply (or needs DP instead) when:**
- you need the actual list (then backtracking — output size is the cost anyway);
- constraints interact irregularly (obstacles, forbidden adjacent pairs, weights) → counting DP;
- you need the best object, not the count → greedy / DP optimization;
- the modulus is not prime (inverses may not exist) → avoid division, use Pascal's rule or CRT.

---

## 15. Interview application

**Talk track:**
1. "Let me check small cases by hand: n = 1, 2, 3 gives 1, 2, 5 …" (spot the sequence).
2. "Each object corresponds one-to-one with … so the count is …" (state the bijection).
3. "Brute force would enumerate, O(n!). The formula is O(n)."
4. "The answer is huge, so I'll either use BigInt or work mod 1e9+7. In JavaScript I'll multiply with BigInt or a split mulMod because products of residues exceed 2^53."
5. "I'd verify the formula against the brute force for n ≤ 8."

**Clarify:** Are items distinct or identical? Does order matter? Can items repeat? Can a bin be empty?
Exact answer or modulo? How many queries (precompute tables?)

---

## 16. Problems in this topic

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Pascal's Triangle | Easy | Pascal's rule | [statement](../03_Problems/01_Easy/01_pascals_triangle.md) | [solution](../03_Problems/solutions/01_pascals_triangle.js) |
| 02 | Unique Paths | Medium | C(m+n−2, m−1) | [statement](../03_Problems/02_Medium/02_unique_paths.md) | [solution](../03_Problems/solutions/02_unique_paths.js) |
| 03 | Count Sorted Vowel Strings | Medium | stars and bars | [statement](../03_Problems/02_Medium/03_count_sorted_vowel_strings.md) | [solution](../03_Problems/solutions/03_count_sorted_vowel_strings.js) |
| 04 | Unique Binary Search Trees | Medium | Catalan | [statement](../03_Problems/02_Medium/04_unique_binary_search_trees.md) | [solution](../03_Problems/solutions/04_unique_binary_search_trees.js) |
| 05 | Distribute Candies Among Children II | Medium | inclusion–exclusion | [statement](../03_Problems/02_Medium/05_distribute_candies_among_children_ii.md) | [solution](../03_Problems/solutions/05_distribute_candies_among_children_ii.js) |
| 06 | Derangements Count (original) | Medium | derangement recurrence | [statement](../03_Problems/02_Medium/06_derangements_count.md) | [solution](../03_Problems/solutions/06_derangements_count.js) |
| 07 | Permutation Sequence | Hard | k-th permutation | [statement](../03_Problems/03_Hard/07_permutation_sequence.md) | [solution](../03_Problems/solutions/07_permutation_sequence.js) |
| 08 | Count Anagrams | Hard | multinomial mod p | [statement](../03_Problems/03_Hard/08_count_anagrams.md) | [solution](../03_Problems/solutions/08_count_anagrams.js) |
| 09 | Number of Music Playlists | Hard | counting DP | [statement](../03_Problems/03_Hard/09_number_of_music_playlists.md) | [solution](../03_Problems/solutions/09_number_of_music_playlists.js) |

### Practice more

- Pascal's Triangle II (LeetCode #119)
- Next Permutation (LeetCode #31)
- Generate Parentheses (LeetCode #22) — Catalan
- Unique Paths II (LeetCode #63)
- Find the Duplicate Number (LeetCode #287) — pigeonhole
- Count the Number of Ideal Arrays (LeetCode #2338) — stars and bars mod p **[Advanced]**
- Count Ways to Build Rooms in an Ant Colony (LeetCode #1916) — multinomial on a tree **[Advanced]**
- Number of Ways to Reorder Array to Get Same BST (LeetCode #1569) — C(n,k) on subtrees **[Advanced]**
- Distribute Candies Among Children III (LeetCode #2927)
- Kth Smallest Instructions (LeetCode #1643) — k-th object by counting blocks
