/**
 * Core processing logic for the BFHL challenge.
 * Handles validation, deduplication, tree construction,
 * cycle detection, depth calculation, and summary generation.
 */

// Regex: exactly one uppercase letter, "->", exactly one uppercase letter
const VALID_EDGE_REGEX = /^[A-Z]->[A-Z]$/;

/**
 * Validates and categorises each entry in the input array.
 * Returns { validEdges, invalidEntries, duplicateEdges }
 */
function parseEntries(data) {
  const validEdges = [];
  const invalidEntries = [];
  const duplicateEdges = [];

  // Track which edges we've already accepted (first-occurrence wins)
  const seenEdges = new Set();

  for (const raw of data) {
    // Trim whitespace first, then validate
    const entry = typeof raw === "string" ? raw.trim() : String(raw).trim();

    if (!VALID_EDGE_REGEX.test(entry)) {
      invalidEntries.push(entry);
      continue;
    }

    // Self-loop check (A->A)
    const [parent, child] = entry.split("->");
    if (parent === child) {
      invalidEntries.push(entry);
      continue;
    }

    if (seenEdges.has(entry)) {
      // Only push to duplicate_edges once, no matter how many repeats
      if (!duplicateEdges.includes(entry)) {
        duplicateEdges.push(entry);
      }
    } else {
      seenEdges.add(entry);
      validEdges.push({ parent, child, raw: entry });
    }
  }

  return { validEdges, invalidEntries, duplicateEdges };
}

/**
 * Builds an adjacency list and tracks parent counts.
 * Handles the diamond / multi-parent case: first-encountered parent wins.
 */
function buildGraph(validEdges) {
  // adjacency: parent -> [children]
  const adjacency = {};
  // childParent: child -> parent (first parent wins)
  const childParent = {};
  // all nodes
  const allNodes = new Set();

  for (const { parent, child } of validEdges) {
    allNodes.add(parent);
    allNodes.add(child);

    // Multi-parent: if child already has a parent, silently discard this edge
    if (childParent.hasOwnProperty(child)) {
      continue;
    }

    childParent[child] = parent;

    if (!adjacency[parent]) adjacency[parent] = [];
    adjacency[parent].push(child);
  }

  return { adjacency, childParent, allNodes };
}

/**
 * Finds connected components using Union-Find.
 * Returns an array of Sets, each containing the nodes of one component.
 */
function findComponents(allNodes, adjacency, childParent) {
  const parent = {};

  function find(x) {
    if (parent[x] === undefined) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }

  function union(a, b) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  // Union all edges
  for (const [p, children] of Object.entries(adjacency)) {
    for (const c of children) {
      union(p, c);
    }
  }

  // Also union via childParent to catch any isolated nodes
  for (const node of allNodes) {
    find(node); // ensure initialised
  }

  // Group nodes by root representative
  const groups = {};
  for (const node of allNodes) {
    const rep = find(node);
    if (!groups[rep]) groups[rep] = new Set();
    groups[rep].add(node);
  }

  return Object.values(groups);
}

/**
 * Detects whether a component contains a cycle using DFS.
 */
function hasCycle(nodes, adjacency) {
  const visited = new Set();
  const inStack = new Set();

  function dfs(node) {
    visited.add(node);
    inStack.add(node);

    for (const neighbour of adjacency[node] || []) {
      if (!visited.has(neighbour)) {
        if (dfs(neighbour)) return true;
      } else if (inStack.has(neighbour)) {
        return true;
      }
    }

    inStack.delete(node);
    return false;
  }

  for (const node of nodes) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

/**
 * Recursively builds the nested tree object starting from `node`.
 */
function buildTree(node, adjacency) {
  const children = adjacency[node] || [];
  const subtree = {};
  for (const child of children) {
    subtree[child] = buildTree(child, adjacency);
  }
  return subtree;
}

/**
 * Calculates the depth (longest root-to-leaf node count) of a tree.
 */
function calcDepth(node, adjacency) {
  const children = adjacency[node] || [];
  if (children.length === 0) return 1;
  return 1 + Math.max(...children.map((c) => calcDepth(c, adjacency)));
}

/**
 * Determines the root of a component.
 * Root = node that never appears as a child.
 * If all nodes appear as children (pure cycle), use lexicographically smallest.
 */
function findRoot(nodes, childParent) {
  const candidates = [...nodes].filter((n) => !childParent.hasOwnProperty(n));

  if (candidates.length > 0) {
    // Sort lexicographically and return the first (handles multiple roots edge case)
    return candidates.sort()[0];
  }

  // Pure cycle — use lexicographically smallest node
  return [...nodes].sort()[0];
}

/**
 * Main entry point: processes the raw data array and returns the full response object.
 */
function processData(data) {
  const { validEdges, invalidEntries, duplicateEdges } = parseEntries(data);
  const { adjacency, childParent, allNodes } = buildGraph(validEdges);

  const hierarchies = [];
  let totalTrees = 0;
  let totalCycles = 0;
  let largestDepth = -1;
  let largestRoot = null;

  if (allNodes.size > 0) {
    const components = findComponents(allNodes, adjacency, childParent);

    for (const componentSet of components) {
      const cyclic = hasCycle(componentSet, adjacency);
      const root = findRoot(componentSet, childParent);

      if (cyclic) {
        totalCycles++;
        hierarchies.push({
          root,
          tree: {},
          has_cycle: true,
        });
      } else {
        const tree = { [root]: buildTree(root, adjacency) };
        const depth = calcDepth(root, adjacency);
        totalTrees++;

        hierarchies.push({
          root,
          tree,
          depth,
        });

        // Track largest tree for summary
        if (
          depth > largestDepth ||
          (depth === largestDepth && root < largestRoot)
        ) {
          largestDepth = depth;
          largestRoot = root;
        }
      }
    }

    // Sort hierarchies: non-cyclic first (by root), then cyclic (by root)
    hierarchies.sort((a, b) => {
      if (a.has_cycle && !b.has_cycle) return 1;
      if (!a.has_cycle && b.has_cycle) return -1;
      return a.root.localeCompare(b.root);
    });
  }

  return {
    invalidEntries,
    duplicateEdges,
    hierarchies,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestRoot,
    },
  };
}

module.exports = { processData };
