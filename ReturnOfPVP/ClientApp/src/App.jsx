import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import AuthRoute from "./components/AuthRoute";
import MainLayout from "./layouts/MainLayout";
import ArrayLayout from "./layouts/ArrayLayout";
import StackLayout from "./layouts/StackLayout";
import HashTableLayout from "./layouts/HashTableLayout";
import LinkedListLayout from "./layouts/LinkedListLayout";
import QueueLayout from "./layouts/QueueLayout";
import TreeLayout from "./layouts/TreeLayout";
import QuestionsLayout from "./layouts/QuestionsLayout";
import QuizzesLayout from "./layouts/QuizzesLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import QuestionsPage from "./pages/QuestionsPage";
import EditQuestionPage from "./pages/EditQuestionPage";
import QuizzesPage from "./pages/QuizzesPage";
import EditQuizPage from "./pages/EditQuizPage";
import QuizPage from "./pages/QuizPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="array/*" element={<ArrayLayout />} />
          <Route path="stack/*" element={<StackLayout />} />
          <Route path="queue/*" element={<QueueLayout />} />
          <Route path="tree/*" element={<TreeLayout />} />
          <Route path="linked-list/*" element={<LinkedListLayout />} />
          <Route path="hash-table/*" element={<HashTableLayout />} />
          <Route path="quizzes" element={<QuizzesLayout />}>
            <Route index element={<QuizzesPage />} />
            <Route path=":id" element={<QuizPage />} />
            <Route element={<AuthRoute allowedRoles={["Admin"]} />}>
              <Route path="edit" element={<EditQuizPage />} />
              <Route path="edit/:id" element={<EditQuizPage />} />
            </Route>
          </Route>
          <Route element={<AuthRoute allowedRoles={["Admin"]} />}>
            <Route path="questions" element={<QuestionsLayout />}>
              <Route index element={<QuestionsPage />} />
              <Route path="edit" element={<EditQuestionPage />} />
              <Route path="edit/:id" element={<EditQuestionPage />} />
            </Route>
          </Route>
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
