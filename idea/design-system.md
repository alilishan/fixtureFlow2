# FixtureFlow v2 — Design System

> How to make a shadcn/Tailwind app look like a professional sports product, not a generic AI build.
> Updated based on design reference: Sporty Modern Sports Website UI/UX (Dribbble).

---

## Design Reference Analysis

The reference image shows:
- **Pure black** backgrounds (not near-black, not dark grey — actual `#0a0a0a`)
- **Orange-red accent** as the single brand colour — warm, urgent, energetic
- **Extremely heavy typography** — 800–900 weight, wide/extended not condensed
- **Section labels** in accent colour, uppercase, tracked — used as dividers not just headings
- **Angular / diagonal cuts** on image sections — breaks the static rectangle layout
- **Zero decorative gradients** — contrast does everything
- **Upcoming Fixtures** cards: dark surface, team name heavy, date/time small in accent
- Full-bleed alternating sections: pure black ↔ dark image ↔ pure black

---

## Design Philosophy

**Three words: Bold. Black. Aggressive.**

| Principle | What it means |
|---|---|
| **Bold** | 800–900 weight type everywhere it matters. Numbers are oversized. Nothing is timid. |
| **Black** | Pure black `#0a0a0a` — not "dark grey", not "near black". The reference image makes no compromise. |
| **Aggressive** | The accent colour punches. Diagonal cuts on images. Section labels scream. This is a sports product. |

Avoid:
- Soft pastels or muted colour palettes
- Rounded corners — zero radius on most elements
- Gradients that don't have a purpose
- White space that feels "airy" — sports data is dense
- Slow animations — everything snappy

---

## Colour System

### Base Palette — Dark Theme (Primary)

```css
@theme {
  /* Backgrounds — pure black hierarchy */
  --color-base-black:  #0a0a0a;   /* Page background — pure black */
  --color-base-900:    #111111;   /* Card / panel surface */
  --color-base-800:    #1a1a1a;   /* Elevated surfaces, inputs */
  --color-base-700:    #242424;   /* Hover states */
  --color-base-600:    #333333;   /* Borders, dividers */

  /* Text — white only, no grey softening on primary */
  --color-text-primary:   #ffffff;   /* Primary text — pure white */
  --color-text-secondary: #888888;   /* Secondary / labels */
  --color-text-muted:     #555555;   /* Placeholder, disabled */

  /* Brand Accent — orange-red, high energy */
  --color-accent:         #e84422;   /* Primary CTA, highlights, section labels */
  --color-accent-hover:   #ff5533;   /* Hover state — slightly brighter */
  --color-accent-dim:     #e8442215; /* Accent at low opacity for backgrounds */

  /* Status Colours */
  --color-live:     #e84422;   /* LIVE — same as accent, unified language */
  --color-live-dim: #e8442215;
  --color-win:      #22c55e;   /* Win — green */
  --color-draw:     #f59e0b;   /* Draw — amber */
  --color-loss:     #ef4444;   /* Loss — red */

  /* Utility */
  --color-border:        #1f1f1f;
  --color-border-strong: #2e2e2e;
  --color-surface:       #111111;
  --color-overlay:       rgba(0,0,0,0.85);
}
```

### Light Theme (for embed widgets on white club sites)

```css
.light {
  --color-base-black:  #ffffff;
  --color-base-900:    #f5f5f5;
  --color-base-800:    #ebebeb;
  --color-base-700:    #dedede;
  --color-text-primary:   #0a0a0a;
  --color-text-secondary: #555555;
  --color-text-muted:     #888888;
  --color-border:     #e0e0e0;
  --color-surface:    #ffffff;
  /* accent stays the same — club brand colour bridges both modes */
}
```

### Colour Usage Rules

| Context | Colour |
|---|---|
| Page background | `base-black` |
| Card / panel | `base-900` |
| Input / elevated | `base-800` |
| Hover surfaces | `base-700` |
| Borders | `base-600` / `border` |
| Primary text | `text-primary` (white) |
| Labels / metadata | `text-secondary` |
| Section headings / labels | `accent` (orange-red) |
| CTA buttons | `accent` background + white text |
| LIVE badge | `accent` — unified, one colour for urgency |
| Active nav item | `accent` left border + `accent-dim` bg |
| Win | `win` (green) |
| Draw | `draw` (amber) |
| Loss | `loss` (red) |

