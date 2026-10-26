# Mistakes already made once (do not repeat)

Each of these shipped in this repo before testing caught it.

1. **Pill `Nav` with text-only items renders empty on mobile.** Labels hide under 640px. Give every item an icon.
2. **Percentage padding resolves against the parent's width, not the element's.** A cover with `padding: 9%` inside a wide card collapsed its title to one letter per line. Size padding from the element's own width via a CSS variable.
3. **React `autoFocus` fires before a `<dialog>` opens.** Focus the target after `showModal()`. `Sheet` does this for any child marked `data-autofocus`.
4. **A list row that is not interactive must not be a button.** Fourteen dead tab stops appeared in a read-only list.
5. **A meter showing "5/5" for a count reads as a score.** Use `Meter`'s `display` prop.
6. **A nowrap tag in a narrow grid cell caused 24px of horizontal scroll.** Shorten the text or let it wrap, then measure overflow at 390px.
7. **Two numbers for one fact.** A chart said "17 expected" while the stat strip said "2 behind" (14 vs 16). Derive every figure from one function.
8. **Scaling an SVG chart shrinks its type.** Measure the container and draw at that width so labels stay 12px.
9. **Do not trust a value you have not measured.** The ink token was `#0a0a0a` until pixel sampling showed `#000000`. Check `docs/provenance.md` before asserting a design fact.
10. **Test locators can be wrong, not the app.** A failing "sort" test was an alphabetical assertion error. Verify the real behaviour before changing product code.
11. **Stepwise flows need focus management, and the skill did not say so.** On each step change, move focus to the new step's heading (`tabIndex={-1}`) so keyboard and screen reader users land in the right place. Skip it on first render, or the page grabs focus on load. Remove the focus ring from such headings: they are targets, not controls. Found while testing the skill on the booking brief.
12. **`FilterTag` had no disabled style.** A slot picker needs "taken" times. Added a dashed, struck-through disabled state to the system rather than overriding it in the product, and the text still says "unavailable" for screen readers.
