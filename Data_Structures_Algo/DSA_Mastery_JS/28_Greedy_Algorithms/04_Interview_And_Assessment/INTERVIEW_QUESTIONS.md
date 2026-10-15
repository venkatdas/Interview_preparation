# Greedy Algorithms: Interview Questions

Answer each question out loud first (about 1-2 minutes), then open the model answer.
Back to the [topic README](../README.md) · [concepts guide](../01_Concepts/CONCEPTS.md) · [quiz](QUIZ.md)

---

### 1. What is a greedy algorithm, and what two properties must a problem have for greedy to be correct?

<details><summary>Model answer</summary>

A greedy algorithm builds the answer step by step, always taking the choice that looks best
right now and never undoing it. It is correct when the problem has:

1. **Greedy-choice property**: some optimal solution contains the greedy choice.
2. **Optimal substructure**: after the choice, the rest is a smaller problem of the same kind,
   and solving it optimally gives an overall optimum.

DP needs only optimal substructure because it tries every choice. Greedy skips the trying,
so it needs the extra guarantee.

</details>

### 2. Explain the exchange argument using interval scheduling.

<details><summary>Model answer</summary>

Goal: pick the maximum number of non-overlapping intervals. Greedy picks the one that ends
earliest. Take any optimal solution O. Let its first interval be X. Greedy's first pick G ends
no later than X, so replacing X with G cannot create an overlap with the rest of O. The new
solution has the same size and agrees with greedy on the first pick. Repeat on the rest.
So greedy's answer is as large as any optimal one.

</details>

### 3. What is the "greedy stays ahead" proof style? Give an example.

<details><summary>Model answer</summary>

You show by induction that after every step, greedy's partial result is at least as good as
any other strategy's partial result. In Jump Game II, after `k` jumps greedy has reached the
farthest index that ANY strategy can reach with `k` jumps. So greedy reaches the end with no
more jumps than anyone else.

</details>

### 4. Why does "sort by start time" fail for maximum non-overlapping intervals?

<details><summary>Model answer</summary>

A long interval that starts first blocks many short ones. Counter-example:
`[[1,10],[2,3],[4,5]]`. Sorting by start picks `[1,10]` and then nothing fits: 1 interval.
Sorting by end picks `[2,3]` and `[4,5]`: 2 intervals. Ending early leaves the most room.

</details>

### 5. Coin change: when is "biggest coin first" correct, and when is it wrong?

<details><summary>Model answer</summary>

It is correct for **canonical** coin systems such as 1/5/10/25 or 1/2/5/10/20/50 (and any
system where each coin divides the next). It is wrong for arbitrary coins: with `[1, 3, 4]`
and amount 6, greedy gives `4+1+1` (3 coins) but `3+3` uses 2. In an interview, use DP
(LeetCode #322) unless the coin system is given as canonical.

</details>

### 6. Fractional knapsack is greedy, 0/1 knapsack is not. Why?

<details><summary>Model answer</summary>

With fractions, any weight spent on a lower value-per-weight item can be swapped for the same
weight of a higher-ratio item without losing value, so taking the best ratio first is always
safe. In 0/1 knapsack you cannot take a slice: a high-ratio item may waste capacity.
Example: capacity 10, items (w=6, v=7) and two of (w=5, v=5). Ratio greedy takes the 6-weight
item (value 7) and then nothing fits; the optimum is both 5-weight items (value 10).

</details>

### 7. Walk me through Gas Station. Why can we skip all stations between the old start and the failure point?

<details><summary>Model answer</summary>

If `sum(gas) < sum(cost)` the answer is -1. Otherwise scan once with a running tank. When the
tank becomes negative at station `i`, start again at `i + 1`. Why skip the stations in between:
every station `k` between the old start and `i` was reached with a tank `>= 0`. Starting at `k`
means starting with 0 fuel, which is no better, so it would also fail at or before `i`.
The total check guarantees the last start works. O(n) time, O(1) space.

</details>

### 8. How do you approach a problem when you are not sure greedy works?

<details><summary>Model answer</summary>

1. State the greedy rule in one sentence.
2. Try to break it with 2-3 tiny inputs (ties, a long interval, odd coin values).
3. If it survives, sketch an exchange argument or a "stays ahead" argument.
4. If you cannot argue it, say so and switch to DP or search. A correct O(n²) DP beats a wrong
   O(n) greedy. Offline, compare greedy against brute force on random small inputs.

</details>

### 9. Task Scheduler: explain the formula `(maxFreq - 1) * (n + 1) + countMax`.

<details><summary>Model answer</summary>

The most frequent task forces `maxFreq - 1` full "frames" of length `n + 1` (the task plus
its cooldown), and a final partial frame that contains every task tied at the max frequency
(`countMax`). Other tasks fill the idle slots. If there are so many task types that frames
overflow, there is no idle time at all and the answer is simply `tasks.length`. So the answer
is `max(formula, tasks.length)`.

</details>

### 10. Why does Candy need two passes?

<details><summary>Model answer</summary>

Each child has two constraints: more than the left neighbour if rated higher, and more than
the right neighbour if rated higher. The left-to-right pass satisfies the left rule only.
A decreasing run like `3, 2, 1` needs information from the right. The right-to-left pass sets
`candy[i] = max(candy[i], candy[i+1] + 1)` when `ratings[i] > ratings[i+1]`, which fixes the
right rule without breaking the left one. O(n) time.

</details>

### 11. Greedy vs dynamic programming: how do you decide in an interview?

<details><summary>Model answer</summary>

Clues for greedy: sort-and-scan feels natural, a local choice never hurts later choices, and
you can find no counter-example. Clues for DP: "count the ways", choices interact (0/1 items),
weighted versions (weighted interval scheduling), or a small counter-example kills your rule.
Greedy is often a special case of DP where one choice dominates all others.

</details>

### 12. Huffman coding: what is the greedy choice and why is it safe?

<details><summary>Model answer</summary>

Repeatedly merge the two least frequent symbols (min-heap). Safe because in some optimal
prefix-code tree the two rarest symbols are siblings at the deepest level: if they were not,
swapping them with the deepest siblings never increases `sum(freq * depth)`. After merging,
the problem is a smaller Huffman problem. O(n log n).

</details>

### 13. What is the time complexity of most greedy solutions and why?

<details><summary>Model answer</summary>

O(n log n), dominated by sorting (or by n heap operations). The scan after sorting is O(n).
Some greedy problems need no sort (Jump Game, Gas Station, Best Time to Buy and Sell Stock II)
and run in O(n).

</details>

### 14. Touching intervals: are `[1,2]` and `[2,3]` overlapping?

<details><summary>Model answer</summary>

It depends on the problem, so ask. In Non-overlapping Intervals (#435) they do not overlap
(use `start >= lastEnd`). In Minimum Arrows (#452) balloons are closed intervals, so one arrow
at x = 2 bursts both (use `start > arrowPos` to need a new arrow). Getting this wrong is the
most common bug in interval greedy.

</details>
