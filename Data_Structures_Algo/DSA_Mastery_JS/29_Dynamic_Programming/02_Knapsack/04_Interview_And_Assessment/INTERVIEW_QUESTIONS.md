# Knapsack DP - Interview Questions

Answer each question out loud first, then open the model answer.
Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md) · Code: [knapsack.js](../02_Implementations/knapsack.js)

---

### 1. Define the 0/1 knapsack state and recurrence.

<details><summary>Model answer</summary>

`dp[i][c]` = best value using only the first i items with capacity c. For item i (weight w,
value v): skip it → `dp[i-1][c]`; take it if `w <= c` → `v + dp[i-1][c-w]`. Take the max.
Base: row 0 and column 0 are 0. Answer `dp[n][W]`. O(n * W) time and space.

</details>

### 2. Why does the 1D version loop capacity downward? What happens if you loop upward?

<details><summary>Model answer</summary>

The update reads `dp[c - w]`, a smaller index. Looping downward means smaller indices still hold
the values from before this item (the "previous row"), so the item is used at most once. Looping
upward lets `dp[c - w]` already include this item, so the item can be taken again - that is
exactly unbounded knapsack. Same code, opposite direction, different problem.

</details>

### 3. Why is knapsack called "pseudo-polynomial"? When does that matter?

<details><summary>Model answer</summary>

O(n * W) is polynomial in the numeric value W, not in the number of bits needed to write W
(log W). If W is 10^9 the table is impossible even though the input is tiny. Then use meet in the
middle (n <= 40), DP over value instead of weight (if values are small), or a different idea.

</details>

### 4. How do you turn "Partition Equal Subset Sum" into knapsack?

<details><summary>Model answer</summary>

Two equal halves exist iff some subset sums to `total / 2`. If total is odd → false
immediately. Then boolean 0/1 knapsack: `dp[0] = true`, for each num, for s from target down to
num: `dp[s] ||= dp[s - num]`. O(n * total) time, O(total) space.

</details>

### 5. Explain the Target Sum transformation.

<details><summary>Model answer</summary>

Let P be the sum of numbers with '+' and N with '-'. `P - N = target` and `P + N = total`, so
`P = (total + target) / 2`. Counting sign assignments = counting subsets that sum to P (counting
knapsack, `dp[0] = 1`). If `total + target` is odd or `|target| > total`, the answer is 0. Zeros
double the count automatically because each zero can be in or out of P.

</details>

### 6. Coin Change II vs Combination Sum IV - why does loop order change the answer?

<details><summary>Model answer</summary>

Coins outer, amount inner: each coin is introduced once, so every multiset is built in one fixed
coin order → counts combinations ({1,2} = {2,1}). Amount outer, coins inner: for each total you
ask "what is the last element?", so different orderings are different paths → counts
permutations. Same table, same recurrence, swapped loops.

</details>

### 7. How would you reconstruct which items were chosen?

<details><summary>Model answer</summary>

Keep the 2D table. Start at `(n, W)`. If `dp[i][c] !== dp[i-1][c]`, item i was taken: record it
and set `c -= w[i]`. Move to `i - 1` either way. Stop at row 0. The 1D table loses this
information, so trade O(W) space back for O(n * W) if reconstruction is needed (or store a
separate boolean "took" table).

</details>

### 8. Why does greedy by value/weight ratio fail for 0/1 knapsack?

<details><summary>Model answer</summary>

Because items cannot be split. Capacity 10, items (w=6, v=7) ratio 1.17 and two items (w=5, v=5)
ratio 1. Greedy takes the 6 first, then nothing else fits → 7. Taking both 5s gives 10. Greedy
by ratio is optimal only for the fractional knapsack.

</details>

### 9. What changes for a "min" knapsack (Coin Change) compared with a "max" knapsack?

<details><summary>Model answer</summary>

Initial values. For min, fill with Infinity (meaning "impossible") and set `dp[0] = 0`; combine
with `Math.min(dp[a], 1 + dp[a - coin])`; return -1 if the answer is still Infinity. For max with
"at most" capacity, fill with 0. For exact-fill max, fill with -Infinity except `dp[0] = 0`.

</details>

### 10. How do you solve knapsack with two budgets (Ones and Zeroes)?

<details><summary>Model answer</summary>

The state gains a dimension: `dp[z][o]` = max strings using at most z zeros and o ones. For each
string with (zeros, ones), loop BOTH z and o downward (0/1 rule) and set
`dp[z][o] = max(dp[z][o], 1 + dp[z - zeros][o - ones])`. O(len * m * n) time, O(m * n) space.

</details>

### 11. Last Stone Weight II looks like a simulation. Why is it subset sum?

<details><summary>Model answer</summary>

Every smash subtracts one stone from another, so the final weight is some signed sum: split the
stones into two groups and subtract their totals. To minimise `|A - B|` with `A + B = total`,
make A as close to `total / 2` as possible from below. Boolean subset sum to `floor(total/2)`,
answer `total - 2 * best`.

</details>

### 12. How do you handle bounded knapsack (item i available k_i times)?

<details><summary>Model answer</summary>

Binary splitting: replace item i with bundles of 1, 2, 4, ..., remainder copies. Any count 0..k_i
is a sum of distinct bundles, so plain 0/1 knapsack over the bundles works. O(W * Σ log k_i).
(A monotonic-queue trick gets O(n * W) but is rarely needed in interviews.)

</details>

### 13. Memoization on (index, remaining capacity) vs the 1D table - which do you write first?

<details><summary>Model answer</summary>

In an interview I often write the memoized recursion first because the decision "skip or take"
reads naturally, then convert to the 2D table and finally the 1D table, explaining the downward
loop. Memo also visits only reachable states, which can be fewer than n * W when weights are
large and sparse.

</details>
