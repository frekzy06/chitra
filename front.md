# Front Document - Frontend Architecture & Implementation

## 1. Technology Stack
- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + Custom Design System Tokens
- **Icons:** Lucide React (`lucide-react`)
- **Physics & Motion:** Framer Motion (`framer-motion`)
- **UI Primitives:** Radix UI (`radix-ui`) with custom components (`/components/ui/progress.tsx`)

## 2. Visual Design & Theme Tokens
- **Canvas Background:** `#FEEAEA` (soft pastel rose)
- **Header Banner:** `#7A3E48` (deep rosewood with clean drop shadow)
- **Primary Action Buttons & Indicators:** Deep burgundy `#5E2E36`
- **Default Window Containers:** `#FFDEDE` with `#5E2E36` (2px solid, `rounded-3xl`, soft shadows)
- **Inner Windows & Controls:** Same `#FFDEDE` background separated cleanly with `#5E2E36` outlines
- **Progress Track:** Soft rose `#E8B8BE` with sleek, stroke-free `#5E2E36` indicator
- **Typography:** Geist, Manrope, Poppins, Fraunces fonts with black / dark charcoal headings (`#020617` / `#0F172A`)

## 3. Component Architecture
- `Header.tsx`: Clean top bar with centered "CHITRA" title and Info button modal trigger.
- `UploadHero.tsx`:
  - Standard aligned width (`max-w-5xl mx-auto`) with proportional height.
  - Centered circular `+` button that toggles open/close on click.
  - Symmetrical mode selection (`Upload Documents` vs `Text Prompt`).
  - Minimal file upload button, parameter drawer trigger, and "Proceed" button.
- `DocumentGrid.tsx`: Minimal empty state displaying only the upload logo and "Upload a file". Outlined `#FFDEDE` document cards.
- `PipelineTracker.tsx`:
  - `#FFDEDE` window frame with borderless, stroke-free progress bar.
  - Clean text without extra logo next to "Executing Synthesis".
  - Instant cancel button stopping processing immediately and aborting active requests.
- `framer-normal-carousel.tsx`: Generated deliverables carousel in `#FFDEDE` frame with generous vertical proportions and auto-scroll trigger.
- `ArtifactResults.tsx`: Detailed deliverable cards (Executive Summary, Presentation Deck, Policy PDF Advisory, SVG Vector Graphic, Social Media text) matching the unified `#FFDEDE` / `#5E2E36` theme.
- `ConfigDrawer.tsx`: Parameters drawer for Target Audience, Tone, and Deliverable Formats.
- `InfoModal.tsx`: Header `CHITRA (Team NiTRO+)`, Body `AMRATANSH`, Footer `CHITRA - BY TEAM NiTRO+`.

## 4. How to Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000`.
