import { useCallback, useState, useEffect } from "react";
import { Stage, Graphics, Text, Container } from "@inlet/react-pixi/animated";
import { animated, Controller } from "react-spring";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, Input, Button } from "reactstrap";
import { BsCheckLg } from "react-icons/bs";
import {useImmerReducer} from "use-immer";
import AnimationsQueue from "../api/AnimationsQueue";
import useTaskQueue from "../hooks/useTaskQueue";

const INITIAL = { x: 80, y: 20, scale: 1 };

const Item = animated(({value, animationController})=>{
    const draw = 
      (g) => {
        g.clear();
        g.lineStyle(2, 0x6699ff, 1);
        g.beginFill(0x6699ff, 1);
        g.drawRoundedRect(0, 0, 80, 80, 15);
      };
    return <><Container {...animationController.springs}>
          <Graphics draw={draw}/>
          <Text text={value} anchor={0.5} x={40} y={40}/>
        </Container></>
  }
)

function VizControlPanel(props) {
    const {value, setValue, index, setIndex, stack, dispatch, isProcessing, ...rest} = props;
    return (
        <div {...rest}>
            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Pridėti"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <div className="d-flex flex-row">
                        <Input value={value} placeholder="reikšmė" type="number" onChange={(e) => setValue(e.target.value)}/>
                        <Button disabled={isProcessing || stack.items.length >= 7} className="ms-1" onClick={() => dispatch({type: "push", payload: {value}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
  
            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Pašalinti viršutinįjį"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <div className="d-flex flex-row">
                        <Button disabled={isProcessing || stack.items.length <= 0} className="ms-1" onClick={() => dispatch({type: "pop", payload: {dispatch}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
  
            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Žvilgtelėti"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <div className="d-flex flex-row">
                        <Button disabled={isProcessing || stack.items.length <= 0} className="ms-1" onClick={() => dispatch({type: "peek"})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
}

function newItem({ value, animationController = INITIAL})
{
    return {
    value,
    animationController: new Controller(animationController),
    };
}

function push(draft, value){
    draft.animationQueue = [];
    draft.animationDelay = -1;
    const item = newItem({value});
    const index = draft.items.length;
    const end = {to:[{x:410, y:20}, {x:410, y:(6-index)*90+20}]};
    AnimationsQueue.push(draft.animationQueue, item.animationController, end);
    draft.items = [...draft.items, item];
}

function pop(draft, dispatch){
    draft.animationQueue = [];
    draft.animationDelay = -1;
    const index = draft.items.length - 1;
    const end = {to:[{x:410, y:20}, {x:-100, y:20}]};
    AnimationsQueue.push(draft.animationQueue, draft.items[index].animationController, end);
    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "remove", payload: {value: index}}); return [];});
}

function removeItem(draft, index) {
    draft.items = draft.items.filter((v, i) => {return i !== index;});
}

function peek(draft){
    draft.animationQueue = [];
    draft.animationDelay = -1;
    const index = draft.items.length - 1;
    const end = {to:[{scale: 1.2}, {scale: 1}]};
    AnimationsQueue.push(draft.animationQueue, draft.items[index].animationController, end);
}

function reducer(draft, action){
    switch(action.type){
      case "push":
        return push(draft, action.payload.value);
      case "pop":
        return pop(draft, action.payload.dispatch);
      case "peek":
        return peek(draft);
      case "remove":
          return removeItem(draft, action.payload.value);
      default:
        throw new Error();
    }
}

function Stack(props){
    const {stack} = props;
    return (stack.items.map((v,i)=>{
      return (<Item index={i} value={v.value} animationController={stack.items[i].animationController} key={i}/>)
    }))
}

export default function StackViz({ width, height }) {
    const { isProcessing, addTask } = useTaskQueue(true);
    const [stack, dispatch] = useImmerReducer(reducer, {
      items: [],
      animationQueue: [],
      animationDelay: -1,
    });
    const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);
    useEffect(()=>{console.log(stack)}, [stack]);
    useEffect(() => {
        if (stack.animationQueue.length > 0) {
            if (stack.animationDelay === -1) {
                addTask(() => AnimationsQueue.playSequentially([...stack.animationQueue]));
            }
            else {
                addTask(() => AnimationsQueue.playWithDelay([...stack.animationQueue], stack.animationDelay));
            }
        }
    }, [addTask, stack.animationQueue, stack.animationDelay])
    const drawArray = useCallback((g) => {
      g.clear();
      g.lineStyle(2, 0x000000, 1);
      g.beginFill(0xff700b, 0);
      g.drawRoundedRect(400, 10, 100, 640, 15);
      g.endFill();
    }, [])
    return (
      <div className="position-relative h-100">
      <Stage
          width={width}
          height={height}
          options={{ backgroundAlpha: 0, antialias: true }}
          className="position-absolute"
        >
            <Graphics draw={drawArray} />
            <Stack stack={stack}/>
      </Stage>
        <VizControlPanel
                  className="position-absolute d-flex flex-column bottom-0 ms-2 mb-2"
                  style={{width: 180}}
                  value={value}
                  setValue={setValue}
                  index={index}
                  setIndex={setIndex}
                  dispatch={dispatch}
                  stack={stack}
                  isProcessing={isProcessing}
              />
      </div>
    )
}