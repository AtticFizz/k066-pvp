import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { BsListTask, BsDot } from "react-icons/bs";
import { createSearchParams, useNavigate } from "react-router-dom";

import QuestionsTable from "../components/Questions/QuestionsTable";
import { QuestionsContext } from "../layouts/QuestionsLayout";
import { useContext } from "react";

export default function QuestionsPage() {
  const { questions, setQuestions, isLoading } = useContext(QuestionsContext);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="display-4">Klausimai</h1>
      <hr />
      <UncontrolledDropdown>
        <DropdownToggle caret className="text-light">
          <AiOutlinePlus size={22} className="me-1" />
          Naujas
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            onClick={() =>
              navigate({
                pathname: "edit",
                search: createSearchParams({ qtype: "truefalse" }).toString(),
              })
            }
          >
            <BsDot size={11} />
            <BsDot size={11} className="me-2" />
            Tiesa/Netiesa
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              navigate({
                pathname: "edit",
                search: createSearchParams({ qtype: "multichoice" }).toString(),
              })
            }
          >
            <BsListTask size={22} className="me-2" />
            Keli pasirinkimai
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      <QuestionsTable
        questions={questions}
        setQuestions={setQuestions}
        isLoading={isLoading}
      />
    </>
  );
}
