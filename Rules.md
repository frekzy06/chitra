# Rules Document - System Directives & Architectural Constraints

## 1. Strict Architecture & Tech Stack Rules
- **Air-Gapped Cybersecurity (100% Sovereign):**
  - ZERO external cloud API calls allowed (No OpenAI, Anthropic, or external cloud embedding endpoints).
  - All LLM inference must execute locally via **Ollama** (`ollama run qwen3:8b` or local OpenAI-compatible endpoint `http://localhost:11434/v1`) or vLLM.
  - All embeddings must run locally via `sentence-transformers` using `BAAI/bge-small-en-v1.5`.
  - Vector database must run locally using embedded `Qdrant` (`./qdrant_data`).

- **Backend Stack:**
  - Python 3.11, FastAPI, Uvicorn.
  - File Parser: PyMuPDF (`fitz`), `python-docx`.
  - Artifact Generation: `python-pptx` for `.pptx` decks, `ReportLab` for `.pdf` advisories.

- **Frontend Stack:**
  - Next.js 14 (App Router) + Tailwind CSS + Lucide Icons + Framer Motion.
  - Radix UI component library (`@/components/ui/progress`).

## 2. Visual Design & Symmetry Rules
- **Canvas Base Background:** `#FEEAEA` (soft pastel rose).
- **Default Window Container Fill:** `#FFDEDE` across ALL primary and secondary windows (Upload, Execution, Generated Carousel, Artifacts).
- **Window Border:** Dark burgundy/maroon `#5E2E36` (2px solid, `rounded-3xl`).
- **Inner Containers & Buttons:** Same `#FFDEDE` fill, separated cleanly by `#5E2E36` borders.
- **Typography:** Black / Dark Charcoal (`text-slate-950`) for all headings and subheadings. Fonts: Geist, Manrope, Poppins, Fraunces.
- **Tone & Copy:** Zero hype verbs, no marketing slogans, no fake telemetry numbers. Errors must strictly state `Error: <reason why it happened>`.
- **Proportions & Alignment:** All main windows must align symmetrically to a unified width (`max-w-5xl mx-auto`) with balanced vertical height and proper viewport scaling without requiring zoom-out.

## 3. Zero-Hallucination & Schema Guard Rules
- LLM outputs MUST be constrained strictly using Pydantic AST JSON schemas (`PresentationDeckSchema`, `SecurityAdvisorySchema`, `SocialPostsSchema`).
- Fast deterministic fallbacks must be maintained to prevent hangs during local LLM execution.

## 4. Communication & Protocol
- Follow repository guidelines strictly and preserve air-gapped sovereignty.