### White-label Club Colour

`NEXT_PUBLIC_CLUB_PRIMARY_COLOR` replaces `--color-accent` at deploy time. All CTAs, section labels, active states, and live indicators instantly adopt the club's brand colour.

The default `#e84422` (orange-red) is strong enough to work for most clubs who haven't specified a colour.

---

## Typography

### Font Stack — Heavy, Wide, Athletic

The reference image uses extremely heavy type with wide/extended proportions. Not condensed — **extended or normal width, maximum weight**.

```css
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

@theme {
  --font-display: 'Anton', system-ui, sans-serif;
  --font-body:    'Barlow', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', 'Courier New', monospace;
}
```

| Font | Role | Why |
|---|---|---|
| **Anton** (single weight, 400 = bold) | H1, H2, hero text, tournament names, section labels | Free Google Font. Extremely heavy, wide, uppercase-designed. Exactly the weight seen in the reference. Used in sports editorial design. No weight variants needed — it's always bold. |
| **Barlow** (400–700) | Body text, labels, card text, nav | Clean workhorse. Humanist sans that pairs well with Anton without competing. Slightly sporty feel. |
| **JetBrains Mono** | Scores, stats numbers, match times, standings columns | Tabular numbers — all stats align perfectly in columns. Makes score displays feel precise and technical. |

### Type Scale

```css
@theme {
  /* Display — hero headings, tournament names */
  --text-hero:    clamp(3rem, 8vw, 6rem);       /* Main hero text */
  --text-display: clamp(1.875rem, 4vw, 3rem);   /* Section headings */

  /* Score — match detail page */
  --text-score:   clamp(3rem, 6vw, 5rem);       /* "2 - 1" */

  /* Headings */
  --text-h1: 2rem;     /* Page titles */
  --text-h2: 1.5rem;   /* Section headings */
  --text-h3: 1.125rem; /* Card headings */

  /* Body */
  --text-base:  0.9375rem; /* Default — slightly smaller for density */
  --text-sm:    0.8125rem; /* Labels, badges */
  --text-xs:    0.6875rem; /* Metadata, timestamps */
}
```

### Typography Rules

- **All display headings** use `font-display` (Anton), `uppercase`, `tracking-normal` — Anton is already wide so don't add extra tracking
- **Section labels** (e.g. "UPCOMING FIXTURES", "LEAGUE TABLE") use `font-display`, `text-accent`, `uppercase` — this is the reference image's most distinctive pattern
- **Score displays** use `font-mono`, `tabular-nums`, maximum size
- **Team names in cards/tables** use `font-body`, `font-bold` — not Anton, not uppercase
- **Stats numbers** always use `font-mono` — column alignment is non-negotiable
- **Navigation items** use `font-body`, `font-medium`, `uppercase`, `tracking-wider`
- **Status badges** use `font-body`, `font-semibold`, `uppercase`, `tracking-widest`, `text-xs`

---

## Component Patterns

### Kill the Generic shadcn Look — Key Overrides

```css
/* globals.css */

/* 1. Zero / near-zero radius — sharp corners everywhere */
--radius-sm: 0;          /* Badges — completely square */
--radius:    0.125rem;   /* Cards, inputs — 2px maximum */
--radius-md: 0.125rem;
--radius-lg: 0.25rem;    /* Modals — barely there */
--radius-xl: 0.25rem;

/* 2. No box shadows — ever. Background contrast only. */

/* 3. Focus ring uses accent */
--ring: var(--color-accent);
```

### Section Label Pattern

This is the most distinctive pattern from the reference image. Every major section of the public pages opens with:

```tsx
<div className="flex items-center gap-3 mb-6">
  <span className="w-1 h-6 bg-accent block" />       {/* accent bar */}
  <h2 className="font-display text-2xl uppercase text-white tracking-normal">
    Upcoming Fixtures
  </h2>
</div>
```

Alternatively, a full-width accent underline:
```tsx
<div className="mb-6">
  <h2 className="font-display text-2xl uppercase text-white pb-2 border-b-2 border-accent">
    League Table
  </h2>
</div>
```

