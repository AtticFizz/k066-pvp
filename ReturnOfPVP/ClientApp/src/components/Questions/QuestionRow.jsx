import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import {
  AiOutlineEdit,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlineDownload,
} from "react-icons/ai";
import { BsListTask, BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "../../api/axios";

export default function QuestionRow({
  data,
  openDelModal,
  openViewModal,
  setModalState,
  checked,
  setSelected,
}) {
  const handleExport = (data) => {
    axios({
      url: `questions/${data.id}/xml`,
      method: "GET",
      responseType: "blob",
    })
      .then((r) => {
        const url = window.URL.createObjectURL(new Blob([r.data]));
        const link = document.createElement("a");
        link.href = url;
        let filename = r.headers["content-disposition"]
          .split("filename=")[1]
          .split(".")[0];
        let extension = r.headers["content-disposition"]
          .split(".")[1]
          .split(";")[0];
        link.setAttribute("download", `${filename}.${extension}`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((r) => console.log(r.data));
  };

  const created = new Date(data.created);
  const updated = new Date(data.updated);

  const icon = (qType) => {
    switch (qType) {
      case "truefalse":
        return (
          <>
            <BsDot size={11} />
            <BsDot size={11} className="me-2" />
          </>
        );
      case "multichoice":
        return <BsListTask size={22} className="me-2" />;
      default:
        return <></>;
    }
  };

  const handleCheck = () => {
    setSelected((prev) => {
      if (prev.includes(data.id)) {
        return prev.filter((id) => id !== data.id);
      }
      return [...prev, data.id];
    });
  };

  return (
    <tr>
      {setSelected !== undefined ? (
        <th>
          <Input type="checkbox" checked={checked} onChange={handleCheck} />
        </th>
      ) : (
        <></>
      )}
      <th scope="row">{data.id}</th>
      <td className="text-truncate">
        {icon(data.qType)}
        {data.name}
      </td>
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
        <UncontrolledDropdown>
          <DropdownToggle caret className="text-light">
            Redaguoti
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag={Link}
              to={`/questions/edit/${data.id}?qtype=${data.qType}`}
              state={data}
            >
              <AiOutlineEdit size={22} className="me-2" />
              Redaguoti klausimą
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                openViewModal();
                setModalState(data);
              }}
            >
              <AiOutlineEye size={22} className="me-2" />
              Peržiūra
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
            <DropdownItem onClick={() => handleExport(data)}>
              <AiOutlineDownload size={22} className="me-2" />
              Eksportuoti į Moodle XML
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </td>
    </tr>
  );
}
