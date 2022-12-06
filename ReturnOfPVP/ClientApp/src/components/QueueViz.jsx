import { useCallback, useState, useEffect } from "react";
import { Stage, Graphics, Text, Container } from "@inlet/react-pixi/animated";
import { animated, Controller } from "react-spring";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, Input, Button } from "reactstrap";
import { BsCheckLg } from "react-icons/bs";
import {useImmerReducer} from "use-immer";
import AnimationsQueue from "../api/AnimationsQueue";
import useTaskQueue from "../hooks/useTaskQueue";

const INITIAL = { x: 2000, y: 2000, scale: 1 };
const COLUMNS = 9;
const ROWS = 4;

const Item = animated(({value, animationController})=>{
    const draw = 
      (g) => {
        g.clear();
        g.lineStyle(2, 0x6699ff, 1);
        g.beginFill(0x6699ff, 1);
        g.drawRoundedRect(0, 0, 120, 120, 15);
      };
    return <><Container {...animationController.springs}>
          <Graphics draw={draw}/>
          <Text text={value} anchor={0.5} x={60} y={60}/>
        </Container></>
  }
)

function VizControlPanel(props) {
    const {value, setValue, index, setIndex, queue, dispatch, isProcessing, ...rest} = props;
    return (
        <div {...rest}>
            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Pridėti"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <div className="d-flex flex-row">
                        <Input value={value} placeholder="reikšmė" type="number" onChange={(e) => setValue(e.target.value)}/>
                        <Button disabled={isProcessing || queue.items.length >= ROWS*COLUMNS} className="ms-1" onClick={() => dispatch({type: "push", payload: {value}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </div>
                </DropdownMenu>
            </UncontrolledDropdown>
  
            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Pašalinti pirmąjį"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <div className="d-flex flex-row">
                        <Button disabled={isProcessing || queue.items.length <= 0} className="ms-1" onClick={() => dispatch({type: "pop", payload: {dispatch}})}>
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
                        <Button disabled={isProcessing || queue.items.length <= 0} className="ms-1" onClick={() => dispatch({type: "peek"})}>
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
    var x = (index%COLUMNS) * 130 + 20;
    if (Math.floor(index / COLUMNS) % 2 !== 0) x = COLUMNS * 130 - x;
    const end = {to:{x: x, y: Math.floor(index/COLUMNS) * 150 + 30}};
    AnimationsQueue.push(draft.animationQueue, item.animationController, end);
    draft.items = [...draft.items, item];
}

function pop(draft, dispatch){
    draft.animationQueue = [];
    draft.animationDelay = -1;
    const index = 0;
    const end = {to:{x:20, y:-1000}};
    AnimationsQueue.push(draft.animationQueue, draft.items[index].animationController, end);
    let shiftControllerList = [];
    let shiftAnimationList = [];
    for(var i = 1; i < draft.items.length; i++){
        var x = ((i-1) % COLUMNS) * 130 + 20;
        if (Math.floor((i-1) / COLUMNS) % 2 !== 0) x = COLUMNS * 130 - x;
        const end = {to:{x: x, y: Math.floor((i-1) / COLUMNS) * 150 + 30}};
        shiftControllerList.push(draft.items[i].animationController);
        shiftAnimationList.push(end);
    }
    AnimationsQueue.push(draft.animationQueue, shiftControllerList, shiftAnimationList);
    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "remove", payload: {value: index}}); return [];});
}

function removeItem(draft, index) {
    draft.items = draft.items.filter((v, i) => {return i !== index;});
}

function peek(draft){
    draft.animationQueue = [];
    draft.animationDelay = -1;
    const index = 0;
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

function Queue(props){
    const {queue} = props;
    return (queue.items.map((v,i)=>{
      return (<Item index={i} value={v.value} animationController={queue.items[i].animationController} key={i}/>)
    }))
}

export default function QueueViz({ width, height }) {
    const { isProcessing, addTask } = useTaskQueue(true);
    const [queue, dispatch] = useImmerReducer(reducer, {
      items: [],
      animationQueue: [],
      animationDelay: -1,
    });
    const drawArrow = useCallback((g) => {
        g.clear();
        g.lineStyle(2, 0x000000, 1);
        g.moveTo(30, 15);
        g.lineTo(1160, 15);
        g.endFill();
        g.lineStyle(2, 0x000000, 1);
        g.beginFill(0x000000)
        g.moveTo(1160, 15);
        g.lineTo(1160, 10);
        g.lineTo(1170, 15);
        g.lineTo(1160, 20);
        g.lineTo(1160, 15);
        g.endFill();
      }, []);
    const [value, setValue] = useState(0);
    const [index, setIndex] = useState(0);
    useEffect(()=>{console.log(queue)}, [queue]);
    useEffect(() => {
        if (queue.animationQueue.length > 0) {
            if (queue.animationDelay === -1) {
                addTask(() => AnimationsQueue.playSequentially([...queue.animationQueue]));
            }
            else {
                addTask(() => AnimationsQueue.playWithDelay([...queue.animationQueue], queue.animationDelay));
            }
        }
    }, [addTask, queue.animationQueue, queue.animationDelay])
    return (
      <div className="position-relative h-100">
      <Stage
          width={width}
          height={height}
          options={{ backgroundAlpha: 0, antialias: true }}
          className="position-absolute"
        >
            <Graphics draw={drawArrow}></Graphics>
            <Graphics draw={drawArrow} y={300}></Graphics>
            <Graphics draw={drawArrow} x={1290} y={180} angle={180}></Graphics>
            <Graphics draw={drawArrow} x={1290} y={480} angle={180}></Graphics>
            <Queue queue={queue}/>
      </Stage>
        <VizControlPanel
                  className="position-absolute d-flex flex-column bottom-0 ms-2 mb-2"
                  style={{width: 180}}
                  value={value}
                  setValue={setValue}
                  index={index}
                  setIndex={setIndex}
                  dispatch={dispatch}
                  queue={queue}
                  isProcessing={isProcessing}
              />
      </div>
    )
}