# Big O, Big Omega, Big Theta (and Recurrences)

[Time Complexity](../../01_Time_Complexity/README.md) taught you to *use* Big-O: read code, drop constants, name the class.
This topic makes it **precise**: what O, Ω and Θ actually mean, why "best case" and "Ω" are not the same thing,
how logarithms behave, and how to analyze **recursive** code with recurrences and the master theorem.
Every claim here is checked empirically in the solutions with **step counters** (deterministic, unlike timers).

---

## 1. Prerequisites (Essential)

- [Time Complexity](../../01_Time_Complexity/README.md): complexity classes, simplification rules, analyzing loops.
- [Space Complexity](../../02_Space_Complexity/README.md): recursion stack space.
- [Recursion Fundamentals](../../../00_Foundations/03_Recursion_Fundamentals/README.md): recursion trees.
- [Mathematics for DSA](../../../00_Foundations/04_Mathematics_For_DSA/README.md): exponents, sums.

---

## 2. Intuition (Essential)

- **Big O = "at most"** (an upper bound): the function grows no faster than this, up to a constant factor, for large n.
- **Big Ω = "at least"** (a lower bound): grows no slower than this.
- **Big Θ = "exactly this rate"** (tight bound): both at once.

Saying "binary search is O(n)" is *true* (it is at most linear) but **loose** and unhelpful; "binary search is Θ(log n) in the worst case" is tight and informative.
In interviews people say "Big-O" but mean the tight worst-case bound. Knowing the difference lets you answer precisely when it matters.

---

## 3. Mental model / analogy + visuals (Essential)

**A ceiling, a floor, and a sandwich.** f(n) is your code's step count. Past some point n0:

```
steps
  ^             c2·g(n)  (ceiling: f = O(g))
  |           /
  |         /     f(n)
  |       /    _/‾‾        f stays between the two lines for all n >= n0
  |     /   _/                 -> f = Θ(g)
  |   /  _/      c1·g(n)  (floor: f = Ω(g))
  |  / _/    __/
  | /_/  __/
  |//__/
  +----|-------------------------> n
       n0   (small n do not count: constants and lower terms can win there)
```

**Growth races.** Lower classes always lose to higher ones eventually, no matter the constant:
`1000·n` vs `n²` → n² wins (is larger) once n > 1000.

---

## 4. Why it exists (what problem it solves) (Essential)

Real running time depends on hardware, language, JIT, input details. We need a description that
(1) ignores those constant factors, (2) still distinguishes truly different algorithms, and (3) works for *every* input size.
Asymptotic notation does exactly that, and recurrences extend it to recursive algorithms, where you cannot just "count the loops".

---

## 5. How it works, step by step

### 5.1 Formal definitions with intuition (Essential)

| Notation | Definition | Read as | Example |
|---|---|---|---|
| f = O(g) | ∃ c > 0, n0: f(n) ≤ c·g(n) for all n ≥ n0 | f grows at most like g | 3n² + 10n + 5 = O(n²) with c = 4, n0 = 11 |
| f = Ω(g) | ∃ c > 0, n0: f(n) ≥ c·g(n) for all n ≥ n0 | at least like g | 3n² + 10n + 5 = Ω(n²) with c = 3, n0 = 1 |
| f = Θ(g) | f = O(g) and f = Ω(g) | exactly like g | 3n² + 10n + 5 = Θ(n²) |
| f = o(g) (Advanced) | f/g → 0 | strictly slower | n = o(n log n) |
| f = ω(g) (Advanced) | f/g → ∞ | strictly faster | 2^n = ω(n^100) |

**Finding c and n0 for the O proof:** 3n² + 10n + 5 ≤ 4n² ⇔ n² − 10n − 5 ≥ 0 ⇔ n ≥ 10.5, so n0 = 11 works.
`growth.js` contains `isBoundedBy`, which checks this numerically.

**Limit shortcut (Advanced):** if lim f/g = L with 0 < L < ∞ then f = Θ(g); if L = 0 then f = O(g) but not Ω; if ∞ then Ω but not O.

### 5.2 Best, average, worst case are a *different axis* (Essential)

A common confusion: "Ω means best case, O means worst case". **No.**

- **Cases** choose *which inputs* you are measuring: the best input of size n, the worst one, or the average over a distribution.
- **O / Ω / Θ** describe *the function you get* for that case.

