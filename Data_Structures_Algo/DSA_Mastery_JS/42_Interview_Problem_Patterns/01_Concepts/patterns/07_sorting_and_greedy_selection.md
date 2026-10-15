# 07. Sorting + Greedy Selection

A greedy algorithm makes the choice that looks best **right now** and never takes it back.
Very often the right "now" only becomes visible after sorting: sort by end time, by size, by
ratio, by deadline. Then one pass makes the choices. Total cost: O(n log n) for the sort plus
O(n) for the pass.

The hard part is not the code. It is knowing that greedy is **correct** for this problem. In an
interview you justify it with an *exchange argument*: "take any optimal answer; swapping its
first choice for my greedy choice never makes it worse".

**Teaches in depth:** [Greedy Algorithms](../../../28_Greedy_Algorithms/README.md), [Sorting](../../../11_Sorting/README.md)

---

## 1. Recognition clues

| Words in the problem | Why it hints at sort + greedy |
|---|---|
| "maximum number of non-overlapping", "most meetings" | sort by end, take the earliest finisher |
| "minimum number of arrows / boats / rooms" | sort, then pair or sweep |
| "assign / match items to people" (cookies, tasks) | sort both, match smallest-that-fits |
| "can you reach the end", "minimum jumps" | track the farthest reach |
| "largest number formed", "order to minimize cost" | sort with a custom comparator |
| "schedule with deadlines / profits" | sort by deadline or profit, sometimes plus a heap |

**Constraint hints**

- n up to 10^5 and an "optimal" question with no obvious DP state -> try greedy first, then try to break it with a small counterexample.
- If small counterexamples break greedy, switch to DP ([17](17_dynamic_programming_families.md)).

## 2. When it applies (preconditions)

- **Greedy choice property:** some optimal solution starts with the greedy choice.
- **Optimal substructure:** after making that choice, the rest is the same problem on smaller input.
- You can state an exchange argument (or a "stays ahead" argument) in two sentences.

## 3. When it does NOT apply

- **Coin change with arbitrary coins.** Coins `[1, 3, 4]`, amount 6. Greedy takes 4 + 1 + 1 = 3 coins. The optimum is 3 + 3 = 2 coins. Use DP (`coinChangeMin`).
- **0/1 knapsack.** Capacity 50, items (weight, value): (10, 60), (20, 100), (30, 120). Best ratio first takes 10 and 20 -> value 160; optimum is 20 + 30 -> 220. Fractional knapsack is greedy; 0/1 is DP.
- **Activity selection sorted by start time.** `[[1, 10], [2, 3], [4, 5]]`: earliest start picks `[1, 10]` and gets 1 meeting; earliest end gets 2. The sort key matters.

## 4. The template

```js
// Activity selection: max number of non-overlapping intervals [s, e) (touching is fine)
function maxNonOverlapping(intervals) {
  const sorted = intervals.slice().sort((a, b) => a[1] - b[1]);
  let count = 0;
  let lastEnd = -Infinity;
  for (const [s, e] of sorted) {
    if (s >= lastEnd) { count++; lastEnd = e; }    // earliest finish leaves the most room
  }
  return count;
}

// Pair the largest with the smallest (Boats to Save People)
function minBoats(people, limit) {
  const a = people.slice().sort((x, y) => x - y);
  let lo = 0;
  let hi = a.length - 1;
  let boats = 0;
  while (lo <= hi) {
    if (a[lo] + a[hi] <= limit) lo++;              // lightest rides with the heaviest if it fits
    hi--;
    boats++;
  }
  return boats;
}
```

Tested in [pattern_templates.js](../../02_Implementations/pattern_templates.js) (`maxNonOverlapping`, `minBoats`) and [tests/patterns.test.js](../../tests/patterns.test.js) (including a brute-force comparison on random inputs).

**Dry run** `maxNonOverlapping([[1, 3], [2, 4], [3, 5], [6, 7]])` sorted by end -> same order:

| interval | s >= lastEnd? | count | lastEnd |
|---|---|---|---|
| [1, 3] | 1 >= -Inf yes | 1 | 3 |
| [2, 4] | 2 >= 3 no | 1 | 3 |
| [3, 5] | 3 >= 3 yes | 2 | 5 |
| [6, 7] | 6 >= 5 yes | 3 | 7 |

**Exchange argument.** Let OPT be any optimal schedule. Its first meeting ends no earlier than
the greedy first meeting (greedy picked the earliest end). Replace OPT's first meeting with the
greedy one: nothing overlaps that did not before, and the count stays the same. Repeat for the rest.

## 5. Variations

