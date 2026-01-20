import { useExam } from "./ExamContext";

/* ===== HELPERS ===== */
function formatTime(seconds) {
  if (seconds == null) return "—";
  const hh = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function ReviewPage() {
  const { state } = useExam();
  const { questions, answers, timeTaken } = state || {};

  if (!questions || questions.length === 0) {
    return <div className="p-6">Resultado não encontrado.</div>;
  }

  const total = questions.length;
  const correctCount = questions.filter(
    q => answers?.[q.id] === q.correct
  ).length;

  const scorePercent = ((correctCount / total) * 100).toFixed(2);
  const pass = scorePercent >= 70;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 space-y-10">

        {/* ===== SUMMARY (WHIZLABS BOXED STYLE) ===== */}
        <div className="bg-white rounded-xl shadow-sm border">

          {/* Header */}
          <div className="flex justify-between items-center px-8 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Final Test
            </h2>
            <span className="text-sm text-gray-500">
              Completed on {new Date().toDateString()}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between px-8 py-8">

            <SummaryItem>
              <div className="text-2xl font-semibold">
                1<sup className="text-sm">st</sup>
              </div>
              <span>Attempt</span>
            </SummaryItem>

            <Divider />

            <SummaryItem>
              <div className="text-2xl font-semibold">
                {correctCount}/{total}
              </div>
              <span>Marks Obtained</span>
            </SummaryItem>

            <Divider />

            <SummaryItem>
              <div className="text-2xl font-semibold">
                {scorePercent}%
              </div>
              <span>Your Score</span>
            </SummaryItem>

            <Divider />

            <SummaryItem>
              <div className="text-2xl font-semibold">
                {formatTime(timeTaken)}
              </div>
              <span>Time Taken</span>
            </SummaryItem>

            <Divider />

            <SummaryItem>
              <div
                className={
                  pass
                    ? "text-2xl font-semibold text-green-600"
                    : "text-2xl font-semibold text-red-600"
                }
              >
                {pass ? "PASS" : "FAIL"}
              </div>
              <span>Result</span>
            </SummaryItem>

          </div>
        </div>

        {/* ===== QUESTIONS ===== */}
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="space-y-8">
            {questions.map((q, index) => {
              const userAnswer = answers?.[q.id];
              const isCorrect = userAnswer === q.correct;

              return (
                <div
                  key={q.id}
                  className="white-box review-answer px-6 lg:px-10 max-w-5xl mx-auto"
                >
                  <div className="questions-block">

                    {/* HEADER */}
                    <div
                      className={`title-block ${
                        isCorrect ? "correct" : "incorrect"
                      }`}
                    >
                      Question {index + 1}
                      <span className={isCorrect ? "correct" : "incorrect"}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="box-content">

                      {/* QUESTION */}
                      <div className="que-group">
                        <div className="que">
                          {q.domain && (
                            <span className="que-category">
                              <strong>Domain: </strong> {q.domain}
                            </span>
                          )}
                          <p>{q.question}</p>
                        </div>

                        {/* ANSWERS */}
                        <div className="answer">
                          <ul>
                            {Object.entries(q.options).map(([key, text]) => {
                              const isRight = key === q.correct;
                              const isSelected = key === userAnswer;

                              return (
                                <li
                                  key={`${q.id}-${key}`}
                                  className={
                                    isRight
                                      ? "right"
                                      : isSelected
                                      ? "selected wrong"
                                      : "wrong"
                                  }
                                >
                                  {key}. {text}
                                  {isRight && <span>right</span>}
                                  {isSelected && !isRight && <span>wrong</span>}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>

                      {/* EXPLANATION */}
                      <div className="explanation-block">
                        <h6>Explanation:</h6>
                        <p>
                          <strong>Correct Answer - {q.correct}</strong>
                        </p>

                        {q.explanation && <p>{q.explanation}</p>}

                        {q.discussions?.length > 0 && (
                          <ul>
                            {q.discussions.map((d, i) => (
                              <li key={`${q.id}-d-${i}`}>
                                {d.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */

function SummaryItem({ children }) {
  return (
    <div className="flex flex-col items-center text-center min-w-[120px]">
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="hidden md:block h-12 w-px bg-gray-300 mx-4" />
  );
}
