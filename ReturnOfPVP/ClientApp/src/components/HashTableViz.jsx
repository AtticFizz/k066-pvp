import { Graphics, Stage, Container, Text } from "@inlet/react-pixi/animated";
import { animated, Controller } from "react-spring";
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Input,
  Button,
} from "reactstrap";
import { useCallback, useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useImmerReducer } from "use-immer";

import AnimationsQueue from "../api/AnimationsQueue";
import useTaskQueue from "../hooks/useTaskQueue";

// https://localhost:44429

const CONFIG = { mass: 1, tension: 120, friction: 14 };
const INIT_POS = { x: 0, y: 1000 };
const INIT_CONFIG = {
  scale: 1,
  alpha: 1,
  alphaCorrect: 0,
  alphaIncorrect: 0,
  alphaText: 1,
  config: CONFIG,
};
const INIT_SPAWN = { ...INIT_POS, ...INIT_CONFIG };

const DELAY = 270;

const BASE_POSITION = { x: 490, y: 60 };
const NODE_SIZE = { width: 100, height: 100 };
const NODE_OFFSET = { x: NODE_SIZE.width / 2, y: NODE_SIZE.height / 2 };
const SPACING = 10;
const SEARCH_OFFSET = 60;
const DOWN = 100;

const COLUMNS = 5;
const ROWS = 7;
const VALUE_MIN = -999;
const VALUE_MAX = 999;
const MIN_LENGTH = 1;

const FILL_NODE = 0x6699ff;
const FILL_NODE_CORRECT = 0x00b212;
const FILL_NODE_INCORRECT = 0x9b0000;
const FILL_TEXT = 0x000000;
const FILL_LINK = 0x000000;

const PANEL_POSITION = { x: 10, y: 60 };
const PANEL_LINE_SPACING = 26;
const PANEL_FONT_SIZE = 15;
const PANEL_LINES = 6;
const PANEL_WIDTH = 465;
const PANEL_HEIGHT = 200;

