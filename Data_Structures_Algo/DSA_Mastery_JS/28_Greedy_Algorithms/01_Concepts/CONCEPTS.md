# Greedy

A **greedy** algorithm builds the answer one step at a time, and at every step it takes the
choice that looks best **right now**, without ever going back to change its mind.
Think of paying for a coffee with the fewest coins: you grab the biggest coin that still fits,
then the next biggest, and so on. You never say "hmm, let me undo that quarter".
Greedy is fast and simple. The catch: it only gives the right answer for problems that have a
special structure, so the real skill is knowing **when** greedy is safe and **how to argue** it.

---

## Prerequisites (Essential)

- [Sorting](../../11_Sorting/README.md) - almost every greedy solution starts with "sort by the right key".
- [Heaps and Priority Queues](../../19_Heaps_And_Priority_Queues/README.md) - for "always take the current best" greedy.
- [Two Pointers](../../06_Two_Pointers/README.md) - pairing extremes (boats, cookies).
- Helpful but optional: [Dynamic Programming](../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md), so you know what to switch to when greedy breaks.

## Mental model (Essential)

Picture a hiker who can only see the next step. At every fork they take the path that looks
best right now and never walk back. On some mountains (the "greedy-friendly" ones) that always
reaches the top. On others it gets stuck on a small hill.

```
   problem with greedy structure          problem WITHOUT greedy structure
        peak                                   small hill      real peak
         /\                                       /\             /\
        /  \     every "best looking"             /  \    gap    /  \
       /    \    step leads up                   /    \_______ /    \
   ---/      \---                           ---/   ^ greedy stops here
```

Your job in an interview is to decide which kind of mountain you are on, and to prove it.

---

## Why it matters / when to use

Reach for greedy when the problem has any of these signals:

- "Minimum number of ...", "maximum number of ...", "fewest ...", "can you reach ..."
- You can **sort** the input and then make one pass, deciding each item once
- A local decision never hurts a future decision (taking the earliest-ending meeting leaves the
  most room for the next one)
- "Intervals", "scheduling", "assign", "pair up", "farthest reach", "fuel / gas"
- The input is huge (10^5+) and DP over all states would be too slow
- A DP solution exists but the "take the best option" choice is obviously always right

Greedy is also the first thing to **try and break**. If you can find a counter-example in
30 seconds, switch to DP (see [Dynamic Programming](../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md)).

---

## How it works

Two properties must hold for greedy to be correct:

1. **Greedy-choice property**: there is always an optimal solution that *contains* the greedy
   choice. Picking the locally best option never locks you out of the global best.
2. **Optimal substructure**: after making the greedy choice, what remains is a smaller
   instance of the same problem, and solving it optimally gives the overall optimum.

```
                 full problem
                     |
          make greedy choice  (never reconsidered)
                     |
             smaller problem of the same kind
                     |
          make greedy choice
                     |
                    ...
```

DP also needs optimal substructure, but DP *tries every choice* and keeps the best.
Greedy skips the trying because it has a proof that one choice is always safe.

### How to argue correctness (what interviewers want to hear)

**Exchange argument.** Take any optimal solution that does *not* use the greedy choice.
Swap one of its decisions for the greedy one and show the result is **no worse**. Repeat until
the optimal solution looks exactly like the greedy one. So greedy is optimal too.

> Interval scheduling: suppose the optimal set starts with a meeting that ends *later* than
> the greedy pick (earliest finish). Swap it for the greedy pick. It still fits (it ends
> earlier, so it cannot collide with the rest). Same count, now matches greedy. Repeat.

**"Greedy stays ahead".** Show by induction that after every step, greedy's partial answer is
at least as good as any other algorithm's partial answer. If it is never behind, it cannot
lose at the end.

> Jump Game II: after `k` jumps, greedy has reached the farthest index any strategy could
> reach with `k` jumps. So it needs no more jumps than anyone else.

### Greedy vs DP: when greedy fails

Coin change with coins `[1, 3, 4]` and amount `6`:

```
greedy: take 4 -> left 2 -> take 1 -> take 1   => 3 coins   (4 + 1 + 1)
optimal:                                         2 coins   (3 + 3)
```

Greedy picks the biggest coin, which is great for US coins (1, 5, 10, 25 - a "canonical"
system) but wrong for `[1, 3, 4]`. The greedy-choice property fails: choosing 4 locks you out
of the best answer. This is exactly where DP is needed. [`02_Implementations/greedy_classics.js`](../02_Implementations/greedy_classics.js) contains
`minCoinsCanonical` with a comment on when it is safe.

