# Requirements: Premium UI Redesign — Rakshika

## Overview

This feature delivers a premium, dark-first visual redesign of the Rakshika safety app. All changes are purely cosmetic — no logic, routing, or API behavior is modified.

---

## Requirements

### 1. Global Design System

**1.1** The app MUST use a dark-first color scheme. On initial load, `document.body` MUST have the `dark` class applied by default, without requiring user interaction.

**1.2** The `index.css` `@theme` block MUST define the following updated design tokens:
- `--color-primary: #e63950` (vivid crimson)
- `--color-primary-hover: #cc2d42`
- `--color-secondary: #7c3aed` (electric violet)
- `--color-accent: #f59e0b` (amber)
- `--color-success: #10b981` (emerald)

**1.3** The global body background MUST use a deep navy gradient (`#0a0f1e` → `#111827` → `#1a0a2e`) instead of the current white/red light gradient.

**1.4** The `.glass-card` component class MUST use a dark surface (`bg-[#1a2235]/90`), a subtle white border (`border-white/7`), and a dark box shadow.

**1.5** The `.btn-primary` component class MUST use a gradient fill (`from-primary to-secondary`), a glow box shadow, and an `active:scale-95` transform.

**1.6** The `.card` component class MUST use a dark elevated surface (`bg-[#1a2235]`) with a `border-white/7` border.

**1.7** All form inputs across the app MUST use a dark surface background (`bg-white/5`), a `border-white/10` border, `text-slate-100` text color, and a `focus:border-primary` focus state.

**1.8** The bottom navigation bar MUST use the dark floating pill style (`bg-slate-900/95 backdrop-blur-2xl rounded-[32px] border border-white/10`) consistently across all pages that include navigation.

---

### 2. Login & Register Pages

**2.1** The form card on Login and Register MUST use the dark glass surface (`bg-white/5 backdrop-blur-2xl border border-white/10`).

**2.2** The "Don't have an account?" / "Already have an account?" link text MUST be `text-primary` (currently renders as invisible white-on-white).

**2.3** The background decorative blobs MUST use increased opacity (`primary/30`, `secondary/30`) for visual depth on the dark background.

**2.4** The submit button on both pages MUST use the updated `.btn-primary` gradient style.

---

### 3. Dashboard Page

**3.1** The Dashboard MUST default to dark mode. The `isDark` state MUST be initialized to `true`.

**3.2** The Dashboard header MUST use `bg-slate-900/90 backdrop-blur-2xl border-b border-white/5` (dark surface).

**3.3** The SOS button MUST have a radial gradient fill, a strong glow shadow (`shadow-[0_0_60px_rgba(230,57,80,0.5)]`), and three concentric ripple rings for visual impact.

**3.4** The SafetyWidget cards MUST use the dark `.card` surface.

**3.5** The feature grid cards (SafeZones, FakeCall links) MUST use the dark `.card` surface with a colored glow border on hover.

**3.6** The ChatAssistant component MUST use a dark surface. User message bubbles MUST use the primary gradient. Assistant message bubbles MUST use `bg-white/10 text-slate-200`.

**3.7** The Safety Check-in card MUST use the dark `.card` surface.

---

### 4. TrustedContacts Page

**4.1** The TrustedContacts header MUST use the same dark surface style as the Dashboard header.

**4.2** The search bar MUST use `bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500`.

**4.3** Contact cards MUST use the dark `.card` surface. The avatar circle MUST use the primary-to-secondary gradient.

**4.4** The add contact form MUST use the dark `.glass-card` surface.

---

### 5. SafeRoute Page

**5.1** The SafeRoute header MUST use the dark surface style consistent with other pages.

**5.2** Place list items MUST use the dark `.card` surface with an emerald left-border accent (`border-l-4 border-emerald-500`).

**5.3** The bottom navigation on SafeRoute MUST be replaced with the dark floating pill nav style matching Dashboard and TrustedContacts.

**5.4** The data source badge MUST use `bg-secondary/10 text-secondary border border-secondary/20` instead of the current light blue style.

---

### 6. FakeCall Page

**6.1** The FakeCall page MUST have a styled dark header with the page title and a back navigation link.

**6.2** The caller type toggle buttons (Papa/Mummy) MUST be styled as dark pill buttons. The active state MUST use the primary gradient.

**6.3** The delay selector buttons MUST be styled as dark surface pills. The active state MUST use a `border-primary text-primary` style.

**6.4** The "Trigger Fake Call" button MUST use the `.btn-primary` gradient style with a phone icon.

**6.5** The incoming call screen MUST have a pulsing ring animation around the caller avatar.

**6.6** The answer button on the incoming call screen MUST use a green gradient with a glow shadow. The decline button MUST use a red gradient with a glow shadow.

**6.7** The talking screen MUST display a styled timer and an end-call button with a red glow shadow.

**6.8** The FakeCall page MUST include the dark floating pill bottom navigation.

---

### 7. Share Page

**7.1** The Share page MUST be redesigned from raw inline styles to a full dark-themed layout.

**7.2** The Share page MUST display a centered card containing the map, the user's name/status, and the last-updated timestamp.

**7.3** The last-updated timestamp MUST be styled as a badge (`bg-white/10 text-slate-300 rounded-full px-3 py-1`).

**7.4** Loading and error states MUST use dark-themed text and surfaces.

---

### 8. Map Component

**8.1** The Map component's inline `style` prop MUST be updated to use dark-themed values: `border: '1px solid rgba(255,255,255,0.1)'` and `background: '#111827'`.

**8.2** The no-API-key fallback message MUST use dark-themed text (`color: '#94a3b8'`) on the dark background.

---

### 9. Non-Functional Requirements

**9.1** All text/background color combinations MUST maintain a minimum contrast ratio of 4.5:1 (WCAG AA).

**9.2** No existing `onClick`, `onChange`, API call, routing logic, or state management MUST be modified.

**9.3** No new npm dependencies MUST be introduced.

**9.4** All existing Framer Motion animations MUST be preserved.

**9.5** The dark mode toggle on the Dashboard MUST continue to function, switching between the dark default and a lighter variant.
