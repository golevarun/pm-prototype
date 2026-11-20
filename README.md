# PM prototype

A clickable desktop prototype of PM, an AI first-round sales interview. Built at 1440px wide.

It opens on the Home screen. Use the step bar at the bottom to move through the flow.

People and companies in the prototype are invented.

## Design tokens

Colors, type sizes, weights and corner radii come from `ds/tokens.css`, the same file the live PM app uses. Each page loads the copy in this repo first, then the live copy from the app (`https://pm-app-one-kappa.vercel.app/ds/tokens.css`). A token changed in the app shows up here as soon as the app deploys. The local copy keeps the prototype styled if the app is down.

- Edit tokens only in golevarun/pm-app (`app/tokens.css`), then run `npm run sync:prototype` there to refresh the local copy.
- Run `node ds/check.mjs` before pushing. It fails on any raw color, size, radius or weight.
