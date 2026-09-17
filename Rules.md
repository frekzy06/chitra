# Rules Document - System Directives & Architectural Constraints

## 1. Strict Architecture & Tech Stack Rules
- **Air-Gapped Cybersecurity (100% Sovereign):**
  - ZERO external cloud API calls allowed (No OpenAI, Anthropic, or external embedding endpoints).
  - All LLM inference must execute locally via **Ollama** (`ollama run llama3:8b-instruct-q4_K_M` or local OpenAI-compatible endpoint `http://localhost:11434/v1`) or vLLM.
  - All embeddings must run locally via `sentence-transformers` using `BAAI/bge-small-en-v1.5`.
  - Vector database must run locally using embedded `Qdrant` (`./qdrant_data`).

- **Backend Stack:**
  - Python 3.11, FastAPI, Uvicorn.
  - File Parser: PyMuPDF (`fitz`), PaddleOCR.
  - Artifact Generation: `python-pptx` for `.pptx` decks, `ReportLab` for `.pdf` advisories.

- **Frontend Stack:**
  - Next.js 14 (App Router) + Tailwind CSS + Lucide Icons.

## 2. Zero-Hallucination & Schema Guard Rules
- LLM outputs MUST be constrained strictly using Pydantic AST JSON schemas (`PresentationDeckSchema`, `SecurityAdvisorySchema`).
- Direct unconstrained raw text or markdown output from the LLM for artifact creation is forbidden.

## 3. Communication & Exception Handling
- If any technical blocker, missing dependency, hardware constraint, or architectural conflict occurs: **STOP and ASK THE USER immediately** instead of altering the stack or guessing fallback workarounds.
