import { lazy, Suspense, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert } from "reactstrap";

import QuestionTypes from "../api/QuestionTypes";
import TrueFalseForm from "../components/Questions/TrueFalseForm";
import MultiChoiceForm from "../components/Questions/MultiChoiceForm";

export default function EditQuestionPage() {
  let [searchParams, setSearchParams] = useSearchParams();

  const chooseForm = useCallback(() => {
    switch (searchParams.get("qtype")) {
      case "truefalse":
        return <TrueFalseForm />;
      case "multichoice":
        return <MultiChoiceForm />;
      default:
        return (
          <Alert className="m-auto w-50" color="danger">
            Nenurodytas klausimo tipas.
          </Alert>
        );
    }
  }, [searchParams]);

  return (
    <>
      <h1 className="display-4">
        Redaguoti{" "}
        {searchParams.has("qtype") &&
          QuestionTypes[searchParams.get("qtype")].alt.toLowerCase()}{" "}
        klausimą
      </h1>
      <hr />
      {chooseForm()}
    </>
  );
}
