// ===============================
// File: src/exam/ExamPage.jsx
import { useExam } from "./ExamContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ExamPage() {
  const { state, dispatch } = useExam();
  const navigate = useNavigate();

  const {
    questions,
    currentIndex,
    answers,
    marked,
    timeLeft,
    practiceTestId,
  } = state;

  const q = questions[currentIndex];
  if (!q) return null;

  // ===== NEW: show / hide explanation
  const [showAnswer, setShowAnswer] = useState(false);

  // Fecha explicação ao trocar de questão
  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  const hh = String(Math.floor(timeLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const userAnswer = answers[q.id];
  const isCorrect = userAnswer === q.correct;

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "2.5fr 1fr",
          gap: "24px",
        }}
      >
        {/* ===== LEFT: QUESTION ===== */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 1px 4px rgba(0,0,0,.08)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>
              Question {currentIndex + 1} / {questions.length}
            </strong>
            <span style={{ fontFamily: "monospace" }}>
              {hh}:{mm}:{ss}
            </span>
          </div>

          {/* Question */}
          <p style={{ marginTop: "16px", lineHeight: 1.6 }}>
            {q.question}
          </p>

          {/* Options */}
          <div style={{ marginTop: "24px" }}>
            {Object.entries(q.options).map(([k, v]) => {
              const selected = answers[q.id] === k;

              return (
                <label
                  key={k}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "14px",
                    marginBottom: "12px",
                    borderRadius: "8px",
                    border: selected
                      ? "2px solid #2563eb"
                      : "1px solid #e5e7eb",
                    background: selected ? "#e0f2fe" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: "2px solid #2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "4px",
                    }}
                  >
                    {selected && (
                      <span
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "#2563eb",
                        }}
                      />
                    )}
                  </span>

                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={selected}
                    onChange={() =>
                      dispatch({
                        type: "ANSWER",
                        qid: q.id,
                        value: k,
                      })
                    }
                    style={{ display: "none" }}
                  />

                  <span>
                    <strong>{k}.</strong> {v}
                  </span>
                </label>
              );
            })}
          </div>

          {/* ===== SHOW ANSWER BUTTON ===== */}
          <div style={{ marginTop: "12px" }}>
            <button
              onClick={() => setShowAnswer(v => !v)}
              style={{
                background: "#e0e7ff",
                color: "#3730a3",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: 500,
              }}
            >
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>
          </div>

          {/* ===== EXPLANATION ===== */}
          {showAnswer && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                borderRadius: "8px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
              }}
            >
              <strong>
                Correct Answer – Option {q.correct}
              </strong>

              {q.explanation && (
                <p style={{ marginTop: "8px" }}>
                  {q.explanation}
                </p>
              )}

              {q.discussions?.length > 0 && (
                <ul style={{ marginTop: "12px", paddingLeft: "18px" }}>
                  {q.discussions.map((d, i) => (
                    <li key={i} style={{ marginBottom: "8px" }}>
                      {d.text || d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "32px",
            }}
          >
            <button
              onClick={() =>
                dispatch({
                  type: "NAVIGATE",
                  index: Math.max(0, currentIndex - 1),
                })
              }
            >
              Prev
            </button>

            <button
              onClick={() =>
                dispatch({ type: "TOGGLE_MARK", qid: q.id })
              }
            >
              {marked[q.id] ? "Unmark review" : "Mark for review"}
            </button>

            <button
              onClick={() =>
                dispatch({
                  type: "NAVIGATE",
                  index: Math.min(
                    questions.length - 1,
                    currentIndex + 1
                  ),
                })
              }
            >
              Next
            </button>
          </div>
        </div>

        {/* ===== RIGHT: NAV ===== */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 1px 4px rgba(0,0,0,.08)",
            display: "flex",
            flexDirection: "column",

            // 🔥 FIX IMPORTANTE
            height: "calc(100vh - 48px)",
            position: "sticky",
            top: "24px",
            overflowY: "auto",
          }}
        >
          <strong style={{ textAlign: "center", marginBottom: "12px" }}>
            Review Attempt
          </strong>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              flexGrow: 1,
              overflowY: "auto",
            }}
          >
            {questions.map((qq, i) => {
              const current = i === currentIndex;
              const answered = answers[qq.id];
              const isMarked = marked[qq.id];

              let bg = "#e5e7eb";
              if (current) bg = "#2563eb";
              else if (isMarked) bg = "#facc15";
              else if (answered) bg = "#86efac";

              return (
                <button
                  key={qq.id}
                  onClick={() =>
                    dispatch({ type: "NAVIGATE", index: i })
                  }
                  style={{
                    height: "36px",
                    borderRadius: "999px",
                    background: bg,
                    color: current ? "#fff" : "#000",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <button
            style={{
              marginTop: "16px",
              background: "#dc2626",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
            }}
            onClick={() => {
              dispatch({ type: "FINISH" });
              navigate(`/review/${practiceTestId}`);
            }}
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}
