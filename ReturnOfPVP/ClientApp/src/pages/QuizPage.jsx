import { FormikProvider, useFormik, Form as FForm } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Form, Modal, ModalFooter, ModalHeader, Row } from "reactstrap";
import { BsArrowRightShort } from "react-icons/bs";

import axios from "../api/axios";
import Timer from "../components/Timer";
import Question from "../components/Questions/Question";
import HtmlDiv from "../components/HtmlDiv";
import { QuizzesContext } from "../layouts/QuizzesLayout";

const validate = (values) => {
  let errors = { questions: [] };

  values.questions.forEach((q, i) => {
    if (q.answers === "" || q.answers.length <= 0) {
      errors.questions[i] = {
        answers: "Turi būti pažymėtas bent vienas atsakymas.",
      };
    }
  });

  if (Object.keys(errors.questions) <= 0) return {};
  return errors;
};

const mapInitialValues = (questions) => {
  return {
    questions: questions.map((q) => ({ id: q.id, answers: "" })),
  };
};

export default function QuizPage() {
  const [initialValues, setInitialValues] = useState();
  const [quiz, setQuiz] = useState();
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { scrollToTop } = useContext(QuizzesContext);
  const topRef = useRef();

  let navigate = useNavigate();
  let { id } = useParams();
  let { state } = useLocation();

  useEffect(() => {
    if (!state && id) {
      axios
        .get(`quiz/${id}`)
        .then((r) => {
          setQuiz(r.data);
          setInitialValues(mapInitialValues(r.data.questions));
        })
        .catch((r) => console.log(r.data));
    } else {
      setQuiz(state);
      setInitialValues(mapInitialValues(state.questions));
    }
  }, []);

  useEffect(() => {
    console.log(quiz);
  }, [quiz]);

  useEffect(() => {
    console.log(initialValues);
  }, [initialValues]);

  const finishQuiz = () => {
    scrollToTop();
    console.log("quiz finished");
    setFinished(true);
  };

  const handleSubmit = (values) => {
    setModalOpen(false);
    finishQuiz();
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    // validateOnBlur: false,
    // validateOnChange: false,
    // validate,
    onSubmit: handleSubmit,
  });

  if (!quiz) {
    return <></>;
  }

  if (!started) {
    return (
      <div className="flex-fill d-flex justify-content-center align-items-center">
        <div className="border shadow rounded p-4">
          <div className="vstack gap-1 align-items-center">
            <h4>{quiz.name}</h4>
            {quiz.text && <HtmlDiv value={quiz.text} />}
            {quiz.timeLimit !== 0 && (
              <span>Testas užtrukts {quiz.timeLimit} min.</span>
            )}
            <span>Testą sudaro {quiz.questions.length} klausimai(s).</span>
            <Button
              onClick={() => setStarted(true)}
              style={{ width: 128 }}
              type="button"
              className="text-light mt-3"
            >
              Pradėti
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <FormikProvider value={formik}>
      <Form tag={FForm} className="d-flex flex-column flex-fill">
        <Row className="sticky-top bg-light">
          <div ref={topRef} className="hstack">
            <h1 className="display-4">Testas</h1>
            <span className="mx-auto">
              <Timer
                timeLimit={quiz.timeLimit}
                onExpire={finishQuiz}
                stopped={finished}
              />
            </span>
            <div>
              {finished ? (
                <Button
                  outline
                  size="lg"
                  type="button"
                  onClick={() => navigate("..")}
                >
                  Grįžti
                </Button>
              ) : (
                <Button
                  onClick={() => setModalOpen(true)}
                  type="button"
                  outline
                  size="lg"
                >
                  Baigti
                  <BsArrowRightShort size={32} />
                </Button>
              )}
            </div>
          </div>
        </Row>
        <hr />
        <Row className="flex-fill flex-column align-items-center mx-0">
          <div className="w-75">
            {quiz.questions.map((q, i) => (
              <Question
                key={`question-${q.id}`}
                data={q}
                index={i}
                finished={finished}
              />
            ))}
          </div>
        </Row>
        <Modal isOpen={modalOpen}>
          <ModalHeader toggle={() => setModalOpen(false)}>
            Baigti testą?
          </ModalHeader>
          <ModalFooter>
            <Button color="success" type="submit" onClick={handleSubmit}>
              Patvirtinti
            </Button>
            <Button color="danger" onClick={() => setModalOpen(false)}>
              Atšaukti
            </Button>
          </ModalFooter>
        </Modal>
      </Form>
    </FormikProvider>
  );
}
