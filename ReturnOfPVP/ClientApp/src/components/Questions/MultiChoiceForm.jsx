import { Form, FormGroup, Input, Label, Col, Button, Alert } from "reactstrap";
import { useFormik, Form as FForm, FieldArray, FormikProvider } from "formik";
import { useContext, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

import CKEditorInput from "../CKEditorInput";
import axios from "../../api/axios";
import { QuestionsContext } from "../../layouts/QuestionsLayout";
import Field from "./Field";
import VizMaker from "../VizMaker";

const validate = (values) => {
  let errors = { answers: [] };

  errors.answers.push({});

  const msg = "Šis laukas yra privalomas";

  if (!values.name) errors.name = msg;
  if (!values.questiontext) errors.questiontext = msg;
  if (!values.defaultgrade) errors.defaultgrade = msg;

  if (values.answers.filter((a) => a.answer !== "").length < 2) {
    errors.answers[0].answer = "Turi būti bent du atsakymai.";
  }

  if (
    values.single === "true" &&
    values.answers.filter((a) => Number(a.fraction) === 100).length !== 1
  ) {
    errors.answers[0].fraction = "Vienas iš pasirinkimų turi sudaryti 100%";
  }

  const sum = values.answers.reduce(
    (prev, curr) => prev + Number(curr.fraction),
    0
  );
  if (values.single === "false" && Math.round(sum) !== 100) {
    errors.answers[0].fraction = `Pasirinkti teigiami įverčiai nesudaro 100% (${sum}%)`;
  }

  if (
    errors.answers.reduce(
      (prev, curr) => prev + Object.keys(curr).length,
      0
    ) === 0
  )
    return {};
  return errors;
};

const mapQuestion = (q) => {
  console.log(q);
  return {
    name: q.name,
    questiontext: q.questionText,
    defaultgrade: q.defaultGrade,
    generalfeedback: q.generalFeedback,
    single: q.single.toString(),
    shuffleanswers: q.shuffleAnswers,
    answernumbering: q.answerNumbering,
    answers: q.questionAnswers.map((a) => ({
      answer: a.answer,
      fraction: a.fraction,
      feedback: a.feedback,
    })),
    correctfeedback: q.correctFeedback,
    partiallycorrectfeedback: q.partiallyCorrectFeedback,
    incorrectfeedback: q.incorrectFeedback,
  };
};

export default function MultiChoiceForm() {
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
    single: "true",
    shuffleanswers: true,
    answernumbering: "abc",
    answers: [
      {
        answer: "",
        fraction: "0",
        feedback: "",
      },
      {
        answer: "",
        fraction: "0",
        feedback: "",
      },
    ],
    correctfeedback: "",
    partiallycorrectfeedback: "",
    incorrectfeedback: "",
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
      // alert(JSON.stringify(values, null, 2));
      if (!id) {
        axios
          .post(`questions/${searchParams.get("qtype")}`, values)
          .then((response) => {
            setQuestions((prev) => [...prev, response.data]);
            navigate("../");
          })
          .catch((e) => console.log("Failed to submit question."));
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
          .catch((e) => console.log("Failed to edit question."));
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
        <Field name="single" type="select" label="Vienas arba keli atsakymai">
          <option value="false">Leidžiami keli atsakymai</option>
          <option value="true">Tik vienas atsakymas</option>
        </Field>
        <FormGroup row>
          <Label sm={2}></Label>
          <Col sm={10}>
            <Input
              id="shuffleanswers"
              type="checkbox"
              onChange={formik.handleChange}
              checked={formik.values.shuffleanswers}
            />{" "}
            <Label for="shuffleanswers">Maišyti pasirinkimus?</Label>
          </Col>
        </FormGroup>
        <Field
          name="answernumbering"
          type="select"
          label="Pasirinkimų numeracija"
        >
          <option value="abc">a., b., c., ...</option>
          <option value="ABCD">A., B., C., ...</option>
          <option value="123">1., 2., 3., ...</option>
          <option value="iii">i., ii., iii., ...</option>
          <option value="IIII">I., II., III., ...</option>
          <option value="none">Be numeravimo</option>
        </Field>
        <FieldArray name="answers">
          {({ push }) => (
            <>
              {formik.values.answers.map((a, i) => (
                <Alert key={`answer-${i}`} color="secondary">
                  <Field
                    name={`answers.${i}.answer`}
                    as={CKEditorInput}
                    inputProps={{
                      onChange: handleEditorChange(`answers.${i}.answer`),
                    }}
                    label={`Atsakymas ${i + 1}`}
                  />
                  <Field
                    name={`answers.${i}.fraction`}
                    type="select"
                    label="Įvertis"
                  >
                    <option value="0">Nėra</option>
                    <option value="100">100%</option>
                    <option value="90">90%</option>
                    <option value="83.33333">83.33333%</option>
                    <option value="80">80%</option>
                    <option value="75">75%</option>
                    <option value="70">70%</option>
                    <option value="66.66667">66.66667%</option>
                    <option value="60">60%</option>
                    <option value="50">50%</option>
                    <option value="40">40%</option>
                    <option value="33.33333">33.33333%</option>
                    <option value="30">30%</option>
                    <option value="25">25%</option>
                    <option value="20">20%</option>
                    <option value="16.66667">16.66667%</option>
                    <option value="14.28571">14.28571%</option>
                    <option value="12.5">12.5%</option>
                    <option value="11.11111">11.11111%</option>
                    <option value="10">10%</option>
                    <option value="5">5%</option>
                    <option value="-5">-5%</option>
                    <option value="-10">-10%</option>
                    <option value="-11.11111">-11.11111%</option>
                    <option value="-12.5">-12.5%</option>
                    <option value="-14.28571">-14.28571%</option>
                    <option value="-16.66667">-16.66667%</option>
                    <option value="-20">-20%</option>
                    <option value="-25">-25%</option>
                    <option value="-30">-30%</option>
                    <option value="-33.33333">-33.33333%</option>
                    <option value="-40">-40%</option>
                    <option value="-50">-50%</option>
                    <option value="-60">-60%</option>
                    <option value="-66.66667">-66.66667%</option>
                    <option value="-70">-70%</option>
                    <option value="-75">-75%</option>
                    <option value="-83.33333">-83.33333%</option>
                    <option value="-80">-80%</option>
                    <option value="-90">-90%</option>
                    <option value="-100">-100%</option>
                  </Field>
                  <Field
                    name={`answers.${i}.feedback`}
                    as={CKEditorInput}
                    inputProps={{
                      onChange: handleEditorChange(`answers.${i}.feedback`),
                    }}
                    label="Grįžtamasis ryšys"
                  />
                </Alert>
              ))}
              <Button
                className="text-light"
                type="button"
                onClick={() =>
                  push({ answer: "", fraction: "0", feedback: "" })
                }
              >
                <AiOutlinePlus size={22} className="me-1" />
                Pridėti klausimą
              </Button>
            </>
          )}
        </FieldArray>

        <hr />
        <h3>Bendri atsiliepimai</h3>
        <Field
          name="correctfeedback"
          as={CKEditorInput}
          inputProps={{
            style: { minHeight: 200, height: 240 },
            onChange: handleEditorChange("correctfeedback"),
          }}
          label="Kiekvienam teisingam atsakymui"
        />
        <Field
          name="partiallycorrectfeedback"
          as={CKEditorInput}
          inputProps={{
            style: { minHeight: 200, height: 240 },
            onChange: handleEditorChange("partiallycorrectfeedback"),
          }}
          label="Kiekvienam dalinai teisingam atsakymui"
        />
        <Field
          name="incorrectfeedback"
          as={CKEditorInput}
          inputProps={{
            style: { minHeight: 200, height: 240 },
            onChange: handleEditorChange("incorrectfeedback"),
          }}
          label="Kiekvienam neteisingam atsakymui"
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
