// src/exam/generatePracticeTests.js
import questions from "../data/questions.json";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generatePracticeTests() {
  const TOTAL_TESTS = 10;
  const QUESTIONS_PER_TEST = 50;

  // 🔹 usa os IDs reais das perguntas
  const allQuestionIds = shuffle(
    questions.map(q => q.id)
  );

  const tests = Array.from({ length: TOTAL_TESTS }, () => []);

  // 1️⃣ distribuição inicial (cobertura total)
  let index = 0;
  for (const qId of allQuestionIds) {
    tests[index].push(qId);
    index = (index + 1) % TOTAL_TESTS;
  }

  // 2️⃣ completa cada exame até 50 perguntas
  for (let i = 0; i < TOTAL_TESTS; i++) {
    while (tests[i].length < QUESTIONS_PER_TEST) {
      const randomQ =
        allQuestionIds[Math.floor(Math.random() * allQuestionIds.length)];

      if (!tests[i].includes(randomQ)) {
        tests[i].push(randomQ);
      }
    }
  }

  return tests;
}
