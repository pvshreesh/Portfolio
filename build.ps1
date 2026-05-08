$ErrorActionPreference = "Stop"

if (Get-Command latexmk -ErrorAction SilentlyContinue) {
  latexmk -pdf -interaction=nonstopmode resume.tex
  exit 0
}

if (Get-Command pdflatex -ErrorAction SilentlyContinue) {
  pdflatex -interaction=nonstopmode resume.tex
  pdflatex -interaction=nonstopmode resume.tex
  exit 0
}

Write-Host "LaTeX not found. Install MiKTeX or TeX Live, then re-run this script."
Write-Host "MiKTeX: https://miktex.org/download"
exit 1

