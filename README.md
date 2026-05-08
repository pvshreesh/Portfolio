### LaTeX resume

This folder contains `resume.tex`, recreated to match the **format/style** of your friend’s `jan_attempt_4.pdf`, filled with **your content** (primarily from `resume.pdf`).

### How to build

- **Option A (recommended)**: `latexmk`

```bash
latexmk -pdf -interaction=nonstopmode resume.tex
```

- **Option B**: `pdflatex` (run twice)

```bash
pdflatex -interaction=nonstopmode resume.tex
pdflatex -interaction=nonstopmode resume.tex
```

### Notes

- If compilation fails due to missing packages, install a full LaTeX distribution (e.g., TeX Live / MiKTeX) and ensure `fontawesome5` is available.