So you can say: "insertion sort is Θ(n) in the best case (sorted input) and Θ(n²) in the worst case (reversed input)". Both cases have tight bounds.
"Insertion sort is O(n²)" (overall, any input) and "Ω(n)" (overall) are also correct.

| Algorithm | Best case | Average case | Worst case |
|---|---|---|---|
| linear search | Θ(1) | Θ(n) | Θ(n) |
| binary search | Θ(1) | Θ(log n) | Θ(log n) |
| insertion sort | Θ(n) | Θ(n²) | Θ(n²) |
| quicksort (random pivot) | Θ(n log n) | Θ(n log n) expected | Θ(n²) |
| hash map get | Θ(1) | Θ(1) expected | Θ(n) (all keys collide) |
| trial-division isPrime(n) | Θ(1) (even n) | — | Θ(√n) (n prime) |

### 5.3 Tight vs loose bounds (Essential)

O(n³) is a valid upper bound for an O(n²) algorithm, but **loose**. In an interview, always give the tightest bound you can justify,
and say which case you mean: "Θ(n log n) worst case", "O(1) amortized", "expected O(1)".
If you can only prove an upper bound (e.g. a tricky while loop), say "at most O(n²); I believe it is tighter, here is why...".

### 5.4 Growth comparison with concrete n (Essential)

Steps, and time at ~10^8 simple steps per second (a rough JS rule of thumb):

| f(n) | n = 10 | n = 100 | n = 1,000 | n = 10^6 | time at n = 10^6 |
|---|---|---|---|---|---|
| log₂ n | 3.3 | 6.6 | 10 | 20 | instant |
| √n | 3.2 | 10 | 32 | 1,000 | instant |
| n | 10 | 100 | 1,000 | 10^6 | 10 ms |
| n log₂ n | 33 | 664 | 9,966 | 2·10^7 | 0.2 s |
| n² | 100 | 10^4 | 10^6 | 10^12 | 3 hours |
| n³ | 1,000 | 10^6 | 10^9 | 10^18 | 300 years |
| 2^n | 1,024 | 1.3·10^30 | 10^301 | — | heat death of the universe |
| n! | 3.6·10^6 | 9.3·10^157 | — | — | — |

Run `node 02_Implementations/growth.js --table` to print a live version.

### 5.5 Logarithms refresher (Essential)

- log_b(n) = "how many times can I divide n by b before reaching 1" (or "the exponent you put on b to get n").
- log₂(1,000) ≈ 10, log₂(10^6) ≈ 20, log₂(10^9) ≈ 30. Remember 2^10 ≈ 10^3.
- Rules: log(xy) = log x + log y; log(x^k) = k log x; log_b(n) = log(n) / log(b).
- **Base does not matter inside O**: log₂ n and log₁₀ n differ by a constant factor (log₂ 10 ≈ 3.32), so O(log n) needs no base.
- **But the base matters in exponents**: 2^(log₂ n) = n while 4^(log₂ n) = n². And n^(log₂ 3) ≈ n^1.585 (Karatsuba).
- log(n!) = Θ(n log n) (Stirling), which is why comparison sorting needs Ω(n log n) comparisons.
- Σ_{i=1..n} 1/i = H(n) ≈ ln n, which is why `for i: for (j = i; j <= n; j += i)` is Θ(n log n).
- log log n grows *extremely* slowly (≤ 5 for any realistic n).

### 5.6 Recurrences (Essential)

A recursive algorithm's running time is described by a **recurrence**: the cost for size n in terms of the cost for smaller sizes.

```
merge sort:          T(n) = 2T(n/2) + Θ(n)        two halves, linear merge
binary search:       T(n) = T(n/2) + Θ(1)
tree traversal:      T(n) = 2T(n/2) + Θ(1)        (balanced)
Karatsuba:           T(n) = 3T(n/2) + Θ(n)
factorial / sum:     T(n) = T(n-1) + Θ(1)         -> Θ(n)
selection sort rec.: T(n) = T(n-1) + Θ(n)         -> Θ(n²)
naive fib:           T(n) = T(n-1) + T(n-2) + Θ(1) -> Θ(φ^n), φ ≈ 1.618
Hanoi:               T(n) = 2T(n-1) + Θ(1)        -> Θ(2^n)
```

