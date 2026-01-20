import fs from "fs";
import path from "path";

const INPUT_DIR = "./input";
const OUTPUT_FILE = "./output/questions.json";

let questions = [];
let globalId = 1;

const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith(".txt"));

for (const file of files) {
  const content = fs.readFileSync(path.join(INPUT_DIR, file), "utf-8");

  const blocks = content
    .split("==============================")
    .filter(b => b.includes("Pergunta:"));

  for (const block of blocks) {
    const questionMatch = block.match(/Pergunta:\n([\s\S]*?)\n\nAlternativas:/);
    const alternativesMatch = block.match(/Alternativas:\n([\s\S]*?)\n\nResposta correta:/);
    const correctMatch = block.match(/Resposta correta:\n([A-D])\./);
    const discussionsMatch = block.match(/Top 10 Discussões \(sem replies\):\n([\s\S]*)/);

    if (!questionMatch || !alternativesMatch || !correctMatch) continue;

    const questionText = questionMatch[1].trim();

    // Alternativas
    const options = {};
    alternativesMatch[1]
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.startsWith("-"))
      .forEach(line => {
        const m = line.match(/- ([A-D])\. (.*)/);
        if (m) options[m[1]] = m[2].trim();
      });

    // Discussões — por item numerado (robusto)
    const discussions = [];

    if (discussionsMatch) {
      const discussionBlock = discussionsMatch[1];

      const itemRegex = /\n?\s*(\d+)\.\s([\s\S]*?)(?=\n\s*\d+\.|\n*$)/g;
      let match;

      while ((match = itemRegex.exec(discussionBlock)) !== null) {
        if (discussions.length >= 10) break;

        let text = match[2]
          .replace(/upvoted\s+\d+\s+times?/gi, "")
          .replace(/\s{2,}/g, " ")
          .replace(/\n{2,}/g, "\n")
          .trim();

        if (text.length < 20) continue;

        discussions.push({
          index: Number(match[1]),
          text
        });
      }
    }

    questions.push({
      id: globalId++,
      source: "examtopics",
      question: questionText,
      options,
      correct: correctMatch[1],
      discussions
    });
  }
}

fs.mkdirSync("./output", { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(questions, null, 2));

console.log(`✅ ${questions.length} perguntas geradas em ${OUTPUT_FILE}`);