This pattern — Anton + uppercase + accent underline/bar — is what immediately separates the design from a generic app.

### Match Card

The most important component. Appears everywhere.

```
┌─────────────────────────────────────────────────────┐
│  TUE 15 APR · 19:30              U14 LEAGUE         │  ← text-secondary, text-xs
│                                                      │
│  Manchester FC    2  —  1    Rovers United           │  ← team: font-body bold
│                             score: font-mono large   │
│  Riverside Ground                        [● LIVE]   │  ← accent badge
└─────────────────────────────────────────────────────┘
```

Live card — left border 3px accent colour + very faint accent background tint:
```
▌────────────────────────────────────────────────────┐
▌  TUE 15 APR · 19:30   [● LIVE]        U14 LEAGUE  │
▌                                                    │
▌  Manchester FC    2  —  1    Rovers United          │
▌                                         45'        │
└────────────────────────────────────────────────────┘
```

**Design rules:**
- No card shadow — border + `base-900` bg against `base-black` page provides depth
- Score is the dominant visual element — team names support it
- Entire card is clickable
- On hover: `base-800` background, 100ms transition

### Section with Diagonal Image (Public Hero / Club Home)

From the reference image — the hero and image-break sections use diagonal cuts:

```css
.section-diagonal-bottom {
  clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
}

.section-diagonal-top {
  clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%);
}
```

Used on:
- Public club home hero section
- "Meet the Teams" section divider
- Any full-bleed image that separates content areas

### League Table

```
  LEAGUE TABLE                           ← Anton, uppercase, accent underline

  #    TEAM              P   W  D  L   GF  GA  GD  PTS   FORM
  ─────────────────────────────────────────────────────────────
  1    City Athletic     12  9  2  1   28  10  +18  29   ● ● ● ○ ●
  2    Riverside FC      12  8  1  3   22  14   +8  25   ● ✕ ● ● ●
  ─────────────────────────────────────────────────────────────
  ...
  11   Town United       12  1  2  9    8  31  -23   5   ✕ ✕ ○ ✕ ✕
```

- Position 1: gold `#` + accent text
- Top 3: subtle top-border accent indicator
- Relegation zone (bottom 2–3): faint red left border on row
- Form circles: 12px solid circles — green (W), amber (D), dark red (L)
- All stat columns: `font-mono`, `tabular-nums`, right-aligned

### Score Display (Match Detail Page)

Full-width card, the centrepiece of the page:

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  U14 LEAGUE · TUE 15 APR · 19:30                    │
│                                                      │
│  MANCHESTER FC           ROVERS UNITED               │  ← Anton, uppercase
│                                                      │
│         2          —          1                      │  ← JetBrains Mono, 5rem
│                                                      │
│                  ● LIVE · 45'                        │  ← accent pulse
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Status Badge

```
LIVE     → accent bg (low opacity) + accent text + accent border + pulsing dot
UPCOMING → no bg + border-border + text-secondary + clock icon
FINISHED → base-700 bg + text-muted — visually quiet
```

```css
.badge-live {
  background: var(--color-accent-dim);
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: var(--color-accent); opacity: 1; }
  50%       { border-color: transparent; opacity: 0.7; }
}
```

### Dashboard Sidebar Nav

```
┌─────────────────────┐
│  [LOGO]             │
│  CLUB NAME          │  ← Anton, accent colour
│  2025/26 Season     │  ← text-muted, text-xs
│                     │
│  ── OVERVIEW ──     │  ← text-muted, tracking-widest, text-xs
│  › Dashboard        │  ← active: 3px left border accent + accent-dim bg
│                     │
│  ── MANAGEMENT ──   │
│    Age Groups       │
│    Teams            │
│    Players          │
│    Tournaments      │
│    Fixtures         │
│                     │
│  ── REPORTS ──      │
│    Statistics       │
│    Settings         │
└─────────────────────┘
```

- Sidebar bg: `base-black` — same as page, separated only by a right border
- Active item: `border-l-[3px] border-accent bg-accent/5` — no rounded pill
- Section labels: `text-muted`, `text-xs`, `uppercase`, `tracking-[0.15em]`
- No icons needed — clean text-only nav is more editorial

