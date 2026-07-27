# El Jefe's Jacks or Better Trainer — Version 16

This package is self-contained and includes `JacksOrBetterStrategy.json`.

## Main modes

- **Play** — first tab; wager five units, choose holds, draw replacements, compare your bankroll with optimal play, and review every incorrect decision from the current session.
- **Train** — practice optimal holds with immediate feedback and a persistent score.
- **Look Up** — enter any five-card hand, view all tied optimal holds, and open the embedded **Complete Decision Ladder**.
- **El Jefe Challenge** — complete 200 hands without feedback. Scores of 190/200 or better earn an El Jefe Approved certificate; a perfect 200/200 earns the special **Grand Master — Certified by El Jefe** certificate.

## Version 16 changes

- Removed the normal strategy-file loading message and the manual file chooser/help panel. Only strategy-loading errors are shown.
- Reordered tabs to **Play, Train, Look Up**, with Play opening first.
- Moved the 5-unit paytable into a dropdown beneath the title and added a footer shortcut to it.
- Added the full verified decision ladder to Look Up.
- Added an **Incorrect hands this session** dropdown to Play, labeled by hand number with the dealt hand, submitted hold, and all accepted optimal holds.
- Resetting the Play session now also clears its incorrect-hand review.
- Added a separate extravagant 100% Grand Master certificate.
- Service-worker cache: `el-jefe-jacks-trainer-v16`.

## Run locally

Open a terminal in this folder and run:

`py -m http.server 8000`

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

Replace the existing site files with the contents of this folder and commit them to the branch used by GitHub Pages. The included strategy JSON must be deployed beside `index.html`.
