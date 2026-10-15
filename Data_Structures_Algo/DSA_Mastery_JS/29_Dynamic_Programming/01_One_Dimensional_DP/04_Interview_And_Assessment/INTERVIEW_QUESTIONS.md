# 1D Dynamic Programming - Interview Questions

Answer each question out loud first (as you would to an interviewer), then open the model answer.
Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md) · Framework: [DP overview](../../01_Concepts/OVERVIEW.md)

---

### 1. What two properties must a problem have for dynamic programming to help?

<details><summary>Model answer</summary>

**Optimal substructure**: the best answer for the whole is built from best answers of smaller
pieces (best robbery of 5 houses uses the best robbery of 3 or 4 houses). **Overlapping
sub-problems**: the plain recursion solves the same smaller piece many times (fib(3) is computed
again and again inside fib(10)). Without overlap, caching gives no speed-up; it is just divide
and conquer.

</details>

### 2. Memoization vs tabulation: what is the difference and when do you prefer each?

<details><summary>Model answer</summary>

Memoization is top-down: write the recursion, store each result in a Map, and return the cached
value when the same state comes again. Tabulation is bottom-up: fill an array from the base cases
upward in an order where every cell's dependencies are already filled.

Prefer memo when the recurrence is easier to think about recursively or when only a few states
are reachable. Prefer tabulation for large inputs (JavaScript's call stack overflows around
10^4 frames), for speed (no function-call overhead), and when you want to roll the array to
O(1) space.

</details>

### 3. Walk me through House Robber. Why does greedy fail?

<details><summary>Model answer</summary>

State: `dp[i]` = most money from the first `i` houses. At house `i` I either skip it
(`dp[i-1]`) or rob it on top of the best from two houses back (`dp[i-2] + nums[i-1]`). Base:
`dp[0] = 0`, `dp[1] = nums[0]`. Answer `dp[n]`. O(n) time, O(1) space with two variables.

Greedy "take the bigger of odd/even positions" fails on `[2, 1, 1, 2]`: odd = 3, even = 3, but
robbing the first and last houses gives 4. The optimal set does not follow a fixed parity.

</details>

### 4. How do you handle the circular version (House Robber II)?

<details><summary>Model answer</summary>

The first and last houses cannot both be robbed. So split into two linear problems: houses
`0..n-2` (last excluded) and houses `1..n-1` (first excluded), run normal House Robber on each and
take the max. Special case: one house → return it, because both ranges would be empty.

</details>

### 5. In a "count the ways" DP, why is `dp[0] = 1` and not 0?

<details><summary>Model answer</summary>

`dp[0]` means "ways to build nothing" and there is exactly one: choose nothing. Every longer
count is built by adding counts from smaller cells; if the bottom is 0, every sum stays 0.
The same logic gives "Coin Change II: 1 way to make amount 0" and "Decode Ways: 1 way to decode
the empty prefix".

</details>

### 6. How do you know when you can reduce O(n) space to O(1)?

<details><summary>Model answer</summary>

Look at the recurrence: if `dp[i]` reads only a fixed number of previous cells (`i-1`, `i-2`),
keep just those as variables and slide them forward. If it reads "every j < i" (Word Break, LIS)
or "i - coin" for arbitrary coins, you need the whole array. Always roll last, after the full
table version is correct, and compute every new value from old values before reassigning.

</details>

### 7. Coin Change: why not greedy? What do you store for "impossible"?

<details><summary>Model answer</summary>

Greedy (largest coin first) is only correct for special coin systems. Coins `[1, 3, 4]`,
amount 6: greedy takes 4+1+1 (3 coins) but 3+3 uses 2. DP: `dp[a] = 1 + min(dp[a - c])` over
coins `c <= a`, `dp[0] = 0`. Impossible amounts stay `Infinity` (never 0, which would mean "free")
and are converted to -1 at the end. O(amount * coins) time, O(amount) space.

</details>

### 8. Explain Kadane's algorithm as DP.

<details><summary>Model answer</summary>

State: `best[i]` = best sum of a subarray that **ends at** index i. Either extend the previous
one or start fresh: `best[i] = max(nums[i], best[i-1] + nums[i])`. The answer is the maximum over
all `i`, not `best[n-1]`, because the best subarray can end anywhere. Rolled to one variable it
is O(n) time, O(1) space. Initialise with `nums[0]` (not 0) so all-negative arrays work.

</details>

### 9. What is a "state machine" DP? Give an example.

<details><summary>Model answer</summary>

When the position alone is not enough to decide, add a small "mode" to the state. Stock with
cooldown has three modes per day: holding, just sold (cooldown), free. Write one recurrence per
mode based on the arrows between modes, e.g. `holding = max(holding, free - price)`. Paint
House is the same idea with "colour of the previous house" as the mode. Cost: O(n * modes).

</details>

### 10. Jump Game can be solved with DP or greedy. Which do you present and why?

<details><summary>Model answer</summary>

Present the DP first to show the reasoning (`canReach[i] = any canReach[j]` for jumps from i),
which is O(n * maxJump). Then the greedy: track the farthest reachable index; if the scan index
passes it, return false. It is O(n), O(1). It is safe because reachability is monotone: if index
k is reachable, every index before k is too, so a single "frontier" number captures the full state.

</details>

### 11. Decode Ways: what are the tricky cases?

<details><summary>Model answer</summary>

Zeros. A single "0" maps to no letter, so `dp[i]` only adds `dp[i-1]` if the last digit is 1-9.
A two-digit code is valid only for 10-26 (no leading zero like "06"). Strings like "100" or "0"
give 0. Base case `dp[0] = 1` (empty prefix). O(n) time, O(1) space with two variables.

</details>

### 12. How do you choose the DP state for a new problem?

<details><summary>Model answer</summary>

Ask: "What is the smallest amount of information about the past I need to make the next
decision correctly?" Start with just the index. If two different histories with the same index
need different future decisions, add what distinguishes them (holding a share or not, last colour,
remaining capacity). Then check the size: states x transitions must fit the constraints.

</details>

### 13. What is the time complexity of a memoized solution and how do you derive it?

<details><summary>Model answer</summary>

(number of distinct states) x (work per state, excluding recursive calls that hit the cache).
Word Break: n states (start index) x n end positions x O(n) substring/hash cost = O(n^3) naive,
O(n^2 * L) if you only try dictionary word lengths. Space = number of states + recursion depth.

</details>

### 14. Your memoized recursion is correct but crashes with "Maximum call stack size exceeded". What now?

<details><summary>Model answer</summary>

The recursion depth is O(n) and JS stacks hold only ~10^4 frames. Convert to tabulation:
identify the order in which states depend on each other (for `solve(i)` depending on `solve(i+1)`
the table is filled from `n` down to 0) and loop instead of recursing. The answer is identical.

</details>
