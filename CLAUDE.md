## Project: Wiom Partner App — PayG Compliance Quiz Prototype

### Overview

A mobile web app prototype (HTML/CSS/JS, no framework, no build step) that simulates the Wiom Partner App's PayG compliance quiz flow. Built for internal sign-off before Flutter implementation. The actual app is in Flutter; this is a browser-based prototype for stakeholder review.

### How to Run

No hosting or build required. Just serve the files locally:

```bash
# From the project root
python -m http.server 8080
```

Then open:
- **Partner App:** http://localhost:8080/index.html
- **Admin Panel:** http://localhost:8080/admin.html

> Opening files directly via `file://` may cause localStorage issues in some browsers. Use a local HTTP server.

---

### Architecture

```
PartnerApp/
├── index.html          # Partner app — home screen + modal (intro → quiz → success)
├── app.js              # Partner app logic — quiz flow, admin config overrides
├── styles.css          # Partner app styles — mobile-first, Wiom brand tokens
├── quiz-data.js        # Quiz questions (11) + defaultConfig for intro/success text
├── admin.html          # Admin panel — form UI for editing all content sections
├── admin.js            # Admin logic — load/save config to localStorage
├── admin.css           # Admin styles — desktop-friendly form layout
├── QUIZ_CONTENT.md     # Source of truth for quiz questions and answer key
├── CLAUDE.md           # This file — project context for AI agents
└── design_reference/
    ├── style_reference.png
    ├── popup_reference.png
    └── Wiom_Design_Guidelines_v1.txt
```

**No build tools, no npm, no backend.** Pure HTML/CSS/JS.

### Key Files

| File | Role |
|------|------|
| `index.html` | Partner-facing app. Shows home screen with a modal overlay for intro → quiz → success flow. Default content is hardcoded in HTML. |
| `app.js` | Loads admin overrides from `localStorage('wiom_config')` if present, otherwise uses hardcoded defaults. Manages quiz state, rendering, and progression. |
| `quiz-data.js` | Contains `quizData` array (11 questions) and `defaultConfig` object (intro, quiz, success content). Shared by both partner app and admin panel. |
| `admin.html` | Internal admin panel for editing intro modal, quiz questions, and success screen content. Desktop-oriented. |
| `admin.js` | Reads/writes `wiom_config` to localStorage. Accordion quiz editor with add/delete/reorder. |
| `styles.css` | Partner app CSS using Wiom design tokens (CSS custom properties). Mobile-first, max-width 420px. |
| `admin.css` | Admin panel CSS. Desktop layout, max-width 800px, Wiom brand colors. |

### Content Management (Admin ↔ Partner App)

- **Shared config key:** `localStorage('wiom_config')`
- **Config shape:**
  ```js
  {
    intro: { title, body, cta },
    quiz: [{ question, options[4], correct, explanation }, ...],
    success: { title, subtitle, payout, note, cta }
  }
  ```
- **Partner app** uses hardcoded defaults in HTML + `quizData` from `quiz-data.js`. If `wiom_config` exists in localStorage with valid data, it overrides the DOM content and quiz questions.
- **Admin panel** loads from localStorage (or seeds defaults), lets user edit all fields, and saves back to localStorage.
- **Reset to Defaults** in admin clears `wiom_config`, reverting partner app to hardcoded content.
- localStorage is per-browser/per-origin — admin changes are local only, not shared across devices.

### Quiz Flow (Partner App)

1. **Home screen** — Simulated partner dashboard (always visible behind modal)
2. **Intro modal** — Explains ₹300 new-install payout rule, prompts quiz start
3. **Quiz** — 11 questions, one at a time, with progress bar. Correct → next question. Wrong → restart from Q1.
4. **Success screen** — PayG Certified badge, payout summary, churn rule note
5. **Quiz passed state** stored in `localStorage('wiom_quiz_passed')` — modal won't reappear once passed

### Quiz behaviour rules
- One wrong answer = restart entire quiz
- Must answer all 11 correctly in sequence to pass
- Feedback shown after each answer (correct/wrong + explanation)
- No skipping, no going back

---

## Domain Context

### 1. User Persona (Partner / Rohit)

- Field technician (partner) responsible for installing Wiom internet connections
- Executes system-assigned bookings
- Performs ISP recharge (30 days, 100 Mbps) during setup
- Collects ₹300 security fee (only allowed payment)
- Must follow strict compliance rules (no extra charges, no refusal of assigned installs)
- Works in semi-structured field environment where rule deviation risk exists (cash collection, selective installs, misinformation)

This user is operational, not strategic. Quiz validates behavioural compliance, not theory.

### 2. PayG System Summary (Operational View)

PayG = Pay As You Go internet model.

**Customer Side:**
- Can recharge for any number of days (1, 7, 28, etc.)
- Internet auto-pauses when recharge ends
- Setup includes: 30-day ISP recharge by partner, customer receives 2 days initial internet
- Customer pays only ₹300 security fee (refundable on device return)
- No additional payment allowed
- No cash collection — if customer wants to pay cash, must use QR → someone else makes UPI payment

**Partner Economics:**
- ₹300 payout for every successful new install
- Customer recharge behaviour does NOT affect partner payout
- Device bonus and rating bonus remain unchanged
- No new joining fee for PayG
- Old rule (₹300 on churn) no longer applies — payout is only for new installs

**Compliance Rules:**
- Installation of system-assigned connections is mandatory
- Recharge must activate internet immediately
- No selective refusal of customers
- No extra payment beyond ₹300

### 3. Objective of the Quiz

**Primary:** Validate that partner fully understands and agrees to operational and financial rules of PayG.

**Secondary:**
- Prevent unauthorized cash collection
- Prevent extra fee charging
- Prevent selective install refusal
- Reinforce ₹300-only rule
- Reinforce fixed payout understanding
- Ensure clarity on recharge → immediate activation behaviour

The quiz is a compliance validation checkpoint before enabling PayG operations. The system may gate feature access until quiz is passed, log partner acknowledgment, and use incorrect answers as risk signals.

---

## Design Reference

- **Brand primary:** #D9008D | **Secondary:** #443152
- **Design tokens** defined as CSS custom properties in `styles.css` (see `:root` block)
- **Full design guidelines:** `design_reference/Wiom_Design_Guidelines_v1.txt`
- **Visual references:** `design_reference/style_reference.png`, `design_reference/popup_reference.png`
- **Language:** Hindi-first (हिंदी). All user-facing content is in Hindi. Admin panel UI is in English.
- **Tone:** Casual, warm, positive. No blame tone. Benefit-first, action-later.

---

## Quiz Content Source

All 11 quiz questions, options, and answer key are defined in `QUIZ_CONTENT.md`. The code in `quiz-data.js` must match this file. Answer key: C, A, C, B, B, C, B, C, C, C, B.
