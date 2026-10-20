# LangSnack TOPIK Tools v3

Public, learner-facing TOPIK tools.

## Included
- Character counter with 300자 and 700자 원고지
- Database-backed TOPIK reading difficulty estimator
- TOPIK I and TOPIK II mock exam timer
- 13 interface languages

## Reading analyser
The analyser now loads:

- `docs/data/vocabulary.json`
- `docs/data/grammar.json`

It combines:

- Vocabulary database coverage
- Basic Korean particle and ending normalization
- Graded grammar detection
- Sentence and clause complexity
- Formal and academic language signals
- Text-length and confidence checks

The result remains an estimate, not an official TOPIK score.

## GitHub Pages
Set GitHub Pages to:

- Branch: `main`
- Folder: `/docs`

The included `CNAME` contains:

    topiktools.langsnack.com

Enter the same hostname in GitHub Pages without `https://` and without a trailing slash.

## Important data limitation
The bundled vocabulary seed currently has strong TOPIK I coverage. Intermediate and advanced vocabulary extraction is still incomplete because several source PDFs are image-based. The engine architecture is ready for those larger data files when reviewed entries are added.


## v6 update
Added Grammar Level Finder with instant substring search, 129 starter grammar records, and source labels. TOPIK levels are estimates, not official certifications.
