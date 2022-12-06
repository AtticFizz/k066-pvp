import { useSearchParams } from "react-router-dom";
import EditQuiz from "../components/Quizzes/EditQuiz";

export default function EditQuizPage() {

  return (
    <>
      <h1 className="display-4">Redaguoti testą</h1>
      <hr />
      <EditQuiz />
    </>
  );
}
