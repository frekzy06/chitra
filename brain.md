# Brain Document - Project Tracking

## Project Overview
- **Project Name:** NITROUS ENGINE (CHITRA - Team NiTRO+)
- **Problem Statement ID:** 26154 | **Theme:** Blockchain & Cybersecurity | **Track:** Smart India Hackathon 2026
- **Objective:** Sovereign, 100% air-gapped GenAI platform for automated content transformation (Raw PDFs/Docs/Prompts -> PowerPoint Decks, PDF Advisories, Infographics, Social/Summary Briefs).

## Core Architecture & Operational Zones
1. **Front Desk (Frontend UI):** Next.js 14 (App Router) + Tailwind CSS + Lucide Icons + Framer Motion + Radix UI.
   - Design: `#FEEAEA` canvas base, `#FFDEDE` default window containers with `#5E2E36` borders, centered circular `+` button with spring animation, symmetrical mode selector (Upload Documents / Text Prompt), stroke-free progress bar, in-browser slide deck carousel, PDF advisory preview modal, and responsive viewport sizing.
2. **Factory Floor (Backend API):** Python 3.11 + FastAPI + Uvicorn (`/api/v1/transform`, `/api/v1/download/{filename}`, `/api/v1/health`).
3. **Reading Room (Ingestion & Semantic Memory):** PyMuPDF (`fitz`), `python-docx`, local `Qdrant` vector database (`./qdrant_data`), `BAAI/bge-small-en-v1.5` embeddings.
4. **The Brain (Offline LLM Inference):** Local Ollama endpoint (`http://localhost:11434/v1`) using active model `qwen3:8b`. Constrained via Pydantic JSON schemas (`PresentationDeckSchema`, `SecurityAdvisorySchema`, `SocialPostsSchema`) with 2.5s client timeout and structured fallback.
5. **The Printing Press (Artifact Generation):** `python-pptx` (16:9 widescreen PowerPoint deck synthesis) + `ReportLab` (Official CERT-In/NCIIPC PDF Security Advisories).

## Change Log
- **2026-09-18:**
  - Added clean Offline / Online Model toggle button in the Header navigation bar next to CHITRA (no icons, matching segmented pill aesthetic).
  - Integrated Google Gemini online models backend (`google-genai`) with automatic model-level fallback cascading (`gemini-3.5-flash` -> `gemini-3.5-flash-lite` -> `gemini-3.6-flash` -> `gemini-flash-latest`) when demand spikes or rate limits occur.
  - Implemented strict offline availability verification (clean error if offline mode is selected and local Ollama is not reachable).
  - Wired `model_mode` through API requests, `/api/v1/health` status reporting, and deliverable artifact metadata badges.

