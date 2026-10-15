# Mixed Sets — Post-set Reflection and Quiz

Use this page **after** finishing a set (not before: the questions reveal the patterns).
For each set: tick the reflection checklist honestly, then answer the 3 conceptual questions out loud or on
paper before opening the answers.

Back to the [mixed sets README](../README.md).

---

## Set 01 — Easy fundamentals ([set](../03_Problems/set_01/README.md))

**Reflection checklist**

- [ ] I said a brute force and its complexity for every problem before optimizing.
- [ ] I spotted the second pattern (map + window, prefix + map, key + count, merge + max, diff + prefix) without Hint 1 in at least 3 problems.
- [ ] I handled "nothing valid" correctly (null / 0 / smallest index) instead of guessing.
- [ ] I tested with an empty input and with all-negative values.
- [ ] I finished inside 90 minutes. If not, I wrote down which problem cost the most time and why.

**Q1.** In *Balanced L/R Substrings* the map is seeded with `{0: 1}`. What exactly goes wrong if you forget it?

<details><summary>Answer</summary>

The seed represents the empty prefix (before the first character). Without it, every balanced substring
that **starts at index 0** is missed, because it needs a matching earlier prefix with balance 0. On `"LR"` you
would return 0 instead of 1.

</details>

**Q2.** Why does *Unique Streak Max Sum* return `null` instead of `0` when there is no valid window?

<details><summary>Answer</summary>

Values may be negative, so 0 is a legal answer that is **larger** than any real streak in an all-negative
array. A sentinel that cannot be a real answer (`null`, or `-Infinity` internally) keeps "no answer" and
"answer is 0" apart. Always ask "can the real answer be 0 or negative?" before picking a sentinel.

</details>

**Q3.** In *Bonus Leader*, why is the difference array of size `n + 1`, and why does the comparison use `>`?

<details><summary>Answer</summary>

An update `[l, r]` writes `-delta` at `r + 1`; for `r = n - 1` that is index `n`. Size `n + 1` keeps that write
inside the array. `>` (strict) means a later index with an equal total does not replace the leader, so ties keep
the smallest index as required.

</details>

---

## Set 02 — Searching and search spaces ([set](../03_Problems/set_02/README.md))

**Reflection checklist**

- [ ] I recognized "binary search on the answer" from the phrase "minimize the maximum" / "find the smallest X that works".
- [ ] I wrote the feasibility check as a separate function and tested it alone.
- [ ] I chose lower bound vs upper bound deliberately (and could say why).
- [ ] I sorted numbers with a comparator every time.
- [ ] I finished inside 120 minutes.

**Q1.** What property must a check function have for "binary search on the answer" to be correct?

<details><summary>Answer</summary>

**Monotonicity**: if `check(x)` is true then `check(y)` is true for every `y > x` (or the reverse). The answers
form `false…false true…true`, and binary search finds the boundary. In *Capped Reading Split*, a bigger daily
limit can only make packing easier, so the check is monotonic.

</details>

**Q2.** In *Active Sessions*, why is `(#starts ≤ t) − (#ends ≤ t)` correct even though the starts and ends are
sorted separately and no longer paired?

<details><summary>Answer</summary>

Every session with `end ≤ t` also has `start ≤ end ≤ t`, so it is counted in the first term too. Subtracting
removes exactly the sessions that already ended. The count does not care which start belongs to which end, so
the pairing is not needed.

</details>

**Q3.** In *K Items Closest to Budget*, why can the loop `break` (not just `continue`) when the cheapest finish
is over budget?

<details><summary>Answer</summary>

Prices are sorted ascending. If taking `a[i..i+need-1]` is already too expensive, any later start `i' > i` uses
items that are each at least as expensive, so it is too expensive as well. The rest of the loop can be skipped.

</details>

---

## Set 03 — Linear structures ([set](../03_Problems/set_03/README.md))

**Reflection checklist**

- [ ] I stored indices (not values) in monotonic stacks and deques.
- [ ] I could explain the invariant of each stack/deque in one sentence.
- [ ] I wrote (or reused) a heap with the right comparator, including tie-breaks.
- [ ] I counted amortized cost correctly ("each index is pushed and popped once").
- [ ] I finished inside 120 minutes.

**Q1.** *Steady Subarrays* adds `right − left + 1` per step. Why does that count every steady subarray exactly once?

<details><summary>Answer</summary>

For a fixed right end, the steady subarrays are exactly those starting in `[left, right]` (if a window is
steady, every window inside it is too, so the valid starts form a contiguous range). Each subarray has exactly
one right end, so summing over right ends counts each once.

</details>

**Q2.** In *Most Versatile Users* the heap keeps the k best users. Why a **min**-heap, and which user sits at the root?

<details><summary>Answer</summary>

We repeatedly need to throw away the **worst** of the kept users when a better one arrives. A min-heap ordered by
"worse first" keeps that user at the root, so eviction is O(log k). With equal counts, the worse user is the one
with the larger name, because the output prefers smaller names.

</details>

**Q3.** In *Smallest Covering Range*, why does it never help to advance a list that is not holding the minimum?

<details><summary>Answer</summary>

The range is `[min, max]`. Advancing any other list can only keep or increase `max`, while `min` stays the
same, so the range cannot shrink. Only moving the minimum forward can raise `min`. When the list holding the
minimum runs out, no further improvement is possible, so the algorithm stops.

</details>

---

## Set 04 — Trees, BSTs, tries ([set](../03_Problems/set_04/README.md))

