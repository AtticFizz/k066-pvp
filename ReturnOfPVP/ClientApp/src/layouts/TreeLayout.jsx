import { Outlet } from "react-router-dom";
import { Navbar, NavbarText } from "reactstrap";
import { Routes, Route, Link } from "react-router-dom";
import BSTPage from "../pages/BSTPage";

export default function TreeLayout() {
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarText
          tag={Link}
          to=""
          className="fs-3 text-center w-100 text-light"
        >
          Paieškos medis
        </NavbarText>
      </Navbar>
      <Outlet />
      <Routes>
        <Route index element={<BSTPage />}></Route>
      </Routes>
    </>
  );
}