Three ways to solve them:

1. **Recursion tree** (most intuitive): draw levels, sum the work per level, sum the levels.
2. **Substitution**: guess the answer, prove it by induction.
3. **Master theorem**: plug in a, b, d (only for the "divide by b" shape).

**Recursion tree for T(n) = 2T(n/2) + n:**

```
level 0:            n                      work n
level 1:      n/2       n/2                work n
level 2:   n/4 n/4   n/4 n/4               work n
...                                         ...
level log n:  1 1 1 ... 1  (n leaves)       work n
total = n per level × (log₂ n + 1) levels = Θ(n log n)
```

### 5.7 The master theorem (Essential)

For **T(n) = a·T(n/b) + Θ(n^d)** with a ≥ 1, b > 1, d ≥ 0. Compare d with the **critical exponent** c* = log_b(a):

| Case | Condition | Result | Intuition | Example |
|---|---|---|---|---|
| 1 | d < log_b a | Θ(n^(log_b a)) | leaves dominate (work grows down the tree) | 3T(n/2)+n → Θ(n^1.585); 2T(n/2)+1 → Θ(n) |
| 2 | d = log_b a | Θ(n^d log n) | every level costs the same | 2T(n/2)+n → Θ(n log n); T(n/2)+1 → Θ(log n) |
| 3 | d > log_b a | Θ(n^d) | the root dominates (work shrinks down the tree) | 2T(n/2)+n² → Θ(n²); T(n/2)+n → Θ(n) |

Extended case 2 (Advanced): if the extra work is Θ(n^d log^k n) with d = log_b a, the result is Θ(n^d log^(k+1) n). E.g. 2T(n/2) + n log n → Θ(n log² n).

**Why it works:** level i has a^i nodes each doing (n/b^i)^d work → total level work n^d · (a/b^d)^i. A geometric series:
ratio a/b^d < 1 (case 3) → first term dominates; = 1 (case 2) → all log_b n levels equal; > 1 (case 1) → last level (n^(log_b a) leaves) dominates.

**When the master theorem does NOT apply:** subtract-and-conquer (T(n−1)), unequal splits (T(n/3) + T(2n/3) + n → use a recursion tree: Θ(n log n)), non-polynomial differences like 2T(n/2) + n/log n. Use a recursion tree or substitution there.

### 5.8 Analyzing recursive code (Essential)

```
1. Write the recurrence: how many recursive calls (a), on what size (n/b or n-1), plus the work outside the calls f(n).
   Watch hidden work: slice/concat/spread are O(size), not O(1).
2. Solve: master theorem if it fits; otherwise recursion tree (count nodes × work).
3. Space: maximum depth × frame size + allocations alive at the same time.
4. Sanity-check empirically: count steps for n and 2n (doubling ratio) — see growth.js.
```

Doubling-ratio cheat sheet: ratio → 1 for Θ(1)/Θ(log n) (log n adds +1), → 2 for Θ(n), slightly above 2 for Θ(n log n), → 4 for Θ(n²), → 2^d for Θ(n^d), and for exponential the ratio *itself* explodes (steps(n+1)/steps(n) → constant > 1).

---

## 6. Pseudocode

```
analyze(code):
  if no recursion:
     count iterations of each loop as a function of n (watch dependent bounds and step sizes)
     multiply nested, add sequential, keep the dominant term
  else:
     T(n) = (#calls) T(sub size) + (work outside the calls)
     if T(n) = a T(n/b) + n^d: compare d with log_b a (master theorem)
     else: draw the recursion tree, sum work per level, sum levels
  state: case (best/worst/average/amortized) + tight bound (Θ) + space
  verify: steps(2n) / steps(n) matches the claim
```

---

## 7. JavaScript implementation

[`02_Implementations/growth.js`](../02_Implementations/growth.js):
`doublingRatio`, `estimateExponent` (log-log slope), `masterTheorem(a, b, d, k)` (returns case and bound),
`evalRecurrence` (exact recurrence values, memoized), `growthTable`, `isBoundedBy` (the formal definition, checked numerically), and `mulberry32`.
Every solution in `03_Problems/solutions` uses it to confirm the growth rate it claims.

