import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/notes/mdxComponents";
import { TopicToolbar } from "@/components/notes/TopicToolbar";
import { Card, EmptyState, buttonClass } from "@/components/ui";
import { getNote, getQuestions } from "@/lib/content";
import { UNITS, allTopics, getUnit, topicSlug } from "@/lib/units";

type Params = { params: Promise<{ unit: string; topic: string }> };

// Every topic in every unit is pre-rendered at build time.
export function generateStaticParams() {
  return UNITS.flatMap((unit) =>
    allTopics(unit).map((topic) => ({
      unit: unit.code.toLowerCase(),
      topic: topicSlug(topic),
    })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { unit, topic } = await params;
  const found = getUnit(unit);
  const note = found ? getNote(found.code, topic) : null;
  return { title: note ? `${note.frontmatter.ref} ${note.frontmatter.title}` : "Topic" };
}

export default async function TopicPage({ params }: Params) {
  const { unit: unitParam, topic: slug } = await params;
  const unit = getUnit(unitParam);
  if (!unit) notFound();

  const topics = allTopics(unit);
  const index = topics.findIndex((t) => topicSlug(t) === slug);
  if (index === -1) notFound();

  const topic = topics[index];
  const prev = index > 0 ? topics[index - 1] : null;
  const next = index < topics.length - 1 ? topics[index + 1] : null;

  const note = getNote(unit.code, slug);
  const questionCount = getQuestions(unit.code, slug).length;
  const unitPath = `/units/${unit.code.toLowerCase()}`;

  return (
    <article>
      <nav className="mb-4 text-[13px] text-faint">
        <Link href={unitPath} className="hover:text-ink">
          {unit.code}
        </Link>
        <span className="mx-1.5">/</span>
        <span>{topic.sectionRef} {topic.sectionTitle}</span>
      </nav>

      <header className="mb-5">
        <p className="tnum text-[13px] font-semibold text-accent-text">{topic.ref}</p>
        <h1 className="mt-0.5 text-2xl font-semibold tracking-tight sm:text-[28px]">
          {topic.title}
        </h1>
      </header>

      <TopicToolbar
        unitCode={unit.code}
        slug={slug}
        ref_={topic.ref}
        title={topic.title}
        questionCount={questionCount}
      />

      {!note ? (
        <div className="mt-6">
          <EmptyState
            title="Notes not written yet"
            body={`This topic is in the specification and listed here in the right place, but the notes for it are still to come. ${unit.code} notes are written in specification order.`}
            action={
              <Link href={unitPath} className={buttonClass("secondary")}>
                Back to {unit.code}
              </Link>
            }
          />
        </div>
      ) : (
        <>
          {/* In one minute */}
          <Card className="mt-5 border-l-[3px] border-l-accent p-4">
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text">
              In one minute
            </p>
            <ul className="mt-2 space-y-1.5">
              {note.frontmatter.oneMinute.map((line) => (
                <li key={line} className="flex gap-2 text-[16px] leading-[1.55]">
                  <span aria-hidden="true" className="text-accent">
                    •
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Key terms */}
          {note.frontmatter.keyTerms?.length ? (
            <section id="key-terms" className="mt-5 scroll-mt-20">
              <details className="group rounded-[var(--radius-card)] border border-line bg-surface">
                <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                  <span className="flex-1 text-[17px] font-semibold tracking-tight">
                    Key terms
                  </span>
                  <span className="text-[13px] text-faint">
                    {note.frontmatter.keyTerms.length}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-faint transition-transform group-open:rotate-90"
                  >
                    <path d="m9.5 6 6 6-6 6" />
                  </svg>
                </summary>
                <dl className="divide-y divide-[color:var(--border)] border-t border-line">
                  {note.frontmatter.keyTerms.map((kt) => (
                    <div key={kt.term} className="px-4 py-3">
                      <dt className="text-[15px] font-semibold">{kt.term}</dt>
                      <dd className="mt-0.5 text-[15px] leading-[1.55] text-muted">
                        {kt.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
              <p className="mt-2 px-1 text-[13px] text-faint">
                These are the definitions a mark scheme would reward. They also become flashcards.
              </p>
            </section>
          ) : null}

          {/* Main content */}
          <div className="mt-2">
            <MDXRemote
              source={note.body}
              components={mdxComponents}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>

          {/* Test yourself */}
          <div className="mt-8">
            {questionCount > 0 ? (
              <Link
                href={`/practice/run?unit=${unit.code.toLowerCase()}&topic=${slug}&mode=learn`}
                className={`${buttonClass("primary")} w-full`}
              >
                Test yourself · {questionCount} questions
              </Link>
            ) : (
              <p className="rounded-[var(--radius-card)] border border-dashed border-line px-4 py-3 text-center text-[15px] text-faint">
                Questions for this topic are still to come.
              </p>
            )}
          </div>

          {note.frontmatter.review?.length ? (
            <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-surface p-4">
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-warn">
                Check with your teacher
              </p>
              <ul className="mt-2 space-y-1.5">
                {note.frontmatter.review.map((r) => (
                  <li key={r} className="text-[15px] leading-[1.55] text-muted">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}

      {/* Previous / next */}
      <nav className="mt-10 flex gap-3 border-t border-line pt-5">
        {prev ? (
          <Link
            href={`${unitPath}/${topicSlug(prev)}`}
            className="min-w-0 flex-1 rounded-xl border border-line p-3 hover:bg-surface-2"
          >
            <span className="block text-[13px] text-faint">Previous</span>
            <span className="mt-0.5 block truncate text-[15px] font-medium">
              {prev.ref} {prev.title}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link
            href={`${unitPath}/${topicSlug(next)}`}
            className="min-w-0 flex-1 rounded-xl border border-line p-3 text-right hover:bg-surface-2"
          >
            <span className="block text-[13px] text-faint">Next</span>
            <span className="mt-0.5 block truncate text-[15px] font-medium">
              {next.ref} {next.title}
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </article>
  );
}
