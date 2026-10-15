# How To Solve A Problem — Interview Questions

Questions about process and communication that interviewers judge as much as the code. Answer out loud, then open the model answer. Theory: [CONCEPTS.md](../01_Concepts/CONCEPTS.md).

### 1. What do you do in the first five minutes after hearing a problem?

<details><summary>Model answer</summary>

Restate it in my own words, confirm inputs, outputs and constraints (sizes, value ranges, duplicates, empty input, sorted or not), and work through one or two examples including an edge case. I do not start coding until we agree on what is being asked.

</details>

### 2. Why state a brute-force solution first?

<details><summary>Model answer</summary>

It proves I understand the problem, gives a correct baseline (and a reference for testing), and exposes the repeated work that the optimal solution removes. Stating its complexity also sets the target: "this is O(n²); can we do O(n)?"

</details>

### 3. What clarifying questions are almost always worth asking?

<details><summary>Model answer</summary>

Input size limits; value ranges (negatives? large numbers?); duplicates; is the input sorted; empty or single-element input; what to return when there is no answer; may I modify the input; is the output order important; any memory limit.

</details>

### 4. How do you find the right pattern for a new problem?

<details><summary>Model answer</summary>

Look for signals: sorted input → binary search or two pointers; contiguous subarray → sliding window or prefix sums; "have I seen this" → hash set; all combinations → backtracking; optimal value with overlapping choices → DP; shortest path in unweighted graph → BFS; top k → heap. Then check the constraints to confirm the complexity target.

</details>

### 5. What do you do when you are stuck?

<details><summary>Model answer</summary>

Say so calmly and keep thinking out loud: solve a smaller example by hand, look for what is repeated, try a simpler version of the problem, consider which data structure would make the slow step fast, or ask the interviewer whether the direction is reasonable. Silence is worse than a partially right idea.

</details>

### 6. How do you test your code without running it?

<details><summary>Model answer</summary>

Dry run line by line on a normal example and an edge case, tracking variables in a small table. Check loop bounds, off-by-one indices, empty input, single element, duplicates, negatives, and that every branch returns.

</details>

### 7. How much should you talk while coding?

<details><summary>Model answer</summary>

Enough that the interviewer can follow the plan: announce each block ("now I shrink the window while it is invalid"), explain non-obvious lines, and mention trade-offs. Do not narrate every keystroke, and pause to think when needed.

</details>

### 8. How do you present complexity at the end?

<details><summary>Model answer</summary>

State time and space with a reason ("O(n) time because each element enters and leaves the window once; O(k) space for the map"), compare with the brute force, and mention possible follow-ups or alternative trade-offs.

</details>

### 9. What do you do if you realise your approach is wrong halfway through coding?

<details><summary>Model answer</summary>

Stop, explain what fails with a concrete example, and decide with the interviewer whether to patch or restart. A clear correction shows good judgment; silently piling on special cases does not.

</details>

### 10. How should you name variables and structure code in an interview?

<details><summary>Model answer</summary>

Use descriptive names (`left`, `right`, `windowSum`, `seen`), small helper functions for repeated logic, early returns for edge cases, and no clever one-liners that hide bugs. Readable code is easier to dry run and to defend.

</details>

### 11. How do you practise so the process becomes automatic?

<details><summary>Model answer</summary>

Use the same template for every problem (understand, match, plan, implement, review, evaluate), time-box attempts, write the brute force and compare it with the optimal using random tests, keep a mistake log, and re-solve problems after a few days and a week.

</details>
