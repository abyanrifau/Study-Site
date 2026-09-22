/**
 * Turns the /content folder into static JSON in /public/data.
 *
 * Why this exists: on Vercel, a serverless function cannot reliably read
 * arbitrary files from the repo at request time. Server-rendered pages read
 * /content at BUILD time, which is fine, but the interactive client pages
 * (practice, flashcards, search) need the data in the browser. Emitting it as
 * static JSON under /public/data means it is served from the CDN, cached, and
 * available offline once the service worker has it.
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(ROOT, "public", "data");

const registry = JSON.parse(fs.readFileSync(path.join(CONTENT, "units.json"), "utf8"));
const UNITS = [...registry.units].sort((a, b) => a.revisionOrder - b.revisionOrder);

const slugOf = (topic) => topic.slug ?? topic.ref.replace(/\./g, "-");

function allTopics(unit) {
  return unit.sections.flatMap((s) =>
    s.topics.map((t) => ({ ...t, sectionRef: s.ref, sectionTitle: s.title })),
  );
}

function readNote(unitCode, slug) {
  const file = path.join(CONTENT, unitCode.toLowerCase(), "notes", `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const parsed = matter(fs.readFileSync(file, "utf8"));
  return { frontmatter: parsed.data, body: parsed.content };
}

function readQuestions(unitCode, slug) {
  const file = path.join(CONTENT, unitCode.toLowerCase(), "questions", `${slug}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    const list = Array.isArray(parsed) ? parsed : (parsed.questions ?? []);
    return list.map((q, i) => ({
      ...q,
      id: q.id ?? `${unitCode.toUpperCase()}-${slug}-${i + 1}`,
      unit: unitCode.toUpperCase(),
      topicSlug: slug,
    }));
  } catch (err) {
    console.warn(`  ! ${unitCode}/${slug}.json is not valid JSON, skipped: ${err.message}`);
    return [];
  }
}

// A diagram alone inside a Figure, which is the authoring convention.
const FIGURE = /<Figure\s+caption="([^"]*)"\s*>\s*<([A-Z][A-Za-z0-9]*)\s*\/>\s*<\/Figure>/g;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "questions"), { recursive: true });

const flashcards = [];
const searchIndex = [];
const summary = [];
let grandTotalQuestions = 0;

for (const unit of UNITS) {
  const unitQuestions = [];
  const topics = [];

  for (const topic of allTopics(unit)) {
    const slug = slugOf(topic);
    const note = readNote(unit.code, slug);
    const questions = readQuestions(unit.code, slug);
    unitQuestions.push(...questions);

    const fm = note?.frontmatter ?? {};
    const keyTerms = fm.keyTerms ?? [];
    const formulas = fm.formulas ?? [];
    const diagrams = note
      ? [...note.body.matchAll(FIGURE)].map((m) => ({ caption: m[1], component: m[2] }))
      : [];

    topics.push({
      ref: topic.ref,
      title: topic.title,
      slug,
      sectionRef: topic.sectionRef,
      sectionTitle: topic.sectionTitle,
      hasNote: note !== null,
      questionCount: questions.length,
      keyTermCount: keyTerms.length,
      formulaCount: formulas.length,
      diagramCount: diagrams.length,
    });

    const href = `/units/${unit.code.toLowerCase()}/${slug}`;

    searchIndex.push({
      kind: "topic",
      title: `${topic.ref} ${topic.title}`,
      detail: `${unit.code} · ${topic.sectionTitle}`,
      href,
      unit: unit.code,
    });

    keyTerms.forEach((kt, i) => {
      flashcards.push({
        id: `${unit.code}-${slug}-t${i}`,
        kind: "term",
        front: kt.term,
        back: kt.definition,
        unit: unit.code,
        topicRef: topic.ref,
        topicTitle: topic.title,
        topicSlug: slug,
      });
      searchIndex.push({
        kind: "term",
        title: kt.term,
        detail: kt.definition,
        href: `${href}#key-terms`,
        unit: unit.code,
      });
    });

    formulas.forEach((f, i) => {
      flashcards.push({
        id: `${unit.code}-${slug}-f${i}`,
        kind: "formula",
        front: f.name,
        back: f.formula + (f.note ? ` — ${f.note}` : ""),
        unit: unit.code,
        topicRef: topic.ref,
        topicTitle: topic.title,
        topicSlug: slug,
      });
      searchIndex.push({
        kind: "formula",
        title: f.name,
        detail: f.formula,
        href: `/units/${unit.code.toLowerCase()}/formulas`,
        unit: unit.code,
      });
    });

    for (const q of questions) {
      searchIndex.push({
        kind: "question",
        title: q.stem,
        detail: `${unit.code} · ${topic.ref} ${topic.title}`,
        href: `/practice/run?unit=${unit.code.toLowerCase()}&topic=${slug}&mode=learn`,
        unit: unit.code,
      });
    }
  }

  fs.writeFileSync(
    path.join(OUT, "questions", `${unit.code.toLowerCase()}.json`),
    JSON.stringify(unitQuestions),
  );

  const written = topics.filter((t) => t.hasNote).length;
  summary.push({
    code: unit.code,
    subject: unit.subject,
    shortTitle: unit.shortTitle,
    title: unit.title,
    topicCount: topics.length,
    writtenCount: written,
    questionCount: unitQuestions.length,
    topics,
  });
  grandTotalQuestions += unitQuestions.length;

  console.log(
    `  ${unit.code}: ${written}/${topics.length} notes, ${unitQuestions.length} questions`,
  );
}

fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify({ units: summary }));
fs.writeFileSync(path.join(OUT, "flashcards.json"), JSON.stringify(flashcards));
fs.writeFileSync(path.join(OUT, "search.json"), JSON.stringify(searchIndex));

console.log(
  `content build: ${grandTotalQuestions} questions, ${flashcards.length} flashcards, ${searchIndex.length} search entries`,
);
