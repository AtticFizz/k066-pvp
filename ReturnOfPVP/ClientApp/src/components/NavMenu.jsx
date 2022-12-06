import {
  Container,
  ListGroup,
  ListGroupItem,
  UncontrolledAccordion,
  AccordionBody,
  AccordionItem,
  AccordionHeader,
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";

import {
  BsHouse,
  BsXDiamond,
  BsBook,
  BsInfoCircle,
  BsDiagram3,
} from "react-icons/bs";
import { VscSymbolArray } from "react-icons/vsc";
import {
  AiOutlineNodeIndex,
  AiOutlineInteraction,
  AiOutlineFileSearch,
  AiOutlineQuestion,
} from "react-icons/ai";
import { ImStack } from "react-icons/im";
import { HiOutlineCollection } from "react-icons/hi";
import {
  MdOutlineSort,
  MdOutlineCompareArrows,
  MdOutlineQuiz,
} from "react-icons/md";
import { BiDonateHeart } from "react-icons/bi";

import NavLogin from "./NavLogin";
import RequireAuth from "./RequireAuth";

function MenuItem({ to, children, ...rest }) {
  let location = useLocation();

  return (
    <ListGroupItem
      action
      tag={to ? Link : "li"}
      to={to}
      active={
        location.pathname.startsWith(`/${to}`) || location.pathname === to
          ? true
          : false
      }
      {...rest}
    >
      {children}
    </ListGroupItem>
  );
}

export default function NavMenu() {
  return (
    <>
      <Container fluid className="w-100 my-4 d-flex justify-content-center">
        <img src="/logo.png" style={{ width: 96, height: 96 }} alt="logo" />
      </Container>
      <ListGroup flush className="flex-grow-1">
        <MenuItem to="/" className="fw-bold">
          <BsHouse size={22} className="me-2" />
          Pagrindinis
        </MenuItem>
        <UncontrolledAccordion flush stayOpen defaultOpen={["1", "2"]}>
          <AccordionItem>
            <MenuItem className="p-0">
              <AccordionHeader targetId="1">
                <BsXDiamond size={22} className="me-2" />
                <b>Duomenų struktūros</b>
              </AccordionHeader>
            </MenuItem>
            <AccordionBody accordionId="1">
              <ListGroup flush>
                <MenuItem to="array" className="ps-4">
                  <VscSymbolArray size={22} className="me-2" />
                  Masyvas
                </MenuItem>
                <MenuItem to="linked-list" className="ps-4">
                  <AiOutlineNodeIndex size={22} className="me-2" />
                  Susietas sąrašas
                </MenuItem>
                <MenuItem to="stack" className="ps-4">
                  <ImStack size={22} className="me-2" />
                  Dėklas
                </MenuItem>
                <MenuItem to="/queue" className="ps-4">
                  <HiOutlineCollection size={22} className="me-2" />
                  Eilė
                </MenuItem>
                <MenuItem to="tree" className="ps-4">
                  <BsDiagram3 size={22} className="me-2" />
                  Paieškos medis
                </MenuItem>
                <MenuItem to="/hash-table" className="ps-4">
                  <BsBook size={22} className="me-2" />
                  Maišos lentelė
                </MenuItem>
              </ListGroup>
            </AccordionBody>
          </AccordionItem>
          <AccordionItem>
            <MenuItem className="p-0">
              <AccordionHeader targetId="2">
                <AiOutlineInteraction size={22} className="me-2" />
                <b>Algoritmai</b>
              </AccordionHeader>
            </MenuItem>
            <AccordionBody accordionId="2">
              <ListGroup flush>
                <MenuItem className="ps-4">
                  <MdOutlineSort size={22} className="me-2" />
                  Rikiavimas
                </MenuItem>
                <MenuItem className="ps-4">
                  <MdOutlineCompareArrows size={22} className="me-2" />
                  Paieškos medžio perėjimas
                </MenuItem>
                <MenuItem className="ps-4">
                  <AiOutlineFileSearch size={22} className="me-2" />
                  Teksto paieška
                </MenuItem>
              </ListGroup>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>
        <MenuItem to="quizzes" className="fw-bold">
          <MdOutlineQuiz size={22} className="me-2" />
          Testai
        </MenuItem>
        <RequireAuth allowedRoles={["Admin"]}>
          <MenuItem to="questions" className="fw-bold">
            <AiOutlineQuestion size={22} className="me-2" />
            Klausimai
          </MenuItem>
        </RequireAuth>
        <MenuItem to="about" className="fw-bold">
          <BsInfoCircle size={22} className="me-2" />
          Apie
        </MenuItem>
        <MenuItem className="fw-bold">
          <BiDonateHeart size={22} className="me-2" />
          Paremkite mus!
        </MenuItem>
      </ListGroup>
      <NavLogin />
    </>
  );
}