---

## Pseudocode (Essential)

```
GREEDY(items):
  sort items by KEY                 # the key is the whole trick (end time, ratio, size, ...)
  state <- initial state            # e.g. lastEnd = -infinity, fuel = 0, farthest = 0
  answer <- empty / 0
  for each item in sorted order:
    if item is compatible with state:      # the local "best" test
      take item; update answer and state
    else:
      skip item (or fix state, e.g. restart, count a removal)
  return answer
```

## Dry run: activity selection (Essential)

Input: `[[1,4],[3,5],[0,6],[5,7],[3,9],[5,9],[6,10],[8,11],[8,12],[2,14],[12,16]]`
(already sorted by end). Rule: take the interval if `start >= lastEnd`.

| Step | Interval | lastEnd before | start >= lastEnd? | Action | Chosen so far |
|------|----------|----------------|-------------------|--------|---------------|
| 1 | [1,4] | -inf | yes | take, lastEnd = 4 | [1,4] |
| 2 | [3,5] | 4 | no (3 < 4) | skip | [1,4] |
| 3 | [0,6] | 4 | no | skip | [1,4] |
| 4 | [5,7] | 4 | yes | take, lastEnd = 7 | [1,4] [5,7] |
| 5 | [3,9] | 7 | no | skip | same |
| 6 | [5,9] | 7 | no | skip | same |
| 7 | [6,10] | 7 | no | skip | same |
| 8 | [8,11] | 7 | yes | take, lastEnd = 11 | [1,4] [5,7] [8,11] |
| 9 | [8,12] | 11 | no | skip | same |
| 10 | [2,14] | 11 | no | skip | same |
| 11 | [12,16] | 11 | yes | take, lastEnd = 16 | [1,4] [5,7] [8,11] [12,16] |

Answer: 4 intervals. Each interval is looked at once after the sort, so O(n log n) total.

## Assumptions and limitations of each classic (Advanced)

| Algorithm | Assumes | Breaks when |
|-----------|---------|-------------|
| Activity selection (sort by end) | all intervals have equal value (we count them) | intervals have weights -> weighted interval scheduling needs DP + binary search |
| Fractional knapsack (sort by ratio) | items can be split into fractions; weights > 0 | items are all-or-nothing (0/1 knapsack) -> DP |
| Huffman coding | frequencies known in advance, binary prefix code, non-negative frequencies | frequencies change over time (adaptive Huffman), or you need a code with extra constraints (length-limited) |
| Biggest coin first | coin system is canonical (1/5/10/25, powers, each coin divides the next) | arbitrary coins like [1, 3, 4] -> DP |
| Farthest reach (jump game) | jump lengths are non-negative, cost per jump is 1 | jumps have different costs -> Dijkstra / DP |
| Gas station one pass | the route is a single circle, every station visited in order | you may choose which stations to stop at with limited tank -> heap greedy (refueling stops) |

---

## Operations & complexity

Greedy is a strategy, not a data structure, so the table lists the classic families:

| Family | Typical time | Space | Note |
|--------|--------------|-------|------|
| Sort then one pass | O(n log n) | O(1) / O(n) | intervals, cookies, boats, candy |
| Heap based | O(n log n) | O(n) | always grab the current best (Huffman, task scheduler) |
| Two-pointer | O(n log n) sort + O(n) | O(1) | pair smallest with largest (boats) |
| Farthest reach / scan | O(n) | O(1) | jump game, gas station, partition labels |
| Counting / math | O(n) | O(1) or O(k) | task scheduler formula, lemonade change |

---

## JavaScript implementation

Full code with tests: [`02_Implementations/greedy_classics.js`](../02_Implementations/greedy_classics.js). It contains:

- `activitySelection(intervals)` – max non-overlapping intervals (sort by end)
- `fractionalKnapsack(items, capacity)` – sort by value/weight, take whole items then a fraction
- `huffmanCodeLengths(freqs)` – merge two smallest, with a small inline min-heap
- `minCoinsCanonical(coins, amount)` – biggest coin first (only for canonical coin systems)

Core shape of almost every greedy solution:

```js
function greedy(items) {
  items.sort(byTheKeyThatMakesTheChoiceSafe); // often by end time / ratio / size
  let answer = 0;
  let state = initial;                          // e.g. lastEnd = -Infinity
  for (const item of items) {
    if (itemIsCompatibleWith(state)) {          // the local "best" test
      answer++;
      state = update(state, item);
    }
  }
  return answer;
}
```

