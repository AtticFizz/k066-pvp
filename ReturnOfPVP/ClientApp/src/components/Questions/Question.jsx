import { Alert, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import { Field as FField, FormikContext } from "formik";
import { BsX, BsCheck } from "react-icons/bs";
import HtmlDiv from "../HtmlDiv";
import { useContext, useEffect, useState } from "react";

const numbering = (n) => {
  switch (n) {
    case "abc":
      return "lower-alpha";
    case "ABCD":
      return "upper-alpha";
    case "123":
      return "decimal";
    case "iii":
      return "lower-roman";
    case "IIII":
      return "upper-roman";
    default:
      return "none";
  }
};

const Field = ({ data, name, type, numbering, finished }) => {
  return (
    <FField name={name}>
      {({ field, form, meta }) => (
        <FormGroup check>
          <Input
            type={type}
            {...field}
            id={`answer-${data.id}`}
            value={data.id}
            disabled={finished}
            className="align-top"
          />
          <div className="hstack align-items-start gap-2">
            <Label for={`answer-${data.id}`}>
              <li style={{ listStyleType: numbering ?? "none" }}>
                <HtmlDiv value={data.answer} className="d-inline-block" />
              </li>
            </Label>
            {finished && field.value.includes(data.id.toString()) && (
              <>
                {Number(data.fraction) <= 0 ? (
                  <BsX size={24} className="text-danger" />
                ) : (
                  <BsCheck size={24} className="text-success" />
                )}
                <HtmlDiv
                  value={data.feedback}
                  className="d-inline-block m-0 bg-warning"
                />
              </>
            )}
          </div>
        </FormGroup>
      )}
    </FField>
  );
};

export default function Question({ data, index, finished }) {
  const formik = useContext(FormikContext);
  const [selected, setSelected] = useState([]);
  const [fractionSum, setFractionSum] = useState(0);

  const SelectByType = () => {
    switch (data.qType) {
      case "truefalse":
        const trueAnwerIndex = data.questionAnswers.findIndex(
          (a) => a.fraction === "100"
        );
        const falseAnwerIndex = data.questionAnswers.findIndex(
          (a) => a.fraction === "0"
        );

        return (
          <>
            <Field
              type="radio"
              data={data.questionAnswers[trueAnwerIndex]}
              name={`questions.${index}.answers`}
              finished={finished}
            />
            <Field
              type="radio"
              data={data.questionAnswers[falseAnwerIndex]}
              name={`questions.${index}.answers`}
              finished={finished}
            />
          </>
        );
      case "multichoice":
        return (
          <>
            {data.single
              ? data.questionAnswers.map((a, i) => (
                  <Field
                    type="radio"
                    key={`q${index}-answer-${i}`}
                    data={a}
                    name={`questions.${index}.answers`}
                    numbering={numbering(data.answerNumbering)}
                    finished={finished}
                  />
                ))
              : data.questionAnswers.map((a, i) => (
                  <Field
                    type="checkbox"
                    key={`q${index}-answer-${i}`}
                    data={a}
                    name={`questions.${index}.answers`}
                    numbering={numbering(data.answerNumbering)}
                    finished={finished}
                  />
                ))}
          </>
        );
      default:
        throw new Error("Invalid question type.");
    }
  };

  useEffect(() => {
    if (finished) {
      const sel = data.questionAnswers.filter((a) =>
        formik.values.questions[index].answers.includes(a.id.toString())
      );
      setSelected(sel);
      setFractionSum(sel.reduce((x, y) => x + Number(y.fraction), 0));
    }
  }, [finished]);

  useEffect(() => {
    console.log(fractionSum);
  }, [fractionSum]);

  return (
    <>
      <Alert color="secondary">
        <div className="hstack gap-3">
          <h4 className="alert-heading me-auto">{data.name}</h4>
          <span>Klausimas {index + 1}</span>
          {finished && (
            <>
              <div className="vr" />
              <span>
                {Math.round((fractionSum / 100) * data.defaultGrade * 100) /
                  100}{" "}
                iš {data.defaultGrade}
              </span>
            </>
          )}
        </div>
        <HtmlDiv value={data.questionText} />
        <FormGroup tag="fieldset" className="mx-2">
          {/* {data.qType !== "truefalse" && <p>Pasirinkite vieną ar daugiau:</p>} */}
          <ol className="p-0 m-0">{SelectByType()}</ol>
        </FormGroup>
      </Alert>
      {/* {finished && (
        <Alert color="warning">
          <></>
        </Alert>
      )} */}
    </>
  );
}
