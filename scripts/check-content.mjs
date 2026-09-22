/** Validates every question bank. Run with `npm run check`. */
import fs from "node:fs";
import path from "node:path";

const CONTENT = path.join(process.cwd(), "content");
let total = 0;
let problems = 0;
const ids = new Set();

for (const unit of fs.readdirSync(CONTENT)) {
  const dir = path.join(CONTENT, unit, "questions");
  if (!fs.existsSync(dir)) continue;
  let unitTotal = 0;

  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith(".json")) continue;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    } catch (err) {
      console.log(`PARSE FAIL ${unit}/${file}: ${err.message}`);
      problems++;
      continue;
    }
    for (const q of data.questions ?? []) {
      if (ids.has(q.id)) {
        console.log(`DUPLICATE id ${q.id}`);
        problems++;
      }
      ids.add(q.id);
      if (q.options?.length !== 4) {
        console.log(`${q.id}: needs 4 options`);
        problems++;
      }
      if (q.whyNot?.length !== 4) {
        console.log(`${q.id}: needs 4 whyNot entries`);
        problems++;
      }
      if (q.whyNot?.[q.answer] !== "") {
        console.log(`${q.id}: whyNot[${q.answer}] should be empty`);
        problems++;
      }
      q.whyNot?.forEach((w, i) => {
        if (i !== q.answer && !w) {
          console.log(`${q.id}: whyNot[${i}] is empty`);
          problems++;
        }
      });
      for (const key of ["stem", "why", "difficulty", "topicRef", "topicTitle"]) {
        if (!q[key]) {
          console.log(`${q.id}: missing ${key}`);
          problems++;
        }
      }
      if (!["easy", "medium", "hard"].includes(q.difficulty)) {
        console.log(`${q.id}: bad difficulty "${q.difficulty}"`);
        problems++;
      }
      unitTotal++;
    }
  }
  if (unitTotal > 0) console.log(`  ${unit.toUpperCase()}: ${unitTotal} questions`);
  total += unitTotal;
}

console.log(`\n${total} questions checked, ${problems} problems`);
process.exit(problems > 0 ? 1 : 0);
