# El Jefe's Video Poker Practice

This version has three normal modes plus the El Jefe Challenge:

- **Train** — choose the optimal hold and track accuracy.
- **Look Up** — enter any five-card hand and view the optimal hold.
- **Play** — wager five units, hold cards, draw replacements, and track a running balance.
- **El Jefe Challenge** — complete 200 hands without answer feedback. A score of 190/200 or better earns an El Jefe Approved certificate.

Train, Play, and Challenge display the name of a paying made hand above the cards.

## Required strategy file

Copy your Mathematica export into this folder using the exact filename:

`JacksOrBetterStrategy.json`

## Test locally on Windows

Open PowerShell in this folder and run:

`py -m http.server 8000`

Then open:

`http://localhost:8000`

## Update GitHub Pages

Replace the existing app files in the repository with these files, while keeping
`JacksOrBetterStrategy.json`. Commit the changes to the branch used by GitHub Pages.
The service-worker cache name is `jacks-trainer-v4`, allowing the new version to replace older cached files.

## Play-mode paytable

The app uses full-pay 9/6 Jacks or Better payouts for a five-unit wager:

- Royal Flush: 4000
- Straight Flush: 250
- Four of a Kind: 125
- Full House: 45
- Flush: 30
- Straight: 20
- Three of a Kind: 15
- Two Pair: 10
- Jacks or Better: 5
