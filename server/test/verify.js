/**
 * Quick verification script — runs the example from the spec
 * and prints the result. Not a formal test suite, just a sanity check.
 */
const { processData } = require("../src/utils/processor");

const input = [
  "A->B",
  "A->C",
  "B->D",
  "C->E",
  "E->F",
  "X->Y",
  "Y->Z",
  "Z->X",
  "P->Q",
  "Q->R",
  "G->H",
  "G->H",
  "G->I",
  "hello",
  "1->2",
  "A->",
];

const result = processData(input);
console.log(JSON.stringify(result, null, 2));

// Assertions
const assert = (condition, msg) => {
  if (!condition) {
    console.error("FAIL:", msg);
    process.exit(1);
  } else {
    console.log("PASS:", msg);
  }
};

assert(result.invalidEntries.includes("hello"), "hello is invalid");
assert(result.invalidEntries.includes("1->2"), "1->2 is invalid");
assert(result.invalidEntries.includes("A->"), "A-> is invalid");
assert(result.duplicateEdges.includes("G->H"), "G->H is duplicate");
assert(result.duplicateEdges.length === 1, "Only one duplicate");

const roots = result.hierarchies.map((h) => h.root);
assert(roots.includes("A"), "Tree A exists");
assert(roots.includes("X"), "Cycle X exists");
assert(roots.includes("P"), "Tree P exists");
assert(roots.includes("G"), "Tree G exists");

const treeA = result.hierarchies.find((h) => h.root === "A");
assert(treeA && treeA.depth === 4, "Tree A depth is 4");
assert(!treeA.has_cycle, "Tree A has no cycle");

const cycleX = result.hierarchies.find((h) => h.root === "X");
assert(cycleX && cycleX.has_cycle === true, "X is a cycle");
assert(
  JSON.stringify(cycleX.tree) === "{}",
  "Cycle X tree is empty"
);

const treeP = result.hierarchies.find((h) => h.root === "P");
assert(treeP && treeP.depth === 3, "Tree P depth is 3");

const treeG = result.hierarchies.find((h) => h.root === "G");
assert(treeG && treeG.depth === 2, "Tree G depth is 2");

assert(result.summary.total_trees === 3, "3 valid trees");
assert(result.summary.total_cycles === 1, "1 cycle");
assert(result.summary.largest_tree_root === "A", "Largest tree root is A");

console.log("\nAll assertions passed!");
