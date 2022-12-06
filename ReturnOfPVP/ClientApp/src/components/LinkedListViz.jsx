import { Graphics, Stage, Container, Text } from "@inlet/react-pixi/animated";
import { animated, Controller } from "react-spring";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, Input, Button } from "reactstrap";
import { useCallback, useEffect, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useImmerReducer } from "use-immer";

import AnimationsQueue from "../api/AnimationsQueue";
import useTaskQueue from "../hooks/useTaskQueue";

// https://localhost:44429

const DELAY = 270;
const CONFIG = {mass: 1, tension: 120, friction: 14};
const SPAWN = {x: 0, y: 1000, scale: 1, alpha: 1, alphaCorrect: 0, alphaIncorrect: 0, config: CONFIG};
const BASE_POSITION = {x: 160, y: 155};
const SIZE = {width: 100, height: 100};
const COLUMNS = 7;
const ROWS = 4;
const MIN_LENGTH = 3;
const MAX_LENGTH = 25;

const VALUE_MIN = -999;
const VALUE_MAX = 999;

const FILL_NODE = 0x6699ff;
const FILL_NODE_CORRECT = 0x00B212;
const FILL_NODE_INCORRECT = 0x9B0000;
const FILL_TEXT = 0x000000;
const FILL_LINK = 0x000000;

const SEARCH_JUMP = 50;

