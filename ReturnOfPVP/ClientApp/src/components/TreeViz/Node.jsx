import { Text } from "@inlet/react-pixi";
import { Container, Graphics } from "@inlet/react-pixi/animated";
import { useCallback, useEffect } from "react";
import { animated, useSpring } from "react-spring";

import Line from "./Line";

const Node = animated(({ root, radius, controller, dispatch }) => {
  const drawNode = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(2, 0x000000, 0);
      g.beginFill(0x6699ff, 1);
      g.drawCircle(0, 0, radius);
      g.endFill();
    },
    [radius]
  );

  const drawHighlightedNode = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(2, 0x000000, 0);
      g.beginFill(0xdc3545, 1);
      g.drawCircle(0, 0, radius);
      g.endFill();
    },
    [radius]
  );

  const handleClick = (e) => {
    console.log(e);
    // dispatch({ type: "SWITCH", payload: e.data.global });
  };

  return (
    <>
      <Container
        // interactive
        // mousedown={handleClick}
        x={root.position.springs.x}
        y={root.position.springs.y}
        scale={controller.springs.scale}
      >
        <Graphics draw={drawNode} alpha={1} />
        <Graphics
          draw={drawHighlightedNode}
          scale={controller.springs.hlScale}
          alpha={controller.springs.hlScale}
        />
        <Text style={{ fontSize: 32 }} text={root.value} anchor={0.5} />
      </Container>

      {root.left && (
        <>
          <Node
            root={root.left}
            dispatch={dispatch}
            controller={root.left.animation}
            radius={radius}
          />
          <Line
            offset={radius}
            pos2={root.left.position.springs}
            pos1={root.position.springs}
            {...root.left.line}
          />
        </>
      )}
      {root.right && (
        <>
          <Node
            root={root.right}
            dispatch={dispatch}
            controller={root.right.animation}
            radius={radius}
          />
          <Line
            offset={radius}
            pos2={root.right.position.springs}
            pos1={root.position.springs}
            {...root.right.line}
          />
        </>
      )}
    </>
  );
});

export default Node;
