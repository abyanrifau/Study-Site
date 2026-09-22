# Adding or fixing content

Everything the site teaches lives in this folder. You never need to open the `src/` folder to
change a note, a definition or a question. Save the file, refresh the page, done — there is no
rebuild step.

## The three kinds of file

| File | What it holds |
| --- | --- |
| `units.json` | The list of units, sections and topics, and each paper's structure. |
| `<unit>/notes/<slug>.mdx` | The notes for one topic. |
| `<unit>/questions/<slug>.json` | The multiple choice questions for one topic. |

The **slug** is the topic's specification reference with dots turned into dashes. Topic `1.3.1.1`
becomes `1-3-1-1`, so its files are `wbs11/notes/1-3-1-1.mdx` and
`wbs11/questions/1-3-1-1.json`.

Flashcards are not a separate file. They are generated from the key terms and formulas in the
notes, so fixing a definition fixes the flashcard too.

## A note file

The part between the two `---` lines is the structured data. Everything after it is the main
content.

```
---
ref: "1.3.1.1"
title: "The market"
unit: "WBS11"
section: "1.3.1 Meeting customer needs"
oneMinute:
  - "Three to five short lines."
keyTerms:
  - term: "Market share"
    definition: "The proportion of total market sales held by one business, as a percentage."
formulas:
  - name: "Market share"
    formula: "(Sales of one business ÷ Total market sales) × 100"
    note: "Optional extra line."
review:
  - "Optional. Anything you should double check with your teacher."
---

## A heading

Normal paragraphs, **bold**, *italic*, bullet lists and tables all work.
```

### Blocks you can use in the main content

Type these exactly as shown. They are what make the note look like a revision guide rather than
a wall of text.

| Block | Use it for |
| --- | --- |
| `<Chunk title="...">` … `</Chunk>` | A collapsible section. Add `open` to have it start open. |
| `<Formula name="...">` … `</Formula>` | A formula in a highlighted box. |
| `<Worked>` … `</Worked>` | A worked example with real numbers. |
| `<Tip>` … `</Tip>` | How the topic is tested and how to get the marks. |
| `<Mistakes>` … `</Mistakes>` | What students get wrong. |
| `<RealWorld where="Maldives">` … `</RealWorld>` | A real world example. |
| `<Figure caption="...">` … `</Figure>` | Wraps a diagram and gives it a caption. |

Diagrams go inside a `<Figure>`, on their own line, like this:

```
<Figure caption="What the diagram shows and why it matters.">
  <EquilibriumDiagram />
</Figure>
```

Keep exactly that shape. The unit's **Diagrams** page finds every diagram by reading the notes
for this pattern, so a diagram written any other way will still show in the note but will not
appear on the Diagrams page.

Diagrams that exist so far:

| Name | Shows |
| --- | --- |
| `<MassNicheDiagram />` | Mass and niche on a customers/profit-per-unit grid |
| `<MarketShareDiagram />` | Market shares as slices of one bar totalling 100% |
| `<DynamicMarketDiagram />` | The four ways a market moves |
| `<RiskUncertaintyDiagram />` | Risk vs uncertainty as a decision tree |
| `<ResearchTypesDiagram />` | Primary vs secondary research compared |
| `<MarketMapDiagram />` | A market map with a gap marked |
| `<DemandShiftDiagram />` | A demand curve and a rightward shift |
| `<SupplyShiftDiagram />` | A supply curve and a rightward shift |
| `<EquilibriumDiagram />` | Supply and demand crossing at equilibrium |
| `<DemandShiftEffectDiagram />` | A demand shift moving the equilibrium |
| `<PedComparisonDiagram />` | Elastic vs inelastic demand from one price change |
| `<YedDiagram />` | Normal vs inferior goods against income |

New diagrams have to be drawn in code, so just ask for one.

Leave a blank line before and after each block, or the content inside it will not format.

Markdown tables work too, using the usual pipe syntax. They scroll sideways inside their own box
on a narrow screen rather than breaking the page.

## A question file

```json
{
  "topicRef": "1.3.1.1",
  "topicTitle": "The market",
  "unit": "WBS11",
  "questions": [
    {
      "id": "WBS11-1-3-1-1-01",
      "topicRef": "1.3.1.1",
      "topicTitle": "The market",
      "difficulty": "easy",
      "stem": "The question itself.",
      "options": ["A text", "B text", "C text", "D text"],
      "answer": 0,
      "why": "Why the right answer is right.",
      "whyNot": ["", "Why B is wrong.", "Why C is wrong.", "Why D is wrong."]
    }
  ]
}
```

Rules that matter:

- `answer` counts from **0**, so 0 means the first option, 3 means the fourth.
- `whyNot` must have four entries, and the one at the `answer` position must be an empty string
  `""`.
- `difficulty` is `easy`, `medium` or `hard`.
- Every `id` must be unique across the whole site. The pattern
  `UNIT-slug-number` keeps that simple.
- Add a `"context"` field for a short scenario or set of data the question refers to.

If a question file has a mistake in it, that topic quietly shows zero questions rather than
breaking the page. So if questions vanish, the JSON has a typo — usually a missing comma.

## House rules for the content

- The specification in `/specs` decides the topic list, the order and the command words. Nothing
  else.
- All writing is original. Nothing is copied from textbooks, revision sites or past papers,
  including the material in the `Files` folder.
- British English spelling.
- Short sentences. No filler.
- Any fact, figure or definition that cannot be confirmed at IAL level is left out and noted in
  `REVIEW.md` instead of being guessed at.
- Numbers used in examples are illustrative unless a source is named. Real market figures you
  want to quote in an exam should come from the source in the question paper.
