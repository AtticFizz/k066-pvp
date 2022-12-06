import { Outlet } from "react-router-dom";
import { Navbar, NavbarText } from "reactstrap";
import { Routes, Route, Link } from "react-router-dom";
import HashTablePage from "../pages/HashTablePage";

export default function HashTableLayout() {
    return (
        <>
            <Navbar color="dark" dark>
                <NavbarText
                    tag={Link}
                    to=""
                    className="fs-3 text-center w-100 text-light"
                >
                    Maišos lentelė
                </NavbarText>
            </Navbar>
            <Outlet />
            <Routes>
                <Route index element={<HashTablePage />}></Route>
            </Routes>
        </>
    );
}