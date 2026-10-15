# Knapsack DP - Quiz

Try every question before opening the answer. Aim for 11/13 before moving on.
Concepts: [CONCEPTS.md](../01_Concepts/CONCEPTS.md)

---

**1. (Multiple choice)** In 1D 0/1 knapsack, which loop is correct for the capacity?

- A. `for (let c = w; c <= W; c++)`  B. `for (let c = W; c >= w; c--)`
- C. `for (let c = 0; c <= W; c++)`  D. Either A or B

<details><summary>Answer</summary>

**B.** Downward keeps `dp[c - w]` from the previous item. A is unbounded knapsack.

</details>

**2. (Define the state)** Coin Change II (count combinations to make `amount`): state, base case,
loop order.

<details><summary>Answer</summary>

`dp[a]` = number of combinations making a with the coins processed so far. `dp[0] = 1`.
Coins in the OUTER loop, amount upward in the inner loop (unbounded + combinations).

</details>

**3. (Complexity)** Partition Equal Subset Sum with n numbers whose total is S?

<details><summary>Answer</summary>

O(n * S / 2) = O(n * S) time, O(S) space.

</details>

**4. (Spot the bug)**

```js
function countSubsets(nums, target) {
  const dp = new Array(target + 1).fill(0);
  for (const x of nums)
    for (let s = target; s >= x; s--) dp[s] += dp[s - x];
  return dp[target];
}
```

<details><summary>Answer</summary>

Missing `dp[0] = 1`. With every cell 0, all additions add 0 and the function always returns 0.

</details>

**5. (Predict the output)** `targetSum([1, 1, 1, 1, 1], 3)`?

<details><summary>Answer</summary>

5. P = (5 + 3) / 2 = 4: choose which single 1 gets the minus sign → 5 ways.

</details>

**6. (Multiple choice)** Combination Sum IV (`nums = [1, 2, 3]`, target 4) returns 7 because:

- A. it counts multisets
- B. it counts ordered sequences
- C. each number can be used once
- D. it counts subsets

<details><summary>Answer</summary>

**B.** Target outer, numbers inner, so (1,3) and (3,1) are different.

</details>

**7. (Define the state)** Ones and Zeroes - write the state and the direction of both loops.

<details><summary>Answer</summary>

`dp[z][o]` = max number of strings using at most z zeros and o ones. For each string, z from m
down to its zeros and o from n down to its ones (both downward: each string used once).

</details>

**8. (Spot the bug)** Unbounded knapsack:

```js
for (let i = 0; i < w.length; i++)
  for (let c = W; c >= w[i]; c--) dp[c] = Math.max(dp[c], v[i] + dp[c - w[i]]);
```

<details><summary>Answer</summary>

The loop runs downward, which is the 0/1 rule - each item is used at most once. For unbounded,
loop `c` from `w[i]` up to `W`.

</details>

**9. (Complexity)** Brute force for 0/1 knapsack with n items?

<details><summary>Answer</summary>

O(2^n) subsets (times O(n) to sum each, or O(2^n) with recursion carrying the sums). Fine only
for n around 20.

</details>

**10. (Predict the output)** `knapsack01([1, 3, 4], [1, 4, 5], 5)`?

<details><summary>Answer</summary>

6 - items with weights 1 and 4 (values 1 + 5).

</details>

**11. (Multiple choice)** Capacity is 10^9 and n = 30. Best approach?

- A. 1D knapsack table  B. Greedy by ratio  C. Meet in the middle  D. 2D table

<details><summary>Answer</summary>

**C.** Split into two halves of 15 items (2^15 subsets each), sort one side, binary search.
A table of size 10^9 is impossible; greedy is wrong for 0/1.

</details>

**12. (Define the state)** Last Stone Weight II - what do you compute and what do you return?

<details><summary>Answer</summary>

Boolean subset sum: `dp[s]` = can some stones sum to s, for s up to `floor(total / 2)`.
Return `total - 2 * (largest reachable s)`.

</details>

**13. (Spot the bug)** Min coins:

```js
const dp = new Array(amount + 1).fill(Infinity);
for (const c of coins) for (let a = c; a <= amount; a++) dp[a] = Math.min(dp[a], 1 + dp[a - c]);
return dp[amount] === Infinity ? -1 : dp[amount];
```

<details><summary>Answer</summary>

`dp[0]` is never set to 0, so everything stays Infinity and the answer is always -1
(except it should be 0 for amount 0). Add `dp[0] = 0`.

</details>

---

## Mastery checklist

- [ ] I can write the 2D 0/1 knapsack table and explain every cell's two choices.
- [ ] I can explain why the 1D loop goes downward for 0/1 and upward for unbounded, with a 3-cell example.
- [ ] I can transform Partition, Target Sum and Last Stone Weight II into knapsack without hints.
- [ ] I know which loop order counts combinations vs permutations and why.
- [ ] I have solved all 11 problems here and `node --test tests/knapsack.test.js` passes.