function VizControlPanel(props) {
  const { hashTable, dispatch, isProcessing, ...rest } = props;

  const [maxSize, setMaxSize] = useState(MIN_LENGTH);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [valueAdd, setValueAdd] = useState("");
  const [valueRemove, setValueRemove] = useState("");
  const [valueSearch, setValueSearch] = useState("");

  return (
    <div {...rest}>
      <UncontrolledDropdown className="mt-1" direction="end">
        <DropdownToggle caret className="w-100 text-light">
          {"Sukurti"}
        </DropdownToggle>
        <DropdownMenu
          modifiers={[{ name: "offset", options: { offset: [0, 7] } }]}
          className="p-0 border-0"
        >
          <form
            className="d-flex flex-row"
            style={{ width: 420 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              autoFocus
              onFocus={(e) => e.target.select()}
              value={maxSize}
              placeholder="elementų kiekis"
              type="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  setMaxSize(e.target.value);
                  return;
                }

                let value = parseInt(e.target.value);
                const diff = max - min + 1;
                if (value < MIN_LENGTH) value = MIN_LENGTH;
                else if (value > ROWS * COLUMNS) value = ROWS * COLUMNS;
                else if (value > COLUMNS * diff) value = COLUMNS * diff;

                setMaxSize(value);
              }}
            />
            <Input
              value={min}
              placeholder="min"
              type="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  setMin(e.target.value);
                  return;
                }

                let value = parseInt(e.target.value);
                if (value < VALUE_MIN) value = VALUE_MIN;
                else if (value > VALUE_MAX) value = VALUE_MAX;

                if (max === "" || max < value + 1) {
                  setMin(value);
                  setMax(value);
                } else {
                  setMin(value);
                }

                const diff = value - min + 1 === 0 ? 1 : value - min + 1;
                if (maxSize > COLUMNS * diff) setMaxSize(COLUMNS * diff);
              }}
            />
            <Input
              value={max}
              placeholder="max"
              type="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  setMax(e.target.value);
                  return;
                }

                let value = parseInt(e.target.value);
                if (value < VALUE_MIN) value = VALUE_MIN;
                else if (value > VALUE_MAX) value = VALUE_MAX;

                if (min === "" || min > value - 1) {
                  setMin(value);
                  setMax(value);
                } else {
                  setMax(value);
                }

                const diff = value - min + 1 === 0 ? 1 : value - min + 1;
                if (maxSize > COLUMNS * diff) setMaxSize(COLUMNS * diff);
              }}
            />
            <Button
              type="submit"
              disabled={
                isProcessing || maxSize === "" || min === "" || max === ""
              }
              className="ms-1"
              onClick={() =>
                dispatch({
                  type: "create",
                  payload: { maxSize, min, max, dispatch },
                })
              }
            >
              <BsCheckLg className="text-light" />
            </Button>
          </form>
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown className="mt-1" direction="end">
        <DropdownToggle caret className="w-100 text-light">
          {"Pridėti"}
        </DropdownToggle>
        <DropdownMenu
          modifiers={[{ name: "offset", options: { offset: [0, 7] } }]}
          className="p-0 border-0 bg-transparent"
        >
          <form
            className="d-flex flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              autoFocus
              onFocus={(e) => e.target.select()}
              value={valueAdd}
              placeholder="reikšmė"
              type="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  setValueAdd(e.target.value);
                  return;
                }

                let value = parseInt(e.target.value);
                if (value < VALUE_MIN) value = VALUE_MIN;
                else if (value > VALUE_MAX) value = VALUE_MAX;

                setValueAdd(value);
              }}
            />
            <Button
              type="submit"
              disabled={
                isProcessing ||
                valueAdd === "" ||
                getSize(hashTable) >= ROWS * COLUMNS ||
                hashTable.items[hash(valueAdd, ROWS)].nodes.length >= COLUMNS
              }
              className="ms-1"
              onClick={() =>
                dispatch({
                  type: "add",
                  payload: { value: valueAdd, dispatch },
                })
              }
            >
              <BsCheckLg className="text-light" />
            </Button>
          </form>
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown className="mt-1" direction="end">
        <DropdownToggle caret className="w-100 text-light">
          {"Pašalinti"}
        </DropdownToggle>
        <DropdownMenu
          modifiers={[{ name: "offset", options: { offset: [0, 7] } }]}
          className="p-0 border-0"
        >
          <form
            className="d-flex flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              autoFocus
              onFocus={(e) => e.target.select()}
              value={valueRemove}
              placeholder="reikšmė"
              type="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  setValueRemove(e.target.value);
                  return;
                }

                let value = parseInt(e.target.value);
                if (value < VALUE_MIN) value = VALUE_MIN;
                else if (value > VALUE_MAX) value = VALUE_MAX;

                setValueRemove(value);
              }}
            />
            <Button
              disabled={isProcessing || valueRemove === ""}
              type="submit"
              className="ms-1"
              onClick={() =>
                dispatch({
                  type: "remove",
                  payload: { value: valueRemove, dispatch },
                })
              }
            >
              <BsCheckLg className="text-light" />
            </Button>
          </form>
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown className="mt-1" direction="end">
        <DropdownToggle caret className="w-100 text-light">
          {"Surasti"}
        </DropdownToggle>
        <DropdownMenu
          modifiers={[{ name: "offset", options: { offset: [0, 7] } }]}
          className="p-0 border-0"
        >
          <form
            className="d-flex flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              autoFocus
              onFocus={(e) => e.target.select()}
              value={valueSearch}
              placeholder="reikšmė"
              type="number"
              onChange={(e) => {
                if (e.target.value === "") {
                  setValueSearch(e.target.value);
                  return;
                }

                let value = parseInt(e.target.value);
                if (value < VALUE_MIN) value = VALUE_MIN;
                else if (value > VALUE_MAX) value = VALUE_MAX;

                setValueSearch(value);
              }}
            />
            <Button
              disabled={isProcessing || valueSearch === ""}
              type="submit"
              className="ms-1"
              onClick={() =>
                dispatch({
                  type: "search",
                  payload: { value: valueSearch, dispatch },
                })
              }
            >
              <BsCheckLg className="text-light" />
            </Button>
          </form>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

function hash(value, maxSize) {
  return Math.abs(10 * value + Math.floor(value / maxSize)) % maxSize;
}

function reducer(draft, action) {
  switch (action.type) {
    case "init":
      return init(draft, action.payload.panelLines);
    case "create":
      return createAnimated(
        draft,
        action.payload.maxSize,
        action.payload.min,
        action.payload.max,
        action.payload.dispatch
      );
    case "add":
      return addAnimated(draft, action.payload.value, action.payload.dispatch);
    case "remove":
      return removeAnimated(
        draft,
        action.payload.value,
        action.payload.dispatch
      );
    case "search":
      return searchAnimated(
        draft,
        action.payload.value,
        action.payload.dispatch
      );
    case "reset-panel":
      return resetPanelAnimated(draft, action.payload.dispatch);
    case "_create":
      return create(draft, action.payload.values);
    case "_add":
      return add(draft, action.payload.node, action.payload.indexItem);
    case "_remove":
      return remove(draft, action.payload.indexItem, action.payload.indexNode);
    case "_update":
      return update(
        draft,
        action.payload.value,
        action.payload.indexItem,
        action.payload.indexNode
      );
    case "_update-panel":
      return updatePanel(draft, action.payload.index, action.payload.text);
    case "_reset-panel":
      return resetPanel(draft);
    case "_reset-items":
      return resetItems(draft);
    default:
      throw new Error();
  }
}

