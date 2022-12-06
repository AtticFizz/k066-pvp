import { useState } from "react";
import {
  Table,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";

import QuizRow from "./QuizRow";
import axios from "../../api/axios";

export default function QuizzesTable({ quizzes, setQuizzes, isLoading }) {
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [modalState, setModalState] = useState({});

  const deleteQuiz = (id) => {
    axios
      .delete(`quiz/${id}`)
      .then(() => {
        setDelModalOpen(false);
        setQuizzes((prev) => prev.filter((q) => q.id !== id));
      })
      .catch(() => console.log("Failed to delete quiz."));
  };

  return (
    <>
      <div className="mx-5 mt-3 d-flex justify-content-center">
        {!isLoading ? (
          <Table
            hover
            className="align-middle"
            style={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <th style={{ width: "36px" }}>#</th>
                <th className="w-50">Testas</th>
                <th style={{ width: "96px" }}>Bandymų</th>
                <th>Sukurta</th>
                <th>Atnaujinta</th>
                <th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => (
                <QuizRow
                  key={`quiz-${q.id}`}
                  data={q}
                  openDelModal={() => setDelModalOpen(true)}
                  setModalState={setModalState}
                />
              ))}
            </tbody>
          </Table>
        ) : (
          <Spinner />
        )}
      </div>
      <Modal centered isOpen={delModalOpen}>
        <ModalHeader toggle={() => setDelModalOpen(false)}>
          Panaikinti {modalState.id} testą?
        </ModalHeader>
        <ModalFooter>
          <Button
            className="text-light"
            color="success"
            onClick={() => deleteQuiz(modalState.id)}
          >
            Patvirtinti
          </Button>
          <Button
            className="text-light"
            color="danger"
            onClick={() => setDelModalOpen(false)}
          >
            Atšaukti
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
