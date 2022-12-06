import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  Input,
  Button,
} from "reactstrap";
import { BsCheckLg } from "react-icons/bs";
import { useState } from "react";

import BST from "./BST";

export default function BSTControlPanel(props) {
  const { index, setIndex, dispatch, isProcessing, ...rest } = props;

  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [value4, setValue4] = useState(0);

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
            // prevent refresh
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              placeholder="Mazgų skaičius [0-8]"
              type="number"
              value={value1}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue >= 0 && newValue <= BST.MAX_NODES)
                  setValue1(newValue);
              }}
            />
            <Button
              type="submit"
              className="ms-1"
              disabled={isProcessing}
              onClick={() => {
                dispatch({
                  type: "CREATE",
                  payload: { count: value1, width: props.width },
                });
              }}
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
            // prevent refresh
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              placeholder="Reikšmė"
              type="number"
              value={value2}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "") setValue2(newValue);
                else if (!isNaN(newValue)) setValue2(Number(newValue));
              }}
            />
            <Button
              className="ms-1"
              type="submit"
              onClick={() =>
                dispatch({
                  type: "SEARCH",
                  payload: value2,
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
          {"Įterpti"}
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
              placeholder="reikšmė"
              type="number"
              autoFocus
              onFocus={(e) => e.target.select()}
              value={value3}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "") setValue3(newValue);
                else if (!isNaN(newValue)) setValue3(Number(newValue));
              }}
            />
            <Button
              type="submit"
              className="ms-1"
              onClick={() =>
                dispatch({
                  type: "INSERT",
                  payload: { value: value3, width: props.width },
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
              placeholder="reikšmė"
              type="number"
              value={value4}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "") setValue4(newValue);
                else if (!isNaN(newValue)) setValue4(Number(newValue));
              }}
            />
            <Button
              className="ms-1"
              type="submit"
              onClick={() =>
                dispatch({
                  type: "REMOVE",
                  payload: { value: value4, width: props.width, dispatch },
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
