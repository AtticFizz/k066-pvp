import useSize from "@react-hook/size";
import { useState, Fragment, useRef } from "react";
import { Col, FormGroup, Input, Label } from "reactstrap";

import ArrayViz from "./ArrayViz";
import LinkedListViz from "./LinkedListViz";
import StackViz from "./StackViz";
import QueueViz from "./QueueViz";
import BSTViz from "./TreeViz/BSTViz";
import HashTableViz from "./HashTableViz";

export default function VizMaker() {
  const [selectValue, setSelectValue] = useState("");
  const containerRef = useRef(null);
  const [width, height] = useSize(containerRef);

  const SelectViz = (value) => {
    let Component = null;
    switch (value) {
      case "array":
        Component = ArrayViz;
        break;
      case "linked-list":
        Component = LinkedListViz;
        break;
      case "stack":
        Component = StackViz;
        break;
      case "queue":
        Component = QueueViz;
        break;
      case "bst":
        Component = BSTViz;
        break;
      case "hash-table":
        Component = HashTableViz;
        break;
      default:
        return <></>;
    }
    return <Component width={width - 10} height={height - 10} />;
  };

  return (
    <>
      <FormGroup row>
        <Label sm={2} for="viz">
          Duomenų struktūros vizualizacija
        </Label>
        <Col sm={10}>
          <Input
            id="viz"
            type="select"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
          >
            <option value="">Nėra</option>
            <option value="array">Masyvas</option>
            <option value="linked-list">Susietas sąrašas</option>
            <option value="stack">Dėklas</option>
            <option value="queue">Eilė</option>
            <option value="bst">Paieškos medis</option>
            <option value="hash-table">Maišos lentelė</option>
          </Input>
        </Col>
      </FormGroup>
      <div
        className="bg-light"
        style={{ height: 600, resize: "both" }}
        ref={containerRef}
        id="textarea"
      >
        {SelectViz(selectValue)}
      </div>
    </>
  );
}