function VizControlPanel(props) {
    const {linkedList, dispatch, isProcessing, ...rest} = props;

    const [length, setLength] = useState(MIN_LENGTH);
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [valueAdd, setValueAdd] = useState("");
    const [valueInsert, setValueInsert] = useState("");
    const [indexInsert, setIndexInsert] = useState("");
    const [valueRemove, setValueRemove] = useState("");
    const [indexRemove, setIndexRemove] = useState("");
    const [valueSearch, setValueSearch] = useState("");

    return (
        <div {...rest}>
            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Sukurti"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <form className="d-flex flex-row" style={{width: 420}} onSubmit={(e) => e.preventDefault()}>
                        <Input autoFocus onFocus={(e) => e.target.select()} value={length} placeholder="ilgis" type="number" onChange={(e) => {
                                if (e.target.value === "") {
                                    setLength(e.target.value);
                                    return;
                                }

                                let value = parseInt(e.target.value);
                                if (value < MIN_LENGTH)
                                    value = MIN_LENGTH;
                                else if (value >  MAX_LENGTH)
                                    value =  MAX_LENGTH;
                                
                                setLength(value);
                            }}/>
                        <Input value={min} placeholder="min" type="number" onChange={(e) => {
                                if (e.target.value === "") {
                                    setMin(e.target.value);
                                    return;
                                }
                                
                                let value = parseInt(e.target.value);                 
                                if (value < VALUE_MIN)
                                    value = VALUE_MIN;
                                else if (value > VALUE_MAX)
                                    value = VALUE_MAX;

                                if (max === "" || max < value + 1) {
                                    setMin(value)
                                    setMax(value)
                                    return;
                                }
                            
                                setMin(value);
                            }}/>
                        <Input value={max} placeholder="max" type="number" onChange={(e) => { 
                                if (e.target.value === "") {
                                    setMax(e.target.value);
                                    return;
                                }
                                
                                let value = parseInt(e.target.value);       
                                if (value < VALUE_MIN)
                                    value = VALUE_MIN;
                                else if (value > VALUE_MAX)
                                    value = VALUE_MAX;

                                if (min === "" || min > value - 1) {
                                    setMin(value)
                                    setMax(value)
                                    return;
                                }
                            
                                setMax(value);
                            }}/>
                        <Button type="submit" disabled={isProcessing || length === "" || min === "" || max === ""} className="ms-1" onClick={() => dispatch({type: "create", payload: {length, min, max, dispatch}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </form>
                </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Pridėti"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <form className="d-flex flex-row" onSubmit={(e) => e.preventDefault()}>
                        <Input autoFocus onFocus={(e) => e.target.select()} value={valueAdd} placeholder="reikšmė" type="number" onChange={(e) => {
                            if (e.target.value === "") {
                                setValueAdd(e.target.value);
                                return;
                            }
                            
                            let value = parseInt(e.target.value);       
                            if (value < VALUE_MIN)
                                value = VALUE_MIN;
                            else if (value > VALUE_MAX)
                                value = VALUE_MAX;
                            
                            setValueAdd(value);
                        }}/>
                        <Button type="submit" disabled={isProcessing || linkedList.nodes.length >= ROWS * COLUMNS || linkedList.nodes.length >= MAX_LENGTH || valueAdd === ""} className="ms-1" onClick={() => dispatch({type: "add", payload: {value: valueAdd, dispatch}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </form>
                </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown className="mt-1" direction="end" >
                <DropdownToggle caret className="w-100 text-light">
                    {"Įterpti"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0 bg-transparent">
                    <form className="d-flex flex-row align-items-baseline" style={{width: 420}} onSubmit={(e) => e.preventDefault()}>
                        <p className="me-2 ms-2" style={{"fontsize": 14}}>Reikšmė: </p>
                        <Input autoFocus onFocus={(e) => e.target.select()} value={valueInsert} placeholder="reikšmė" type="number" onChange={(e) => {
                            if (e.target.value === "") {
                                setValueInsert(e.target.value);
                                return;
                            }
                            
                            let value = parseInt(e.target.value);       
                            if (value < VALUE_MIN)
                                value = VALUE_MIN;
                            else if (value > VALUE_MAX)
                                value = VALUE_MAX;
                            
                            setValueInsert(value);
                        }}/>
                        
                        <p className="me-2 ms-2" style={{"fontsize": 14}}>Indeksas: </p>
                        <Input value={indexInsert} placeholder="indeksas" type="number" className="ms-1" onChange={(e) => {
                                if (e.target.value === "") {
                                    setIndexInsert(e.target.value);
                                    return;
                                }

                                let index = parseInt(e.target.value);
                                if (index < 1)
                                    index = 1;
                                else if (index > linkedList.nodes.length - 1)
                                    index = linkedList.nodes.length - 1;

                                setIndexInsert(index);
                            }}/>
                        <Button type="submit" disabled={isProcessing || valueInsert === "" || indexInsert === "" || linkedList.nodes.length >= ROWS * COLUMNS || linkedList.nodes.length >= MAX_LENGTH || indexInsert >= linkedList.nodes.length} className="ms-1" onClick={() => dispatch({type: "insert", payload: {value: valueInsert, index: indexInsert, dispatch}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </form>
                </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Pašalinti"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <form className="d-flex flex-row align-items-baseline" style={{width: 460}} onSubmit={(e) => e.preventDefault()}>
                        <p className="me-2 ms-2" style={{"fontsize": 14}}>Reikšmė: </p>
                        <Input autoFocus onFocus={(e) => e.target.select()} value={valueRemove} placeholder="reikšmė" type="number" onChange={(e) => {
                            if (e.target.value === "") {
                                setValueRemove(e.target.value);
                                return;
                            }
                            
                            let value = parseInt(e.target.value);       
                            if (value < VALUE_MIN)
                                value = VALUE_MIN;
                            else if (value > VALUE_MAX)
                                value = VALUE_MAX;
                            
                            setValueRemove(value);
                        }}/>
                        <Button disabled={isProcessing || valueRemove === ""} type="submit" className="ms-1" onClick={() => dispatch({type: "remove", payload: {value: valueRemove, dispatch, removeIndex: false}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                        
                        <p className="me-2 ms-2" style={{"fontsize": 14}}>Indeksas: </p>
                        <Input value={indexRemove} placeholder="indeksas" type="number" className="ms-1" onChange={(e) => {
                                if (e.target.value === "") {
                                    setIndexRemove(e.target.value);
                                    return;
                                }

                                let index = parseInt(e.target.value);
                                if (index < 1)
                                    index = 1;
                                else if (index > linkedList.nodes.length - 2)
                                    index = linkedList.nodes.length - 2;

                                setIndexRemove(index);
                            }}/>
                        <Button disabled={isProcessing || indexRemove === ""} type="submit" className="ms-1" onClick={() => dispatch({type: "remove", payload: {value: indexRemove, dispatch, removeIndex: true}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </form>
                </DropdownMenu>
            </UncontrolledDropdown>

            <UncontrolledDropdown className="mt-1" direction="end">
                <DropdownToggle caret className="w-100 text-light">
                    {"Surasti"}
                </DropdownToggle>
                <DropdownMenu modifiers={[{name: "offset", options: {offset: [0, 7]}}]} className="p-0 border-0">
                    <form className="d-flex flex-row" onSubmit={(e) => e.preventDefault()}>
                        <Input autoFocus onFocus={(e) => e.target.select()} value={valueSearch} placeholder="reikšmė" type="number" onChange={(e) => {
                            if (e.target.value === "") {
                                setValueSearch(e.target.value);
                                return;
                            }
                            
                            let value = parseInt(e.target.value);       
                            if (value < VALUE_MIN)
                                value = VALUE_MIN;
                            else if (value > VALUE_MAX)
                                value = VALUE_MAX;
                            
                            setValueSearch(value);
                        }}/>
                        <Button disabled={isProcessing || valueSearch === ""} type="submit" className="ms-1" onClick={() => dispatch({type: "search", payload: {value: valueSearch, dispatch}})}>
                            <BsCheckLg className="text-light"/>
                        </Button>
                    </form>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
}

function reducer(draft, action) {
    switch (action.type) {
        case "init":
            return init(draft);
        case "create":
            return createAnimated(draft, action.payload.length, action.payload.min, action.payload.max, action.payload.dispatch);
        case "add":
            return addAnimated(draft, action.payload.value, action.payload.dispatch);
        case "insert":
            return insertAnimated(draft, action.payload.value, action.payload.index, action.payload.dispatch);
        case "remove":
            return removeAnimated(draft, action.payload.value, action.payload.dispatch, action.payload.removeIndex);
        case "search":
            return searchAnimated(draft, action.payload.value);
        case "_create":
            return create(draft, action.payload.nodes, action.payload.links);
        case "_add":
            return add(draft, action.payload.node, action.payload.link);
        case "_insert":
            return insert(draft, action.payload.node, action.payload.link, action.payload.index);
        case "_remove":
            return remove(draft, action.payload.index);
        default:
            throw new Error();
    }
}

function init(draft) {
    draft.animationQueue = [];
    draft.animationDelay = 0;
    const headPos = calculatePosition(0, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    const tailPos = calculatePosition(1, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    AnimationsQueue.push(draft.animationQueue, draft.nodes[0].animationController, headPos);
    AnimationsQueue.push(draft.animationQueue, draft.nodes[1].animationController, tailPos);
    AnimationsQueue.push(draft.animationQueue, draft.links[0].animationController, tailPos);
}

function createAnimated(draft, length, min, max, dispatch) {
    draft.animationQueue = [];
    draft.animationDelay = DELAY;

    let removeLinksControllers = [];
    let removeLinksAnimations = [];
    let removeControllers = [];
    let removeAnimations = [];

    const headPos = calculatePosition(0, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    removeLinksControllers.push(draft.links[0].animationController);
    removeLinksAnimations.push(headPos);

    for (let i = 1; i < draft.nodes.length - 1; i++) {
        const nextLinkPose = calculatePosition(i, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
        const nextPos = {x: nextLinkPose.x, y: nextLinkPose.y + SEARCH_JUMP, alpha: 0};

        removeLinksControllers.push(draft.links[i].animationController);
        removeLinksAnimations.push(nextLinkPose);
        removeControllers.push(draft.nodes[i].animationController);
        removeAnimations.push(nextPos);
        removeControllers.push(draft.links[i].animationController);
        removeAnimations.push(nextPos);
    }

    AnimationsQueue.push(draft.animationQueue, removeLinksControllers, removeLinksAnimations);
    AnimationsQueue.push(draft.animationQueue, removeControllers, removeAnimations);

    const tailPos = calculatePosition(length - 1, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    AnimationsQueue.push(draft.animationQueue, draft.nodes[draft.nodes.length - 1].animationController, tailPos);

    let nodes = [];
    let links = [];

    let moveControllers = [];
    let moveAnimations = [];
    let connectLinksControllers = [];
    let connectLinksAnimations = [];

    const firstPos = calculatePosition(1, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    connectLinksControllers.push(draft.links[0].animationController);
    connectLinksAnimations.push(firstPos);

    for (let i = 1; i < length - 1; i++) {
        const value = randomInt(min, max).toString();
        const node = newNode({value});
        const link = newLink({});
        const currPos = calculatePosition(i, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
        const nextPos = calculatePosition(i + 1, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);

        nodes.push(node);
        links.push(link);

        moveControllers.push(node.animationController);
        moveAnimations.push(currPos);
        moveControllers.push(link.animationController);
        moveAnimations.push(currPos);
        connectLinksControllers.push(link.animationController);
        connectLinksAnimations.push(nextPos);
    }

    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_create", payload: {nodes, links}}); return [];});

    AnimationsQueue.push(draft.animationQueue, moveControllers, moveAnimations);
    AnimationsQueue.push(draft.animationQueue, connectLinksControllers, connectLinksAnimations);
}

function create(draft, nodes, links) {
    console.log(nodes);
    console.log(links);
    draft.nodes = [draft.nodes[0], ...nodes, draft.nodes[draft.nodes.length - 1]];
    draft.links = [draft.links[0], ...links];
}


function addAnimated(draft, value, dispatch) {
    draft.animationQueue = [];
    draft.animationDelay = DELAY;

    const nodeNew = newNode({value: value});
    const linkNew = newLink({});
    const prevNodePos = calculatePosition(draft.nodes.length - 2, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    const currTailPos = calculatePosition(draft.nodes.length - 1, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    const nextTailPos = calculatePosition(draft.nodes.length, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    
    AnimationsQueue.push(draft.animationQueue, draft.links[draft.links.length - 1].animationController, prevNodePos);
    AnimationsQueue.push(draft.animationQueue, draft.nodes[draft.nodes.length - 1].animationController, nextTailPos);
    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_add", payload: {node: nodeNew, link: linkNew}}); return [];});
    AnimationsQueue.push(draft.animationQueue, [nodeNew.animationController, linkNew.animationController], [currTailPos, currTailPos]);
    AnimationsQueue.push(draft.animationQueue, draft.links[draft.links.length - 1].animationController, currTailPos);
    AnimationsQueue.push(draft.animationQueue, linkNew.animationController, nextTailPos);

}

function add(draft, node, link) {
    draft.nodes = [...draft.nodes.slice(0, draft.nodes.length - 1), node, draft.nodes[draft.nodes.length - 1]];
    draft.links = [...draft.links, link];
}

function insertAnimated(draft, value, index, dispatch) {
    draft.animationQueue = [];
    draft.animationDelay = DELAY;

    const nodeNew = newNode({value: value});
    const linkNew = newLink({});
    const currNodeIndex = index;
    const prevNodeIndex = index - 1;
    const nextNodeIndex = index + 1;
    const currNodePos = calculatePosition(currNodeIndex, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    const prevNodePos = calculatePosition(prevNodeIndex, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    const nextNodePos = calculatePosition(nextNodeIndex, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);

    searchAnimated(draft, currNodeIndex);
    AnimationsQueue.push(draft.animationQueue, draft.links[prevNodeIndex].animationController, prevNodePos);

    let shiftControllerList = [];
    let shiftAnimationList = [];

    for (let i = currNodeIndex; i < draft.nodes.length - 1; i++) {
        const nextShiftNodePos = calculatePosition(i + 1, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
        const nextShiftLinkPos = calculatePosition(i + 2, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
        shiftControllerList.push(draft.nodes[i].animationController);
        shiftControllerList.push(draft.links[i].animationController);
        shiftAnimationList.push(nextShiftNodePos);
        shiftAnimationList.push(nextShiftLinkPos);
    }

    const currTailIndex = draft.nodes.length - 1;
    const nextTailIndex = currTailIndex + 1;
    const nextTailPos = calculatePosition(nextTailIndex, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    shiftControllerList.push(draft.nodes[currTailIndex].animationController);
    shiftAnimationList.push(nextTailPos);

    AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_insert", payload: {node: nodeNew, link: linkNew, index}}); return [];});
    AnimationsQueue.push(draft.animationQueue, shiftControllerList, shiftAnimationList);
    AnimationsQueue.push(draft.animationQueue, [nodeNew.animationController, linkNew.animationController], [currNodePos, currNodePos]);
    AnimationsQueue.push(draft.animationQueue, draft.links[prevNodeIndex].animationController, currNodePos);
    AnimationsQueue.push(draft.animationQueue, linkNew.animationController, nextNodePos);
}

function insert(draft, node, link, index) {
    draft.nodes = [...draft.nodes.slice(0, index), node, ...draft.nodes.slice(index)];
    draft.links = [...draft.links.slice(0, index), link, ...draft.links.slice(index)];
}

function removeAnimated(draft, value, dispatch, removeIndex) {
    draft.animationQueue = [];
    draft.animationDelay = DELAY;

    const currNodeIndex = removeIndex ? value : draft.nodes.findIndex(node => node.value === value.toString());
    searchAnimated(draft, currNodeIndex);
    const prevNodeIndex = currNodeIndex - 1;
    const currNodePos = calculatePosition(currNodeIndex, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
    const prevNodePos = calculatePosition(prevNodeIndex, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);

    if (currNodeIndex !== -1) {
        AnimationsQueue.push(draft.animationQueue, draft.links[prevNodeIndex].animationController, prevNodePos);
        AnimationsQueue.push(draft.animationQueue, draft.links[currNodeIndex].animationController, currNodePos);

        const currNodeDownPos = {x: currNodePos.x, y: currNodePos.y + 2 * SEARCH_JUMP};
        AnimationsQueue.push(draft.animationQueue, [draft.nodes[currNodeIndex].animationController, draft.links[currNodeIndex].animationController], [{...currNodeDownPos, alpha: 0}, {...currNodeDownPos, alpha: 0}]);

        let shiftControllerList = [];
        let shiftAnimationList = [];

        for (let i = currNodeIndex; i < draft.nodes.length; i++) {
            const nextShiftNodePos = calculatePosition(i - 1, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
            const nextShiftLinkPos = calculatePosition(i, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
            shiftControllerList.push(draft.nodes[i].animationController);
            shiftAnimationList.push(nextShiftNodePos);

            if (draft.links[i]) {
                shiftControllerList.push(draft.links[i].animationController);
                shiftAnimationList.push(nextShiftLinkPos);
            }
        }

        AnimationsQueue.push(draft.animationQueue, shiftControllerList, shiftAnimationList);
        AnimationsQueue.push(draft.animationQueue, draft.links[prevNodeIndex].animationController, currNodePos);
        
        AnimationsQueue.pushFunc(draft.animationQueue, () => {dispatch({type: "_remove", payload: {index: currNodeIndex}}); return [];});
    }
}

function remove(draft, index) {
    draft.nodes = draft.nodes.filter((v, i) => {return i !== index;});
    draft.links = draft.links.filter((v, i) => {return i !== index;});
}

function searchAnimated(draft, index) {
    draft.animationQueue = [];
    draft.animationDelay = DELAY;

    for (let i = 1; i < draft.nodes.length; i++) {
        const nodePos = calculatePosition(i, COLUMNS, SIZE.width, SIZE.height, BASE_POSITION);
        const nodeUpPos = {x: nodePos.x, y: nodePos.y - SEARCH_JUMP};

        AnimationsQueue.push(draft.animationQueue, [draft.nodes[i].animationController, draft.links[i - 1].animationController], [nodeUpPos, nodeUpPos]);
        
        if (i === index) {
            AnimationsQueue.push(draft.animationQueue, draft.nodes[i].animationController, {alphaCorrect: 1, scale: 2});
            AnimationsQueue.push(draft.animationQueue, draft.nodes[i].animationController, {alphaCorrect: 0, scale: 1});
            AnimationsQueue.push(draft.animationQueue, [draft.nodes[i].animationController, draft.links[i - 1].animationController], [nodePos, nodePos]);
            return;
        }
        else {
            AnimationsQueue.push(draft.animationQueue, draft.nodes[i].animationController, {alphaIncorrect: 1});
            AnimationsQueue.push(draft.animationQueue, draft.nodes[i].animationController, {alphaIncorrect: 0});
            AnimationsQueue.push(draft.animationQueue, [draft.nodes[i].animationController, draft.links[i - 1].animationController], [nodePos, nodePos]);
        }
    }
}

function newNode({value, animationController = SPAWN}) {
    return {
        value,
        animationController: new Controller(animationController),
    };
}

function newLink({animationController = SPAWN}) {
    return {
        animationController: new Controller(animationController),
    };
}

function calculatePosition(index, nodesPerLine, width, height, basePos) {
    const y = Math.floor(index / nodesPerLine) * (2 * height) + basePos.y;
    let x = (index % nodesPerLine) * (2 * width) + basePos.x;
    if (Math.floor(index / nodesPerLine) % 2 !== 0)
        x = (nodesPerLine - (index % nodesPerLine) - 1) * (2 * width) + basePos.x;

    return {x, y};
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

const Link = animated(({ x1, y1, x2, y2, fill}) => {
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
})

const Node = animated((props) => {
    const {value, index, animationController, fill, correctFill, incorrectFill, textFill, linkFill, width, height, linkAnimationController} = props;

    const rectangle = useCallback((instance) => {
        instance.clear();
        instance.beginFill(fill);
        instance.drawRoundedRect(-width / 2, -height / 2, width, height, 15);
        instance.endFill();
    }, [fill, width, height]);

    const rectangleCorrect = useCallback((instance) => {
        instance.clear();
        instance.beginFill(correctFill);
        instance.drawRoundedRect(-width / 2, -height / 2, width, height, 15);
        instance.endFill();
    }, [correctFill, width, height]);

    const rectangleIncorrect = useCallback((instance) => {
        instance.clear();
        instance.beginFill(incorrectFill);
        instance.drawRoundedRect(-width / 2, -height / 2, width, height, 15);
        instance.endFill();
    }, [incorrectFill, width, height]);

    return (
        <>
            {
                linkAnimationController && 
                <Container alpha={animationController.springs.alpha}>
                    <Link 
                        x1={animationController.springs.x}
                        y1={animationController.springs.y}
                        x2={linkAnimationController.springs.x}
                        y2={linkAnimationController.springs.y}
                        fill={linkFill}
                    />
                </Container>
            }
            <Container {...animationController.springs} >
                <Graphics draw={rectangle} />
                <Graphics draw={rectangleCorrect} alpha={animationController.springs.alphaCorrect} />
                <Graphics draw={rectangleIncorrect} alpha={animationController.springs.alphaIncorrect} />
                <Text text={value} anchor={0.5} x={0} y={0} scale={1.75} style={{fill: textFill}} resolution={16}/>
                <Text text={index} anchor={{x: -0.4, y: -0.2}} x={-width / 2} y={-height / 2} scale={0.75} style={{fill: textFill}} resolution={1}/>
            </Container>
        </>
    );
});

function LinkedList(props) {
    const {linkedList, nodeFill, correctFill, incorrectFill, textFill, linkFill, width, height} = props;
    
    return (
        linkedList.nodes.map((node, index) => {
            return (
                <Node 
                    key={index}
                    value={node.value}
                    index={index}
                    animationController={node.animationController}
                    fill={nodeFill}
                    correctFill={correctFill}
                    incorrectFill={incorrectFill}
                    textFill={textFill}
                    linkFill={linkFill}
                    width={width}
                    height={height}
                    linkAnimationController={index < linkedList.nodes.length - 1 ? linkedList.links[index].animationController : null}
                />
            )
        })
    );
}

export default function LinkedListViz({width, height}) {
    const { isProcessing, addTask } = useTaskQueue(true);

    const [linkedList, dispatch] = useImmerReducer(reducer, {
        nodes: [{value: "H", animationController: new Controller(SPAWN)}, 
                {value: "T", animationController: new Controller(SPAWN)}],
        links: [{animationController: new Controller(SPAWN)}],
        animationQueue: [],
        animationDelay: -1,
    });

    useEffect(() => {
        dispatch({type: "init", payload: {value: null}});
    }, [dispatch])

    useEffect(() => {
        console.log(linkedList);
    }, [linkedList])

    useEffect(() => {
        if (linkedList.animationQueue.length > 0) {
            if (linkedList.animationDelay === -1) {
                addTask(() => AnimationsQueue.playSequentially([...linkedList.animationQueue]));
            }
            else {
                addTask(() => AnimationsQueue.playWithDelay([...linkedList.animationQueue], linkedList.animationDelay));
            }
        }
      }, [addTask, linkedList.animationDelay, linkedList.animationQueue]);

    return (
        <div className="position-relative h-100">
            <Stage
                width={width}
                height={height}
                options={{ backgroundAlpha: 0, antialias: true }}
                className="position-absolute"
            >
                <LinkedList
                    linkedList={linkedList}
                    nodeFill={FILL_NODE}
                    correctFill={FILL_NODE_CORRECT}
                    incorrectFill={FILL_NODE_INCORRECT}
                    textFill={FILL_TEXT}
                    linkFill={FILL_LINK}
                    width={SIZE.width}
                    height={SIZE.height}
                />
            </Stage>
            
            <VizControlPanel
                linkedList={linkedList}
                dispatch={dispatch}
                isProcessing={isProcessing}
                className="position-absolute d-flex flex-column bottom-0 ms-2 mb-2"
                style={{width: 180}}
            />
            
        </div>
    );
}