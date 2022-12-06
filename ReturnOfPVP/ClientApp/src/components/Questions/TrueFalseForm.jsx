import { Form, Button } from "reactstrap";
import { FormikProvider, useFormik, Form as FForm } from "formik";
import { useContext, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import CKEditorInput from "../CKEditorInput";
import axios from "../../api/axios";
import { QuestionsContext } from "../../layouts/QuestionsLayout";
import Field from "./Field";
import VizMaker from "../VizMaker";

const validate = (values) => {
  const errors = {};

  const msg = "Šis laukas yra privalomas";

  if (!values.name) errors.name = msg;
  if (!values.questiontext) errors.questiontext = msg;
  if (!values.defaultgrade) errors.defaultgrade = msg;
  if (!values.answer) errors.answer = msg;

  return errors;
};

const mapQuestion = (q) => {
  return {
    name: q.name,
    questiontext: q.questionText,
    defaultgrade: q.defaultGrade,
    generalfeedback: q.generalFeedback,
    answer: q.questionAnswers[0].fraction === "1" ? "true" : "false",
    truefeedback:
      q.questionAnswers[0].answer === "Tiesa"
        ? q.questionAnswers[0].feedback
        : q.questionAnswers[1].feedback,
    falsefeedback:
      q.questionAnswers[0].answer === "Netiesa"
        ? q.questionAnswers[0].feedback
        : q.questionAnswers[1].feedback,
  };
};

export default function TrueFalseForm() {
  const { questions, setQuestions } = useContext(QuestionsContext);
  let { id } = useParams();
  let navigate = useNavigate();
  let { state } = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();

  const [initialValues, setInitialValues] = useState({
    name: "",
    questiontext: "",
    defaultgrade: "",
    generalfeedback: "",
    answer: "true",
    truefeedback: "",
    falsefeedback: "",
  });

  useEffect(() => {
    if (!state && id) {
      axios
        .get(`questions/${id}`)
        .then((response) => setInitialValues(mapQuestion(response.data)))
        .catch((response) => console.log(response.data));
    } else if (state) {
      setInitialValues(mapQuestion(state));
    }
  }, []);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      if (!id) {
        axios
          .post(`questions/${searchParams.get("qtype")}`, values)
          .then((response) => {
            setQuestions((prev) => [...prev, response.data]);
            navigate("../");
          })
          .catch((r) => console.log("Failed to submit question."));
      } else {
        axios
          .put(`questions/${searchParams.get("qtype")}/${id}`, values)
          .then((response) => {
            setQuestions((prev) => {
              const newQuestions = [...prev];
              const i = newQuestions.findIndex((q) => q.id === Number(id));
              newQuestions[i] = response.data;
              return newQuestions;
            });
            navigate("../");
          })
          .catch((r) => console.log("Failed to edit question."));
      }
    },
  });

  const handleEditorChange = (field) => {
    return (_, editor) => {
      formik.setFieldValue(field, editor.getData());
    };
  };

  return (
    <FormikProvider value={formik}>
      <h3>Vizualizacija</h3>
      <VizMaker />
      <hr />
      <Form tag={FForm} noValidate>
        <h3>Bendra</h3>
        <Field name="name" label="Klausimo pavadinimas" required />
        <Field
          name="questiontext"
          as={CKEditorInput}
          inputProps={{
            style: { minHeight: 200, height: 240 },
            onChange: handleEditorChange("questiontext"),
          }}
          label="Klausimo tekstas"
          required
        />
        <Field
          name="defaultgrade"
          type="number"
          label="Numatytasis pažymys"
          required
        />
        <Field
          name="generalfeedback"
          as={CKEditorInput}
          inputProps={{
            style: { minHeight: 200, height: 240 },
            onChange: handleEditorChange("generalfeedback"),
          }}
          label="Bendras grįžtamasis ryšys"
        />
        <hr />
        <h3>Atsakymai</h3>
        <Field name="answer" type="select" label="Teisingas atsakymas">
          <option value="true">Tiesa</option>
          <option value="false">Netiesa</option>
        </Field>
        <Field
          name="truefeedback"
          as={CKEditorInput}
          inputProps={{
            style: { minHeight: 200, height: 240 },
            onChange: handleEditorChange("truefeedback"),
          }}
          label="Atsiliepimas apie atsakymą „Tiesa“"
        />
        <Field
          name="falsefeedback"
          as={CKEditorInput}
          inputProps={{
            style: { minHeight: 200, height: 240 },
            onChange: handleEditorChange("falsefeedback"),
          }}
          label="Atsiliepimas apie atsakymą „Netiesa“"
        />
        <hr />
        <div className="hstack gap-3">
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
  );
}