**Reflection checklist**

- [ ] I built the tree from the level-order array correctly (including `null` holes).
- [ ] I undid my hash-map change on the way back up (backtracking on a tree path).
- [ ] I knew what in-order traversal of a BST gives me without thinking.
- [ ] I stored counts (not booleans) at trie nodes when duplicates mattered.
- [ ] I finished inside 130 minutes.

**Q1.** In *Divisible Downward Paths*, what bug appears if you do not decrement the remainder count after visiting a node's children?

<details><summary>Answer</summary>

The map would still contain prefixes from a finished subtree when you visit its sibling. A path would then be
"counted" from a node in the left subtree to a node in the right subtree, which is not a downward path. Undoing
the change keeps the map equal to the current root-to-node chain.

</details>

**Q2.** *Capped XOR Queries* answers queries in sorted order of `m`. Why does that make the problem easier, and
what must you remember at the end?

<details><summary>Answer</summary>

Sorting the queries by `m` means the allowed set of numbers only grows, so we can insert numbers into the trie
once and never delete. This is the "offline" trick. At the end, answers must be written back to the **original**
query positions.

</details>

**Q3.** Why is choosing the opposite bit greedily (from the highest bit down) optimal for maximum XOR?

<details><summary>Answer</summary>

Bit `b` is worth `2^b`, which is more than all lower bits together (`2^b − 1`). So setting a higher bit of the
result to 1 is always better than any combination of lower bits. Taking the opposite bit whenever it exists
sets that bit; this greedy choice never loses.

</details>

---

## Set 05 — Graphs with a twist ([set](../03_Problems/set_05/README.md))

**Reflection checklist**

- [ ] I said the graph type out loud (directed? weighted? DAG? grid?) before choosing an algorithm.
- [ ] I used BFS only for unweighted reachability/shortest paths, Dijkstra for non-negative weights.
- [ ] I detected cycles where they made the answer -1.
- [ ] I could explain why my union-find did or did not use path compression.
- [ ] I finished inside 150 minutes.

**Q1.** In *Coupon Routes*, why is `dist[city]` alone not enough?

<details><summary>Answer</summary>

Two ways to reach the same city can differ in coupons left. A path that is more expensive now but saved a coupon
can be cheaper later. Different "situations" must be different nodes: `(city, couponsUsed)`. This "expand the
state" trick turns many constrained shortest-path problems into plain Dijkstra.

</details>

**Q2.** Why must *Connection Time Queries* avoid path compression?

<details><summary>Answer</summary>

The algorithm treats each parent link as a permanent edge stamped with the time it was created. Path compression
rewires nodes directly to the root, deleting the original links and their time stamps, so the "max stamp on the
path" would be wrong. Union by size keeps the trees O(log n) deep, so walking up is still fast.

</details>

**Q3.** In *Pipeline Finish Time*, why does Kahn's algorithm guarantee that a task's start time is final when it is popped?

<details><summary>Answer</summary>

A task is pushed only when its in-degree reaches 0, meaning every prerequisite has already been popped and has
pushed its finish time to it. No further updates can arrive, so `start[task]` is the max over all prerequisites.
If some tasks are never popped, they sit on a cycle, so the answer is -1.

</details>

---

## Set 06 — Hard mixed ([set](../03_Problems/set_06/README.md))

**Reflection checklist**

- [ ] I recognized "n ≤ 15–20" as a signal for exponential-in-n (bitmask) solutions.
- [ ] I explained why a simple sliding window fails with negative numbers.
- [ ] I wrote the DP state in words ("dp[i] = number of ways to split s from i") before coding.
- [ ] I reduced a big graph to a small table of distances between key points.
- [ ] I finished inside 160 minutes.

**Q1.** Why does *Shortest Burst* need a deque instead of the usual shrinking window?

<details><summary>Answer</summary>

With negative numbers, the window sum is not monotonic: shrinking from the left can **increase** the sum (when a
negative leaves), and extending to the right can decrease it. The two-pointer argument breaks. Prefix sums plus a
deque of increasing prefix values keep only starts that could still be the best, which restores O(n).

</details>

**Q2.** In *Compatible Assignment*, why is `popcount(mask)` enough to know which worker is next?

<details><summary>Answer</summary>

We assign workers in fixed order 0, 1, 2, … So after `c` jobs are used, exactly workers `0..c-1` have been
assigned, and the next worker is `c = popcount(mask)`. This removes the worker from the state and gives
2^n states instead of n·2^n.

</details>

**Q3.** *Courier All Stops* runs Dijkstra several times and then a bitmask DP. What is the total complexity, and
why is it better than trying every order?

<details><summary>Answer</summary>

`(s + 1)` Dijkstra runs cost `O((s + 1) · E log n)`. Held-Karp costs `O(2^s · s^2)`. Trying every order costs
`O(s! · s)`. For s = 12: 12! ≈ 4.8 · 10^8 orders versus 2^12 · 144 ≈ 5.9 · 10^5 DP steps. The DP merges every
order that visited the same set and ended at the same stop.

</details>

---

## Mastery checklist

- [ ] I can finish Set 06 within its time budget using at most one hint.
- [ ] For each of the 30 problems I can name the patterns in under one minute after reading it.
- [ ] I can write a seeded random brute-vs-optimal test from memory.
- [ ] I re-solved every missed problem after 3 days and after 1 week.
- [ ] I am ready for the [mock interviews](../../44_Mock_Interviews/README.md).
