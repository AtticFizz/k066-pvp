import { Button, Spinner } from "reactstrap";
import { useSpring, animated } from "react-spring";
import { useState } from "react";
import {
  BsChevronLeft,
  BsChevronRight,
  BsPencilFill,
  BsCheck,
} from "react-icons/bs";
import RequireAuth from "./RequireAuth";

const height = window.innerHeight * 0.75;
const width = 650;

export default function Sidebar({
  title,
  editing,
  setEditing,
  onEdit,
  loading,
  children,
}) {
  const [sidebarOpen, setOpen] = useState(false);
  const animProps = useSpring({
    to: { right: sidebarOpen ? 0 : -width + 42 },
  });

  return (
    <animated.div
      style={{
        top: (window.innerHeight - height) / 2,
        width: width,
        height: height,
        ...animProps,
      }}
      className="bg-white position-absolute rounded-start d-flex border border-2 border-secondary shadow"
    >
      <div className="bg-secondary d-flex flex-column align-items-center justify-content-between">
        <Button onClick={() => setOpen((prev) => !prev)}>
          {sidebarOpen ? <BsChevronRight /> : <BsChevronLeft />}
        </Button>
        <h2
          className="user-select-none text-light"
          style={{
            margin: 0,
            width: 40,
            writingMode: "vertical-lr",
            textOrientation: "upright",
          }}
        >
          {title}
        </h2>
        <div>
          <RequireAuth allowedRoles={["Admin"]}>
            <Button
              onClick={() => {
                setOpen(true);
                setEditing((prev) => !prev);
                editing && onEdit();
              }}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : editing ? (
                <BsCheck />
              ) : (
                <BsPencilFill />
              )}
            </Button>
          </RequireAuth>
        </div>
      </div>
      <div
        style={{ overflowY: "auto", overflowX: "hidden" }}
        className="flex-grow-1"
      >
        {children}
      </div>
    </animated.div>
  );
}
