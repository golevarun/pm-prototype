# PM prototype: working rules

- Static clickable prototype served by GitHub Pages and embedded on Varun's portfolio. Pushing to main publishes it.
- Design tokens: `ds/tokens.css` is generated from golevarun/pm-app `app/tokens.css`. Don't edit it here; change the app's file and run `npm run sync:prototype` in pm-app.
- In pages, stylesheets and scripts, use `var(--…)` tokens only. No raw hex/rgba, px font sizes, px radii or numeric weights. Run `node ds/check.mjs` before pushing.
- Exempt: `cd-ios-*` (iPhone Mail mock imitates iOS on purpose) and `case-study/` (marketing page with its own look).