### Data Tables

- No zebra striping — hover highlight only (`base-800`, 100ms)
- Header: `text-xs uppercase tracking-wider text-secondary font-medium`
- Rows: `border-b border-border` — horizontal lines only, no vertical
- Action buttons: `opacity-0 group-hover:opacity-100 transition-opacity duration-100`
- Empty state: centered, `text-muted`, no heavy illustration — keep it minimal

### Buttons

```
Primary:   bg-accent text-white rounded-none px-6 py-2.5 font-body font-semibold uppercase tracking-wider
Secondary: bg-transparent border border-border text-white rounded-none hover:border-accent hover:text-accent
Ghost:     bg-transparent text-secondary hover:text-white transition-colors
Danger:    bg-loss/10 text-loss border border-loss/30 rounded-none
```

Zero border radius on all buttons. `uppercase` + `tracking-wider` on primary.

---

## Layout Principles

### Spacing — Tight, Data-Dense

```css
/* Card padding */
.card         { padding: 1rem; }
.card-header  { padding: 0.875rem 1rem 0.5rem; }
.card-content { padding: 0.5rem 1rem 1rem; }

/* Table cells */
td, th { padding: 0.625rem 0.75rem; }

/* Section gaps */
.section { margin-bottom: 2.5rem; }
```

### Public Page Layout

```
┌─────────────────────────────────────────────────────┐
│  [LOGO]  CLUB NAME    Fixtures  Standings  Bracket   │  ← sticky, 64px, bg-black border-b-border
├─────────────────────────────────────────────────────┤
│                                                     │
│  ╔═══════════════════════════════════════════════╗  │
│  ║  HERO — full bleed, diagonal clip-path        ║  │
│  ║  BG image + black overlay                     ║  │
│  ║  Club Name in Anton · Season label            ║  │
│  ╚═══════════════════════════════════════════════╝  │
│                                                     │
│  max-w-6xl mx-auto px-4                            │
│  ┌─────────────────────────┐ ┌───────────────┐     │
│  │ Match cards  (flex 2/3) │ │ Sidebar (1/3) │     │
│  │ Section label header    │ │ ─ LIVE NOW ─  │     │
│  │ MatchCard               │ │ live scores   │     │
│  │ MatchCard               │ │               │     │
│  │ MatchCard               │ │ ─ STANDINGS ─ │     │
│  └─────────────────────────┘ │ mini table    │     │
│                               └───────────────┘     │
└─────────────────────────────────────────────────────┘
```

### Dashboard Layout

```
┌────────────┬────────────────────────────────────────┐
│  SIDEBAR   │  TOPBAR (h-14, border-b)               │
│  (w-60)    │  Page title + action buttons           │
│            ├────────────────────────────────────────┤
│  bg-black  │  CONTENT AREA (p-6)                    │
│  border-r  │                                        │
│  border    │  ┌────┐ ┌────┐ ┌────┐ ┌────┐          │
│            │  │stat│ │stat│ │stat│ │stat│          │
│  Nav items │  └────┘ └────┘ └────┘ └────┘          │
│            │                                        │
│            │  ┌──────────────────────────────────┐  │
│            │  │  Data table / content area       │  │
│            │  └──────────────────────────────────┘  │
└────────────┴────────────────────────────────────────┘
```

---

## Motion & Animation

**Rule: functional only, fast.**

| Animation | Use | Spec |
|---|---|---|
| LIVE badge pulse | Active status | 2s ease-in-out infinite, border + opacity |
| Score flash | Goal scored via SSE | 300ms — text flashes to accent then back |
| Skeleton shimmer | Loading state | 1.5s linear infinite |
| Hover | Cards, rows, buttons | 100ms transition-colors |
| Page fade | Route transitions | 150ms opacity |
| Mobile nav slide | Sidebar on mobile | 200ms ease-out |

Never: bounce, elastic, spin on content, anything over 300ms.

---

## Key UI Moments

### 1. The Section Label
Every public page section opens with an Anton uppercase heading + 3px accent left bar or accent bottom border. This is the single most distinctive pattern from the reference. Costs nothing to implement, immediately kills the "generic" look.

