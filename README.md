# El Jefe's Jacks or Better Trainer — Version 17

This package is self-contained and includes `JacksOrBetterStrategy.json`.

## Main modes

- **Play** — first tab; wager five units, choose holds, draw replacements, compare your bankroll with optimal play, and review every incorrect decision from the current session.
- **Train** — practice optimal holds with immediate feedback and a persistent score.
- **Look Up** — enter any five-card hand, view all tied optimal holds, and open the embedded **Complete Decision Ladder**.
- **El Jefe Challenge** — complete 200 hands without feedback. Scores of 190/200 or better earn an El Jefe Approved certificate; a perfect 200/200 earns the special **Grand Master — Certified by El Jefe** certificate.

## Version 17 changes

- Removed the “Video Poker Practice” eyebrow above the title.
- Clarified that the two made-hand groups are handled before the main ladder, using top/bottom wording that matches the stacked layout.
- Removed the internal coverage note from the bottom of the decision ladder.
- Removed the footer paytable shortcut and strategy-profile sentence; the full-pay 9/6 max-bet context remains in the header.
- Service-worker cache: `el-jefe-jacks-trainer-v18`.

## Run locally

Open a terminal in this folder and run:

`py -m http.server 8000`

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

Replace the existing site files with the contents of this folder and commit them to the branch used by GitHub Pages. The included strategy JSON must be deployed beside `index.html`.