---

## Patterns / variations

### 1. Activity selection / interval scheduling (sort by END)

```js
function maxNonOverlapping(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);   // earliest finish first
  let count = 0;
  let lastEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= lastEnd) { count++; lastEnd = end; }
  }
  return count;
}
```
Use when: "maximum number of non-overlapping ...", "minimum removals to make non-overlapping",
"minimum arrows / points to cover all intervals". Finishing early leaves the most room.

### 2. Sorting-based greedy (match smallest with smallest)

```js
function assignCookies(greed, sizes) {
  greed.sort((a, b) => a - b);
  sizes.sort((a, b) => a - b);
  let child = 0;
  for (const size of sizes) {
    if (child < greed.length && size >= greed[child]) child++; // smallest cookie that fits
  }
  return child;
}
```
Use when: assigning resources to requests, "maximum units", "how many can be satisfied".

### 3. Heap-based greedy (always take the current best)

```js
// Huffman: merge the two smallest frequencies until one tree remains
function huffmanCost(freqs) {
  const heap = new MinHeap(freqs);
  let cost = 0;
  while (heap.size() > 1) {
    const merged = heap.pop() + heap.pop();
    cost += merged;
    heap.push(merged);
  }
  return cost;
}
```
Use when: "repeatedly combine the two smallest/largest", "schedule the most frequent task",
"k largest ...". See [Heaps and Priority Queues](../../19_Heaps_And_Priority_Queues/README.md).

### 4. Two-pointer greedy (pair extremes)

```js
function boats(people, limit) {
  people.sort((a, b) => a - b);
  let light = 0, heavy = people.length - 1, count = 0;
  while (light <= heavy) {
    if (people[light] + people[heavy] <= limit) light++; // heaviest takes the lightest along
    heavy--;
    count++;
  }
  return count;
}
```
Use when: pairing items with a capacity limit, "two sum style" with sorted input.

### 5. Farthest reach (jump game)

```js
function canJump(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;           // this index is unreachable
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}
```
Use when: "can you reach the end", "minimum jumps", "video stitching", "partition labels"
(track the farthest last-occurrence).

### 6. Fractional knapsack (ratio greedy)

Sort items by `value / weight`. Take whole items while they fit, then a **fraction** of the
next one. Works because items are divisible. The 0/1 knapsack (no fractions) is NOT greedy -
it needs DP.

### 7. Gas station circuit argument

If total gas >= total cost, a solution exists. Scan once: whenever the running tank goes
negative, nothing between the previous start and here can be the start (they would all run
out at the same place), so restart from the next station.

### 8. Greedy with counting / math (task scheduler)

Sometimes greedy is a formula: `(maxFreq - 1) * (n + 1) + countOfMaxFreq`, then take
`max(formula, tasks.length)`.

---

## Alternatives (Essential)

| Approach | Time | When to prefer it |
|----------|------|-------------------|
| Brute force: try every subset / order | O(2^n) or O(n!) | tiny inputs; as a reference to test your greedy against |
| Dynamic programming | usually O(n^2) or O(n * W) | the greedy choice can be broken by a counter-example; you need the exact optimum |
| Greedy | usually O(n log n) | you can prove the greedy-choice property (exchange argument / stays ahead) |
| Greedy + heap | O(n log n) | the "best" item changes as you go (refueling stops, IPO, task scheduler) |
| Binary search on the answer + greedy check | O(n log range) | "minimise the maximum" questions where a greedy can only answer "is X feasible?" |

A great habit: write the brute force on tiny inputs and compare it with your greedy on random
cases (the test file for this topic does exactly that).

## When greedy does NOT apply (Essential)

- **Choices interact later.** Taking an item now changes what is worth taking later in a way
  you cannot see yet (0/1 knapsack, coin change with odd coins, longest increasing subsequence).
- **You need to count ways**, not find one best answer. Counting is DP territory.
- **Weighted versions** of a greedy-friendly problem: weighted interval scheduling,
  weighted job scheduling (LeetCode 1235) need DP.
- **You can build a counter-example in a minute.** If two or three small items break your rule,
  stop and switch to DP or search.
- **Edge cases change the rule.** If the sort key needs many special cases to work, the problem
  is probably not greedy.

---

## Common mistakes & edge cases

- Sorting by the **wrong key**. Interval scheduling needs sort by *end*, not start. Try a
  2-3 interval counter-example before committing.
- Assuming greedy is correct because it "feels right". Always try to break it with a tiny
  example (`[1, 3, 4]` coins, amount 6).
