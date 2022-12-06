import { Button } from "reactstrap";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import RequireAuth from "../components/RequireAuth";
import { QuizzesContext } from "../layouts/QuizzesLayout";
import QuizzesTable from "../components/Quizzes/QuizzesTable";

export default function QuizzesPage() {
  const { quizzes, setQuizzes, isLoading } = useContext(QuizzesContext);
  const navigate = useNavigate();

  return (
    <>
      <h1 className="display-4">Testai</h1>
      <hr />
      <div>
        <RequireAuth allowedRoles={["Admin"]}>
          <Button onClick={() => navigate("edit")} className="text-light">
            <AiOutlinePlus size={22} className="me-1" />
            Naujas
          </Button>
        </RequireAuth>
      </div>
      <QuizzesTable
        quizzes={quizzes}
        setQuizzes={setQuizzes}
        isLoading={isLoading}
      />
    </>
  );
}
