# Verification checklist

Run what you can, report what you ran, and say what you did not.

## Identity (must hold)
- [ ] Canvas is `--ds-bg` or `--ds-surface`. Colour only as ink, a tint or the orange signal.
- [ ] Headings weight 500, tight tracking, one two-tone page title per view.
- [ ] Actions and labels are pills. No sharp corners.
- [ ] Hairlines and space before cards, cards before shadows.
- [ ] Tints identify content, not chrome. Orange used sparingly and only for "needs attention".
- [ ] No raw hex in product CSS: `grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(" src/products` should find nothing you wrote. Build translucent colours with `color-mix(in srgb, var(--token) N%, transparent)`.

## Accessibility
- [ ] Every input labelled. Errors `role="alert"`. One `main` landmark. Every `nav` labelled.
- [ ] Visible focus everywhere. Keyboard can complete the main flow.
- [ ] Tap targets 44px+ on touch. Status never by colour alone.
- [ ] `--ds-text-soft` only on 24px+ text.
- [ ] No row or card is a button unless it does something.
- [ ] Multi-step flow: focus moves to the new step heading on each change (not on first render). Errors appear on submit, not on first keystroke.
- [ ] Automated scan: axe-core with `wcag2a` and `wcag2aa`. Also scan with a sheet open.

## Responsive
- [ ] 390, 768 and 1280px viewed.
- [ ] `document.documentElement.scrollWidth <= window.innerWidth` at 390px.
- [ ] Below 900px one pane, secondary content in a sheet. Below 640px side sheets become bottom sheets.

## Commands used in this repo
```bash
npm run build                       # tsc --noEmit then vite build
npm run preview -- --port 4173      # serve the build
```
Then drive it with Playwright (Chromium) for interaction checks and axe-core for the scan.

## Honest reporting
State exactly what ran. Not run is not passed.
