import { Graphics, Text } from "@inlet/react-pixi/animated";
import { useCallback, useEffect, useRef, useState } from "react";
import { animated, to } from "react-spring";

const Line = animated(({ pos1, pos2, offset, animation }) => {
  const [length, setLength] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let x1 = pos1.x;
    let y1 = pos1.y;
    let x2 = pos2.x;
    let y2 = pos2.y;
    setLength(
      to(
        [x1, y1, x2, y2],
        (x1, y1, x2, y2) =>
          Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) - offset * 2
      )
    );
    const rot = to([x1, y1, x2, y2], (x1, y1, x2, y2) => {
      let r = Math.atan2(y2 - y1, x2 - x1);
      return r < 0 ? r + Math.PI : r;
    });
    setRotation(rot);
  }, [pos1.x, pos1.y, pos2.x, pos2.y, offset]);

  const drawLine = useCallback((g) => {
    g.clear();
    g.lineStyle(2, 0x000000, 1);
    g.moveTo(0, 0);
    g.lineTo(1, 0);
  }, []);

  const drawActiveLine = useCallback((g) => {
    g.clear();
    g.lineStyle(2, 0xdc3545, 1);
    g.moveTo(0, 0);
    g.lineTo(1, 0);
  }, []);

  return (
    <>
      <Graphics
        draw={drawLine}
        x={to([pos1.x, rotation], (x, rot) => x + offset * Math.cos(rot))}
        y={to([pos1.y, rotation], (y, rot) => y + offset * Math.sin(rot))}
        rotation={rotation}
        scale={to([animation.springs.size, length], (size, len) => [
          size[0] * len,
          size[1],
        ])}
      />
      <Graphics
        draw={drawActiveLine}
        x={to([pos1.x, rotation], (x, rot) => x + offset * Math.cos(rot))}
        y={to([pos1.y, rotation], (y, rot) => y + offset * Math.sin(rot))}
        rotation={rotation}
        scale={to([animation.springs.hlSize, length], (size, len) => [
          size[0] * len,
          size[1],
        ])}
        alpha={animation.springs.hlSize.to((w, _) => w)}
      />
    </>
  );
});

export default Line;
