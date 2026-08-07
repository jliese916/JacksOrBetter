# Build notes — v33

Validation performed:

- JavaScript syntax checks passed for `app.js` and `service-worker.js`.
- HTML contains no duplicate IDs and every JavaScript ID selector resolves to an element.
- Every service-worker app-shell file exists.
- The decision-ladder explanation classifier was checked against all 2,598,960 possible five-card starting hands; zero optimal decisions fell back to an unclassified explanation.
- Ladder #5 was separately checked with T-T-J-Q-K and returns both equivalent holds, each discarding one ten.


## v33
- Immediate Train feedback now shows the correct hold as card faces.
- Train, Play, and Challenge mistake reviews show both the user hold and correct hold(s) visually with cards.