function init(draft, panelLines) {
  draft.animationQueue = [];
  draft.animationDelay = 0;

  let items = [];
  for (let i = 0; i < ROWS; i++) {
    const pos = calculatePosition(
      i,
      0,
      NODE_SIZE,
      BASE_POSITION,
      SPACING,
      NODE_OFFSET
    );
    const item = newNode({
      value: "",
      animationController: { ...pos, ...INIT_CONFIG },
      linkAnimationController: { ...pos, ...INIT_CONFIG },
    });
    items.push({ nodes: [item] });
  }

  let lines = [];
  for (let i = 0; i < panelLines; i++) {
    const lineNew = newLine({ text: "", animationController: { alpha: 0 } });
    lines.push(lineNew);
  }

  draft.items = items;
  draft.panel = [...draft.panel, ...lines];
}

function createAnimated(draft, maxSize, min, max, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = DELAY;

  let linkControllers = [];
  let linkAnimations = [];
  let nodeControllers = [];
  let nodeAnimations = [];

  if (getSize(draft) !== 0) {
    for (let i = 0; i < draft.items.length; i++) {
      if (draft.items[i].nodes[0] !== "") {
        if (draft.items[i].nodes.length > 1) {
          linkControllers.push(draft.items[i].nodes[0].linkAnimationController);
          const pos = calculatePosition(
            i,
            0,
            NODE_SIZE,
            BASE_POSITION,
            SPACING,
            NODE_OFFSET
          );
          linkAnimations.push(pos);
        }

        nodeControllers.push(draft.items[i].nodes[0].animationController);
        nodeAnimations.push({ alphaText: 0 });

        for (let j = 1; j < draft.items[i].nodes.length; j++) {
          const pos = calculatePosition(
            i,
            j,
            NODE_SIZE,
            BASE_POSITION,
            SPACING,
            NODE_OFFSET
          );
          const posDown = { x: pos.x, y: pos.y + DOWN };

          linkControllers.push(draft.items[i].nodes[j].linkAnimationController);
          linkAnimations.push(pos);
          nodeControllers.push(draft.items[i].nodes[j].animationController);
          nodeAnimations.push({ ...posDown, alpha: 0 });
          nodeControllers.push(draft.items[i].nodes[j].linkAnimationController);
          nodeAnimations.push(posDown);
        }
      }
    }

    resetPanelAnimated(draft, dispatch);
    AnimationsQueue.push(draft.animationQueue, linkControllers, linkAnimations);
    AnimationsQueue.push(draft.animationQueue, nodeControllers, nodeAnimations);
    AnimationsQueue.pushFunc(draft.animationQueue, () => {
      dispatch({ type: "_reset-items" });
      return [];
    });
  }

  let values = [];
  for (let i = 0; i < ROWS; i++) {
    values.push([]);
  }

  let counter = maxSize;
  while (counter !== 0) {
    const value = randomInt(min, max);
    const indexItem = hash(value, ROWS);

    if (values[indexItem].length < COLUMNS) {
      const nodeNew = newNode({ value: value });
      values[indexItem].push(nodeNew);
      counter--;
    }
  }

  for (let i = 0; i < ROWS; i++) {
    if (values[i].length === 0) {
      const nodeNew = newNode({ value: "" });
      values[i].push(nodeNew);
    }

    values[i][0].animationController =
      draft.items[i].nodes[0].animationController;
    values[i][0].linkAnimationController =
      draft.items[i].nodes[0].linkAnimationController;
  }

  AnimationsQueue.pushFunc(draft.animationQueue, () => {
    dispatch({ type: "_create", payload: { values: values } });
    return [];
  });

  linkControllers = [];
  linkAnimations = [];
  nodeControllers = [];
  nodeAnimations = [];

  for (let i = 0; i < values.length; i++) {
    if (values[i][0] !== "") {
      nodeControllers.push(values[i][0].animationController);
      nodeAnimations.push({ alphaText: 1 });

      if (values[i].length > 1) {
        const posNext = calculatePosition(
          i,
          1,
          NODE_SIZE,
          BASE_POSITION,
          SPACING,
          NODE_OFFSET
        );
        linkControllers.push(values[i][0].linkAnimationController);
        linkAnimations.push(posNext);
      }

      for (let j = 1; j < values[i].length; j++) {
        const pos = calculatePosition(
          i,
          j,
          NODE_SIZE,
          BASE_POSITION,
          SPACING,
          NODE_OFFSET
        );
        const posNext = calculatePosition(
          i,
          j + 1,
          NODE_SIZE,
          BASE_POSITION,
          SPACING,
          NODE_OFFSET
        );

        nodeControllers.push(values[i][j].animationController);
        nodeAnimations.push(pos);
        nodeControllers.push(values[i][j].linkAnimationController);
        nodeAnimations.push(pos);

        if (j < values[i].length - 1) {
          linkControllers.push(values[i][j].linkAnimationController);
          linkAnimations.push(posNext);
        }
      }
    }
  }

  AnimationsQueue.push(draft.animationQueue, nodeControllers, nodeAnimations);
  AnimationsQueue.push(draft.animationQueue, linkControllers, linkAnimations);
}

