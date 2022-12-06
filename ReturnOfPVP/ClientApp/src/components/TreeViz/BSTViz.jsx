import { useCallback, useEffect, useRef } from "react";
import { useImmerReducer } from "use-immer";
import { Container, Graphics, Stage, Text } from "@inlet/react-pixi/animated";
import useDeepCompareEffect from "use-deep-compare-effect";

import BSTControlPanel from "./BSTControlPanel";
import BST from "./BST";
import Node from "./Node";
import AnimationsQueue from "../../api/AnimationsQueue";
import useTaskQueue from "../../hooks/useTaskQueue";
import { useSpring } from "react-spring";

export default function BSTViz({ width, height }) {
  const [tree, treeDispatch] = useImmerReducer(BST.treeReducer, {
    root: {},
    animQueue: [],
    animDelay: -1,
    selected: undefined,
  });

  const { tasks, isProcessing, addTask } = useTaskQueue(true);

  useEffect(() => {
    console.log(tree);
  }, [tree]);

  useDeepCompareEffect(() => {
    treeDispatch({ type: "UPDATE_POS", payload: width });
  }, [treeDispatch, width, tree.root]);

  useEffect(() => {
    if (tree.animQueue.length > 0) {
      if (tree.animDelay === -1) {
        addTask(() => AnimationsQueue.playSequentially([...tree.animQueue]));
      } else {
        addTask(() =>
          AnimationsQueue.playWithDelay([...tree.animQueue], tree.animDelay)
        );
      }
    }
  }, [tree.animQueue]);

  const drawAddNode = useCallback((g) => {
    g.clear();
    g.lineStyle(2, 0x000000, 0);
    g.beginFill(0x198754, 1);
    g.drawCircle(0, 0, 12);
    g.endFill();
  }, []);

  const drawDeleteNode = useCallback((g) => {
    g.clear();
    g.lineStyle(2, 0x000000, 0);
    g.beginFill(0xdc3545, 1);
    g.drawCircle(0, 0, 12);
    g.endFill();
  }, []);

  const drawBackground = useCallback(
    (g) => {
      g.clear();
      g.beginFill(0xffffff, 1);
      g.drawRect(0, 0, width, height);
      g.endFill();
    },
    [height, width]
  );

  const handleClick = (e) => {
    console.log(e)
    treeDispatch({
      type: "SELECT_NODE",
      payload: e.data.global,
    });
  };

  return (
    <div className="position-relative h-100">
      <Stage
        width={width}
        height={height}
        options={{
          backgroundAlpha: 0,
          antialias: true,
        }}
        className="position-absolute"
      >
        <Graphics
          alpha={0}
          interactive
          pointerup={handleClick}
          draw={drawBackground}
        />
        {Object.keys(tree.root).length > 0 ? (
          <Node
            root={tree.root}
            dispatch={treeDispatch}
            controller={tree.root.animation}
            radius={BST.RADIUS}
          />
        ) : (
          <></>
        )}
        {tree.selected && (
          <EditNode
            symbol="-"
            parent={tree.selected}
            draw={drawDeleteNode}
            onClick={() => treeDispatch({ type: "REMOVE_NODE" })}
            x={tree.selected.position.springs.x.get()}
            y={tree.selected.position.springs.y.get() - 50}
          />
        )}
        {tree.selected && !tree.selected.right && (
          <EditNode
            symbol="R"
            parent={tree.selected}
            draw={drawAddNode}
            onClick={() =>
              treeDispatch({
                type: "ADD_NODE",
                payload: { type: "RIGHT", value: 5, width },
              })
            }
            x={tree.selected.position.springs.x.get() + 40}
            y={tree.selected.position.springs.y.get() + 40}
          />
        )}
        {tree.selected && !tree.selected.left && (
          <EditNode
            symbol="L"
            parent={tree.selected}
            draw={drawAddNode}
            onClick={() =>
              treeDispatch({
                type: "ADD_NODE",
                payload: { type: "LEFT", value: 5, width },
              })
            }
            x={tree.selected.position.springs.x.get() - 40}
            y={tree.selected.position.springs.y.get() + 40}
          />
        )}
      </Stage>

      <BSTControlPanel
        className="position-absolute d-flex flex-column bottom-0 ms-2 mb-2"
        style={{ width: 180 }}
        dispatch={treeDispatch}
        width={width}
        isProcessing={isProcessing}
      />
    </div>
  );
}

function EditNode({ symbol, x, y, draw, onClick }) {
  const spring = useSpring({ from: { scale: 0 }, to: { scale: 1 } });
  return (
    <Container interactive mousedown={onClick} scale={spring.scale} x={x} y={y}>
      <Graphics draw={draw} />
      <Text style={{ fontSize: 12 }} text={symbol} anchor={0.5} />
    </Container>
  );
}
