# The engineering folio

Redesign of Venkata Shreesh Poojari's portfolio, September 2026. The audit and direction below were established before changing the site. The intended audience is recruiters and engineering teams hiring Full Stack, Software, and AI Engineers.

## Phase 1 — Repository audit

Reviewed every tracked site, script, configuration, and documentation file, the existing PDF, the new résumé, and supporting project descriptions. The local checkout points to [pvshreesh/Portfolio](https://github.com/pvshreesh/Portfolio). Historical screenshots are from an earlier light version; current layout concerns were identified from the actual source, including its later dark-theme overrides.

| Area | Finding in the original site | Design response |
| --- | --- | --- |
| Strengths | Real AI, backend, and systems projects; direct contact information; simple static deployment | Preserve factual material and the static stack |
| Technical identity | Generic hero, student positioning, and repeated D3 emphasis dilute the Full Stack / AI story | State the role directly and surface current AI work |
| Outdated content | Degree described as in progress; no Mystik Science; old Fashion AI stack; April résumé | Use `resume/New Resume.pdf`, including completed May 2026 MSCS and August 2026 current role |
| Project hierarchy | Full-height hero, redundant entry CTA, a 640px network, then project bubbles; flagship appears after skills and timeline | Put TravelMate directly after the introduction, followed by Fashion AI and Accio |
| Storytelling | Single-paragraph project summaries, no problem/decision/architecture/outcome structure | Add substantive, inspectable case studies |
| Force network | Dragging skills reveals no additional evidence or navigable project detail | Remove |
| Bubble chart | Arbitrary numeric sizing implies importance; hover/click reveals one project at a time; long labels are truncated | Replace with visible project articles and real links |
| Radar | Self-assigned scores of 86–92 lack a meaningful scale | Replace with grouped technologies |
| Timeline | Sparse SVG labels omit professional contributions; “Full-Time Search” is a milestone | Replace with dated experience articles and separate education |
| Counters | Counts of projects, roles, and degrees consume attention without demonstrating impact | Remove; retain relevant sourced professional results in context |
| Accessibility | SVG groups have focus handlers but no tab stops or keyboard activation; drag-only interaction; no skip link or reduced-motion support; content depends on D3 | Semantic HTML, native details, accessible tabs, visible focus, motion preferences, readable no-JS content |
| Mobile | Late desktop hero rules override earlier breakpoints; a minimum 20rem second column can force overflow; 48rem SVG timeline scrolls sideways | Responsive reading order; vertical architecture on phones; persistently visible compact navigation |
| Visual system | Conflicting light/dark colors, glass panels, gradients, pointer glow, large radii, and repeated shadows | One coherent paper/ink palette; flat surfaces, rules, type, and spacing |
| Maintenance | Unused CSS, repeated rules, stray `*** End Patch` marker, missing LaTeX source referenced by build script | Replace the old presentation code and update tooling/documentation |
| Missing assets | No product screenshots or recordings in the portfolio; no project-specific URLs | Verify public source URLs, reuse the available Accio image, illustrate documented architecture |
| Recruiter information | Current work and graduation are absent; actual professional impact is buried; résumé is stale | Current role in hero, clear experience, current résumé and contact actions |

No framework migration: a single document with three case studies and one small interactive system does not require a client application. Static HTML also keeps the primary evidence available before JavaScript runs.

## Phase 2 — Creative direction

**Concept:** an engineering folio with an editorial reading rhythm. Project-specific system diagrams provide the visual signature. The result should feel like someone carefully explaining their work, with the technical depth available one level below the overview.

- **Typography:** self-hosted variable Manrope, weights 400–800. Headlines use 600 with restrained negative tracking. System monospace is reserved for dates, stage labels, and technology annotations. Fluid display sizes; body copy is never scaled as part of an image.
- **Palette:** paper `#f7f5ef`, ink `#242823`, muted text `#62665d`, rust `#a84930`, rules `#d7d8ce`. TravelMate uses a flat deep-green canvas; Fashion AI has a warm neutral field; Accio has a muted sage field.
- **Spacing:** a 4px base with 8, 12, 16, 24, 32, 48, 64, and 96px intervals. A 1280px maximum reading canvas and fluid page gutters. Sections use 56px on phones and 80–96px on larger screens.
- **Layout:** asymmetrical hero and flagship; paired secondary projects; aligned experience and toolkit rows. Borders define relationships without turning every paragraph into a card.
- **Hero:** technical identity, full name, four direct actions, and a marginal note about present voice-agent work.
- **Navigation:** four visible anchors. On small screens, compact typography fits all four actions without an extra menu interaction. Sticky header offsets protect anchor targets.
- **Projects:** readable summaries and technologies, followed by native expandable notes covering problem, architecture, decisions, flow, outcome, and material tradeoffs.
- **Experience:** current role first, with employer, dates, role, location, and concrete contributions. Earlier internships remain concise. Education is separate.
- **Toolkit:** Frontend, Backend, AI, Cloud, and Data. No scores, logos, or decorative meters.
- **Interaction:** direct anchor navigation, 160ms hover/focus feedback, native disclosures, and user-controlled architecture stages. No autoplay, cursor effects, scroll hijacking, reveal gates, physics, or counters.
- **Mobile:** a single reading column; the architecture sequence stacks above its explanation; details work with touch and keyboard; the full content remains available without JavaScript.

This fits a Full Stack / AI engineer because the visual emphasis is on system boundaries, orchestration, state, evidence, and outcomes. It shows how the software works without making visualization the author's primary identity.

## Phase 3 — Information architecture

1. **Identity and current work:** role, name, proposition, résumé, social links, Mystik Science, ASU.
2. **Project index:** direct jumps to TravelMate, Fashion AI, and Accio.
3. **Selected work:** TravelMate overview and interactive six-stage architecture; Fashion AI and Accio; concise systems projects.
4. **Experience:** Mystik Science → Darwinbox → BlueJeans by Verizon → BHEL.
5. **Toolkit and education:** grouped technologies, completed ASU MSCS, BITS degree.
6. **Contact:** target roles, email, résumé, GitHub, LinkedIn, phone.

The first desktop scroll reaches TravelMate. The following scrolls expose the secondary projects. No animation or visualization must be completed to read the work. Each case study has a stable fragment URL.

## Content provenance and asset decisions

- **Current résumé:** `resume/New Resume.pdf` in the parent workspace, supplied by the user. The site publishes an identical copy at `assets/venkata-shreesh-poojari-resume.pdf`. The legacy résumé filename also contains the new PDF to preserve existing inbound links.
- **TravelMate:** the local `project reports/TravelMate Hackathon Project.md` provides workflow and implementation details. No public repository URL, live deployment, product screenshot, or recording was verified. The interactive illustration represents documented architecture; example prompts and payloads are explicitly labeled illustrative. It does not call AI or mapping services.
- **TravelMate metrics:** the new résumé includes percentage improvements, but the supporting brief has no evaluation method or benchmark evidence. The web case study uses implemented product outcomes instead of turning those numbers into headline claims.
- **Fashion AI:** the local `PROJECT_SUMMARY.md`, local project README, and [public repository](https://github.com/pvshreesh/FashionAI) support the AWS stack and engineering decisions. Available repository images are garment inputs, not product screenshots. The diagram represents the architecture; no product capture is fabricated.
- **Accio:** résumé evaluation figures plus the [public README](https://github.com/pvshreesh/Accio/blob/main/README.md). The project interface/citation image is reused from the README's [original attachment](https://github.com/user-attachments/assets/2831bbc9-17b8-436d-ace3-f5d36cada827), downloaded locally and loaded only when needed. The caption identifies its source. The evaluation numbers are identified as résumé-reported project evaluation, not independently reproduced benchmarks.
- **Professional results:** the new résumé supplies employer dates, role names, and Darwinbox/BlueJeans outcomes. No invented users, adoption, revenue, or production-scale claims were added.
- **Other systems work:** original repository descriptions of graph-based taxi analytics and automated warehouse planning. The NBA visualization project is omitted to sharpen the engineering story.
- **Font:** Manrope Latin variable WOFF2, with its SIL Open Font License included in `assets/manrope-LICENSE.txt`.

## Phase 4 — Implementation

The site remains semantic HTML, one CSS file, and one deferred browser script. D3 and all other production JavaScript dependencies were removed. Architecture links progressively become ARIA tabs with arrow/Home/End/Space keyboard support and deep links. Without JavaScript, all stages render as regular sections. Case studies use native `details`/`summary`.

A small Node preview server serves only public files. The build copies HTML, CSS, JavaScript, and assets to `dist/`, keeping source documentation, tests, and packages out of deployment. Playwright and axe are development-only dependencies. Fonts and the project image are served locally; there are no third-party requests on initial load.

## Phase 5 — Quality and self-critique

See `QUALITY.md` for the final verified results, limitations, and refinement decisions. The reproducible browser check and screenshots are generated with `npm test`.
