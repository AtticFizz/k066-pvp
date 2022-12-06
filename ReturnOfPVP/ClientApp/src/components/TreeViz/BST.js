import { Controller } from "react-spring";
import AnimationsQueue from "../../api/AnimationsQueue";

// Properties
const MAX_VALUE = 99;
const MAX_NODES = 10;
const RADIUS = 32;
const DRAW_DELAY = 50;
const Y_PAD = 96;

// Animation constants
const NODE_INITIAL = { scale: 0, hlScale: 0 };
const NODE_END = { scale: 1, hlScale: 0 };
const NODE_HIGHLIGHT = { scale: 1, hlScale: 1 };
const LINE_INITIAL = { size: [0, 1], hlSize: [0, 0] };
const LINE_END = { size: [1, 1], hlSize: [0, 0] };
const LINE_HIGHLIGHT = { size: [1, 1], hlSize: [1, 5] };
const LINE_HIGHLIGHT_END = {
  size: [1, 1],
  hlSize: [1, 2],
};

const treeReducer = (draft, action) => {
  switch (action.type) {
    case "CLEAR":
      draft.root = {};
      draft.animQueue = [];
      break;
    case "CLEAR_QUEUE":
      draft.animQueue = [];
      break;
    case "CREATE":
      draft.animQueue = [];
      draft.animDelay = DRAW_DELAY;
      draft.root = BST.createTree({}, action.payload.count, draft.animQueue);
      updatePositions(
        draft.root,
        RADIUS,
        Y_PAD,
        action.payload.width - RADIUS * 2
      );
      clearHighlights(draft.root, draft.animQueue);
      break;
    case "SEARCH":
      draft.animDelay = -1;
      draft.animQueue = [];
      searchAnimated(draft.root, draft.animQueue, action.payload);
      clearHighlights(draft.root, draft.animQueue);
      break;
    case "INSERT":
      draft.animDelay = -1;
      draft.animQueue = [];
      let root = insertAnimated(
        draft.root,
        draft.animQueue,
        newNode({
          value: action.payload.value,
          line: Object.keys(draft.root).length > 0 ? newLine({}) : undefined,
        })
      );
      if (Object.keys(draft.root).length <= 0) draft.root = root;

      clearHighlights(draft.root, draft.animQueue);

      updatePositions(
        draft.root,
        RADIUS,
        Y_PAD,
        action.payload.width - RADIUS * 2
      );

      break;
    case "REMOVE":
      draft.animQueue = [];
      draft.animDelay = -1;
      const foundNode = searchAnimated(
        draft.root,
        draft.animQueue,
        action.payload.value
      );
      if (!foundNode) {
        clearHighlights(draft.root, draft.animQueue);
        break;
      }

      const lines = [];
      foundNode.line && lines.push(foundNode.line.animation);
      foundNode.left && lines.push(foundNode.left.line.animation);
      foundNode.right && lines.push(foundNode.right.line.animation);
      const anims = new Array(lines.length).fill(LINE_INITIAL);
      lines.push(foundNode.animation);
      anims.push({ scale: 0, hlScale: 0 });

      AnimationsQueue.push(draft.animQueue, lines, anims);

      const removeNodeValue = foundNode.value;

      AnimationsQueue.pushFunc(draft.animQueue, () => {
        action.payload.dispatch({
          type: "_REMOVE",
          payload: { value: removeNodeValue, width: action.payload.width },
        });
        return [];
      });
      clearHighlights(draft.root, draft.animQueue);
      break;
    case "_REMOVE":
      draft.animQueue = [];
      draft.root =
        remove(draft.root, action.payload.value, draft.animQueue) ?? {};

      updatePositions(
        draft.root,
        RADIUS,
        Y_PAD,
        action.payload.width - RADIUS * 2
      );

      break;
    case "UPDATE_POS":
      updatePositions(draft.root, RADIUS, Y_PAD, action.payload - RADIUS * 2);
      break;
    case "SELECT_NODE":
      draft.animQueue = [];
      let selected = undefined;
      if (Object.keys(draft.root) <= 0) {
        break;
      }
      bfs(draft.root, (nodes) => {
        nodes.forEach((n) => {
          const n_x = action.payload.x;
          const n_y = action.payload.y;
          const x = n.position.springs.x.get();
          const y = n.position.springs.y.get();
          const distance = Math.sqrt((x - n_x) ** 2 + (y - n_y) ** 2);
          if (distance <= RADIUS && (!n.left || !n.right)) {
            selected = n;
            return;
          }
        });
      });
      if (!selected) {
        break;
      }
      if (!draft.selected) {
        draft.selected = selected;
        AnimationsQueue.push(
          draft.animQueue,
          selected.animation,
          NODE_HIGHLIGHT
        );
      } else if (selected.value === draft.selected.value) {
        draft.selected = undefined;
        AnimationsQueue.push(draft.animQueue, selected.animation, NODE_END);
      } else {
        AnimationsQueue.push(
          draft.animQueue,
          [selected.animation, draft.selected.animation],
          [NODE_HIGHLIGHT, NODE_END]
        );
        draft.selected = selected;
      }
      break;
    case "REMOVE_NODE":
      console.log(draft.selected.value);
      // const parentNode = searchNodeParent(draft.root, draft.selected.value);
      let parentNode = undefined;
      bfs(draft.root, (nodes) => {
        nodes.forEach((n) => {
          if (n.left && n.left.value === draft.selected.value) {
            parentNode = n;
            return;
          } else if (n.right && n.right.value === draft.selected.value) {
            parentNode = n;
            return;
          }
        });
      });
      if (!parentNode) {
        draft.root = {};
        draft.selected = undefined;
        break;
      }
      if (parentNode.left && parentNode.left.value === draft.selected.value) {
        parentNode.left = undefined;
      } else if (
        parentNode.right &&
        parentNode.right.value === draft.selected.value
      ) {
        parentNode.right = undefined;
      }
      draft.selected = undefined;
      break;
    case "ADD_NODE":
      let node = search(draft.root, draft.selected.value);
      const nNode = newNode({
        value: action.payload.value,
        line: newLine({}),
      });
      if (action.payload.type === "LEFT") {
        node.left = nNode;
      } else if (action.payload.type === "RIGHT") {
        node.right = nNode;
      }
      updatePositions(
        draft.root,
        RADIUS,
        Y_PAD,
        action.payload.width - RADIUS * 2
      );
      AnimationsQueue.push(
        draft.animQueue,
        [nNode.animation, node.animation, nNode.line.animation],
        [NODE_END, NODE_END, LINE_END]
      );
      draft.selected = undefined;
      break;
    default:
      throw new Error();
  }
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function newNode({
  value,
  left = undefined,
  right = undefined,
  animation = NODE_INITIAL,
  line = undefined,
}) {
  return {
    value,
    left,
    right,
    position: new Controller(),
    animation: new Controller(animation),
    line,
  };
}

function newLine({ animation = LINE_INITIAL }) {
  return { animation: new Controller(animation) };
}

function updatePositions(root, x, y, width) {
  if (!root || Object.keys(root).length <= 0) {
    return;
  }

  root.position.start({ x: width / 2 + x, y });

  updatePositions(root.left, x, y + Y_PAD, width / 2, root.x, root.y);
  updatePositions(
    root.right,
    width / 2 + x,
    y + Y_PAD,
    width / 2,
    root.x,
    root.y
  );
}

function clearHighlights(root, animQueue) {
  const { nodes, lines } = getControllers(root);

  AnimationsQueue.push(animQueue, [nodes, lines], [NODE_END, LINE_END]);
}

function swapNodes(node1, node2) {}

function searchAnimated(root, animQueue, value) {
  if (!root || Object.keys(root).length <= 0) {
    return undefined;
  }

  if (root.line) {
    AnimationsQueue.push(animQueue, root.line.animation, LINE_HIGHLIGHT);
    AnimationsQueue.push(
      animQueue,
      [root.line.animation, root.animation],
      [LINE_HIGHLIGHT_END, NODE_HIGHLIGHT]
    );
  } else {
    AnimationsQueue.push(animQueue, root.animation, NODE_HIGHLIGHT);
  }

  if (value < root.value) {
    return searchAnimated(root.left, animQueue, value);
  } else if (value > root.value) {
    return searchAnimated(root.right, animQueue, value);
  } else {
    return root;
  }
}

function search(root, value) {
  if (!root || Object.keys(root).length <= 0) {
    return undefined;
  }

  if (value < root.value) {
    return search(root.left, value);
  } else if (value > root.value) {
    return search(root.right, value);
  } else {
    return root;
  }
}

function searchNodeParent(root, value) {
  if (!root || Object.keys(root).length <= 0) {
    return undefined;
  }
  console.log(`lul:${root.value}`);

  if (root.left && root.left.value === value) return root;
  if (root.right && root.right.value === value) return root;

  if (value < root.value) {
    return searchNodeParent(root.left, value);
  } else if (value > root.value) {
    return searchNodeParent(root.right, value);
  }
}

function insertAnimated(root, animQueue, newNode) {
  if (!root || Object.keys(root).length <= 0) {
    if (newNode.line) {
      AnimationsQueue.push(animQueue, newNode.line.animation, LINE_HIGHLIGHT);
      AnimationsQueue.push(
        animQueue,
        [newNode.line.animation, newNode.animation],
        [LINE_HIGHLIGHT_END, NODE_HIGHLIGHT]
      );
    } else {
      AnimationsQueue.push(animQueue, newNode.animation, NODE_HIGHLIGHT);
    }

    return newNode;
  }

  if (root.line) {
    AnimationsQueue.push(animQueue, root.line.animation, LINE_HIGHLIGHT);
    AnimationsQueue.push(
      animQueue,
      [root.line.animation, root.animation],
      [LINE_HIGHLIGHT_END, NODE_HIGHLIGHT]
    );
  } else {
    AnimationsQueue.push(animQueue, root.animation, NODE_HIGHLIGHT);
  }

  let value = newNode.value;

  if (value < root.value) {
    root.left = insertAnimated(root.left, animQueue, newNode);
  } else if (value > root.value) {
    root.right = insertAnimated(root.right, animQueue, newNode);
  }
  return root;
}

function insert(root, newNode) {
  if (!root || Object.keys(root).length <= 0) {
    return newNode;
  }
  let value = newNode.value;

  if (value < root.value) {
    root.left = insert(root.left, newNode);
  } else if (value > root.value) {
    root.right = insert(root.right, newNode);
  }
  return root;
}

const createTree = (root, count, animQueue) => {
  let inserted = [];

  let tries = 0;
  while (count > 0) {
    if (tries > 100) {
      throw new Error("No more possible unique values.");
    }

    const value = getRandomInt(MAX_VALUE);
    if (!inserted.includes(value)) {
      root = insert(
        root,
        newNode({
          value,
          line: inserted.length === 0 ? undefined : newLine({}), // line is undefined for first node
        })
      );
      inserted.push(value);
      count--;
    }
    tries++;
  }

  bfs(root, (nodesQueue) => {
    // skip first node as it doesn't have a line to animate
    if (nodesQueue[0].line !== undefined)
      AnimationsQueue.push(
        animQueue,
        [nodesQueue.map((node) => node.line.animation)],
        LINE_END
      );

    if (Object.keys(nodesQueue[0]).length > 0)
      AnimationsQueue.push(
        animQueue,
        [nodesQueue.map((node) => node.animation)],
        NODE_END
      );
  });
  return root;
};

function bfs(root, pushAnims) {
  let queue = [root];
  while (queue.length) {
    let len = queue.length;

    pushAnims(queue);

    for (let i = 0; i < len; i++) {
      let node = queue.shift();

      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }
}

// https://www.scriptonitejs.com/javascript-binary-search-trees/
function remove(root, value) {
  /*
  First we find out if the node exists. If it doesn't exist, we return null and exit the function
  */
  if (!root || Object.keys(root).length <= 0) {
    return undefined;
  }

  //find the node in question
  var currentNode = search(root, value);
  //find nodes parent.
  var nodeParent = searchNodeParent(root, value);

  if (!currentNode || Object.keys(currentNode).length <= 0) {
    return root;
  }

  //case 1: remove a node that does not have a right child.
  if (!currentNode.right || Object.keys(currentNode.right).length <= 0) {
    if (!nodeParent || Object.keys(nodeParent).length <= 0) {
      root = currentNode.left;
    } else {
      //if parent is greater than current value, make the current left child a child of parent
      if (currentNode.value < nodeParent.value) {
        nodeParent.left = currentNode.left;
        //if parent is less than current value, make the left child a right child of parent.
      } else if (currentNode.value > nodeParent.value) {
        nodeParent.right = currentNode.left;
      }
    }
    //case 2. if the node we are removing has a right child which doesnt have a left child
  } else if (
    !currentNode.right.left ||
    Object.keys(currentNode.right.left).length <= 0
  ) {
    currentNode.right.left = currentNode.left;
    if (!nodeParent || Object.keys(nodeParent).length <= 0) {
      root = currentNode.right;
    } else {
      //if current value is less than parent, make right child of the left the parent
      if (currentNode.value < nodeParent.value) {
        nodeParent.left = currentNode.right;
        //if current value is greater than parent, make current right child a right child of the parent
      } else if (currentNode.value > nodeParent.value) {
        nodeParent.right = currentNode.right;
      }
    }
    //case 3 if the node we are removing has a right child that has a left child.
    //promote the left child to deleted spot
  } else {
    //find the rights left most child
    var leftmost = currentNode.right.left;
    var leftmostParent = currentNode.right;

    while (leftmost && leftmost.left) {
      leftmostParent = leftmost;
      leftmost = leftmost.left;
    }
    //parents left subtree becomes the leftmost's right subtree
    leftmostParent.left = leftmost.right;
    //assign leftmost's left and right to the current left and right children
    leftmost.left = currentNode.left;
    leftmost.right = currentNode.right;

    if (!nodeParent || Object.keys(nodeParent).length <= 0) {
      root = leftmost;
    } else {
      if (currentNode.value < nodeParent.value) {
        nodeParent.left = leftmost;
      } else if (currentNode.value > nodeParent.value) {
        nodeParent.right = leftmost;
      }
    }
  }

  return root;
}

function getControllers(root) {
  let controllers = { nodes: [], lines: [] };
  bfs(root, (nodes) => {
    nodes.forEach((n) => {
      n.line && controllers.lines.push(n.line.animation);
      n.animation && controllers.nodes.push(n.animation);
    });
  });
  return controllers;
}

const BST = {
  MAX_VALUE,
  MAX_NODES,
  RADIUS,
  getRandomInt,
  createTree,
  insert,
  treeReducer,
};

export default BST;
