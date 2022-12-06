import { Outlet, useLocation } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";
import { Routes, Route, Link } from "react-router-dom";
import ArrayPage from "../pages/ArrayPage";
import DynamicArrayPage from "../pages/DynamicArrayPage";

export default function ArrayLayout() {
  let location = useLocation();
  
  console.log(location.pathname);

  return (
    <>
      <Nav tabs={true} className="bg-dark">
        <div className="justify-content-center d-flex w-100">
          <NavItem >
            <NavLink
              active={location.pathname.endsWith("/array")}
              tag={Link}
              to=""
              className={`fs-3 text-center w-100 ${location.pathname.endsWith("/array") ? "bg-light" : "text-light" }`}
            >
              Fiksuotas Masyvas
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={location.pathname.endsWith("/dynamic")}
              tag={Link}
              to="dynamic"
              className={`fs-3 text-center w-100 ${location.pathname.endsWith("/dynamic") ? "bg-light" : "text-light" }`}
            >
              Dinaminis Masyvas
            </NavLink>
          </NavItem>
        </div>
      </Nav>
      <Outlet />
      <Routes>
        <Route index element={<ArrayPage />}></Route>
        <Route path="dynamic" element={<DynamicArrayPage />}></Route>
      </Routes>
    </>
  );
}
