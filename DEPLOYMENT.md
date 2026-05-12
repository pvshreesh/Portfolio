# Vercel Deployment Guide

This is a static D3.js portfolio website ready for deployment on Vercel.

## Quick Start

### Step 1: Prepare Resume PDF

The website references a resume PDF at `assets/Poojari-Venkata-Shreesh-Resume.pdf`. You need to:

1. Create the `assets/` folder if it doesn't exist
2. Add your resume PDF: `assets/Poojari-Venkata-Shreesh-Resume.pdf`

Without this file, the "View resume" button will return a 404 error.

### Step 2: Push to GitHub

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: portfolio website ready for Vercel"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Import your GitHub repository (the portfolio repo)
3. Root directory: **Leave blank** (the repo root is already the portfolio folder)
4. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm install -g vercel
cd portfolio
vercel
```

## Project Structure

```
portfolio/
├── index.html              # Main portfolio page
├── script.js              # D3.js visualizations and interactions
├── styles.css             # Styling (light & dark modes)
├── package.json           # Project metadata
├── vercel.json            # Vercel configuration
├── README_PORTFOLIO.md    # Local development guide
└── assets/
    └── Poojari-Venkata-Shreesh-Resume.pdf (ADD THIS FILE)
```

## Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Dark & light mode support
- ✅ Interactive D3 visualizations
  - Force-directed network graph
  - Bubble chart with filters
  - Radar chart for skills
  - Career timeline
- ✅ Animated counters
- ✅ Contact links (email, phone, GitHub, LinkedIn)
- ✅ Smooth scrolling navigation

## Local Testing (Before Deployment)

```bash
cd portfolio
python -m http.server 8000
# Visit http://localhost:8000
```

## Environment Variables

None required for this static site. If you need to add dynamic features later, create a `.env.local` file (it's in .gitignore).

## Troubleshooting

**"View resume" button returns 404:**
- Add the PDF file to `assets/Poojari-Venkata-Shreesh-Resume.pdf`

**Visualizations not rendering:**
- Check browser console (F12) for JavaScript errors
- Ensure D3.js loads from CDN: https://d3js.org/d3.v7.min.js

**Mobile layout broken:**
- Check media queries in `styles.css` (queries at 960px and 720px)

## Next Steps

1. Add resume PDF to `assets/` folder
2. Test locally with `python -m http.server 8000`
3. Push to GitHub
4. Deploy to Vercel
5. Share your live portfolio URL!

## Support

For Vercel deployment help: https://vercel.com/docs
For D3.js issues: https://d3js.org
