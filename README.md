# Trialfacts Assessment — Diabetes Study Recruitment System

An end-to-end patient recruitment funnel for a type 2 diabetes clinical study.

## Live Links

- **Web Ad** — https://f1uff.github.io/trialfacts-assessment/
- **Recruitment Form** — https://docs.google.com/forms/d/e/1FAIpQLSc_O4KHhFt6s4o3liAAb7DfyTPkVVPjGPujLG5Ww2hF_Gtifg/viewform
- **Response Spreadsheet** — https://docs.google.com/spreadsheets/d/1oG8DRvyeEgvsHRHK2Hc9seWImVy51tdeg7NrHe_l_ys/edit?usp=sharing

## Architecture

```
Landing Page (GitHub Pages) → Google Form (Eligibility Screening) → Google Sheet (Auto-Evaluation + Live Dashboard)
```

1. **Web Ad** — Static HTML/CSS page hosted on GitHub Pages. Participants learn about the study and click through to the questionnaire.
2. **Google Form** — Collects personal info and screens eligibility. Conditional logic routes respondents: Q3 only appears if Q2 = Yes/Unsure.
3. **Google Sheet** — Auto-evaluates each response as Passed or Failed. Incorrect answers highlighted red via conditional formatting.
4. **Prescreening Report** — Dedicated sheet tab with live COUNTIF/COUNTA formulas and auto-updating charts.

## File Structure

```
├── index.html        # Web ad landing page
├── style.css         # Flexbox/grid layout, responsive
├── assets/
│   ├── trialfacts-logo.jpg
│   └── study-hero.jpg
└── README.md
```

## Eligibility Logic

| Question | Pass Condition |
|----------|----------------|
| Q1: Diagnosed with type 2 diabetes? | Yes or Unsure |
| Q2: Travelling out of state? | Routing only — triggers Q3 if Yes/Unsure |
| Q3: Can postpone trips? | Yes or Unsure (only shown if Q2 ≠ No) |

**Overall Pass** = Q1 passes AND (Q2 = No OR Q3 passes)
