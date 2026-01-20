import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import allQuestions from "../data/questions.json";

const TOTAL_QUESTIONS = 50;
const TOTAL_TIME_SECONDS = 90 * 60; // 1h30

const ExamContext = createContext(null);

const initialState = {
  status: "idle",
  questions: [],
  currentIndex: 0,
  answers: {},
  marked: {},
  timeLeft: TOTAL_TIME_SECONDS,
  startedAt: null,
  timeTaken: null, // ✅ NOVO
  practiceTestId: null,
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function reducer(state, action) {
  switch (action.type) {
    case "START": {
      const picked = shuffle(allQuestions).slice(0, TOTAL_QUESTIONS);
      return {
        ...initialState,
        status: "running",
        questions: picked,
        startedAt: Date.now(),
      };
    }

    case "START_PRACTICE_TEST": {
      const { practiceTestId, questions } = action.payload;
      return {
        ...initialState,
        status: "running",
        practiceTestId,
        questions,
        startedAt: Date.now(),
      };
    }

    case "ANSWER": {
      const { qid, value } = action;
      return { ...state, answers: { ...state.answers, [qid]: value } };
    }

    case "TOGGLE_MARK": {
      const qid = action.qid;
      const next = { ...state.marked };
      next[qid] ? delete next[qid] : (next[qid] = true);
      return { ...state, marked: next };
    }

    case "NAVIGATE":
      return { ...state, currentIndex: action.index };

    case "TICK":
      return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };

    case "FINISH": {
      const now = Date.now();
      const elapsedSeconds = Math.floor(
        (now - state.startedAt) / 1000
      );

      return {
        ...state,
        status: "finished",
        timeTaken: elapsedSeconds, // ✅ SALVO AQUI
      };
    }

    default:
      return state;
  }
}

export function ExamProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.status !== "running") return;
    const t = setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => clearInterval(t);
  }, [state.status]);

  useEffect(() => {
    if (state.status === "running" && state.timeLeft === 0) {
      dispatch({ type: "FINISH" });
    }
  }, [state.status, state.timeLeft]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExam() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error("useExam must be used inside ExamProvider");
  return ctx;
}
