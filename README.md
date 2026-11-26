# PM prototype

A clickable desktop prototype of PM, an AI first-round sales interview. Built at 1440px wide.

It opens on the Home screen. Use the step bar at the bottom to move through the flow.

## Phone screens (`m/`)

The candidate flow and the hiring manager's screens, built for a phone: 16 screens, several with states (mic blocked, call dropped, before and after rating). `m/index.html` opens the first screen, "Sam gets the invite", on phones and laptops. The list of all screens is at `m/index.html?all`.

- On a phone they fill the screen, with a thin tour strip on top. On a laptop they sit in a phone frame with the tour beside them.
- Phones that open any desktop page are sent to `m/`. Add `?desktop=1` to stay on the desktop prototype.
- `m/build.py` writes the screen pages. Edit it, then run `python3 m/build.py`. Shared styles are in `m/m.css`, the tour and states in `m/m.js`. The three email screens use `m/ios.css`, which imitates iOS Mail and is exempt from the token check.
- Demo data (the rating and the decision) lives in localStorage under `pmm:`. "Start over" clears it.

People and companies in the prototype are invented.

## Design tokens

Colors, type sizes, weights and corner radii come from `ds/tokens.css`, the same file the live PM app uses. Each page loads the copy in this repo first, then the live copy from the app (`https://pm-app-one-kappa.vercel.app/ds/tokens.css`). A token changed in the app shows up here as soon as the app deploys. The local copy keeps the prototype styled if the app is down.

- Edit tokens only in golevarun/pm-app (`app/tokens.css`), then run `npm run sync:prototype` there to refresh the local copy.
- Run `node ds/check.mjs` before pushing. It fails on any raw color, size, radius or weight.
