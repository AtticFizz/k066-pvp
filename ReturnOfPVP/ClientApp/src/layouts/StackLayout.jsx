import { Outlet } from "react-router-dom";
import { Navbar, NavbarText } from "reactstrap";
import { Routes, Route, Link } from "react-router-dom";
import StackPage from "../pages/StackPage";

export default function VizLayout() {
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarText
          tag={Link}
          to=""
          className="fs-3 text-center w-100 text-light"
        >
          Dėklas
        </NavbarText>
      </Navbar>
      <Outlet />
      <Routes>
        <Route index element={<StackPage />}></Route>
      </Routes>
    </>
  );
}
