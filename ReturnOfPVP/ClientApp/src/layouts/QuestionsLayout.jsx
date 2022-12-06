import { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";

import axios from "../api/axios";

export const QuestionsContext = createContext([]);

export default function QuestionsLayout() {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios
      .get("questions")
      .then((response) => {
        setQuestions(response.data);
        setIsLoading(false);
      })
      .catch((response) => console.log(response.data));
  }, []);

  return (
    <QuestionsContext.Provider value={{ questions, setQuestions, isLoading }}>
      <div className="h-100 w-100 overflow-auto">
        <Container className="min-vh-100 p-2">
          <Outlet />
        </Container>
      </div>
    </QuestionsContext.Provider>
  );
}