function create(draft, values) {
  for (let i = 0; i < draft.items.length; i++) {
    draft.items[i].nodes[0].value = values[i][0].value;

    for (let j = 1; j < values[i].length; j++) {
      draft.items[i].nodes.push(values[i][j]);
    }
  }
}

function hashAnimated(draft, value, maxSize, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = DELAY;

  if (draft.panel[1].text !== "") {
    for (let i = PANEL_LINES; i >= 1; i--) {
      AnimationsQueue.push(
        draft.animationQueue,
        draft.panel[i].animationController,
        { alpha: 0 }
      );
    }
  }

  let lines = [];
  lines.push(
    "h(" +
      value +
      ") = |10 • " +
      value +
      " + [" +
      value +
      " ÷ " +
      maxSize +
      "]| mod " +
      maxSize
  );
  lines.push(
    "h(" +
      value +
      ") = |" +
      10 * value +
      " + [" +
      (value / maxSize).toFixed(2) +
      "]| mod " +
      maxSize
  );
  lines.push(
    "h(" +
      value +
      ") = |" +
      10 * value +
      " + " +
      Math.floor(value / maxSize) +
      "| mod " +
      maxSize
  );
  lines.push(
    "h(" +
      value +
      ") = |" +
      (10 * value + Math.floor(value / maxSize)) +
      "| mod " +
      maxSize
  );
  lines.push(
    "h(" +
      value +
      ") = " +
      Math.abs(10 * value + Math.floor(value / maxSize)) +
      " mod " +
      maxSize
  );
  lines.push("h(" + value + ") = " + hash(value, maxSize));

  for (let i = 1; i <= PANEL_LINES; i++) {
    AnimationsQueue.pushFunc(draft.animationQueue, () => {
      dispatch({
        type: "_update-panel",
        payload: { index: i, text: lines[i - 1] },
      });
      return [];
    });
    AnimationsQueue.push(
      draft.animationQueue,
      draft.panel[i].animationController,
      { alpha: 1 }
    );
  }
}

function resetPanelAnimated(draft, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = DELAY;

  for (let i = PANEL_LINES; i >= 1; i--) {
    AnimationsQueue.push(
      draft.animationQueue,
      draft.panel[i].animationController,
      { alpha: 0 }
    );
  }

  AnimationsQueue.pushFunc(draft.animationQueue, () => {
    dispatch({ type: "_reset-panel" });
    return [];
  });
}

function resetPanel(draft) {
  for (let i = PANEL_LINES; i >= 1; i--) {
    draft.panel[i].text = "";
  }
}

function updatePanel(draft, index, text) {
  draft.panel[index].text = text;
}

function resetItems(draft) {
  for (let i = 0; i < draft.items.length; i++) {
    draft.items[i].nodes = [{ ...draft.items[i].nodes[0] }];
    draft.items[i].nodes[0].value = "";
  }
}

function addAnimated(draft, value, dispatch) {
  const indexItem = hash(value, ROWS);
  const indexNodeLast = draft.items[indexItem].nodes.length - 1;

  hashAnimated(draft, value, ROWS, dispatch);

  if (draft.items[indexItem].nodes[indexNodeLast].value === "") {
    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[0].animationController,
      { alphaText: 0 }
    );
    AnimationsQueue.pushFunc(draft.animationQueue, () => {
      dispatch({
        type: "_update",
        payload: { value: value, indexItem: indexItem, indexNode: 0 },
      });
      return [];
    });
    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[0].animationController,
      { scale: 2, alphaCorrect: 1 }
    );
    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[0].animationController,
      { alphaText: 1 }
    );
    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[0].animationController,
      { scale: 1, alphaCorrect: 0 }
    );
    return;
  }

  const indexNodeNew = indexNodeLast + 1;
  const nodeNew = newNode({ value: value, animationController: INIT_SPAWN });
  const posNodeNew = calculatePosition(
    indexItem,
    indexNodeNew,
    NODE_SIZE,
    BASE_POSITION,
    SPACING,
    NODE_OFFSET
  );

  traverseToEndAnimated(draft, indexItem);
  AnimationsQueue.pushFunc(draft.animationQueue, () => {
    dispatch({
      type: "_add",
      payload: { value, node: nodeNew, indexItem: indexItem },
    });
    return [];
  });

  const indexNodePrev = indexNodeLast;
  AnimationsQueue.push(
    draft.animationQueue,
    [nodeNew.animationController, nodeNew.linkAnimationController],
    [posNodeNew, posNodeNew]
  );
  AnimationsQueue.push(
    draft.animationQueue,
    draft.items[indexItem].nodes[indexNodePrev].linkAnimationController,
    posNodeNew
  );
}

function add(draft, node, indexItem) {
  draft.items[indexItem].nodes.push(node);
}

function update(draft, value, indexItem, indexNode) {
  draft.items[indexItem].nodes[indexNode].value = value;
}

