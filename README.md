# Pazcare Design assignment

Roshyoui design system, applied to products it has never seen. Status: **Product A (team messaging) is complete.** Reader profile (Product B), the packaged skill and the unfamiliar-brief test are not built yet.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173, switch concepts with the bar at the top (#/rail, #/canvas, #/rooms)
npm run build      # typecheck + production build
npm run preview    # serve the build on :4173
```

Needs Node 18+. No backend: messages, threads and unread counts live in React state and reset on reload.

## Structure

```
src/design-system/        tokens.css, components.css, 10 components, tints.ts
src/products/messaging/   three concepts + shared pieces (Composer, MessageItem, ThreadPanel, workspace state)
src/App.tsx, shell.css    demo shell (concept switcher, Compare sheet). Not part of the products.
```

## Product A: team messaging (Slack alternative), hiring and design-automation team content

| | Concept | Core idea | Lens from the brief |
|---|---|---|---|
| A | **Rail** (Discord-style, dark) | Channels, conversation, thread and composer visible at once, driven from the keyboard | Keyboard-driven |
| B | **Canvas** (Teams-style, light) | Every post carries its thread inline, so replies are the main reading experience | Conversation-first |
| C | **Rooms** (Clubhouse-style, light) | One inbox of mentions across all channels, reply in place, live huddles one tap away | Unified inbox |

**Preferred: A (Rail).** It is the only concept that shows channels, a thread and the composer together at desktop width, and Ctrl+K plus j/k/t serve the high-frequency scanning job. Caveat: it depends on the inferred dark theme. B is the safer on-brand alternative for async teams.

Keyboard in Rail: `Ctrl/Cmd K` command menu, `Alt ↑/↓` switch channel, `/` focus composer, `j`/`k` move between messages, `t` open thread, `Esc` close, `Shift R` mark read, `Shift D` toggle theme.

Note on scope: the chat direction asked for Discord, Teams and Clubhouse references. The assignment brief lists conversation-first, unified inbox and keyboard-driven. Each concept is built to satisfy one of those lenses too (table above), so both readings hold.

## Design system decisions

Observed from the two portfolio screenshots: off-white canvas, ink black, pastel tints, pill buttons, 16 to 24px radii, two-tone headings, hairline separation.
**Inferred, not verified against the live site:** Inter Tight and Inter, Phosphor regular icons, every motion value, the dark theme.

Gaps and the decision taken (skill ladder rung in brackets):

- **Composer** with formatting, attach, send. Product component built from Button, tokens only (3). Shared by all three concepts via a `variant` prop.
- **@mention picker.** Native `<textarea>` as an ARIA combobox plus listbox (3).
- **Command menu.** `Sheet` + `Input` + listbox (1 to 3). No new system component.
- **Message, thread panel, huddle stage.** Product components (3). Candidate score uses the system `Meter`.
- **Toasts.** None in the system, so notices are `Banner` with `role="status"` and Undo (1).
- **Dialog autofocus.** React `autoFocus` fires before `<dialog>` opens, so `Sheet` now focuses any `[data-autofocus]` child after `showModal()`. A system fix, found by testing (4).
- **Pill `Nav` hides labels under 640px**, so its items must have icons. The demo switcher hit this and now uses letter badges. Document this in the skill.

## Verification actually run

- `tsc --noEmit` and `vite build`: pass.
- Playwright, Chromium, 24 interaction checks (send, mention picker, command menu, shortcuts, thread open and reply, filters, inline reply from inbox, Done and Undo, huddle join, mobile menus and back): all pass.
- axe-core WCAG 2 A/AA on each concept at 1280px: 0 violations. Only the default state was scanned, not every sheet and state.
- Horizontal overflow at 390, 768, 1280px: none. Screenshots reviewed by eye at those widths.
- Not done: screen reader testing, real touch devices, Safari and Firefox.

## Known limitations

- Workspace switcher in Rail and the Files and People tabs in Canvas are light mocks. Workspaces do not change content.
- Message formatting supports `**bold**`, `` `code` `` and `@mentions` only. Italic is not parsed even though the brief might expect it.
- Huddles are visual only. No audio.
- Dark theme contrast was checked by axe in Rail's default view only.
