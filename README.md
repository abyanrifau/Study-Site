# IAL Revision

A private revision site for your six Pearson Edexcel International A Level papers in the
October/November 2026 series. Runs on your laptop, deploys to Vercel, works offline on your
phone, and stores your progress in your own browser.

| Code | Subject | Unit | Title | Your exam |
| --- | --- | --- | --- | --- |
| WBS11 | Business | 1 | Marketing and People | Thu 8 Oct 2026, 10:00 |
| WBS12 | Business | 2 | Managing Business Activities | Wed 14 Oct 2026, 10:00 |
| WBS13 | Business | 3 | Business Decisions and Strategy | Tue 20 Oct 2026, 10:00 |
| WBS14 | Business | 4 | Global Business | Tue 27 Oct 2026, 10:00 |
| WAC12 | Accounting | 2 | Corporate and Management Accounting | Tue 27 Oct 2026, 13:00 |
| WEC14 | Economics | 4 | Developments in the Global Economy | Fri 30 Oct 2026, 10:00 |

---

## Start here, in the morning

```bash
npm run dev
```

Open **http://localhost:3000**. Then:

1. **Plan** — your day-by-day timetable, working backwards from each exam. Your six October 2026
   dates are already built in, so there is nothing to set up. Change your minutes per day at the
   top and it rebuilds itself.
2. **Units → WBS11** — start with the soonest paper.

`Ctrl+C` in the terminal stops the server.

### On your phone, over Wi-Fi

With `npm run dev` running, find your computer's local address (`ipconfig` on Windows, look for
the IPv4 address like `192.168.1.24`) and open `http://192.168.1.24:3000` on your phone. Both
devices need to be on the same network.

Better: deploy it (below) and add it to your home screen. Then it works anywhere, and offline.

---

## Deploying to Vercel

The whole site builds to static pages, so it deploys cleanly with no server configuration.

```bash
npx vercel
```

Accept the defaults; Vercel detects Next.js. Or push the folder to GitHub and import the repo at
vercel.com.

### Read this before you deploy

**The site will be publicly reachable at its Vercel URL unless you protect it.** Two things
matter:

1. **Your past papers are committed to the repository** (114 PDFs, 38 MB) so that they are
   viewable inside the site. Those are Pearson's copyright. Keeping them for your own study is
   fine; publishing them on an open URL is redistribution.
2. Your progress is per-browser, so nobody else sees your scores. But the notes and papers would
   be public.

**So do one of these:**

- **Recommended:** in the Vercel dashboard, go to your project → Settings → Deployment
  Protection and turn on **Vercel Authentication**. Only your logged-in Vercel account can then
  open the site. It stays private and the papers stay viewable in-site.
- **Or:** add `public/papers/*.pdf` back to `.gitignore` before deploying. The site still works;
  the Papers page just shows everything as missing, and you use the papers locally instead.

There is already an `X-Robots-Tag: noindex` header and a `robots.txt` blocking crawlers, but that
is politeness, not protection. Use Deployment Protection.

### Adding papers after deploying

The papers list is read at build time. Drop a new PDF into `public/papers`, commit, and redeploy
(or just run `npm run dev` locally and it appears immediately).

---

## What is in the site

**Home** — countdowns, what to do today from your plan, progress per unit, weakest topics.

**Plan** — a generated day-by-day timetable to your last exam. It finishes each unit before its
own paper, reserves the last two days before each exam for the refresher, cheat sheet and a past
paper, and tells you if something will not fit. Change your minutes per day and it rebuilds.

**Units** — every topic from the official specification, in specification order. Each unit also
has five ways to revise the whole paper at once:

| | What it is |
| --- | --- |
| **Refresher** | Every topic in short form: the one-minute summary, formulas and definitions. The night-before pass. |
| **Formulas** | Every calculation in the unit, grouped by section. None are given to you in the exam. |
| **Diagrams** | Every diagram in one place, for the Construct and Draw command words. |
| **Written practice** | Essay planners, model answers with the marks annotated in the margin, evaluation point banks, and calculation drills. |
| **Cheat sheet** | Everything on one page. Print it or screenshot it for the last hour. |

**Topic pages** — "in one minute", key terms written the way a mark scheme would reward them,
content in collapsible chunks, SVG diagrams that fit a phone, formulas with worked examples, real
world examples, exam tips naming the command words, and common mistakes. Mark as read, bookmark,
or reset the topic to relearn it from scratch.

**Practice** — multiple choice in four modes (Learn, Test, Mistakes, Mix), a command word drill,
and flashcards generated automatically from the notes.

**Papers** — 114 official question papers and mark schemes, downloaded from Pearson and named
automatically. Read them inside the site, switch between question paper and mark scheme in one
tap, run a timer set to the real length of the paper, and record your score. Shows what is still
missing from your folder.

**Progress** — accuracy by unit and topic, weakest topics, paper score trends, what is still to
read.

**Search** — one box across every topic, key term, formula and practice question.

---

## Content status

**All six units are complete.** Every topic in every specification has a full note, and every
topic has a practice bank of at least fifteen questions.