function traverseToEndAnimated(draft, indexItem) {
  draft.animationQueue = [];
  draft.animationDelay = DELAY;

  const indexLast = draft.items[indexItem].nodes.length - 1;
  for (let i = 0; i <= indexLast; i++) {
    const nodePos = calculatePosition(
      indexItem,
      i,
      NODE_SIZE,
      BASE_POSITION,
      SPACING,
      NODE_OFFSET
    );
    const nodeUpPos = { x: nodePos.x, y: nodePos.y - SEARCH_OFFSET };

    if (i === 0) {
      if (i === indexLast) {
        AnimationsQueue.push(
          draft.animationQueue,
          [
            draft.items[indexItem].nodes[i].animationController,
            draft.items[indexItem].nodes[i].linkAnimationController,
          ],
          [nodeUpPos, nodeUpPos]
        );
        AnimationsQueue.push(
          draft.animationQueue,
          [
            draft.items[indexItem].nodes[i].animationController,
            draft.items[indexItem].nodes[i].linkAnimationController,
          ],
          [nodePos, nodePos]
        );
      } else {
        AnimationsQueue.push(
          draft.animationQueue,
          draft.items[indexItem].nodes[i].animationController,
          nodeUpPos
        );
        AnimationsQueue.push(
          draft.animationQueue,
          draft.items[indexItem].nodes[i].animationController,
          nodePos
        );
      }
    } else if (i === indexLast) {
      AnimationsQueue.push(
        draft.animationQueue,
        [
          draft.items[indexItem].nodes[i].animationController,
          draft.items[indexItem].nodes[i - 1].linkAnimationController,
          draft.items[indexItem].nodes[i].linkAnimationController,
        ],
        [nodeUpPos, nodeUpPos, nodeUpPos]
      );
      AnimationsQueue.push(
        draft.animationQueue,
        [
          draft.items[indexItem].nodes[i].animationController,
          draft.items[indexItem].nodes[i - 1].linkAnimationController,
          draft.items[indexItem].nodes[i].linkAnimationController,
        ],
        [nodePos, nodePos, nodePos]
      );
    } else {
      AnimationsQueue.push(
        draft.animationQueue,
        [
          draft.items[indexItem].nodes[i].animationController,
          draft.items[indexItem].nodes[i - 1].linkAnimationController,
        ],
        [nodeUpPos, nodeUpPos]
      );
      AnimationsQueue.push(
        draft.animationQueue,
        [
          draft.items[indexItem].nodes[i].animationController,
          draft.items[indexItem].nodes[i - 1].linkAnimationController,
        ],
        [nodePos, nodePos]
      );
    }
  }
}

function removeAnimated(draft, value, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = DELAY;

  const indexItem = hash(value, ROWS);

  searchAnimated(draft, value, dispatch);

  if (draft.items[indexItem].nodes.length === "") {
    return;
  }

  const indexNode = draft.items[indexItem].nodes.findIndex(
    (node) => node.value === value
  );
  if (indexNode !== -1) {
    if (draft.items[indexItem].nodes.length === 1) {
      AnimationsQueue.push(
        draft.animationQueue,
        draft.items[indexItem].nodes[0].animationController,
        { alphaText: 0 }
      );
      AnimationsQueue.pushFunc(draft.animationQueue, () => {
        dispatch({
          type: "_remove",
          payload: { value: value, indexItem: indexItem, indexNode: 0 },
        });
        return [];
      });
      return;
    }

    const indexPrev = indexNode - 1;
    const posNode = calculatePosition(
      indexItem,
      indexNode,
      NODE_SIZE,
      BASE_POSITION,
      SPACING,
      NODE_OFFSET
    );
    const posPrev = calculatePosition(
      indexItem,
      indexPrev,
      NODE_SIZE,
      BASE_POSITION,
      SPACING,
      NODE_OFFSET
    );
    console.log(posPrev);
    const posDown = { x: posNode.x, y: posNode.y + DOWN };

    if (indexNode !== 0)
      AnimationsQueue.push(
        draft.animationQueue,
        draft.items[indexItem].nodes[indexPrev].linkAnimationController,
        posPrev
      );

    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[indexNode].linkAnimationController,
      posNode
    );
    AnimationsQueue.push(
      draft.animationQueue,
      [
        draft.items[indexItem].nodes[indexNode].animationController,
        draft.items[indexItem].nodes[indexNode].linkAnimationController,
      ],
      [{ ...posDown, alpha: 0 }, posDown]
    );

    let controllers = [];
    let animations = [];

    const indexNext = indexNode + 1;
    for (let i = indexNext; i < draft.items[indexItem].nodes.length - 1; i++) {
      const posShiftPrev = calculatePosition(
        indexItem,
        i - 1,
        NODE_SIZE,
        BASE_POSITION,
        SPACING,
        NODE_OFFSET
      );
      const posShiftCurr = calculatePosition(
        indexItem,
        i,
        NODE_SIZE,
        BASE_POSITION,
        SPACING,
        NODE_OFFSET
      );

      controllers.push(draft.items[indexItem].nodes[i].animationController);
      animations.push(posShiftPrev);
      controllers.push(draft.items[indexItem].nodes[i].linkAnimationController);
      animations.push(posShiftCurr);
    }

    const indexLast = draft.items[indexItem].nodes.length - 1;
    const posLast = calculatePosition(
      indexItem,
      indexLast - 1,
      NODE_SIZE,
      BASE_POSITION,
      SPACING,
      NODE_OFFSET
    );

    controllers.push(
      draft.items[indexItem].nodes[indexLast].animationController
    );
    animations.push(posLast);
    controllers.push(
      draft.items[indexItem].nodes[indexLast].linkAnimationController
    );
    animations.push(posLast);

    AnimationsQueue.push(draft.animationQueue, controllers, animations);

    if (indexNode !== 0 && indexNode !== indexLast)
      AnimationsQueue.push(
        draft.animationQueue,
        draft.items[indexItem].nodes[indexPrev].linkAnimationController,
        posNode
      );

    AnimationsQueue.pushFunc(draft.animationQueue, () => {
      dispatch({
        type: "_remove",
        payload: { value: value, indexItem: indexItem, indexNode: indexNode },
      });
      return [];
    });
  }
}

