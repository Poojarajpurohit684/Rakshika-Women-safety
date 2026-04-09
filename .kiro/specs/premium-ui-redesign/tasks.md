# Tasks: Premium UI Redesign — Rakshika

## Task List

- [ ] 1. Update global design system in `index.css`
  - [ ] 1.1 Update `@theme` block with new color tokens (`#e63950` primary, `#7c3aed` secondary)
  - [ ] 1.2 Replace body background gradient with deep navy dark-first gradient
  - [ ] 1.3 Rewrite `.glass-card` to use dark surface (`bg-[#1a2235]/90`) with subtle border
  - [ ] 1.4 Rewrite `.btn-primary` with gradient fill (`from-primary to-secondary`) and glow shadow
  - [ ] 1.5 Rewrite `.card` to use dark elevated surface with `border-white/7`
  - [ ] 1.6 Add `.btn-ghost` utility class for secondary actions
  - [ ] 1.7 Update `.nav-item.active` to use primary color with glow indicator

- [ ] 2. Redesign Login page (`Login.jsx`)
  - [ ] 2.1 Update form card to dark glass surface (`bg-white/5 backdrop-blur-2xl border-white/10`)
  - [ ] 2.2 Update input fields to dark surface with `border-white/10` and `text-slate-100`
  - [ ] 2.3 Fix "Sign Up" link color from `text-white` to `text-primary`
  - [ ] 2.4 Increase background blob opacity to `primary/30` and `secondary/30`

- [ ] 3. Redesign Register page (`Register.jsx`)
  - [ ] 3.1 Apply same dark glass card and input styles as Login
  - [ ] 3.2 Fix "Login here" link color from `text-white` to `text-primary`
  - [ ] 3.3 Increase background blob opacity to match Login

- [ ] 4. Redesign Dashboard page (`Dashboard.jsx`)
  - [ ] 4.1 Set `isDark` initial state to `true` (dark mode by default)
  - [ ] 4.2 Update header to `bg-slate-900/90 backdrop-blur-2xl border-b border-white/5`
  - [ ] 4.3 Upgrade SOS button with radial gradient, stronger glow, and three ripple rings
  - [ ] 4.4 Update SafetyWidget cards to use dark `.card` surface
  - [ ] 4.5 Update feature grid cards (SafeZones, FakeCall) to dark surface with hover glow border
  - [ ] 4.6 Update ChatAssistant: dark surface, gradient user bubbles, `bg-white/10` assistant bubbles
  - [ ] 4.7 Update Safety Check-in card to dark surface

- [ ] 5. Redesign TrustedContacts page (`TrustedContacts.jsx`)
  - [ ] 5.1 Update header to dark surface matching Dashboard
  - [ ] 5.2 Update search bar to `bg-white/5 border-white/10 text-slate-100`
  - [ ] 5.3 Update contact cards to dark `.card` surface with gradient avatar circle
  - [ ] 5.4 Update add contact form to dark `.glass-card` surface

- [ ] 6. Redesign SafeRoute page (`SafeRoute.jsx`)
  - [ ] 6.1 Update header to dark surface matching other pages
  - [ ] 6.2 Update place list items to dark `.card` with emerald left-border accent
  - [ ] 6.3 Replace bottom nav with dark floating pill nav matching Dashboard style
  - [ ] 6.4 Update data source badge to `bg-secondary/10 text-secondary border-secondary/20`

- [ ] 7. Redesign FakeCall page (`FakeCall.jsx`)
  - [ ] 7.1 Add styled dark header with page title and back navigation link
  - [ ] 7.2 Style caller type toggle as dark pill buttons with active gradient state
  - [ ] 7.3 Style delay selector as dark surface pills with active `border-primary` state
  - [ ] 7.4 Replace trigger button with `.btn-primary` gradient style and phone icon
  - [ ] 7.5 Add pulsing ring animation around avatar on incoming call screen
  - [ ] 7.6 Style answer/decline buttons with colored gradients and glow shadows
  - [ ] 7.7 Style talking screen timer and end-call button with red glow
  - [ ] 7.8 Add dark floating pill bottom navigation

- [ ] 8. Redesign Share page (`Share.jsx`)
  - [ ] 8.1 Replace raw inline styles with full dark-themed layout
  - [ ] 8.2 Wrap map in a centered dark card with status badge
  - [ ] 8.3 Style last-updated timestamp as a `bg-white/10` badge
  - [ ] 8.4 Add dark-themed loading and error states

- [ ] 9. Update Map component (`Map.jsx`)
  - [ ] 9.1 Replace light inline styles with dark-themed border and background
  - [ ] 9.2 Update no-API-key fallback message to use dark-themed text color
