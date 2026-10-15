# Interval DP — Interview Questions

Answer out loud first, then open the model answer. Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md).

### 1. What signals tell you a problem is interval DP?

<details><summary>Model answer</summary>

The input is a sequence and you repeatedly merge, cut, remove or pair up **contiguous** pieces, and the cost of an operation depends on the current neighbours (so the order matters). Words like "burst", "merge stones", "cut", "multiply in some order", "triangulate", or a two-player game taking from either end are strong hints.
</details>

### 2. Define the usual state and the order of computation.

<details><summary>Model answer</summary>

`dp[l][r]` = best answer for the sub-array `l..r`. It depends on strictly shorter ranges inside it, so fill by increasing length (outer loop `len`, inner loop `l`, with `r = l + len - 1`), or loop `l` from right to left and `r` from left to right. A memoised recursion handles the order automatically.
</details>

### 3. Why is a typical interval DP O(n^3)?

<details><summary>Model answer</summary>

There are about n^2/2 ranges, and for each one the split loop tries up to n positions k. States × work per state = n^2 × n.
</details>

### 4. Explain the "last operation" trick in Burst Balloons.

<details><summary>Model answer</summary>

If you choose the first balloon to burst, its neighbours change and the two sides interact, so the problem does not split. If you choose the balloon k burst **last** in the open range (l, r), then when it bursts its neighbours are exactly the fixed borders l and r, and the two sides (l, k) and (k, r) were solved independently. Padding the array with 1s at both ends makes the borders always exist.
</details>

### 5. How does matrix chain multiplication fit the template?

<details><summary>Model answer</summary>

With dimensions `dims` (matrix i is `dims[i-1] x dims[i]`), `dp[i][j]` = min scalar multiplications to compute matrices i..j. Try every split k: `dp[i][k] + dp[k+1][j] + dims[i-1]·dims[k]·dims[j]`. Base `dp[i][i] = 0`. Answer `dp[1][n]`.
</details>

### 6. How do you model a two-player game where players take from either end?

<details><summary>Model answer</summary>

Store the score difference for the player to move: `dp[l][r] = max(nums[l] - dp[l+1][r], nums[r] - dp[l][r-1])`. Subtracting the opponent's best difference encodes "they also play optimally". Player 1 wins if `dp[0][n-1] >= 0` (Predict the Winner). One table, no separate tracking of two totals.
</details>

### 7. In Minimum Cost to Cut a Stick, why not index the DP by stick positions?

<details><summary>Model answer</summary>

The stick length can be 10^6 while there are at most ~100 cuts. Only the cut positions matter, so sort the cuts, add sentinels 0 and n, and run interval DP over cut indices: `dp[i][j] = (c[j] - c[i]) + min over k in (i, j) of dp[i][k] + dp[k][j]`. O(m^3) with m = cuts + 2.
</details>

### 8. Palindrome Partitioning II mixes interval and 1D DP. How?

<details><summary>Model answer</summary>

First build `isPal[l][r]` (interval DP, O(n^2)): `s[l] === s[r] && (r - l < 2 || isPal[l+1][r-1])`. Then a 1D DP over prefixes: `cuts[i] = min over j ≤ i with isPal[j][i] of (j === 0 ? 0 : cuts[j-1] + 1)`. Total O(n^2) instead of O(n^3).
</details>

### 9. Why does Remove Boxes need a third dimension?

<details><summary>Model answer</summary>

The points for removing a group are the square of its size, and boxes of the same colour from outside `[l, r]` may join a group inside it. So the answer for `[l, r]` depends on how many boxes equal to `boxes[l]` are already attached on the left — state `dp[l][r][k]`. O(n^3) states, O(n) transitions → O(n^4) worst case.
</details>

### 10. Memo or tabulation in an interview?

<details><summary>Model answer</summary>

Memo first: it follows the recurrence directly and avoids order bugs. Mention you can convert to tabulation by increasing length to remove recursion depth and the Map/array cache overhead. For n ≤ 500 recursion depth is fine in JavaScript.
</details>

### 11. Can greedy replace interval DP for "merge adjacent piles with cost = merged size"?

<details><summary>Model answer</summary>

No. If ANY two piles may merge, greedy (always merge the two smallest, Huffman) is optimal. When only **adjacent** piles may merge, the cheapest pair may not be adjacent later, and counterexamples exist — use interval DP (Minimum Cost to Merge Stones).
</details>

### 12. What edge cases do you test?

<details><summary>Model answer</summary>

Single element (base case), two elements, all equal values, zeros (Burst Balloons with 0s), strings of one repeated character (Strange Printer, Palindrome Partitioning), and a brute-force comparison on random small inputs.
</details>