- Forgetting the global feasibility check (gas station: `totalGas < totalCost` -> `-1`).
- Off-by-one on "touching" intervals: is `[1, 2]` overlapping `[2, 3]`? Depends on the problem
  (arrows: yes, non-overlapping intervals: no).
- JavaScript `sort()` without a comparator sorts **lexicographically** (`[10, 9, 1]` ->
  `[1, 10, 9]`). Always pass `(a, b) => a - b`.
- Modifying the input array with `sort()` when the caller still needs the original order.
- Candy-style problems: one pass is not enough; do a left pass and a right pass.

---

## Interview tips

- Say the choice out loud: "At each step I take the X that is smallest / ends earliest,
  because ...". Then give the one-line exchange argument.
- Mention you tried to break it: "I checked a small case where greedy could fail and it
  holds because ...". Interviewers love seeing you *doubt* greedy before trusting it.
- If you cannot argue it, say so and pivot to DP. A correct O(n^2) DP beats a wrong O(n) greedy.
- Always state the sort cost: most greedy solutions are O(n log n) because of sorting.
- Know the famous ones cold: Jump Game, Gas Station, Non-overlapping Intervals, Task Scheduler,
  Partition Labels, Candy.

---

## Problems in this folder

| # | Problem | Difficulty | Pattern | File |
|---|---------|------------|---------|------|
| 01 | Assign Cookies | Easy | sort + two pointers | 03_Problems/solutions/01_assign_cookies.js |
| 02 | Lemonade Change | Easy | counting greedy | 03_Problems/solutions/02_lemonade_change.js |
| 03 | Maximum Units on a Truck | Easy | sort by value | 03_Problems/solutions/03_maximum_units_on_truck.js |
| 04 | Best Time to Buy and Sell Stock II | Medium | take every rise | 03_Problems/solutions/04_best_time_to_buy_and_sell_stock_ii.js |
| 05 | Jump Game | Medium | farthest reach | 03_Problems/solutions/05_jump_game.js |
| 06 | Jump Game II | Medium | farthest reach (BFS levels) | 03_Problems/solutions/06_jump_game_ii.js |
| 07 | Gas Station | Medium | circuit argument | 03_Problems/solutions/07_gas_station.js |
| 08 | Boats to Save People | Medium | two-pointer greedy | 03_Problems/solutions/08_boats_to_save_people.js |
| 09 | Partition Labels | Medium | farthest last occurrence | 03_Problems/solutions/09_partition_labels.js |
| 10 | Non-overlapping Intervals | Medium | interval scheduling | 03_Problems/solutions/10_non_overlapping_intervals.js |
| 11 | Minimum Number of Arrows to Burst Balloons | Medium | interval scheduling | 03_Problems/solutions/11_minimum_arrows_burst_balloons.js |
| 12 | Hand of Straights | Medium | sorted map greedy | 03_Problems/solutions/12_hand_of_straights.js |
| 13 | Merge Triplets to Form Target | Medium | filter then check | 03_Problems/solutions/13_merge_triplets.js |
| 14 | Valid Parenthesis String | Medium | greedy min/max range | 03_Problems/solutions/14_valid_parenthesis_string.js |
| 15 | Task Scheduler | Medium | greedy math / heap | 03_Problems/solutions/15_task_scheduler.js |
| 16 | Queue Reconstruction by Height | Medium | sort + insert | 03_Problems/solutions/16_queue_reconstruction_by_height.js |
| 17 | Minimum Deletions to Make Character Frequencies Unique | Medium | sort + decrement | 03_Problems/solutions/17_min_deletions_unique_frequencies.js |
| 18 | Candy | Hard | two-pass greedy | 03_Problems/solutions/18_candy.js |

---

## Practice more

Easy: Array Partition I (561), Can Place Flowers (605), Largest Perimeter Triangle (976),
Maximum 69 Number (1323), Minimum Cost to Move Chips (1217)

Medium: Minimum Number of Platforms style - Meeting Rooms II (253), Two City Scheduling (1029),
Reorganize String (767), Bag of Tokens (948), Minimum Add to Make Parentheses Valid (921),
Remove K Digits (402), Wiggle Subsequence (376), Monotone Increasing Digits (738),
Reduce Array Size to the Half (1338), Maximum Score From Removing Stones (1753),
Furthest Building You Can Reach (1642), Video Stitching (1024)

Hard: Minimum Number of Refueling Stops (871), IPO (502), Course Schedule III (630),
Create Maximum Number (321), Patching Array (330)
