import { useCallback, useState, useEffect } from "react";
import { Stage, Graphics, Text, Container } from "@inlet/react-pixi/animated";
import { animated, Controller } from "react-spring";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, Input, Button } from "reactstrap";
import { BsCheckLg } from "react-icons/bs";
import { useImmerReducer } from "use-immer";
import AnimationsQueue from "../api/AnimationsQueue";
import useTaskQueue from "../hooks/useTaskQueue";

const Y_INIT = 230;
const INITIAL = { x: 80, y: Y_INIT, scale: 1, alpha: 1, alphaCorrect: 0, alphaIncorrect: 0, alphaText: 1};
const FILL_NODE = 0x6699ff;
const FILL_NODE_CORRECT = 0x00b212;
const FILL_NODE_INCORRECT = 0x9b0000;
const FILL_TEXT = 0x000000;
const ITEM_SIZE = 120;
const SPACING = 10;
const OFFSET = 20;
const MAX_LENGTH = 8;

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
            <Button disabled={isProcessing || lengthCreate > MAX_LENGTH - 1} className="ms-1"
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
            <Button disabled={isProcessing || array.items.length > MAX_LENGTH - 1} className="ms-1"
              onClick={() => dispatch({type: "add", payload: {value: valueAdd, dispatch}})}
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
            <Button disabled={isProcessing || array.items.length > MAX_LENGTH - 1 || index > MAX_LENGTH - 1 || index >= array.items.length + 1 || index < 0} className="ms-1"
              onClick={() => dispatch({type: "insert", payload: {value: valueInsert, index, dispatch}})}
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
            <Button disabled={isProcessing || array.items.length > MAX_LENGTH - 1 || index > MAX_LENGTH - 1 || index >= array.items.length + 1 || index < 0} className="ms-1"
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
    value: value,
    animationController: new Controller(animationController),
  };
}

