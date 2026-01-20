import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ExamProvider } from "./exam/ExamContext";

import PracticeTestsPage from "./exam/PracticeTestsPage";
import ExamPage from "./exam/ExamPage";
import { ReviewPage } from "./exam/ReviewPage";

export default function App() {
  return (
    <ExamProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/practice-tests" />} />

          <Route
            path="/practice-tests"
            element={<PracticeTestsPage />}
          />

          <Route
            path="/exam/:testId"
            element={<ExamPage />}
          />

          <Route
            path="/review/:testId"
            element={<ReviewPage />}
          />
        </Routes>
      </BrowserRouter>
    </ExamProvider>
  );
}
