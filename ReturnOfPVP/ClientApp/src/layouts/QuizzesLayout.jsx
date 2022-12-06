import { createContext, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Container } from "reactstrap";

import axios from "../api/axios";

export const QuizzesContext = createContext([]);

export default function QuizzesLayout() {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const containerRef = useRef();

  useEffect(() => {
    axios
      .get("quiz")
      .then((response) => {
        setQuizzes(response.data);
        setIsLoading(false);
      })
      .catch((response) => console.log(response.data));
  }, []);

  const scrollToTop = () => {
    window.scrollTo(0, containerRef.current.offsetTop);
  };

  return (
    <QuizzesContext.Provider
      value={{ quizzes, setQuizzes, isLoading, scrollToTop }}
    >
      <div
        ref={containerRef}
        className="h-100 w-100"
        style={{ overflowX: "hidden" }}
      >
        <Container fluid className="h-100 p-2 d-flex flex-column pt-0">
          <Outlet />
        </Container>
      </div>
    </QuizzesContext.Provider>
  );
}