| Unit | Topics | Notes | Questions | Written practice |
| --- | --- | --- | --- | --- |
| WBS11 Marketing and People | 22 | 22 | 309 | 3 questions, 2 drills, 8 banks |
| WBS12 Managing Business Activities | 20 | 20 | 194 | 2 questions, 3 drills, 6 banks |
| WBS13 Business Decisions and Strategy | 21 | 21 | 245 | 2 questions, 3 drills, 9 banks |
| WBS14 Global Business | 16 | 16 | 261 | 2 questions, 2 drills, 11 banks |
| WAC12 Corporate and Management Accounting | 9 | 9 | 192 | 3 questions, 10 drills, 9 banks |
| WEC14 Developments in the Global Economy | 20 | 20 | 325 | 4 essays, 6 drills, 17 banks |
| **Total** | **108** | **108** | **1,526** | **16 questions, 26 drills, 60 banks** |

Also included: 980 flashcards and 2,614 search entries, both generated from the notes, 47 hand
drawn diagrams, and 114 past papers.

The two units you said you find hardest got the most attention:

- **WEC14** has the largest written pack in the site, because 74 of its 80 marks are essays and
  data response. Four complete essays, each with a step-by-step planner, a model answer annotated
  paragraph by paragraph with which assessment objective it earns, and a mark scheme breakdown.
  Plus six calculation drills and 141 ready-made evaluation points.
- **WAC12** has ten worked calculation drills, each laid out the way an accountant would present
  it, each with a second set of numbers to try afterwards.

See the live counts any time with `npm run content`, and validate every question bank with
`npm run check`.

`content/REVIEW.md` lists everything uncertain that is worth checking with your teacher, including
two places where Business and Accounting use genuinely different conventions for the same formula.

---

## Where your progress lives

**Your exam dates are not stored in the browser.** They are fixed in `content/units.json`, so
clearing your data, using private browsing, reinstalling the app or moving to another device can
never lose them. Settings shows them read-only. If a sitting moves, edit that file and rebuild.

Read ticks, quiz scores, mistakes, paper scores, bookmarks, plan ticks and your light/dark choice
are all in **this browser, on this device**. Nothing is uploaded and there is no account.

So: **Settings → Export backup** now and then, and keep the file somewhere safe. Import puts it
back, including onto a different device. Clearing browser data or using private browsing loses
that part, though not your timetable.

You can also reset selectively rather than wiping everything: **Reset topic** on any topic page,
or **Start this unit again** on a unit page, which offers quiz results only, paper scores only, or
the whole unit.

### Syncing progress with Supabase

If you want progress to follow you between devices, the code is already set up for it. Every
write goes through one function, so this is a small, contained change.

1. Create a Supabase project and a table:

   ```sql
   create table progress (
     user_id uuid primary key references auth.users on delete cascade,
     data jsonb not null,
     updated_at timestamptz default now()
   );
   alter table progress enable row level security;
   create policy "own row" on progress
     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ```

2. `npm install @supabase/supabase-js`, then add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your Vercel environment variables.

3. Implement the `RemoteStore` interface in `src/lib/progress.ts` (documented at the bottom of
   that file: it is just `load()` and `save(progress)`), then call `configureRemote` and
   `enableSyncOnWrite` once from a client component.

localStorage stays the source of truth, so the site keeps working offline and while signed out.

---

## Editing the content yourself

Everything the site teaches is in `/content` as plain files. Save, refresh, done. See
**`content/HOW-TO-ADD-CONTENT.md`** — it explains the file formats in plain language with no code
involved.

| Folder | What is in it |
| --- | --- |
| `content/` | All study material. `units.json` is the unit and topic list; notes are `.mdx`; questions are `.json`; `written.json` holds essay planners and evaluation banks; `command-drill.json` holds the command word drill. |
| `specs/` | The three official Pearson specification PDFs. The topic lists come from these and nothing else. |
| `public/papers/` | Your past paper PDFs. |
| `Files/` | The material your teachers gave you. Used for cross-checking only, never copied. |
| `scripts/` | `build-content.mjs` turns `/content` into the JSON the browser fetches. Runs automatically before dev and build. |
| `src/` | The code. You should not need to open it. |

If notes or questions vanish after an edit, that file has a typo. Run `npm run content` and it
tells you which one.

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the site locally on port 3000 |
| `npm run build` | Production build, the same one Vercel runs |
| `npm run content` | Rebuild the content JSON and print the per-unit counts |
| `npm run check` | Validate every question bank: four options, one answer, a reason for each wrong option |
| `npx vercel` | Deploy |

`npm run build` runs `npm run content` first, so you never have to remember to rebuild the data.
If you add a note or a question bank while `npm run dev` is running, stop it and start it again.

---

## Ground rules the content follows

- Topic lists, order, assessment objectives and command words come from the official
  specifications in `/specs` and nothing else. No guessed syllabus.
- All notes and questions are original writing. Nothing is copied from textbooks, revision sites,
  past papers or the material in `Files/`.
- British English throughout.
- Numbers in worked examples are illustrative unless a source is named. Real figures you quote in
  an exam should come from the source in the question paper.
- Anything that could not be confirmed at IAL level is left out and recorded in
  `content/REVIEW.md` rather than guessed.