### 2. The Live Card
3px left border in accent + faint accent background wash + pulsing badge. When a match goes LIVE this card visually separates from the rest of the list. The demo moment.

### 3. The Score Display
Full-width, centred, JetBrains Mono at 5rem. Home score left, away score right, dash in the middle. Below: pulsing LIVE badge or the final whistle icon. No other page has typography this large — it signals "this is the important thing".

### 4. The Diagonal Hero
Public club home page. Full-bleed dark image (club ground, team photo) with `clip-path` diagonal bottom edge. Club name in Anton at maximum size. This is what you open on the demo tablet when walking into the club.

### 5. Form Circles in League Table
12px solid coloured circles for W/D/L — not letters, not squares, not coloured text. Circles. The shape communicates completeness/result at a glance without reading.

---

## Implementation: globals.css

```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

@theme {
  --font-sans:    'Barlow', system-ui, sans-serif;
  --font-display: 'Anton', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  --radius-sm: 0rem;
  --radius:    0.125rem;
  --radius-md: 0.125rem;
  --radius-lg: 0.25rem;
  --radius-xl: 0.25rem;
}

:root {
  --background:          10 10 10;      /* #0a0a0a */
  --foreground:          255 255 255;   /* #ffffff */
  --card:                17 17 17;      /* #111111 */
  --card-foreground:     255 255 255;
  --border:              31 31 31;      /* #1f1f1f */
  --input:               26 26 26;
  --primary:             232 68 34;     /* #e84422 — orange-red accent */
  --primary-foreground:  255 255 255;
  --muted:               36 36 36;
  --muted-foreground:    136 136 136;
  --accent:              232 68 34;
  --accent-foreground:   255 255 255;
  --destructive:         239 68 68;
  --ring:                232 68 34;
}

@layer utilities {
  .font-score {
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    letter-spacing: -0.02em;
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
  }

  .section-label::before {
    content: '';
    display: block;
    width: 3px;
    height: 1.5rem;
    background: hsl(var(--accent));
    flex-shrink: 0;
  }

  .section-label h2 {
    font-family: var(--font-display);
    font-size: 1.5rem;
    text-transform: uppercase;
    color: white;
  }

  .badge-live {
    @apply inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-2 py-0.5;
    color: hsl(var(--accent));
    background: hsl(var(--accent) / 0.1);
    border: 1px solid hsl(var(--accent) / 0.5);
    animation: pulse-live 2s ease-in-out infinite;
  }

  @keyframes pulse-live {
    0%, 100% { border-color: hsl(var(--accent) / 0.5); }
    50%       { border-color: transparent; }
  }

  .form-pill-w { @apply w-3 h-3 rounded-full bg-green-500; }
  .form-pill-d { @apply w-3 h-3 rounded-full bg-amber-500; }
  .form-pill-l { @apply w-3 h-3 rounded-full bg-red-600; }
}
```

## Font Loading (Next.js layout.tsx)

```tsx
import { Anton, Barlow, JetBrains_Mono } from 'next/font/google'

const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-display',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${barlow.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

---

## Reference Inspiration

| Reference | What to borrow |
|---|---|
| **Dribbble ref image** | Section labels, diagonal cuts, orange-red accent, Anton-weight type |
| **Sofascore** | Data density, form indicators, bracket design |
| **BBC Sport** | Score card layout, league table structure |
| **OneFootball** | Dark mobile-first match cards |
| **Linear** | Sidebar nav, dark token system |
| **ESPN** | Urgency of live states, red-on-dark colour language |

---

## The Anti-checklist

- No `rounded-full` on anything except avatar/team badge images
- No `rounded-lg` — maximum `rounded-sm` (0.125rem)
- No `shadow-md` or `shadow-xl` — border contrast only
- No Inter font — most "AI-built" choice available
- No slate grey palette — pure blacks and whites only
- No `text-gray-500` — use `text-muted-foreground` token
- No gradient backgrounds on content areas — hero only, if at all
- No `transition-all` — be specific: `transition-colors`, `transition-opacity`
- No slow animations — `duration-150` maximum for interactions
- No centered text in data tables — left text, right numbers
- No pill-shaped buttons — `rounded-none` on all primary actions