```js
const { masterTheorem } = require('./growth');
masterTheorem(2, 2, 1);   // { case: 2, bound: 'Theta(n log n)', ... }
masterTheorem(3, 2, 1);   // { case: 1, bound: 'Theta(n^1.585)', ... }
```

---

## 8. Dry run on a concrete example

Analyze `for (let i = 1; i <= n; i++) for (let j = i; j <= n; j += i) steps++` for n = 8:

| i | j values | inner iterations = ⌊8/i⌋ |
|---|---|---|
| 1 | 1..8 | 8 |
| 2 | 2,4,6,8 | 4 |
| 3 | 3,6 | 2 |
| 4 | 4,8 | 2 |
| 5..8 | i | 1 each → 4 |
| total | | 8+4+2+2+4 = **20** |

In general Σ ⌊n/i⌋ ≈ n·H(n) ≈ n ln n → Θ(n log n). Doubling check: steps(2·10^5)/steps(10^5) ≈ 2.12 (slightly above 2, the n log n signature).

Master theorem dry run for T(n) = 3T(n/2) + n: a = 3, b = 2, d = 1, log₂3 ≈ 1.585 > 1 → case 1 → Θ(n^1.585). Doubling ratio → 3 (= 2^1.585).

---

## 9. Edge cases

- **Small n**: asymptotics say nothing about n < n0. An O(n²) algorithm can beat O(n log n) for n = 20 (insertion sort inside TimSort).
- **Multiple inputs**: O(n + m) or O(n·m), never collapse to O(n) unless you know m ≤ n.
- **Input value vs input size**: a loop to n where n is a *number* is linear in the value but **exponential in the number of bits** (pseudo-polynomial: trial division, knapsack DP).
- **Hidden costs**: `slice`, spread, `includes`, `indexOf`, `shift`, string concatenation in a loop, `JSON.stringify` keys.
- **Floors and ceilings** in recurrences do not change the Θ result.

---

## 10. Complexity analysis (reference)

| Code shape | Steps | Θ |
|---|---|---|
| `for (i = 0; i < n; i++) for (j = i + 1; j < n; j++)` | n(n−1)/2 | Θ(n²) |
| `for (i = n; i > 0; i = Math.floor(i / 2))` | ⌊log₂ n⌋ + 1 | Θ(log n) |
| `for (i = 1; i * i <= n; i++)` | ⌊√n⌋ | Θ(√n) |
| `for i < n: for (j = 1; j <= i; j *= 2)` | Σ (⌊log₂ i⌋ + 1) | Θ(n log n) |
| `for i ≤ n: for (j = i; j <= n; j += i)` | Σ ⌊n/i⌋ | Θ(n log n) |
| `for i < n: for (j = 1; j < n; j *= 2) ... for (k = 0; k < j; k++)` | Σ (2^0 + ... ) ≈ 2n per i | Θ(n²) |
| `T(n) = 2T(n/2) + n` | n log₂ n + n (n power of 2, T(1) = 1) | Θ(n log n) |
| `T(n) = 3T(n/2) + 1` | (3^(k+1) − 1)/2 for n = 2^k | Θ(n^log₂3) |
| `T(n) = T(n−1) + T(n−2) + 1` | 2F(n+1) − 1 | Θ(φ^n) |

---

## 11. Alternatives (trade-offs)

| Tool | Good for | Limitation |
|---|---|---|
| Counting loops | iterative code | dependent/irregular loops need sums |
| Recursion tree | any recursion, builds intuition | sums can be messy |
| Master theorem | a T(n/b) + n^d in seconds | only that shape |
| Substitution (induction) | rigorous proofs, odd recurrences | you must guess first |
| Empirical step counting | checking your claim, spotting hidden costs | suggests, does not prove; constants and log factors blur |
| Wall-clock timing | real performance | noisy; never use in asserts |

---

## 12. Common mistakes (and why they happen)