function calculatePosition(index, size, spacing, offset) {
  return {x: offset + spacing + size/2 + (spacing + size) * index, y: 90};
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

function addAnimated(draft, value, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = -1;

  if (draft.items.length === draft.size) {
    copyAnimated(draft, dispatch);
  }

  const item = newItem({ value });
  const index = draft.items.length;
  const position = calculatePosition(index, ITEM_SIZE, SPACING, OFFSET);
  const end = {to: [{x: position.x, y: Y_INIT}, position]};
  AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_add", payload: {value: item}}); return [];});
  AnimationsQueue.push(draft.animationQueue, item.animationController, end);
}

function add(draft, item) {
  draft.items = [...draft.items, item];
}

function addNull(draft, item) {
  draft.itemsNull = [...draft.itemsNull, item];
}

function copyAnimated(draft, dispatch) {
  draft.size *= 2; 
  const lastLength = draft.items.length;
  
  let controlers = [draft.copyBorderController];
  let animations = [{y: 2 * Y_INIT}];
  for (let i = 0; i < draft.items.length; i++) {
    const pos = calculatePosition(i, ITEM_SIZE, SPACING, OFFSET);
    const posDown = {x: pos.x, y: 2 * Y_INIT + ITEM_SIZE / 2 + SPACING};
    controlers.push(draft.items[i].animationController);
    animations.push(posDown);
  }

  AnimationsQueue.push(draft.animationQueue, controlers, animations);

  controlers = [draft.borderController];
  animations = [{width: (SPACING + ITEM_SIZE) * draft.size + SPACING}];
  for (let i = draft.size / 2; i < draft.size; i++) {
    const position = calculatePosition(i, ITEM_SIZE, SPACING, OFFSET);
    const nullNew = newItem({value: "NULL", animationController: {...position, alpha: 0, alphaCorrect: 0, alphaIncorrect: 0, alphaText: 1}});
    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_add-null", payload: {value: nullNew}}); return [];})
    controlers.push(nullNew.animationController);
    animations.push({alpha: 0.5});
  }
  
  AnimationsQueue.push(draft.animationQueue, controlers, animations);

  controlers = [draft.copyBorderController];
  animations = [{alpha: 0}];
  for (let i = 0; i < lastLength; i++) {
    const pos = calculatePosition(i, ITEM_SIZE, SPACING, OFFSET);
    const posDown = {x: pos.x, y: 2 * Y_INIT + ITEM_SIZE / 2 + SPACING};
    const copyItem = newItem({value: draft.items[i].value, animationController: {...posDown, alpha: 1, alphaCorrect: 0, alphaIncorrect: 0, alphaText: 1}});
    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_add", payload: {value: copyItem}}); return [];})
    AnimationsQueue.push(draft.animationQueue, draft.items[i].animationController, pos);
    controlers.push(copyItem.animationController);
    animations.push({alpha: 0});
  }

  AnimationsQueue.push(draft.animationQueue, controlers, animations);
  AnimationsQueue.push(draft.animationQueue, draft.copyBorderController, {width: (SPACING + ITEM_SIZE) * draft.size + SPACING});
  AnimationsQueue.push(draft.animationQueue, draft.copyBorderController, {x: OFFSET, y: OFFSET});

  for (let i = lastLength; i < draft.size; i++) {
    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_remove", payload: {value: lastLength}}); return [];});
  }

  AnimationsQueue.push(draft.animationQueue, draft.copyBorderController, {alpha: 1});
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

function insertAnimated(draft, value, index, dispatch) {
  draft.animationQueue = [];
  draft.animationDelay = -1;

  if (draft.items.length === draft.size) {
    copyAnimated(draft, dispatch);
  }

  const item = newItem({ value });
  const position = calculatePosition(index, ITEM_SIZE, SPACING, OFFSET);
  const end = {to: [{x: position.x, y: Y_INIT}, position]};
  for (let i = draft.items.length - 1; i >= index; i--) {
    const nextPos = calculatePosition(i+1, ITEM_SIZE, SPACING, OFFSET);
    AnimationsQueue.push(draft.animationQueue, draft.items[i].animationController, nextPos);
  }
  AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_insert", payload: {value: item, index: index}}); return [];});
  AnimationsQueue.push(draft.animationQueue, item.animationController, end);
}

function insert(draft, item, index) {
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

function init(draft) {
  for (let i = 0; i < 2; i++) {
    const position = calculatePosition(i, ITEM_SIZE, SPACING, OFFSET);
    const controller = {...position, alpha: 0.5, alphaCorrect: 0, alphaIncorrect: 0, alphaText: 1};
    const itemNew = newItem({value: "NULL", animationController: controller});
    draft.itemsNull = [...draft.itemsNull, itemNew];
  }
}

function reducer(draft, action) {
  switch (action.type) {
    case "_init":
      return init(draft);
    case "create":
      return create(draft, action.payload.value);
    case "add":
      return addAnimated(draft, action.payload.value, action.payload.dispatch);
    case "_add":
      return add(draft, action.payload.value);
    case "_add-null":
      return addNull(draft, action.payload.value);
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
      return insertAnimated(draft, action.payload.value, action.payload.index, action.payload.dispatch);
    case "_insert":
      return insert(draft, action.payload.value, action.payload.index);
    case "search":
      return search(draft, action.payload.value);
    case "searchIndex":
      return searchIndex(draft, action.payload.value);
    default:
      throw new Error();
  }
}

const Border = animated((props) => {
  const {x, y, width, height, fill} = props;
  
  const rectangle = (g) => {
    g.clear();
    g.lineStyle(2, fill, 1);
    g.beginFill(0x000000, 0);
    g.drawRoundedRect(x, y, width, height, 15);
    g.endFill();
  };

  return <Graphics draw={rectangle} />;
})

function DynamicArray(props) {
  const params = {fill:FILL_NODE, correctFill:FILL_NODE_CORRECT, incorrectFill:FILL_NODE_INCORRECT, textFill:FILL_TEXT, width:ITEM_SIZE, height:ITEM_SIZE};
  const { array } = props;
  
  const ItemsNull = array.itemsNull.map((v, i) => {
    return (
      <Item
        key={i}
        index={i}
        value={v.value}
        animationController={array.itemsNull[i].animationController}
        {...params}
      />
    )
  });
  
  const Items = array.items.map((v, i) => {
    return (
      <Item
        key={i}
        index={i}
        value={v.value}
        animationController={array.items[i].animationController}
        {...params}
      />
    )
  });

  return (
    <>
      <Container alpha={array.borderController.springs.alpha} >
        <Border
          x={array.borderController.springs.x}
          y={array.borderController.springs.y}
          width={array.borderController.springs.width} // {(SPACING + ITEM_SIZE) * array.size + SPACING}
          height={array.borderController.springs.height} // {SPACING + ITEM_SIZE + SPACING}
          fill={FILL_TEXT}
        />
      </Container>
      <Container alpha={array.copyBorderController.springs.alpha} >
        <Border
          x={array.copyBorderController.springs.x}
          y={array.copyBorderController.springs.y}
          width={array.copyBorderController.springs.width} // {(SPACING + ITEM_SIZE) * array.size + SPACING}
          height={array.copyBorderController.springs.height} // {SPACING + ITEM_SIZE + SPACING}
          fill={FILL_TEXT}
        />
      </Container>
      {ItemsNull}
      {Items}
    </>
  )
}

export default function ArrayViz({ width, height }) {
  const { isProcessing, addTask } = useTaskQueue(true);

  const [array, dispatch] = useImmerReducer(reducer, {
    items: [],
    itemsNull: [],
    size: 2,
    borderController: new Controller({x: OFFSET, y: OFFSET, width: ((SPACING + ITEM_SIZE) * 2 + SPACING), height: (SPACING + ITEM_SIZE + SPACING), alpha: 1}),
    copyBorderController: new Controller({x: OFFSET, y: OFFSET, width: ((SPACING + ITEM_SIZE) * 2 + SPACING), height: (SPACING + ITEM_SIZE + SPACING), alpha: 1}),
    animationQueue: [],
    animationDelay: -1,
  });

  useEffect(() => {
    dispatch({type: "_init"});
  }, [dispatch]);
  
  useEffect(() => { 
    console.log(array); 
  }, [array]);

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

  return (
    <>
      <Stage
        width={width}
        height={height}
        options={{ backgroundAlpha: 0, antialias: true }}
        className="position-absolute"
      >
        <DynamicArray array={array} />
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
