# CLAUDE.md - frontend website rules

## Always Do First

- **Invoke the 'frontend-design' skill** before writing any frontend code, every session, no exceptions.

## Brand Guidelines

### Logo & Icon

| Asset | Path |
|-------|------|
| Full logo (white) | `images/full_logo_white.svg` |
| Full logo (black) | `images/full_logo_black.svg` — uses `currentColor` for flexibility |
| Icon (white) | `images/icon_white.svg` — "LS" monogram, white fill |
| Icon (black) | `images/icon_black.svg` — "LS" monogram, `#1d1d1b` fill |

### Colors

Only these four colors should be used across the site:

| Role | Value |
|------|-------|
| White | `#FFFFFF` — page background, inverse text |
| Black | `#000000` — headings, primary text, buttons, accents |
| Light grey | `#F2F1F3` — section backgrounds, cards, inputs |
| Dark grey | `#6E6E73` — body text, muted text, secondary elements |

Use opacity variations of black and white for borders, shadows, and subtle UI elements (e.g. `rgba(0,0,0,0.06)` for borders).

### Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Headings | **Gilroy** (local, `./Gilroy/`) | 700 (Bold) | letter-spacing: -1px to -3px |
| Body | **Inter** (Google Fonts) | 400, 500, 600 | line-height: 1.6–1.8 |
| Eyebrows | Inter | 600 | 12px, uppercase, letter-spacing: 3px |

Gilroy font files: `Gilroy-Regular.ttf`, `Gilroy-Medium.ttf`, `Gilroy-SemiBold.ttf`, `Gilroy-Bold.ttf`, `Gilroy-Heavy.ttf`

### Key Styling Patterns

- **Border radius:** cards 16–20px, buttons 8–10px, pill buttons 999px
- **Section padding:** 120–140px vertical
- **Nav:** frosted glass — `rgba(255,255,255,0.88)` + `blur(16px)`
- **Shadows:** subtle `0 2px 24px rgba(0,0,0,0.07)`, hover `0 12px 48px rgba(0,0,0,0.1)`
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for bouncy, 0.2–0.7s durations
