# LangSnack Admin v1

A private, static database manager for the LangSnack grammar and vocabulary seed.

## What it does
- Loads the bundled grammar and vocabulary JSON files
- Searches and filters entries
- Adds, edits and deletes entries
- Marks entries as reviewed/approved
- Saves edits in browser localStorage
- Imports and exports clean JSON files

## Important limitation
This is a static private-beta admin. It does not write directly back to GitHub and it does not include login protection.

Use it in one of these ways:
1. Open through GitHub Pages in a private/testing repository.
2. Run locally with a simple local web server.
3. Export JSON after editing and replace the files in your repository manually.

Opening `index.html` directly with `file://` may block JSON loading in some browsers.

## Local server
From this folder, run:

    python3 -m http.server 8000

Then open:

    http://localhost:8000

## GitHub Pages structure
- index.html
- data/grammar.json
- data/vocabulary.json
- data/difficulty-rules.json
- data/source-manifest.json