function remove(draft, indexItem, indexNode) {
  if (draft.items[indexItem].nodes.length === 1) {
    draft.items[indexItem].nodes[0].value = "";
  } else {
    draft.items[indexItem].nodes = draft.items[indexItem].nodes.filter(
      (v, i) => {
        return i !== indexNode;
      }
    );
  }
}

function searchAnimated(draft, value, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = DELAY;

  const indexes = search(draft, value);
  const indexItem = indexes.indexItem;
  const indexNode = indexes.indexNode;
  hashAnimated(draft, value, ROWS, dispatch);

  const indexLast = draft.items[indexItem].nodes.length - 1;
  const indexTo = indexNode !== -1 ? indexNode : indexLast;
  for (let i = 0; i <= indexTo; i++) {
    const nodePos = calculatePosition(
      indexItem,
      i,
      NODE_SIZE,
      BASE_POSITION,
      SPACING,
      NODE_OFFSET
    );
    const nodeUpPos = { x: nodePos.x, y: nodePos.y - SEARCH_OFFSET };

    if (i === 0) {
      if (i === indexLast) {
        AnimationsQueue.push(
          draft.animationQueue,
          [
            draft.items[indexItem].nodes[i].animationController,
            draft.items[indexItem].nodes[i].linkAnimationController,
          ],
          [nodeUpPos, nodeUpPos]
        );
        isIndexCorrectAnimated(
          draft,
          indexItem,
          i,
          indexTo,
          draft.items[indexItem].nodes[i].value,
          value
        );
        AnimationsQueue.push(
          draft.animationQueue,
          [
            draft.items[indexItem].nodes[i].animationController,
            draft.items[indexItem].nodes[i].linkAnimationController,
          ],
          [nodePos, nodePos]
        );
      } else {
        AnimationsQueue.push(
          draft.animationQueue,
          draft.items[indexItem].nodes[i].animationController,
          nodeUpPos
        );
        isIndexCorrectAnimated(
          draft,
          indexItem,
          i,
          indexTo,
          draft.items[indexItem].nodes[i].value,
          value
        );
        AnimationsQueue.push(
          draft.animationQueue,
          draft.items[indexItem].nodes[i].animationController,
          nodePos
        );
      }
    } else if (i === indexLast) {
      AnimationsQueue.push(
        draft.animationQueue,
        [
          draft.items[indexItem].nodes[i].animationController,
          draft.items[indexItem].nodes[i - 1].linkAnimationController,
          draft.items[indexItem].nodes[i].linkAnimationController,
        ],
        [nodeUpPos, nodeUpPos, nodeUpPos]
      );
      isIndexCorrectAnimated(
        draft,
        indexItem,
        i,
        indexTo,
        draft.items[indexItem].nodes[i].value,
        value
      );
      AnimationsQueue.push(
        draft.animationQueue,
        [
          draft.items[indexItem].nodes[i].animationController,
          draft.items[indexItem].nodes[i - 1].linkAnimationController,
          draft.items[indexItem].nodes[i].linkAnimationController,
        ],
        [nodePos, nodePos, nodePos]
      );
    } else {
      AnimationsQueue.push(
        draft.animationQueue,
        [
          draft.items[indexItem].nodes[i].animationController,
          draft.items[indexItem].nodes[i - 1].linkAnimationController,
        ],
        [nodeUpPos, nodeUpPos]
      );
      isIndexCorrectAnimated(
        draft,
        indexItem,
        i,
        indexTo,
        draft.items[indexItem].nodes[i].value,
        value
      );
      AnimationsQueue.push(
        draft.animationQueue,
        [
          draft.items[indexItem].nodes[i].animationController,
          draft.items[indexItem].nodes[i - 1].linkAnimationController,
        ],
        [nodePos, nodePos]
      );
    }
  }
}

