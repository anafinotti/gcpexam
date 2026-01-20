import { PRACTICE_TESTS } from "./practiceTests";
import { useExam } from "./ExamContext";
import allQuestions from "../data/questions.json";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "gcp_practice_tests_v1";

export default function PracticeTestsPage() {
  const { dispatch } = useExam();
  const navigate = useNavigate(); // ✅ AGORA NO LUGAR CERTO

  function startPracticeTest(test) {
    const questions = test.questionIds
      .map(id => allQuestions.find(q => q.id === id))
      .filter(Boolean);

    dispatch({
      type: "START_PRACTICE_TEST",
      payload: {
        practiceTestId: test.id,
        questions,
      },
    });
  }

  function resetPracticeTests() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  return (
    <div style={{ padding: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Practice Tests</h1>
          <p>Choose one test to start</p>
        </div>

        <button onClick={resetPracticeTests}>
          Reset Practice Tests
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 24,
        }}
      >
        {PRACTICE_TESTS.map(test => (
          <div
            key={test.id}
            style={{
              padding: 20,
              border: "1px solid #ddd",
              borderRadius: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3>{test.title}</h3>
              <p>{test.questionIds.length} questions • 2h 0m</p>
            </div>

            <button
              onClick={() => {
                startPracticeTest(test);
                navigate(`/exam/${test.id}`);
              }}
            >
              Start
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
