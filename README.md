# Jacks or Better Trainer Web App

This version has two modes:

- **Train:** receive a random hand, choose the cards to hold, and track accuracy.
- **Look Up:** enter a real hand by tapping a rank and then a suit, and display every tied optimal hold.

## Put your strategy file here

Copy your exported file into this folder and make sure its exact name is:

`JacksOrBetterStrategy.json`

## Test it on Windows

Do not double-click `index.html`; browsers usually block JSON loading from a
`file://` page.

1. Open this folder in File Explorer.
2. Click the address bar, type `powershell`, and press Enter.
3. Run:

   `py -m http.server 8000`

4. Open:

   `http://localhost:8000`

5. Confirm that the page reports the number of loaded strategy hands.

## Put it online with GitHub Pages

1. Create a public GitHub repository.
2. Upload every file in this folder, including the strategy JSON.
3. Open **Settings > Pages**.
4. Under Build and deployment, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.

## Install it on iPhone

1. Open the published address in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Turn on Open as Web App if that option appears.
5. Tap Add.

Open it once while online so its resources can be cached.
