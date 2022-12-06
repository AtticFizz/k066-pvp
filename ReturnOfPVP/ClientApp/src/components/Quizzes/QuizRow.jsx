import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
} from "reactstrap";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineQuestion,
} from "react-icons/ai";
import { Link } from "react-router-dom";

import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

export default function QuizRow({ data, openDelModal, setModalState }) {
  const { user } = useAuth();
  const created = new Date(data.created);
  const updated = new Date(data.updated);

  return (
    <tr>
      <th scope="row">{data.id}</th>
      <td className="text-truncate">{data.name}</td>
      <td>{data.attempts}</td>
      <td>
        {data.createdBy.firstName}
        {data.createdBy.lastName}
        <br />
        {created.toLocaleDateString()} {created.toLocaleTimeString()}
      </td>
      <td>
        {data.updatedBy.firstName}
        {data.updatedBy.lastName}
        <br />
        {updated.toLocaleDateString()} {updated.toLocaleTimeString()}
      </td>
      <td>
        {user && user.role === "Admin" ? (
          <UncontrolledDropdown>
            <DropdownToggle caret className="text-light">
              Redaguoti
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                tag={Link}
                to={`/quizzes/edit/${data.id}`}
                state={data}
              >
                <AiOutlineEdit size={22} className="me-2" />
                Redaguoti testą
              </DropdownItem>
              <DropdownItem tag={Link} to={`/quizzes/${data.id}`} state={data}>
                <AiOutlineQuestion size={22} className="me-2" />
                Atlikti
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  openDelModal();
                  setModalState(data);
                }}
              >
                <AiOutlineDelete size={22} className="me-2" />
                Naikinti
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        ) : (
          <Button
            tag={Link}
            to={`/quizzes/${data.id}`}
            state={data}
            color="success"
          >
            <AiOutlineQuestion size={22} className="me-1" />
            Atlikti
          </Button>
        )}
      </td>
    </tr>
  );
}
