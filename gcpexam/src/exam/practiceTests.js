import { generatePracticeTests } from "./generatePracticeTests";

const STORAGE_KEY = "gcp_practice_tests_v1";

function loadOrCreatePracticeTests() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }

  const generatedQuestionIds = generatePracticeTests();

  const tests = [
    { id: 1, title: "Practice Test 1", questionIds: generatedQuestionIds[0] },
    { id: 2, title: "Practice Test 2", questionIds: generatedQuestionIds[1] },
    { id: 3, title: "Practice Test 3", questionIds: generatedQuestionIds[2] },
    { id: 4, title: "Practice Test 4", questionIds: generatedQuestionIds[3] },
    { id: 5, title: "Practice Test 5", questionIds: generatedQuestionIds[4] },
    { id: 6, title: "Practice Test 6", questionIds: generatedQuestionIds[5] },
    { id: 7, title: "Practice Test 7", questionIds: generatedQuestionIds[6] },
    { id: 8, title: "Practice Test 8", questionIds: generatedQuestionIds[7] },
    { id: 9, title: "Practice Test 9", questionIds: generatedQuestionIds[8] },
    { id: 10, title: "Practice Test 10", questionIds: generatedQuestionIds[9] },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  return tests;
}

export const PRACTICE_TESTS = loadOrCreatePracticeTests();
