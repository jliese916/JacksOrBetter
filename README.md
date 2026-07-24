# El Jefe's Jacks or Better Trainer

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
The service-worker cache name is `jacks-trainer-v12`, allowing the new version to replace older cached files.

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

## Version 5 interface changes

- Lookup cards remain in the order entered.
- Play cards remain in their original machine positions.
- Discarded cards turn into blue card backs and reveal left to right.
- Play feedback reports only the payout, without a net-this-hand sentence.
- Training score controls appear only in Train mode.


## Version 6 display updates

- Tens display as `10` rather than `T`.
- Card faces use a large centered rank with suit marks in the top-right and bottom-left corners.
- Four-color deck: hearts red, diamonds blue, clubs green, and spades black.
- Non-paying pairs are labeled `Small Pair` in purple.

## Version 7 display updates

- Clubs are green and spades are black.
- Card ranks are slightly larger without changing card dimensions.
- Training score and percentage are contained inside Train mode only.


## Version 8 changes

- Lookup can import the current active Play hand without disturbing Play state.
- Suit-picker symbols use the four-color deck colors.
- Initial Play deals reveal from left to right.
- Reset Balance is separated from the main play control.
- Card ranks are slightly larger.


## Version 9

Play mode now tracks optimal-decision accuracy for the current balance session and displays a running balance chart. The chart records the balance after each completed hand, uses a dotted zero line, and colors results green above zero and red below zero. Reset Balance also resets Play accuracy and chart history.


## Version 10

Play accuracy now gives immediate decision feedback: a green plus pulses beside the percentage after an optimal hold, while a red minus pulses after a non-optimal hold. The indicator then settles to a dim state until the next hand. Reset Balance clears it along with the Play session statistics.


## Version 11

The Play chart now overlays a gray optimal-play shadow line. For each completed hand, the app replays the same initial five cards and the same ordered draw pile using an optimal hold. If the player's hold is already optimal, the shadow uses that same hold so the results match exactly. Reset Balance clears both histories.


## Version 12

The Play balance chart now displays the current difference between the optimal-play shadow balance and the player's balance. A bracket connects the latest two values and labels the signed difference in units; overlapping lines display `0 units`.


## Version 13 changes

- Renamed the app to **El Jefe's Jacks or Better Trainer**.
- Added the full-pay 9/6, max-bet profile beneath the title.
- Renamed the Play chart to **Bankroll history**.
- Added a signed **Optimal − you** summary pill above the chart.
- Moved reset into a **Session controls** dropdown.
- Added a footer link to the Blackjack trainer.
- Service-worker cache: `el-jefe-jacks-trainer-v15`.

The footer links to `https://jliese916.github.io/BlackJackTrainer/`.


## Challenge review

After a 200-hand challenge, select **See missed hands** to review each missed five-card hand, the submitted hold, and all tied optimal holds accepted by the strategy table.
