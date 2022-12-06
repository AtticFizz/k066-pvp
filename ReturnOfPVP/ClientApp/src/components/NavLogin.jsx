import { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

import LoginForm from "./LoginForm";
import useAuth from "../hooks/useAuth";
import AuthService from "../services/AuthService";

import { BiLogIn, BiUser } from "react-icons/bi";

export default function NavLogin() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { user, setUser } = useAuth();

  const logout = () => {
    AuthService.logout()
      .then((r) => setUser(undefined))
      .catch((e) => {
        console.log(e.response);
      });
  };

  return (
    <>
      <div className="mb-2 w-100">
        {!user ? (
          <Button
            className="w-100 text-truncate"
            outline
            onClick={() => setLoginOpen(true)}
          >
            <BiLogIn size={22} className="me-2" />
            Prisijungti
          </Button>
        ) : (
          <UncontrolledDropdown direction="up">
            <DropdownToggle caret className="w-100 text-truncate" outline>
              <BiUser size={22} className="me-2" />
              {user.email}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => logout()}>Atsijungti</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
      </div>

      <Modal
        centered
        isOpen={loginOpen}
        toggle={() => setLoginOpen(false)}
        contentClassName="px-4 pb-4 pt-2"
      >
        <ModalHeader tag="h3" toggle={() => setLoginOpen(false)}>
          Prisijungti
        </ModalHeader>
        <ModalBody>
          <LoginForm setModalOpen={setLoginOpen} />
        </ModalBody>
      </Modal>
    </>
  );
}
