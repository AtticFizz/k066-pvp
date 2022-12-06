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

import QuestionRow from "./QuestionRow";
import axios from "../../api/axios";
import Question from "./Question";

export default function QuestionsTable({
  questions,
  setQuestions,
  isLoading,
  selected,
  setSelected,
}) {
  const [delModalOpen, setDelModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [modalState, setModalState] = useState({});

  const deleteQuestion = (id) => {
    axios
      .delete(`questions/${id}`)
      .then(() => {
        setDelModalOpen(false);
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      })
      .catch(() => console.log("Failed to delete."));
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
                {setSelected !== undefined ? (
                  <th style={{ width: "24px" }}></th>
                ) : (
                  <></>
                )}
                <th style={{ width: "36px" }}>#</th>
                <th className="w-50">Klausimas</th>
                <th>Sukurta</th>
                <th>Atnaujinta</th>
                <th>Veiksmai</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <QuestionRow
                  key={`question-${q.id}`}
                  data={q}
                  openDelModal={() => setDelModalOpen(true)}
                  openViewModal={() => setViewModalOpen(true)}
                  setModalState={setModalState}
                  checked={selected?.includes(q.id)}
                  setSelected={setSelected}
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
          Panaikinti {modalState.id} klausimą?
        </ModalHeader>
        <ModalFooter>
          <Button
            className="text-light"
            color="success"
            onClick={() => deleteQuestion(modalState.id)}
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
      {/* <Modal centered isOpen={viewModalOpen}>
        <ModalHeader toggle={() => setViewModalOpen(false)}></ModalHeader>
        <ModalBody>
          <Question data={modalState.data} />
        </ModalBody>
        <ModalFooter>
          <Button className="text-light">Pradėti iš naujo</Button>
          <Button className="text-light">Pažymėti teisingus atsakymus</Button>
          <Button className="text-light">Pateikti</Button>
          <Button
            className="text-light"
            onClick={() => setViewModalOpen(false)}
          >
            Uždaryti
          </Button>
        </ModalFooter>
      </Modal> */}
    </>
  );
}
