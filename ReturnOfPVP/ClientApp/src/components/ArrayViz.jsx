import { useCallback, useState, useEffect } from "react";
import { Stage, Graphics, Text, Container } from "@inlet/react-pixi/animated";
import { animated, Controller } from "react-spring";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, Input, Button } from "reactstrap";
import { BsCheckLg } from "react-icons/bs";
import { useImmerReducer } from "use-immer";
import AnimationsQueue from "../api/AnimationsQueue";
import useTaskQueue from "../hooks/useTaskQueue";

const Y_INIT = 220;
const INITIAL = { x: 80, y: Y_INIT, scale: 1, alpha: 1, alphaCorrect: 0, alphaIncorrect: 0, alphaText: 1};
const FILL_NODE = 0x6699ff;
const FILL_NODE_CORRECT = 0x00b212;
const FILL_NODE_INCORRECT = 0x9b0000;
const FILL_TEXT = 0x000000;
const ITEM_SIZE = 120;
const SPACING = 10;
const OFFSET = 20;

const Item = animated((props) => {
  const {value, index, animationController, fill, correctFill, incorrectFill, textFill, width, height} = props;

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
      <Container {...animationController.springs}>
        <Graphics draw={rectangle}/>
        <Graphics draw={rectangleCorrect} alpha={animationController.springs.alphaCorrect}/>
        <Graphics draw={rectangleIncorrect} alpha={animationController.springs.alphaIncorrect}/>
        <Text text={value} anchor={0.5} x={0} y={0} scale={1.25} style={{ fill: textFill }} resolution={16} alpha={animationController.springs.alphaText}/>
        <Text text={index} anchor={{ x: -0.4, y: -0.2 }} x={-width / 2} y={-height / 2} scale={0.75} style={{ fill: textFill }} resolution={1}/>
      </Container>
    </>
  );
});

