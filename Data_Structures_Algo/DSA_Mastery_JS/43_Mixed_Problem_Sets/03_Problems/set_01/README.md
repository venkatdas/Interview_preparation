# Mixed Set 01 — Easy fundamentals

Warm-up set. Every problem is short, but each one needs two ideas working together. The goal is to notice the second idea quickly.

| | |
|---|---|
| **Level** | Easy → Medium |
| **Suggested total time** | 90 minutes (sum of time boxes: 85 min, plus review) |
| **Previous set** | none — this is the first set |
| **Next** | [Set 02](../set_02/README.md) |

## Stages this set assumes

You should have finished these topics (sets are cumulative, so everything from earlier sets is fair game too):

- [Arrays](../../../03_Arrays/README.md)
- [Strings](../../../04_Strings/README.md)
- [Hashing](../../../05_Hashing/README.md)
- [Two Pointers](../../../06_Two_Pointers/README.md)
- [Sliding Window](../../../07_Sliding_Window/README.md)
- [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md)

## How to run this set

1. Do it in **one sitting** with a timer. Problems are in rough order of difficulty, but you may pick the order.
2. For each problem: read it, say the brute force out loud, then look for the second idea. **The topic is not written on the page on purpose.**
3. When a problem's time box ends, open Hint 1 (it names the patterns). Then give yourself 10 more minutes before the next hint.
4. Run your code against the examples. Only then open the solution file.
5. After the set, answer the reflection checklist and the 3 conceptual questions for this set in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).

Scoring guide: 5/5 solved inside the time boxes without hints = ready for the next set. 3–4 = redo the missed ones in 3 days. 0–2 = go back to the topics in the list above first.

## Problems

| # | Problem | Difficulty | Time box | Statement | Solution |
|---|---------|------------|----------|-----------|----------|
| 01 | [Unique Streak Max Sum](01_unique_streak_max_sum.md) | Easy | 15 min | [statement](01_unique_streak_max_sum.md) | [solution](solutions/01_unique_streak_max_sum.js) |
| 02 | [Balanced L/R Substrings](02_balanced_lr_substrings.md) | Easy | 15 min | [statement](02_balanced_lr_substrings.md) | [solution](solutions/02_balanced_lr_substrings.js) |
| 03 | [Anagram Pair Count](03_anagram_pair_count.md) | Easy | 15 min | [statement](03_anagram_pair_count.md) | [solution](solutions/03_anagram_pair_count.js) |
| 04 | [Longest Quiet Gap](04_longest_quiet_gap.md) | Easy | 15 min | [statement](04_longest_quiet_gap.md) | [solution](solutions/04_longest_quiet_gap.js) |
| 05 | [Bonus Leader](05_bonus_leader.md) | Medium | 25 min | [statement](05_bonus_leader.md) | [solution](solutions/05_bonus_leader.js) |

Run all solutions of this set:

```
for f in solutions/*.js; do node "$f"; done
```
