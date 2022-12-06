import { Label } from "reactstrap";
import { BsExclamationCircleFill } from "react-icons/bs";

export default function RequiredLabel({ children, ...rest }) {
  return (
    <Label className="hstack align-items-baseline" {...rest}>
      {children}{" "}
      <BsExclamationCircleFill
        style={{ minHeight: 16, minWidth: 16 }}
        className="ms-auto align-items-center text-danger"
      />
    </Label>
  );
}
