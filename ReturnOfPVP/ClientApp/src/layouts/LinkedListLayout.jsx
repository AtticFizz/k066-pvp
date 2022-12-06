import { Outlet } from "react-router-dom";
import { Navbar, NavbarText } from "reactstrap";
import { Routes, Route, Link } from "react-router-dom";
import LinkedListPage from "../pages/LinkedListPage";

export default function LinkedListLayout() {
  return (
    <>
      <Navbar color="dark" dark>
        <NavbarText
          tag={Link}
          to=""
          className="fs-3 text-center w-100 text-light"
        >
          Susietas sąrašas
        </NavbarText>
      </Navbar>
      <Outlet />
      <Routes>
        <Route index element={<LinkedListPage />}></Route>
      </Routes>
    </>
  );
}
