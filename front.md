# Front Document - Frontend Architecture & Implementation

## 1. Technology Stack
- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + Custom Design System Tokens
- **Icons:** Lucide React (`lucide-react`)
- **Physics & Motion:** Framer Motion (`framer-motion`)

## 2. Visual Design & Theme Tokens
- **Canvas Background:** `#FEEAEA` (soft pastel rose)
- **Header Banner:** `#7A3E48` (deep burgundy/rosewood with subtle drop shadow)
- **Upload Button:** Gradient `#8B4752` to `#6A323B` with border `#FEEAEA` and spring elevation
- **Unfolded Container Card:** `#C69A9E` (rose-mauve) with backdrop blur and white border
- **Document Icons:** Clean white/slate sheets with folded corner and prominent `#E02424` red PDF badge

## 3. Component Architecture
- `Header.tsx`: Clean top bar with centered "CHITRA" title and Info button trigger.
- `UploadHero.tsx`:
  - Centered circular `+` button that toggles open/closed on click.
  - "Proceed" primary action button with active processing spinner.
  - Responsive dropzone for PDF, DOCX, and TXT files.
- `DocumentGrid.tsx`: Document cards with custom upload empty state prompt, selection indicators, and remove options.
- `ConfigDrawer.tsx`: Parameters drawer with updated Target Audiences (`Common Public`, `Educated People`, `Kids`, `GenZ`) and Deliverable Formats (`All Formats`, `Social Text`, `Slide Deck (.pptx)`, `Advisory (.pdf)`).
- `PipelineTracker.tsx`: Clean "Execution" tracker displaying the 4 core tiers (`Reading Room`, `Factory Floor`, `The Brain`, `Printing Press`) without clutter.
- `ArtifactResults.tsx`: Result display with 1-click social media copy buttons (Instagram, LinkedIn, Twitter/X), presentation deck actions, and reliable PDF/PPTX downloaders.
- `SlideViewerModal.tsx`: 16:9 widescreen in-browser PowerPoint deck carousel with bullet points and key metrics.
- `AdvisoryViewerModal.tsx`: Simplified, friendly security advisory preview for everyday users with direct PDF download.
- `InfoModal.tsx`: Header `CHITRA (Team NiTRO+)`, Body `AMRATANSH`, and Footer `CHITRA - BY TEAM NiTRO+`.
- `downloadHelper.ts`: Universal download utility resolving backend API endpoints and fallback document exports.

## 4. How to Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:3000`.

