# 1D Dynamic Programming - Quiz

Try every question before opening the answer. Score yourself; aim for 12/14 before moving on.
Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md)

---

**1. (Multiple choice)** Which recurrence solves House Robber (`dp[i]` = best from first i houses)?

- A. `dp[i] = dp[i-1] + nums[i-1]`
- B. `dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])`
- C. `dp[i] = max(dp[i-1], dp[i-1] + nums[i-1])`
- D. `dp[i] = dp[i-2] + nums[i-1]`

<details><summary>Answer</summary>

**B.** Skip house i (keep `dp[i-1]`) or rob it on top of the best from two back. C allows adjacent
houses; A and D have no choice at all.

</details>

**2. (Define the state)** "Given a string of digits, count how many ways it decodes to letters."
Write the state, recurrence, base case and answer.

<details><summary>Answer</summary>

`dp[i]` = ways to decode the first i characters. `dp[i] = (s[i-1] != '0' ? dp[i-1] : 0) +
(10 <= int(s[i-2..i-1]) <= 26 ? dp[i-2] : 0)`. `dp[0] = 1`. Answer `dp[n]`.

</details>

**3. (Complexity)** What are the time and space of Coin Change with `k` coins and target `A`
(tabulation)?

<details><summary>Answer</summary>

O(A * k) time, O(A) space. A states, each tries k coins.

</details>

**4. (Spot the bug)**

```js
function climbStairs(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1; dp[1] = 1;
  for (let i = 2; i < n; i++) dp[i] = dp[i - 1] + dp[i - 2];
  return dp[n];
}
```

<details><summary>Answer</summary>

The loop stops at `i < n`, so `dp[n]` is never filled and the function returns 0 for every
`n >= 2`. The loop must run to `i <= n`. Always check that the cell you return is actually written.

</details>

**5. (Predict the output)** Kadane with `best = 0` as the starting answer on `[-3, -1, -2]` returns?

<details><summary>Answer</summary>

0 - which is wrong (the true answer is -1). Initialise both the running sum and the answer with
`nums[0]`.

</details>

**6. (Multiple choice)** Which problem CANNOT be rolled down to O(1) space?

- A. Fibonacci  B. House Robber  C. Word Break  D. Min Cost Climbing Stairs

<details><summary>Answer</summary>

**C.** Word Break reads `dp[j]` for every `j < i`, so the whole array must stay.

</details>

**7. (Define the state)** Best Time to Buy and Sell Stock with Transaction Fee - what states do
you track per day?

<details><summary>Answer</summary>

Two: `hold` = best profit while holding a share, `free` = best profit with no share.
`hold = max(hold, free - price)`, `free = max(free, hold + price - fee)`. Answer `free`.

</details>

**8. (Spot the bug)**

```js
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(0);
  for (let a = 1; a <= amount; a++)
    for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], 1 + dp[a - c]);
  return dp[amount];
}
```

<details><summary>Answer</summary>

The table is filled with 0, so `Math.min(0, ...)` keeps every cell at 0. Fill with `Infinity`,
set `dp[0] = 0`, and return `dp[amount] === Infinity ? -1 : dp[amount]`.

</details>

**9. (Complexity)** Plain recursion for Fibonacci without memo - how many calls for `fib(n)`?

<details><summary>Answer</summary>

About φ^n ≈ 1.618^n (exponential, often written O(2^n)). With memo it becomes O(n).

</details>

**10. (Multiple choice)** In Jump Game, why is the greedy "farthest reach" scan correct?

- A. Jumps are always of size 1
- B. Reachable indices form a prefix of the array
- C. The array is sorted
- D. It is not correct; DP is required

<details><summary>Answer</summary>

**B.** If index k is reachable, so is every index before it, so one number (the frontier)
describes the entire reachable set.

</details>

**11. (Predict the output)** `deleteAndEarn([2, 2, 3, 3, 3, 4])`?

<details><summary>Answer</summary>

9. Buckets: points[2] = 4, points[3] = 9, points[4] = 4. House Robber on [0, 0, 4, 9, 4]:
taking 3 (9) beats taking 2 and 4 (8).

</details>

**12. (Spot the bug)** Rolling-variable House Robber:

```js
let prev2 = 0, prev1 = 0;
for (const x of nums) { prev2 = prev1; prev1 = Math.max(prev1, prev2 + x); }
```

<details><summary>Answer</summary>

`prev2` is overwritten before it is used, so `prev2 + x` is really `prev1 + x` - adjacent houses
get robbed. Compute `const cur = Math.max(prev1, prev2 + x)` first, then shift.

</details>

**13. (Define the state)** Perfect Squares: state, recurrence and why it is "unbounded knapsack".

<details><summary>Answer</summary>

`dp[i]` = fewest squares summing to i. `dp[i] = 1 + min(dp[i - k*k])` for `k*k <= i`, `dp[0] = 0`.
Each square can be used any number of times, exactly like unlimited coins.

</details>

**14. (Complexity)** Word Break with string length n and dictionary as a Set: time of the
tabulation that tries every split?

<details><summary>Answer</summary>

O(n^2) splits, each slicing/hashing a substring of length up to n → O(n^3) worst case.
Limiting the split to the dictionary's word lengths gives O(n * L * maxLen).

</details>

---

## Mastery checklist

- [ ] I can state the DP state, recurrence, base case and answer location for any problem in this folder in under a minute.
- [ ] I can write brute force → memo → tabulation → O(1) space for House Robber from memory.
- [ ] I know which base case each question type needs (count → 1, min → 0 with Infinity elsewhere, can-we → true).
- [ ] I can explain why greedy fails for House Robber and Coin Change but works for Jump Game.
- [ ] I have solved all 19 problems here and the topic tests pass (`node --test tests/one_dimensional_dp.test.js`).