- **Erase overlap intervals:** answer = n - `maxNonOverlapping`.
- **Minimum arrows:** same sort by end; shoot at the end of the current group.
- **Assign cookies:** sort greed and sizes, give each child the smallest cookie that fits.
- **Jump Game:** keep `farthest = max(farthest, i + nums[i])`; fail if `i > farthest`.
- **Gas station:** if the total is non-negative, start right after the point where the running sum was lowest.
- **Custom comparator:** Largest Number sorts by `(b + a).localeCompare(a + b)`.
- **Greedy + heap:** IPO, Task Scheduler, meeting rooms — pick the best available item over time ([10](10_top_k_and_heaps.md)).

## 6. Common pitfalls

1. Sorting by the wrong key (start instead of end). Test with the counterexample above.
2. Default `sort()` is lexicographic. `[[10, 2], [9, 1]].sort()` compares strings. Always pass a comparator.
3. Comparators must return a number, not a boolean: `(a, b) => a > b` is wrong.
4. Mutating the input with `sort` (it sorts in place). Copy with `slice()` or use `toSorted` (Node 20+).
5. Claiming greedy without proof. Interviewers will ask "why does this work?". Prepare an exchange argument or a counterexample check.
6. Touching intervals: decide whether `[1, 2]` and `[2, 3]` overlap (meetings: no; closed intervals: yes).

## 7. Representative problems

| # | Problem | Difficulty | Why this pattern | Page |
|---|---|---|---|---|
| 1 | Assign Cookies | Easy | sort both, match | [statement](../../../28_Greedy_Algorithms/03_Problems/01_Easy/01_assign_cookies.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/01_assign_cookies.js) |
| 2 | Maximum Units on a Truck | Easy | sort by value per unit | [statement](../../../28_Greedy_Algorithms/03_Problems/01_Easy/03_maximum_units_on_truck.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/03_maximum_units_on_truck.js) |
| 3 | Jump Game | Medium | farthest reach | [statement](../../../28_Greedy_Algorithms/03_Problems/02_Medium/05_jump_game.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/05_jump_game.js) |
| 4 | Jump Game II | Medium | BFS-like levels of reach | [statement](../../../28_Greedy_Algorithms/03_Problems/02_Medium/06_jump_game_ii.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/06_jump_game_ii.js) |
| 5 | Gas Station | Medium | running sum reset | [statement](../../../28_Greedy_Algorithms/03_Problems/02_Medium/07_gas_station.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/07_gas_station.js) |
| 6 | Boats to Save People | Medium | sort + pair extremes | [statement](../../../28_Greedy_Algorithms/03_Problems/02_Medium/08_boats_to_save_people.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/08_boats_to_save_people.js) |
| 7 | Non-overlapping Intervals | Medium | sort by end | [statement](../../../28_Greedy_Algorithms/03_Problems/02_Medium/10_non_overlapping_intervals.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/10_non_overlapping_intervals.js) |
| 8 | Largest Number | Medium | custom comparator | [statement](../../../11_Sorting/03_Problems/02_Medium/05_largest_number.md) · [solution](../../../11_Sorting/03_Problems/solutions/05_largest_number.js) |
| 9 | Queue Reconstruction by Height | Medium | sort then insert | [statement](../../../28_Greedy_Algorithms/03_Problems/02_Medium/16_queue_reconstruction_by_height.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/16_queue_reconstruction_by_height.js) |
| 10 | Candy | Hard | two greedy passes | [statement](../../../28_Greedy_Algorithms/03_Problems/03_Hard/18_candy.md) · [solution](../../../28_Greedy_Algorithms/03_Problems/solutions/18_candy.js) |

## 8. Self-check

**Q1.** Give a counterexample showing "always take the largest coin" fails.

<details><summary>Answer</summary>

Coins `[1, 3, 4]`, amount 6: greedy 4+1+1 (3 coins) vs optimal 3+3 (2 coins).

</details>

**Q2.** Why sort by **end** time for the maximum number of non-overlapping meetings?

<details><summary>Answer</summary>

Finishing earliest leaves the largest remaining time for the other meetings. The exchange argument: swapping any optimal first meeting for the earliest-ending one never creates an overlap.

</details>

**Q3.** What is wrong with `arr.sort((a, b) => a > b)`?

<details><summary>Answer</summary>

The comparator must return negative/zero/positive. A boolean becomes 1 or 0, never negative, so the engine may not sort correctly. Use `(a, b) => a - b`.

</details>

---

Previous: [06. Binary Search & Search on the Answer](06_binary_search_and_search_on_answer.md) · Next: [08. Intervals & Sweep Line](08_intervals_and_sweep_line.md) · [Pattern index](../../README.md)