function VizControlPanel(props) {
  const { array, dispatch, isProcessing, ...rest } = props;
  const [valueAdd, setValueAdd] = useState(0);
  const [valueInsert, setValueInsert] = useState(0);
  const [valueRemove, setValueRemove] = useState(0);
  const [valueSearch, setValueSearch] = useState(0);
  const [valueChange, setValueChange] = useState(0);
  const [index, setIndex] = useState(0);
  const [indexSearch, setIndexSearch] = useState(0);
  const [indexChange, setIndexChange] = useState(0);
  const [removeIndex, setRemoveIndex] = useState(0);
  const [lengthCreate, setLengthCreate] = useState(0);
  return (
    <div {...rest}>
      <UncontrolledDropdown className="mt-1" direction="end">
        <DropdownToggle caret className="w-100 text-light">
          {"Sukurti"}
        </DropdownToggle>
        <DropdownMenu modifiers={[{ name: "offset", options: { offset: [0, 7] } }]} className="p-0 border-0 bg-transparent">
          <form className="d-flex flex-row align-items-baseline" style={{width: 220}} onSubmit={(e) => e.preventDefault()}>
            <p className="me-2 ms-2" style={{"fontSize": 14}}>Ilgis: </p>
            <Input value={lengthCreate} placeholder="reikšmė" type="number" onChange={(e) => setLengthCreate(parseInt(e.target.value))}/>
            <Button disabled={isProcessing || lengthCreate >= 9} className="ms-1"
              onClick={() => dispatch({type: "create", payload: {value: lengthCreate}})}
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
        <DropdownMenu modifiers={[{ name: "offset", options: { offset: [0, 7] } }]} className="p-0 border-0">
          <div className="d-flex flex-row">
            <Input value={valueAdd} placeholder="reikšmė" type="number" onChange={(e) => setValueAdd(parseInt(e.target.value))}/>
            <Button disabled={isProcessing || array.items.length >= 9} className="ms-1"
              onClick={() => dispatch({type: "add", payload: {value: valueAdd}})}
            >
              <BsCheckLg className="text-light" />
            </Button>
          </div>
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown className="mt-1" direction="end">
        <DropdownToggle caret className="w-100 text-light">
          {"Įterpti"}
        </DropdownToggle>
        <DropdownMenu modifiers={[{ name: "offset", options: { offset: [0, 7] } }]} className="p-0 border-0 bg-transparent">
          <form className="d-flex flex-row align-items-baseline" style={{width: 420}} onSubmit={(e) => e.preventDefault()}>
            <p className="me-2 ms-2" style={{"fontSize": 14}}>Reikšmė: </p>
            <Input value={valueInsert} placeholder="reikšmė" type="number" onChange={(e) => setValueInsert(parseInt(e.target.value))}/>
            <p className="me-2 ms-2" style={{"fontSize": 14}}>Indeksas: </p>
            <Input value={index} placeholder="indeksas" type="number" className="ms-1" onChange={(e) => setIndex(parseInt(e.target.value))}/>
            <Button disabled={isProcessing || array.items.length >= 9 || index >= 9 || index >= array.items.length + 1 || index < 0} className="ms-1"
              onClick={() => dispatch({type: "insert", payload: {value: valueInsert, index}})}
            >
              <BsCheckLg className="text-light" />
            </Button>
          </form>
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown className="mt-1" direction="end">
        <DropdownToggle caret className="w-100 text-light">
          {"Pakeisti"}
        </DropdownToggle>
        <DropdownMenu modifiers={[{ name: "offset", options: { offset: [0, 7] } }]} className="p-0 border-0 bg-transparent">
          <form className="d-flex flex-row align-items-baseline" style={{width: 420}} onSubmit={(e) => e.preventDefault()}>
            <p className="me-2 ms-2" style={{"fontSize": 14}}>Reikšmė: </p>
            <Input value={valueChange} placeholder="reikšmė" type="number" onChange={(e) => setValueChange(parseInt(e.target.value))}/>
            <p className="me-2 ms-2" style={{"fontSize": 14}}>Indeksas: </p>
            <Input value={indexChange} placeholder="indeksas" type="number" className="ms-1" onChange={(e) => setIndexChange(parseInt(e.target.value))}/>
            <Button disabled={isProcessing || array.items.length >= 9 || index >= 9 || index >= array.items.length + 1 || index < 0} className="ms-1"
              onClick={() => dispatch({type: "change", payload: {value: valueChange, index: indexChange, dispatch}})}
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
        <DropdownMenu modifiers={[{ name: "offset", options: { offset: [0, 7] } }]} className="p-0 border-0 bg-transparent">
          <form className="d-flex flex-row align-items-baseline" style={{width: 420}} onSubmit={(e) => e.preventDefault()}>
            <p className="me-2 ms-2" style={{"fontSize": 14}}>Reikšmė: </p>
            <Input value={valueRemove} placeholder="reikšmė" type="number" onChange={(e) => setValueRemove(parseInt(e.target.value))}/>
            <Button disabled={isProcessing || array.items.length <= 0} className="ms-1"
              onClick={() => dispatch({type: "remove", payload: {value: valueRemove, dispatch}})}
            >
              <BsCheckLg className="text-light" />
            </Button>

            <p className="me-2 ms-2" style={{"fontSize": 14}}>Indeksas: </p>
            <Input value={removeIndex} placeholder="reikšmė" type="number" onChange={(e) => setRemoveIndex(parseInt(e.target.value))}/>
            <Button disabled={isProcessing || array.items.length <= 0 || array.items.length <= removeIndex || removeIndex < 0} className="ms-1"
              onClick={() => dispatch({type: "removeIndex", payload: {value: parseInt(removeIndex), dispatch}})}
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
        <DropdownMenu modifiers={[{ name: "offset", options: { offset: [0, 7] } }]} className="p-0 border-0">
          <form className="d-flex flex-row align-items-baseline" style={{width: 420}} onSubmit={(e) => e.preventDefault()}>
            <p className="me-2 ms-2" style={{"fontSize": 14}}>Reikšmė: </p>
            <Input value={valueSearch} placeholder="reikšmė" type="number" onChange={(e) => setValueSearch(parseInt(e.target.value))}/>
            <Button disabled={isProcessing} className="ms-1"
              onClick={() => dispatch({type: "search", payload: {value: valueSearch}})}
            >
              <BsCheckLg className="text-light" />
            </Button>
            
            <p className="me-2 ms-2" style={{"fontSize": 14}}>Indekas: </p>
            <Input value={indexSearch} placeholder="reikšmė" type="number" onChange={(e) => setIndexSearch(parseInt(e.target.value))}/>
            <Button disabled={isProcessing} className="ms-1"
              onClick={() => dispatch({type: "searchIndex", payload: {value: indexSearch}})}
            >
              <BsCheckLg className="text-light" />
            </Button>
          </form>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
}

function newItem({ value, animationController = INITIAL }) {
  return {
    value: parseInt(value),
    animationController: new Controller(animationController),
  };
}

function calculatePosition(index, size, spacing, offset) {
  return {x: offset + size/2 + (spacing + size)*index, y: 80};
}

function create(draft, length){
  draft.animationQueue = [];
  draft.animationDelay = 10;
  draft.items = [];
  for(var i = 0; i < length; i++) {
    const value = Math.floor(Math.random() * 1000).toString();
    const item = newItem({ value });
    const index = draft.items.length;
    const position = calculatePosition(index, ITEM_SIZE, SPACING, OFFSET);
    const end = {to: [{x: position.x, y: Y_INIT}, position]};
    AnimationsQueue.push(draft.animationQueue, item.animationController, end);
    draft.items = [...draft.items, item];
  }
}

function add(draft, value) {
  draft.animationQueue = [];
  draft.animationDelay = -1;
  const item = newItem({ value });
  const index = draft.items.length;
  const position = calculatePosition(index, ITEM_SIZE, SPACING, OFFSET);
  const end = {to: [{x: position.x, y: Y_INIT}, position]};
  AnimationsQueue.push(draft.animationQueue, item.animationController, end);
  draft.items = [...draft.items, item];
}

function change(draft, value, index, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = -1;
  const item = newItem({ value });
  const position = calculatePosition(index, ITEM_SIZE, SPACING, OFFSET);
  const end = {to: [{x: position.x, y: Y_INIT}, position]};
  AnimationsQueue.push(draft.animationQueue, item.animationController, end);
  draft.items = [...draft.items, item];
  AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_change", payload: {value: item, index: index}}); return [];});
  const length = draft.items.length;
  AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_remove", payload: {value: length-1}}); return [];});
}

function changeItem(draft, value, index) {
  draft.items.splice(index, 1, value);
}

function insert(draft, value, index) {
  draft.animationQueue = [];
  draft.animationDelay = -1;
  const item = newItem({ value });
  const position = calculatePosition(index, ITEM_SIZE, SPACING, OFFSET);
  const end = {to: [{x: position.x, y: Y_INIT}, position]};
  for (let i = draft.items.length - 1; i >= index; i--) {
    const nextPos = calculatePosition(i+1, ITEM_SIZE, SPACING, OFFSET);
    AnimationsQueue.push(draft.animationQueue, draft.items[i].animationController, nextPos);
  }
  AnimationsQueue.push(draft.animationQueue, item.animationController, end);
  draft.items.splice(index, 0, item);
}

function search(draft, value) {
  draft.animationQueue = [];
  draft.animationDelay = -1;
  for (let i = 0; i < draft.items.length; i++) {
    if (draft.items[i].value === value) {
      const end = {to:[{scale: 1.2, alphaCorrect: 1}, {scale: 1, alphaCorrect: 0}]};
      AnimationsQueue.push(draft.animationQueue, draft.items[i].animationController, end);
      break;
    }
    const next = {to:[{scale: 1.2, alphaIncorrect: 1}, {scale: 1, alphaIncorrect: 0}]};
    AnimationsQueue.push(draft.animationQueue, draft.items[i].animationController, next);
  }
}

function searchIndex(draft, index) {
  draft.animationQueue = [];
  draft.animationDelay = -1;
  const end = {to:[{scale: 1.2, alphaCorrect: 1}, {scale: 1, alphaCorrect: 0}]};
  AnimationsQueue.push(draft.animationQueue, draft.items[parseInt(index)].animationController, end);
}

function remove(draft, value, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = -1;
  search(draft, value);
  const ind = draft.items.findIndex((object) => { return object.value === value; });
  if (ind <= draft.items.length - 1 && ind >= 0) {
    for (let i = ind + 1; i < draft.items.length; i++) {
      const nextPos = calculatePosition(i-1, ITEM_SIZE, SPACING, OFFSET);
      AnimationsQueue.push(draft.animationQueue, draft.items[i].animationController, nextPos);
    }
    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_remove", payload: {value: ind}}); return [];});
  }
}

function removeItem(draft, index) {
    draft.items = draft.items.filter((v, i) => {return i !== index;});
}

function removeByIndex(draft, index, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = -1;
  searchIndex(draft, index);
  if (index <= draft.items.length - 1 && index >= 0) {
    for (let i = index + 1; i < draft.items.length; i++) {
      const nextPos = calculatePosition(i-1, ITEM_SIZE, SPACING, OFFSET);
      AnimationsQueue.push(draft.animationQueue, draft.items[i].animationController, nextPos);
    }
    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_remove", payload: {value: index}}); return [];});
  }
}

function reducer(draft, action) {
  switch (action.type) {
    case "create":
      return create(draft, action.payload.value);
    case "add":
      return add(draft, action.payload.value);
    case "change":
        return change(draft, action.payload.value, action.payload.index, action.payload.dispatch);
    case "_change":
        return changeItem(draft, action.payload.value, action.payload.index);
    case "_remove":
      return removeItem(draft, action.payload.value);
    case "remove":
      return remove(draft, action.payload.value, action.payload.dispatch);
    case "removeIndex":
      return removeByIndex(draft, action.payload.value, action.payload.dispatch);
    case "insert":
      return insert(draft, action.payload.value, action.payload.index);
    case "search":
      return search(draft, action.payload.value);
    case "searchIndex":
      return searchIndex(draft, action.payload.value);
    default:
      throw new Error();
  }
}

function ArrayThis(props) {
  const fill = {fill:FILL_NODE, correctFill:FILL_NODE_CORRECT, incorrectFill:FILL_NODE_INCORRECT, textFill:FILL_TEXT, width:ITEM_SIZE, height:ITEM_SIZE, alpha:1, alphaCorrect:0, alphaIncorrect:0, alphaText:1};
  const { array} = props;
  return array.items.map((v, i) => {
    return (
      <Item
        index={i}
        value={v.value}
        animationController={array.items[i].animationController}
        key={i}
        {...fill}
      />
    );
  });
}

export default function ArrayViz({ width, height }) {
  const { isProcessing, addTask } = useTaskQueue(true);

  const [array, dispatch] = useImmerReducer(reducer, {
    items: [],
    animationQueue: [],
    animationDelay: -1,
  });
  
  useEffect(() => { console.log(array); }, [array]);

  useEffect(() => {
    if (array.animationQueue.length > 0) {
      if (array.animationDelay === -1) {
          addTask(() => AnimationsQueue.playSequentially([...array.animationQueue]));
      }
      else {
          addTask(() => AnimationsQueue.playWithDelay([...array.animationQueue], array.animationDelay));
      }
    }
  }, [addTask, array.animationQueue, array.animationDelay]);

  const drawArray = useCallback((g) => {
    g.clear();
    g.lineStyle(2, 0x000000, 1);
    g.beginFill(0xff700b, 0);
    g.drawRoundedRect(10, 10, 1180, 140, 15);
    g.endFill();
  }, []);
  const fill = {fill:FILL_NODE, correctFill:FILL_NODE_CORRECT, incorrectFill:FILL_NODE_INCORRECT, textFill:FILL_TEXT, width:ITEM_SIZE, height:ITEM_SIZE};
  return (
    <>
      <Stage
        width={width}
        height={height}
        options={{ backgroundAlpha: 0, antialias: true }}
        className="position-absolute"
      >
        <Graphics draw={drawArray} />
        {[...Array(9)].map((v, i)=>{
          return <Item key={i} value={"NULL"} index={i} animationController={new Controller({...calculatePosition(i,ITEM_SIZE,SPACING,OFFSET), alpha:0.5, alphaCorrect:0, alphaIncorrect:0, alphaText:0.5})} {...fill}/>
        })}
        <ArrayThis array={array} />
      </Stage>
      <VizControlPanel
        className="position-absolute d-flex flex-column bottom-0 ms-2 mb-2"
        style={{ width: 180 }}
        dispatch={dispatch}
        isProcessing={isProcessing}
        array={array}
      />
    </>
  );
}
