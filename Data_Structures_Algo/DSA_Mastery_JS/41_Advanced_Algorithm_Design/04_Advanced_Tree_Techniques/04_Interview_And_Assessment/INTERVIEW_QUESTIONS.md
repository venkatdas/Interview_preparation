# Advanced Tree Techniques — Interview Questions

> **Level: Advanced.** Questions 1–6 are the ones most likely to come up at top companies. Questions 7–13 are about techniques that are rare in interviews; answer them at the "explain the idea" level.

Try to answer out loud first, then open the model answer.

**1. How do you find the diameter of a tree in O(n), and why does it work?**

<details><summary>Model answer</summary>

BFS (or DFS) from any node to its farthest node a, then BFS from a; the largest distance is the
diameter. It works because the farthest node from any start is always an endpoint of some
longest path: if it were not, you could combine the route to it with part of a real diameter
and build a longer path, which is impossible. It only holds on trees with non-negative weights.

</details>

**2. What is the alternative one-pass DFS method for the diameter, and when do you prefer it?**

<details><summary>Model answer</summary>

Post-order: for each node keep the two largest child heights h1 >= h2; the longest path
bending at that node is h1 + h2 (+ edge lengths). The diameter is the max over all nodes. Prefer
it for binary trees (LeetCode 543), weighted edges, or when the path has an extra constraint
(like "adjacent characters differ", LeetCode 2246) that BFS cannot check.

</details>

**3. Why does Minimum Height Trees have at most two answers?**

<details><summary>Model answer</summary>

The height from a root r equals its distance to the farthest node, and the farthest node is
always an end of a diameter. So the height is minimised at the middle of a diameter. A path
with an even number of edges has one middle node, an odd number has two adjacent middles.

</details>

**4. Explain rerooting DP using Sum of Distances in Tree.**

<details><summary>Model answer</summary>

First pass from root 0 (post-order): subtree sizes count[v] and down[v] = sum of distances
into v's subtree, with down[p] += down[c] + count[c]. ans[0] = down[0]. Second pass
(pre-order): moving the root from p to child c brings count[c] nodes 1 closer and pushes
n - count[c] nodes 1 farther, so ans[c] = ans[p] - count[c] + (n - count[c]). Two O(n) passes.

</details>

**5. Rerooting gets harder when the combine is "max" instead of "sum". Why, and what do you do?**

<details><summary>Model answer</summary>

With sums you remove a child's contribution by subtracting. You cannot "subtract" from a max.
Keep the best and second-best child values per node (or prefix/suffix maxima over the children
list) so that "the best excluding child c" is available in O(1).

</details>

**6. Why should tree traversals in JavaScript usually be iterative in these problems?**

<details><summary>Model answer</summary>

Constraints allow path-shaped trees with 10^4–10^5 nodes. V8's call stack overflows around
10k frames of a typical recursive function, throwing RangeError. An explicit stack, or a BFS
order processed forwards (parents first) and backwards (children first), avoids it.

</details>

**7. What is an Euler tour and what does it buy you?**

<details><summary>Model answer</summary>

Number nodes in DFS preorder (tin). With tout = tin + size - 1, the subtree of v is exactly
the contiguous range tin[v]..tout[v]. Subtree queries become range queries, so a Fenwick or
segment tree gives O(log n) subtree sums with point updates, and "is u an ancestor of v" is
the O(1) check tin[u] <= tin[v] <= tout[u].

</details>

**8. When do you NOT need an Euler tour for subtree sums?**

<details><summary>Model answer</summary>

When values never change. One post-order pass stores sum[v] for every node and answers
every query in O(1). The tour + Fenwick only pays off with updates interleaved with queries.

</details>

**9. What is a centroid and why does centroid decomposition have O(log n) depth?**

<details><summary>Model answer</summary>

A centroid is a node whose removal leaves components of size at most n/2 (every tree has one
or two). Removing it and recursing on each piece means every piece is at most half of its
parent piece, so after log2(n) levels pieces have size 1. Each node therefore belongs to O(log n)
pieces, which bounds the total work.

</details>

**10. How does centroid decomposition count pairs of nodes at distance <= k?**

<details><summary>Model answer</summary>

Every path has exactly one centroid that was removed first among its nodes, and the path goes
through it. For each centroid c, collect distances from c to every node in its piece and count
pairs with d1 + d2 <= k (sort + two pointers). Pairs inside the same child piece do not truly
pass through c, so subtract the same count computed per child piece. Total O(n log^2 n).

</details>

**11. Explain heavy-light decomposition in two minutes.**

<details><summary>Model answer</summary>

Mark the edge to the child with the largest subtree as heavy. Heavy edges form chains. Going up
a light edge at least doubles the subtree size, so any root path uses O(log n) light edges,
hence O(log n) chains. Lay chains out contiguously in an array (pos[v]) and record head[v].
A path query repeatedly takes the endpoint whose chain head is deeper, queries the range
from the head to it, and jumps above the head; then finishes on the shared chain. With a
Fenwick or segment tree that is O(log^2 n) per query.

</details>

**12. Path sums: when is LCA + prefix sums enough, and when do you need HLD?**

<details><summary>Model answer</summary>

Without updates, pre[v] = sum of values from the root to v gives
sum(u, v) = pre[u] + pre[v] - 2 pre[lca] + val[lca] in O(log n) with binary lifting. With
point updates every pre[] in a subtree changes (you could fix that with Euler tour + range
add), and for path MAX or MIN there is no subtraction at all, so HLD with a segment tree is the
general tool.

</details>

**13. How do you test whether two unrooted trees are isomorphic?**

<details><summary>Model answer</summary>

Find the center(s) of each tree (at most 2). Root at a center and compute canonical ids
bottom-up: a node's id is looked up from the sorted list of its children's ids in a Map
shared by both trees. The trees are isomorphic when the root ids match for some center pairing.
Sorting makes child order irrelevant; the shared Map makes ids comparable. O(n log n).

</details>

**14. Number of Good Paths: why process values in increasing order?**

<details><summary>Model answer</summary>

A path is good for value x only if all its nodes are <= x. If we add edges in increasing order
of their larger endpoint, then when we handle value x the union-find components contain exactly
the nodes reachable through values <= x. Nodes of value x in the same component are pairwise
connected by good paths: c nodes give c(c+1)/2 paths including singles.

</details>
