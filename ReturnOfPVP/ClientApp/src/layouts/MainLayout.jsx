import { Container, Row, Col } from "reactstrap";
import { Outlet } from "react-router-dom";
import NavMenu from "../components/NavMenu";

export default function Layout() {
  return (
    <Row className="h-100 w-100 mx-0 flex-sm-nowrap">
      <Col sm="4" md="4" lg="3" xl="2" className="d-flex flex-column">
        <NavMenu />
      </Col>
      <Col className="d-flex flex-column g-0 flex-fill">
        <Outlet />
      </Col>
    </Row>
  );
}