function isIndexCorrectAnimated(
  draft,
  indexItem,
  index,
  indexTo,
  value,
  valueTo
) {
  if (index === indexTo && value === valueTo) {
    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[index].animationController,
      { alphaCorrect: 1, scale: 2 }
    );
    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[index].animationController,
      { alphaCorrect: 0, scale: 1 }
    );
  } else {
    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[index].animationController,
      { alphaIncorrect: 1 }
    );
    AnimationsQueue.push(
      draft.animationQueue,
      draft.items[indexItem].nodes[index].animationController,
      { alphaIncorrect: 0 }
    );
  }
}

function search(draft, value) {
  const indexItem = hash(value, ROWS);
  const indexNode = draft.items[indexItem].nodes.findIndex(
    (node) => node.value === value
  );
  return { indexItem, indexNode };
}

const Link = animated(({ x1, y1, x2, y2, fill }) => {
  const [length, setLength] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    const rot = Math.atan2(deltaY, deltaX);
    setRotation(rot);
    setLength(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)));
  }, [x1, x2, y1, y2]);

  const drawTriangle = useCallback(
    (g) => {
      g.clear();
      g.beginFill(fill);
      g.moveTo(0, 0);
      g.lineTo(-12, 6);
      g.lineTo(-12, -6);
      g.endFill();
    },
    [fill]
  );

  const drawLine = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(2, fill, 1);
      g.moveTo(0, 0);
      g.lineTo(1, 0);
    },
    [fill]
  );

  return (
    <>
      <Graphics
        draw={drawLine}
        x={x1}
        y={y1}
        rotation={rotation}
        scale={[length, 1]}
      />
      <Graphics
        draw={drawTriangle}
        x={x1 + (x2 - x1) / 2}
        y={y1 + (y2 - y1) / 2}
        rotation={rotation}
      />
    </>
  );
});

const Node = animated((props) => {
  const {
    value,
    index,
    animationController,
    fill,
    correctFill,
    incorrectFill,
    textFill,
    linkFill,
    width,
    height,
    linkAnimationController,
  } = props;

  const rectangle = useCallback(
    (instance) => {
      instance.clear();
      instance.beginFill(fill);
      instance.drawRoundedRect(-width / 2, -height / 2, width, height, 15);
      instance.endFill();
    },
    [fill, width, height]
  );

  const rectangleCorrect = useCallback(
    (instance) => {
      instance.clear();
      instance.beginFill(correctFill);
      instance.drawRoundedRect(-width / 2, -height / 2, width, height, 15);
      instance.endFill();
    },
    [correctFill, width, height]
  );

  const rectangleIncorrect = useCallback(
    (instance) => {
      instance.clear();
      instance.beginFill(incorrectFill);
      instance.drawRoundedRect(-width / 2, -height / 2, width, height, 15);
      instance.endFill();
    },
    [incorrectFill, width, height]
  );

  return (
    <>
      {linkAnimationController && (
        <Container alpha={animationController.springs.alpha}>
          <Link
            x1={animationController.springs.x}
            y1={animationController.springs.y}
            x2={linkAnimationController.springs.x}
            y2={linkAnimationController.springs.y}
            fill={linkFill}
          />
        </Container>
      )}
      <Container {...animationController.springs}>
        <Graphics draw={rectangle} />
        <Graphics
          draw={rectangleCorrect}
          alpha={animationController.springs.alphaCorrect}
        />
        <Graphics
          draw={rectangleIncorrect}
          alpha={animationController.springs.alphaIncorrect}
        />
        <Text
          text={value}
          anchor={0.5}
          x={0}
          y={0}
          scale={1.75}
          style={{ fill: textFill }}
          resolution={16}
          alpha={animationController.springs.alphaText}
        />
        <Text
          text={index}
          anchor={{ x: -0.4, y: -0.2 }}
          x={-width / 2}
          y={-height / 2}
          scale={0.75}
          style={{ fill: textFill }}
          resolution={1}
        />
      </Container>
    </>
  );
});

function Border({ x, y, width, height, fill }) {
  const rectangle = (g) => {
    g.clear();
    g.lineStyle(2, fill, 1);
    g.beginFill(0x000000, 0);
    g.drawRoundedRect(x, y, width, height, 15);
    g.endFill();
  };

  return <Graphics draw={rectangle} />;
}

function HashPanel({
  x,
  y,
  offset,
  width,
  height,
  fontSize,
  fill,
  items,
  spacing,
}) {
  return (
    <>
      <Border
        x={x}
        y={y}
        width={width + offset / 2}
        height={height + offset / 2}
        fill={fill}
      />
      {items.map((item, index) => {
        return (
          <Text
            key={item.text + index}
            text={item.text}
            // style={{fontSize: fontSize}}
            x={x + offset}
            y={y + offset + index * spacing}
            alpha={item.animationController.springs.alpha}
          />
        );
      })}
    </>
  );
}