1. **"Ω = best case, O = worst case."** Cases and bounds are independent axes.
2. **Two nested loops ⇒ n² automatically.** The inner bound may be log n (`j *= 2`), √n, n/i (harmonic), or amortized (two pointers).
3. **Forgetting hidden work** in recursive calls (`f(arr.slice(1))` makes T(n) = T(n−1) + n → Θ(n²)).
4. **Calling the same subproblem twice** (`pow(x, n/2) * pow(x, n/2)` → T(n) = 2T(n/2) + 1 → Θ(n), not log n).
5. **Applying the master theorem to T(n−1)** recurrences. It only covers division by b.
6. **Confusing log bases in exponents**: n^(log₂3) ≠ n^(log₁₀3).
7. **Claiming Θ when you only proved O.**
8. **Writing O(n) for a loop to a number n that is the input value**, then calling the algorithm "linear" (it is exponential in the input length).

---

## 13. Patterns / variations with templates

**Step counter template (use it to verify any claim)**
```js
function analyze(n) {
  let steps = 0;
  // ... the code under study, with steps++ in the innermost body ...
  return steps;
}
const { doublingRatio } = require('../../02_Implementations/growth');
console.log(doublingRatio(analyze, 1 << 12)); // ~4 means quadratic
```

**Recurrence → master theorem**
```js
const { masterTheorem } = require('../../02_Implementations/growth');
masterTheorem(a, b, d);   // a calls, size n/b, n^d work outside
```

**Exact recurrence value (to check closed forms)**
```js
evalRecurrence({ a: 2, b: 2, f: n => n }, 1024); // 11264 = 1024·10 + 1024
```

---

## 14. Recognition clues

**Use the formal tools when:**
- the interviewer asks "is that tight?" or "best case?" or "can you prove it?";
- loops have dependent bounds or multiplicative steps;
- the solution is recursive (write the recurrence);
- you are deciding between two algorithms with similar Big-O (constants and cases matter).

**When it does NOT help much:**
- tiny fixed n (n ≤ 20): constants dominate; any reasonable code is fine;
- performance tuning of a fixed algorithm: profile, do not re-derive Θ.

---

## 15. Interview application

**Talk track:**
- "Worst case is Θ(n log n): the recurrence is 2T(n/2) + n, which is case 2 of the master theorem: every level of the recursion tree does n work and there are log n levels."
- "The inner loop doubles j, so it runs log i times; summed over i that's Θ(n log n), not n²."
- "Best case is Θ(1) when the first element matches; worst and average are Θ(n)."
- "Space is the recursion depth, Θ(log n) here, plus the O(n) merge buffer."

**What to clarify:** which case they want (worst, average, amortized, expected), what n is (length? value? number of bits?), and whether multiple inputs need separate variables.

---

## 16. Problems in this topic

| # | Problem | Difficulty | Focus |
|---|---|---|---|
| 01 | [Dependent Nested Loops](../03_Problems/01_Easy/01_dependent_nested_loops.md) | Easy | arithmetic series, Θ(n²) |
| 02 | [Halving Loop](../03_Problems/01_Easy/02_halving_loop.md) | Easy | Θ(log n), floors |
| 03 | [Square-Root Loop and Trial Division](../03_Problems/01_Easy/03_sqrt_loop_trial_division.md) | Easy | Θ(√n), best vs worst case |
| 04 | [Doubling Inner Loop](../03_Problems/02_Medium/04_doubling_inner_loop.md) | Medium | Σ log i = Θ(n log n) |
| 05 | [Harmonic Loop](../03_Problems/02_Medium/05_harmonic_loop.md) | Medium | Σ n/i = Θ(n log n) |
| 06 | [Divide in Two, Linear Merge](../03_Problems/02_Medium/06_divide_two_linear_merge.md) | Medium | master theorem case 2 |
| 07 | [Three Half-Size Calls](../03_Problems/02_Medium/07_three_half_calls.md) | Medium | master theorem case 1 |
| 08 | [Root-Dominated Recursion](../03_Problems/02_Medium/08_root_dominated_recursion.md) | Medium | master theorem case 3 |
| 09 | [Fibonacci Call Tree](../03_Problems/03_Hard/09_fibonacci_call_tree.md) | Hard | non-master recurrence, Θ(φ^n) vs memo |

**Practice more:** analyze the complexity of your own solutions to LeetCode 704 Binary Search, 912 Sort an Array (merge sort), 50 Pow(x, n), 204 Count Primes (Θ(n log log n)), 509 Fibonacci Number, 70 Climbing Stairs, 241 Different Ways to Add Parentheses (Catalan growth), 23 Merge k Sorted Lists (Θ(N log k)).
