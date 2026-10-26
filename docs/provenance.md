# Provenance: what is verified, what is inferred

The live site (`roshyoui.framer.website`) could not be fetched from the build environment (blocked by the session's network allowlist), so nothing below comes from its CSS or source. Everything marked **Measured** was sampled from the pixels of the two supplied screenshots (a full-page capture and a "Featured Projects" close-up). Everything else is labelled honestly.

## Measured from the screenshots

| Thing | Finding | Token |
|---|---|---|
| Canvas | `#fafafa` exactly, in both images | `--ds-bg` |
| Ink / inverse surface | `#000000` for the footer block and for the darkest heading and body pixels | `--ds-text`, `--ds-tint-ink` (changed from `#0a0a0a` after measuring) |
| Card tint, sky (MyDoorView) | top of gradient `#a2ddff`, fading to near white | `--ds-tint-sky: #a8dcff` (within about 6 units) |
| Card tint, stone (MIKASA) | `#e8e8e8` | `--ds-tint-stone: #e9e9e9` |
| Card tint, ice (Trademo) | top of gradient `#cfe6fe` | `--ds-tint-ice: #d3e6ff` |
| Card tint, cream (KORU) | top of gradient `#fff4e1` | `--ds-tint-cream: #fff0da` |

Tint cards are vertical gradients from the tint to near white, so any single hex is an approximation of the gradient's start. The tokens are rounded, not exact.

## Observed by eye (no number measured)

- **Single narrow column** (about 500px wide in the 765px capture) bounded by vertical hairlines, with horizontal hairline dividers between sections. This is the portfolio's layout, and the skill explicitly does not copy it into products.
- **Two-tone headings** everywhere: grey lead-in, black payoff ("Designing experiences / that solve real problems.", "Testimonials", "Things I get oddly excited about").
- **Tight-tracked, medium-weight sans** for headings. Large "Featured Projects" shows the tracking clearly.
- **Large-radius cards**, roughly 24px, on tint backgrounds, each with a translucent **pill** label at the top ("End to End CRM Project").
- **Caption pattern:** project name in regular weight, then a muted subtitle with a middle dot separator ("Fleet Management · Web Dashboard").
- **Floating pill nav** centred at the top, with an avatar.
- **Round ink-filled icon chips** beside a services list.
- **Outline testimonial cards** in three columns; an accordion FAQ with plus icons.
- **Black footer** with a very large cropped wordmark and a two-tone heading in white and grey.
- **A red-orange handwritten signature** and red line illustrations: the basis for a single warm "signal" colour used sparingly.
- A small "Made in Framer" badge, which confirms the site is built in Framer.

## Inferred, not verified

| Item | What we assumed | Why | How to verify |
|---|---|---|---|
| Heading font | Inter Tight | Shapes and tracking look like it, but several grotesques look similar | DevTools, Computed, `font-family` on an `h1` |
| Body font | Inter | Same | Same, on a paragraph |
| Icon library | Phosphor regular | You said you believed it. The screenshots show small glyphs in dark chips and brand logos for the tech stack, but nothing that distinguishes Phosphor from, say, Lucide | Inspect an icon's SVG `viewBox` and path data, or look for `ph-` classes |
| Signal colour | `#c2410c` | A text-safe darker relative of the observed red-orange. The measured hex was not captured | Eyedropper the signature |
| Success, danger, info | `#15803d`, `#b91c1c`, `#0b6bcb` | The portfolio shows no status colours at all | Product decision, not a portfolio fact |
| Dark theme | Entire palette | The portfolio has no dark mode. Product A's Meetify concept leans on it | Needs a design decision from you |
| Motion | 140, 220, 360ms with ease-out curves | Static screenshots show no motion | Watch the live site or inspect Framer's animation settings |
| Spacing scale | 4px base | Standard practice, not measured | Inspect padding values |
| Radius scale | 8, 12, 16, 24, pill | 24px is eyeballed from the cards. The rest are conventional | Inspect `border-radius` |

## Things to know before trusting a number

- The screenshot is a compressed capture. Anti-aliasing means "darkest pixel" can only be as dark as the true ink, never darker, so `#000000` is a lower bound that happens to be exact here because the footer is a solid fill.
- The tints are sampled at one point each. Re-sample if exact brand match matters.
