function processHierarchy(data) {
  const invalidEntries = [];
  const duplicateEdges = [];

  const edgeSet = new Set();
  const childParent = {};
  const graph = {};
  const allNodes = new Set();

  function isValid(edge) {
    edge = edge.trim();

    const regex = /^[A-Z]->[A-Z]$/;

    if (!regex.test(edge)) return false;

    const [parent, child] = edge.split("->");

    if (parent === child) return false;

    return true;
  }

  for (let edge of data) {
    edge = edge.trim();

    if (!isValid(edge)) {
      invalidEntries.push(edge);
      continue;
    }

    const [parent, child] = edge.split("->");

    if (edgeSet.has(edge)) {
      if (!duplicateEdges.includes(edge)) {
        duplicateEdges.push(edge);
      }
      continue;
    }

    edgeSet.add(edge);

    if (childParent[child]) {
      continue;
    }

    childParent[child] = parent;

    if (!graph[parent]) graph[parent] = [];
    if (!graph[child]) graph[child] = [];

    graph[parent].push(child);

    allNodes.add(parent);
    allNodes.add(child);
  }

  const visited = new Set();
  const hierarchies = [];

  function getComponent(start) {
    const stack = [start];
    const component = new Set();

    while (stack.length) {
      const node = stack.pop();

      if (component.has(node)) continue;

      component.add(node);

      for (const child of graph[node] || []) {
        stack.push(child);
      }

      for (const parent in graph) {
        if (graph[parent].includes(node)) {
          stack.push(parent);
        }
      }
    }

    return component;
  }

  function detectCycle(node, component, visiting, visitedDFS) {
    if (visiting.has(node)) return true;

    if (visitedDFS.has(node)) return false;

    visiting.add(node);
    visitedDFS.add(node);

    for (const child of graph[node] || []) {
      if (component.has(child)) {
        if (
          detectCycle(
            child,
            component,
            visiting,
            visitedDFS
          )
        ) {
          return true;
        }
      }
    }

    visiting.delete(node);

    return false;
  }

  function buildTree(node) {
    const obj = {};

    for (const child of graph[node] || []) {
      obj[child] = buildTree(child);
    }

    return obj;
  }

  function calculateDepth(node) {
    if (
      !graph[node] ||
      graph[node].length === 0
    ) {
      return 1;
    }

    let maxDepth = 0;

    for (const child of graph[node]) {
      maxDepth = Math.max(
        maxDepth,
        calculateDepth(child)
      );
    }

    return 1 + maxDepth;
  }

  let totalTrees = 0;
  let totalCycles = 0;

  let largestTreeRoot = "";
  let largestDepth = 0;

  for (const node of allNodes) {
    if (visited.has(node)) continue;

    const component = getComponent(node);

    component.forEach((n) => visited.add(n));

    const childSet = new Set();

    component.forEach((n) => {
      for (const child of graph[n] || []) {
        childSet.add(child);
      }
    });

    let roots = [...component].filter(
      (n) => !childSet.has(n)
    );

    let root;

    if (roots.length > 0) {
      roots.sort();
      root = roots[0];
    } else {
      root = [...component].sort()[0];
    }

    const hasCycle = detectCycle(
      root,
      component,
      new Set(),
      new Set()
    );

    if (hasCycle) {
      totalCycles++;

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });

      continue;
    }

    totalTrees++;

    const treeObj = {};
    treeObj[root] = buildTree(root);

    const depth = calculateDepth(root);

    if (
      depth > largestDepth ||
      (depth === largestDepth &&
        (largestTreeRoot === "" ||
          root < largestTreeRoot))
    ) {
      largestDepth = depth;
      largestTreeRoot = root;
    }

    hierarchies.push({
      root,
      tree: treeObj,
      depth,
    });
  }

  return {
    user_id: "sargunpreet_27052005",
    email_id:
      "sargunpreet1043.be23@chitkara.edu.in",
    college_roll_number: "1043",
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary: {
      total_trees: totalTrees,
      total_cycles: totalCycles,
      largest_tree_root: largestTreeRoot,
    },
  };
}

module.exports = processHierarchy;