function HashTable(props) {
  const {
    hashTable,
    nodeFill,
    correctFill,
    incorrectFill,
    textFill,
    linkFill,
    width,
    height,
  } = props;

  return hashTable.items.map((item, itemIndex) => {
    return item.nodes.map((node, nodeIndex) => {
      return (
        <Node
          key={itemIndex * ROWS + nodeIndex}
          value={node.value}
          index={nodeIndex === 0 ? itemIndex : ""}
          animationController={node.animationController}
          linkAnimationController={node.linkAnimationController}
          fill={nodeFill}
          correctFill={correctFill}
          incorrectFill={incorrectFill}
          textFill={textFill}
          linkFill={linkFill}
          width={width}
          height={height}
        />
      );
    });
  });
}

function getSize(hashTable) {
  let size = 0;

  for (let i = 1; i < hashTable.items.length; i++) {
    if (hashTable.items[i].nodes[0] !== "") {
      size += hashTable.items[i].length;
    }
  }

  return size;
}

function newNode({
  value,
  animationController = { ...INIT_POS, ...INIT_CONFIG },
  linkAnimationController = { ...INIT_POS, ...INIT_CONFIG },
}) {
  return {
    value,
    animationController: new Controller(animationController),
    linkAnimationController: new Controller(linkAnimationController),
  };
}

function newLine({ text, animationController }) {
  return {
    text: text,
    animationController: new Controller(animationController),
  };
}

function calculatePosition(
  indexItem,
  indexNode,
  nodeSize,
  basePos,
  spacing,
  offset
) {
  const x =
    basePos.x +
    offset.x +
    spacing +
    (2 * offset.x + nodeSize.width) * indexNode;
  const y =
    basePos.y + offset.y + spacing + (spacing + nodeSize.height) * indexItem;
  return { x, y };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function HashTableViz({ width, height }) {
  const { isProcessing, addTask } = useTaskQueue(true);

  const [hashTable, dispatch] = useImmerReducer(reducer, {
    items: [
      // {nodes: [{value: "", animationController: new Controller(SPAWN), linkAnimationController: null}]},
      // {nodes: [{value: "", animationController: new Controller(SPAWN), linkAnimationController: null}]}
    ],
    panel: [
      {
        text: "h(r) = |10 • r + [r ÷ N]| mod N",
        animationController: new Controller({ alpha: 1 }),
      },
    ],
    animationQueue: [],
    animationDelay: -1,
  });

  useEffect(() => {
    dispatch({ type: "init", payload: { panelLines: PANEL_LINES } });
  }, [dispatch]);

  useEffect(() => {
    console.log(hashTable);
  }, [hashTable]);

  useEffect(() => {
    if (hashTable.animationQueue.length > 0) {
      if (hashTable.animationDelay === -1) {
        addTask(() =>
          AnimationsQueue.playSequentially([...hashTable.animationQueue])
        );
      } else {
        addTask(() =>
          AnimationsQueue.playWithDelay(
            [...hashTable.animationQueue],
            hashTable.animationDelay
          )
        );
      }
    }
  }, [addTask, hashTable.animationDelay, hashTable.animationQueue]);

  return (
    <div className="position-relative h-100">
      <Stage
        width={width}
        height={height}
        options={{ backgroundAlpha: 0, antialias: true }}
        className="position-absolute"
      >
        <HashPanel
          x={PANEL_POSITION.x}
          y={PANEL_POSITION.y}
          width={PANEL_WIDTH}
          height={PANEL_HEIGHT}
          offset={SPACING}
          fill={FILL_TEXT}
          fontSize={PANEL_FONT_SIZE}
          items={hashTable.panel}
          spacing={PANEL_LINE_SPACING}
        />
        <Border
          x={BASE_POSITION.x}
          y={BASE_POSITION.y}
          width={SPACING + NODE_SIZE.width + SPACING}
          height={SPACING + (NODE_SIZE.height + SPACING) * ROWS}
          fill={FILL_LINK}
        />
        <HashTable
          hashTable={hashTable}
          nodeFill={FILL_NODE}
          correctFill={FILL_NODE_CORRECT}
          incorrectFill={FILL_NODE_INCORRECT}
          textFill={FILL_TEXT}
          linkFill={FILL_LINK}
          width={NODE_SIZE.width}
          height={NODE_SIZE.height}
        />
      </Stage>

      <VizControlPanel
        hashTable={hashTable}
        dispatch={dispatch}
        isProcessing={isProcessing}
        className="position-absolute d-flex flex-column bottom-0 ms-2 mb-2"
        style={{ width: 180 }}
      />
    </div>
  );
}
