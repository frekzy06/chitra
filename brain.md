# Brain Document - Project Tracking

## Project Overview
- **Project Name:** NITROUS ENGINE (CHITRA - Team NiTRO+)
- **Problem Statement ID:** 26154 | **Theme:** Blockchain & Cybersecurity | **Track:** Smart India Hackathon 2026
- **Objective:** Sovereign, 100% air-gapped GenAI platform for automated content transformation (Raw PDFs/Docs -> PowerPoint Decks, PDF Advisories, Social/Summary Briefs).

## Core Architecture & 5 Operational Zones
1. **Front Desk (Frontend UI):** Next.js 14 (App Router) + Tailwind CSS + Lucide Icons + Framer Motion.
   - Exact Figma design: `#7A3E48` burgundy header bar, `#FEEAEA` canvas, centered circular `+` button with spring physics animation, unfolding `#C69A9E` container card, 6-document PDF grid with red badges, drag-and-drop feedback, live pipeline tracker, in-browser slide deck carousel modal, advisory preview modal, and Pydantic JSON AST inspector.
2. **Factory Floor (Backend API):** Python 3.11 + FastAPI + Uvicorn (`/api/v1/transform`, `/api/v1/download/{filename}`, `/api/v1/health`).
3. **Reading Room (Ingestion & Semantic Memory):** PyMuPDF (`fitz`), local `Qdrant` vector database (`./qdrant_data`), `BAAI/bge-small-en-v1.5` embeddings.
4. **The Brain (Offline LLM Inference):** Local Ollama endpoint (`http://localhost:11434/v1`) using active model `qwen3:8b`. Constrained via Pydantic JSON schemas (`PresentationDeckSchema`, `SecurityAdvisorySchema`) for zero hallucination.
5. **The Printing Press (Artifact Generation):** `python-pptx` (16:9 widescreen PowerPoint deck synthesis) + `ReportLab` (Official CERT-In/NCIIPC PDF Security Advisories).

## Change Log
- **2026-09-17:** Extracted all critical code samples, schemas, generators, pitch points, and requirements from `chitra.docx` into `brain.md`, `fact.md`, and `front.md`.
- **2026-09-17:** Created `Rules.md` enforcing strict 100% air-gapped tech stack, Ollama/vLLM local inference, Pydantic schemas, and explicit user-query protocol for any architectural issues.
- **2026-09-17:** Analyzed Figma reference screenshots (unpressed state with centered "+" button, transition animation, and pressed state with 6-document card container and drag-and-drop effects).
- **2026-09-17:** Built complete backend in `backend/`:
  - `backend/api/schemas.py`: Pydantic AST models (`SlideContent`, `PresentationDeckSchema`, `SecurityAdvisorySchema`, `TransformResponse`).
  - `backend/services/parser.py`: Multi-format text extraction (PDF, DOCX, TXT).
  - `backend/services/vector_store.py`: Local Qdrant memory with BAAI embeddings.
  - `backend/services/llm_engine.py`: AirGappedBrain targeting local Ollama `qwen3:8b` with JSON validation.
  - `backend/services/generators/pptx_generator.py`: 16:9 widescreen PowerPoint generator.
  - `backend/services/generators/pdf_generator.py`: ReportLab security advisory PDF generator.
  - `backend/main.py`: FastAPI server with CORS, health check, transform, and download endpoints.
  - `backend/requirements.txt`: Python package requirements.
- **2026-09-17:** Refactored UI & Backend per exact user feedback:
  - Removed "SOVEREIGN AIR-GAP 0 Cloud Calls" and "Ollama: qwen3:8b" badges from `Header.tsx`.
  - Updated `InfoModal.tsx`: Header set to `CHITRA (Team NiTRO+)`, Body content simplified to `AMRATANSH`, and Footer set to `CHITRA - BY TEAM NiTRO+`.
  - Fixed `+` button in `UploadHero.tsx` so clicking toggles expansion state cleanly (opens on 1st click, collapses on 2nd click).
  - Removed gimmick hardcoded sample PDF documents and hardcoded "Selected: CERT-In Threat Advisory..." text. Default state starts clean.
  - Updated Target Audience options in `ConfigDrawer.tsx` to: `Common Public`, `Educated People`, `Kids`, `GenZ`.
  - Added `Social Media Text (Insta, LinkedIn, Twitter)` deliverable format in `ConfigDrawer.tsx`, `ArtifactResults.tsx`, `schemas.py`, `llm_engine.py`, and `main.py`.
  - Changed primary action button text from "Transform Intelligence" to "Proceed".
  - Updated `PipelineTracker.tsx`: Changed title to "Execution", removed latency readout, renamed "Memory Bank" to "Factory Floor", removed stage descriptions, and removed the log box.
  - Simplified security advisory content across the offline LLM engine and preview modal to use clear, simple language suitable for everyday people.
  - Created `downloadHelper.ts` and fixed PDF & PPTX file downloading logic for both backend and client-side fallback.
  - Changed application footer to `CHITRA - BY TEAM NiTRO+`.

