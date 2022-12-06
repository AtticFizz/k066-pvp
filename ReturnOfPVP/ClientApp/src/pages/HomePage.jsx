import { Container, Row, Col } from "reactstrap";

export default function HomePage() {
  return (
    <Container className="d-flex min-vh-100 flex-column justify-content-evenly">
      <Row className="w-100">
        <Col className="text-center ">
          <h1 className="display-1 mb-3">MOKYKIS INOVATYVIAI</h1>
          <p className="lead w-75 mx-auto">
            Inovatyvi duomenų struktūrų ir algoritmų mokymosi aplinka
          </p>
        </Col>
        <Col xs={6}></Col>
      </Row>
      <Row></Row>
    </Container>
  );
}
