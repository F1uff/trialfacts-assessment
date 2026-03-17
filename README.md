# Trialfacts Assessment — Diabetes Study Recruitment System

An end-to-end patient recruitment funnel for a type 2 diabetes clinical study, built for the Trialfacts Junior Tech Coordinator assessment.

## Architecture

```
Landing Page (GitHub Pages) → Google Form (Eligibility Screening) → Google Sheet (Auto-Evaluation + Live Dashboard)
```

1. **Web Ad** — Static HTML page hosted on GitHub Pages. Participants learn about the study and click through to the questionnaire.
2. **Google Form** — Collects personal info and screens eligibility via conditional logic (Q3 only appears if Q2 = Yes/Unsure).
3. **Google Sheet** — Auto-evaluates each response as "Passed" or "Failed" using an ARRAYFORMULA with boolean math. Incorrect answers are highlighted red via conditional formatting.
4. **Prescreening Report** — A dedicated sheet tab with dynamic COUNTIF/COUNTA formulas and auto-updating charts that reflect every new response.

## File Structure

```
├── index.html                # Web ad landing page
├── style.css                 # Flexbox/grid layout, responsive
├── assets/
│   ├── trialfacts-logo.jpg   # Navigation logo
│   └── study-hero.jpg        # Hero image (About the Study section)
├── scripts/
│   ├── createForm.gs         # Apps Script — creates the Google Form
│   └── setupSheet.gs         # Apps Script — configures Sheet + Report tab
└── README.md
```

## Setup Instructions

### 1. Deploy the Web Ad

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

Then enable GitHub Pages: **Settings → Pages → Source: main branch**.

### 2. Create the Google Form

1. Go to [script.google.com](https://script.google.com) → **New Project**
2. Paste the contents of `scripts/createForm.gs`
3. Run `createForm()` and authorize when prompted
4. Copy the **Published URL** from the execution log

### 3. Update the Web Ad

1. In `index.html`, replace `YOUR_GOOGLE_FORM_URL` with the Form URL
2. Push the update to GitHub

### 4. Configure the Response Sheet

1. Open the Google Form → **Responses** tab → **Link to Google Sheets**
2. In the linked Sheet, go to **Extensions → Apps Script**
3. Paste the contents of `scripts/setupSheet.gs`
4. Run `setupSheet()` and authorize when prompted

### 5. Verify End-to-End

- Submit a test response through the form
- Confirm the **Status** column shows "Passed" or "Failed"
- Confirm incorrect answers are highlighted red
- Open the **Prescreening Report** tab and confirm charts update

## Eligibility Logic

| Question | Pass Condition |
|----------|---------------|
| Q1: Diagnosed with type 2 diabetes? | Yes or Unsure |
| Q2: Travelling out of state? | Routing only — triggers Q3 if Yes/Unsure |
| Q3: Can postpone trips? | Yes or Unsure (only shown if Q2 ≠ No) |

**Overall Pass** = Q1 passes AND (Q2 = No, OR Q3 passes)

The Status formula uses boolean math inside ARRAYFORMULA for auto-expansion:

```
((E="Yes")+(E="Unsure")) * ((F="No") + ((F="Yes")+(F="Unsure")) * ((G="Yes")+(G="Unsure")))
```

A result > 0 means "Passed", 0 means "Failed".
