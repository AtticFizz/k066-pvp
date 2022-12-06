import { useFormik, Form as FForm, FormikProvider, FieldArray } from "formik";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

import CKEditorInput from "../CKEditorInput";
import Field from "../Questions/Field";
import QuestionsTable from "../Questions/QuestionsTable";
import axios from "../../api/axios";
import { QuizzesContext } from "../../layouts/QuizzesLayout";

const validate = (values) => {
  let errors = {};

  const msg = "Šis laukas yra privalomas";

  if (!values.name) errors.name = msg;
  if (!values.timelimit) errors.timelimit = msg;
  if (values.questions.length <= 0)
    errors.questions = "Bent vienas klausimas privalomas.";

  return errors;
};

const mapQuiz = (q) => {
  return {
    name: q.name,
    text: q.text,
    timelimit: q.timeLimit,
    shufflequestions: q.shuffleQuestions,
    questions: q.questions,
  };
};

export default function EditQuiz() {
  const { quizzes, setQuizzes } = useContext(QuizzesContext);
  let navigate = useNavigate();
  let { id } = useParams();
  let { state } = useLocation();
  const [addQuestionsOpen, setAddQuestionsOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    text: "",
    timelimit: 0,
    shufflequestions: false,
    questions: [],
  });

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios
      .get("questions")
      .then((response) => {
        setQuestions(response.data);
        setIsLoading(false);
      })
      .catch((response) => console.log(response.data));
  }, []);

  useEffect(() => {
    if (!state && id) {
      axios
        .get(`quiz/${id}`)
        .then((response) => setInitialValues(mapQuiz(response.data)))
        .catch((response) => console.log(response.data));
    } else if (state) {
      setInitialValues(mapQuiz(state));
    }
  }, []);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      const modifiedValues = {
        ...values,
        questions: values.questions.map((q) => q.id),
      };
      console.log(modifiedValues);
      if (!id) {
        axios
          .post("quiz", modifiedValues)
          .then((response) => {
            setQuizzes((prev) => [...prev, response.data]);
            navigate("../");
          })
          .catch((e) => console.log("Failed to submit quiz."));
      } else {
        axios
          .put(`quiz/${id}`, modifiedValues)
          .then((response) => {
            setQuizzes((prev) => {
              const newQuizzes = [...prev];
              const i = newQuizzes.findIndex((q) => q.id === Number(id));
              newQuizzes[i] = response.data;
              return newQuizzes;
            });
            navigate("../");
          })
          .catch((e) => console.log("Failed to edit quiz."));
      }
    },
  });

  useEffect(() => {
    console.log(
      questions.filter(
        (q) => !formik.values.questions.some((qs) => qs.id === q.id)
      )
    );
  }, [formik.values.questions, questions]);

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const handleEditorChange = (field) => {
    return (_, editor) => {
      formik.setFieldValue(field, editor.getData());
    };
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Form tag={FForm} noValidate>
          <h3>Bendra</h3>
          <Field name="name" label="Testo pavadinimas" required />
          <Field
            name="text"
            as={CKEditorInput}
            inputProps={{
              style: { minHeight: 200, height: 240 },
              onChange: handleEditorChange("text"),
            }}
            label="Testo tekstas"
          />
          <Field
            name="timelimit"
            type="number"
            label="Laiko limitas (min)"
            required
          />
          <hr />
          <h3>Klausimai</h3>
          <FieldArray name="questions">
            {({ push, remove }) => (
              <>
                <div className="hstack gap-3">
                  <Button
                    className="text-light"
                    type="button"
                    onClick={() => setAddQuestionsOpen(true)}
                  >
                    <AiOutlinePlus size={22} className="me-1" />
                    Pridėti
                  </Button>
                  <Button
                    className="text-light"
                    type="button"
                    onClick={() => {
                      selected.forEach((id) =>
                        remove(
                          formik.values.questions.findIndex((q) => q.id === id)
                        )
                      );
                      setSelected([]);
                    }}
                  >
                    <AiOutlineMinus size={22} className="me-1" />
                    Pašalinti
                  </Button>
                  <div className="ms-auto">
                    <Input
                      id="shufflequestions"
                      type="checkbox"
                      onChange={formik.handleChange}
                      checked={formik.values.shufflequestions}
                    />{" "}
                    <Label for="shufflequestions">Maišyti klausimus?</Label>
                  </div>
                </div>
                <Modal centered isOpen={addQuestionsOpen} size="xl">
                  <ModalHeader toggle={() => setAddQuestionsOpen(false)}>
                    Pridėti klausimus
                  </ModalHeader>
                  <ModalBody>
                    <QuestionsTable
                      questions={questions.filter(
                        (q) =>
                          !formik.values.questions.some((qs) => qs.id === q.id)
                      )}
                      setQuestions={setQuestions}
                      isLoading={isLoading}
                      selected={selected}
                      setSelected={setSelected}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="success"
                      className="text-light"
                      onClick={() => {
                        console.log(selected);
                        selected
                          .map((s) => questions.find((q) => q.id === s))
                          .forEach((q) => {
                            push(q);
                          });
                        setSelected([]);
                        setAddQuestionsOpen(false);
                      }}
                    >
                      Patvirtinti
                    </Button>
                  </ModalFooter>
                </Modal>
                <QuestionsTable
                  questions={formik.values.questions}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Input type="hidden" invalid={!!formik.errors.questions} />
                <FormFeedback>{formik.errors.questions}</FormFeedback>
              </>
            )}
          </FieldArray>
          <hr />
          <div className="hstack gap-3 mb-3">
            <Button type="submit" className="text-light">
              Išsaugoti
            </Button>
            <Button
              type="button"
              className="text-light"
              onClick={() => navigate("..")}
            >
              Atšaukti
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </>
  );
}
