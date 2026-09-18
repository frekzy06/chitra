# CHITRA Setup & Deployment Guide

> **NITROUS ENGINE (CHITRA - Team NiTRO+)**  
> AI-powered automated content transformation platform (Raw PDFs, DOCX, Text Prompts $\rightarrow$ PowerPoint Decks, PDF Advisories, Infographics, Social Posts, and Executive Summaries).

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Project Architecture Overview](#-project-architecture-overview)
3. [Quick Start (Choose Your Operating Mode)](#-quick-start)
   - [Mode A: 100% Offline Mode (Air-Gapped)](#mode-a-100-offline-mode-air-gapped)
   - [Mode B: Online Cloud Mode (Google Gemini)](#mode-b-online-cloud-mode-google-gemini)
   - [Mode C: Hybrid Mode (Offline + Online Switchable)](#mode-c-hybrid-mode-offline--online-both)
4. [Backend Setup (FastAPI)](#-backend-setup)
5. [Frontend Setup (Next.js 14)](#-frontend-setup)
6. [Testing & Verification](#-testing--verification)
7. [API Reference](#-api-reference)
8. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🛠️ Prerequisites

Ensure your system meets the following requirements:

| Component | Minimum Requirement | Recommended |
|---|---|---|
| **Operating System** | Linux (Ubuntu/Fedora/Debian), macOS, Windows 10/11 (WSL2) | Linux / WSL2 |
| **Python** | Python 3.10+ | Python 3.11 or 3.12 |
| **Node.js** | Node.js v18.0.0+ | Node.js v20 LTS |
| **Package Managers** | `pip`, `npm` (or `pnpm`/`yarn`) | `pip`, `npm` |
| **RAM** | 8 GB RAM (Online) | 16 GB+ RAM (for local LLM inference) |

---

## 🏛️ Project Architecture Overview

```
sih_try/
├── backend/
│   ├── .env                     # API keys & model configuration
│   ├── main.py                  # FastAPI application & REST endpoints
│   ├── requirements.txt         # Backend Python dependencies
│   ├── api/
│   │   └── schemas.py           # Pydantic JSON schemas & validators
│   └── services/
│       ├── llm_engine.py        # HybridBrain (AirGappedBrain & GeminiBrain)
│       ├── parser.py            # PDF/DOCX multi-page text parser
│       ├── vector_store.py      # Embedded Qdrant vector memory
│       └── generators/
│           ├── pptx_generator.py# PowerPoint deck generator (.pptx)
│           └── pdf_generator.py # CERT-In/NCIIPC advisory PDF generator
├── frontend/
│   ├── app/                     # Next.js App Router (page.tsx, layout.tsx)
│   ├── components/              # Header, UploadHero, ArtifactResults, etc.
│   ├── package.json             # Frontend dependencies & scripts
│   └── tailwind.config.js       # Design system colors and tokens
├── guide.md                     # This setup guide
└── brain.md                     # Project specification & tracking
```

---

## 🚀 Quick Start

### Mode A: 100% Offline Mode (Air-Gapped)
Use this mode when you want **zero external cloud calls**, complete data sovereignty, and full local inference.

1. **Install Ollama:**
   - **Linux / WSL2:**
     ```bash
     curl -fsSL https://ollama.com/install.sh | sh
     ```
   - **macOS / Windows:** Download the installer from [ollama.com](https://ollama.com).

2. **Pull and Run the Local Model:**
   ```bash
   ollama pull qwen3:8b
   # or
   ollama run qwen3:8b
   ```

3. **Verify Ollama is Running:**
   ```bash
   curl http://localhost:11434/
   # Should return: "Ollama is running"
   ```

---

### Mode B: Online Cloud Mode (Google Gemini)
Use this mode for rapid cloud generation without needing local GPU/RAM resources for LLM inference.

1. **Get a Google Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and generate an API key.

2. **Configure `backend/.env`:**
   Create or edit `backend/.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODELS=gemini-3.5-flash-lite,gemini-3.6-flash,gemini-flash-latest,gemini-flash-lite-latest
   GEMINI_IMAGE_MODELS=gemini-3.1-flash-image,gemini-3-pro-image,gemini-2.5-flash-image
   ```

   > **Automatic Rate-Limit Fallback:** If `gemini-3.5-flash-lite` experiences a quota limit or temporary server spike, the engine automatically falls back to `gemini-3.6-flash` and `gemini-flash-latest` without interrupting synthesis.

---

### Mode C: Hybrid Mode (Offline + Online Both)
Run both Ollama locally and provide your Gemini API key in `backend/.env`.
- You can freely switch between **Offline Model** and **Online Model** via the pill toggle in the top header next to **CHITRA**.
- If offline mode is selected and Ollama is not active, a clean error alert is displayed immediately.
- If you switch model modes mid-synthesis, the active generation is aborted cleanly to prevent stale jobs.

---

## 🐍 Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd sih_try/backend
   ```

2. **Create and activate a Python virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   # On Windows (cmd/powershell):
   # venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Verify environment file (`backend/.env`):**
   ```bash
   cat << 'EOF' > .env
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
   GEMINI_MODELS=gemini-3.5-flash-lite,gemini-3.6-flash,gemini-flash-latest,gemini-flash-lite-latest
   GEMINI_IMAGE_MODELS=gemini-3.1-flash-image,gemini-3-pro-image,gemini-2.5-flash-image,gemini-3.1-flash-lite-image
   OLLAMA_BASE_URL=http://localhost:11434/v1
   OLLAMA_MODEL=qwen3:8b
   EOF
   ```

5. **Start the FastAPI backend server:**
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
   The backend API will be available at: `http://localhost:8000` (Interactive docs: `http://localhost:8000/docs`).

---

## 💻 Frontend Setup

1. **Open a new terminal and navigate to the frontend folder:**
   ```bash
   cd sih_try/frontend
   ```

2. **Install Node.js packages:**
   ```bash
   npm install
   ```

3. **Run the Next.js development server:**
   ```bash
   npm run dev
   ```
   The application UI will be accessible at: `http://localhost:3000`.

4. **(Optional) Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔍 Testing & Verification

1. **Check Backend Health:**
   ```bash
   curl http://localhost:8000/api/v1/health
   ```
   *Expected Response:*
   ```json
   {
     "status": "healthy",
     "engine": "NITROUS ENGINE (CHITRA)",
     "offline_llm": {
       "available": true,
       "model": "qwen3:8b",
       "endpoint": "http://localhost:11434/v1"
     },
     "online_llm": {
       "available": true,
       "model": "gemini-3.5-flash-lite",
       "models_chain": ["gemini-3.5-flash-lite", "gemini-3.6-flash", "gemini-flash-latest", "gemini-flash-lite-latest"]
     }
   }
   ```

2. **Test In-Browser Workflow:**
   1. Open `http://localhost:3000` in your web browser.
   2. Select **Offline Model** or **Online Model** from the Header toggle.
   3. Click the circular `+` button to expand the intake stage.
   4. Upload a document (`.pdf`, `.docx`, `.txt`) or select **Text Prompt** and type instructions.
   5. Click **Proceed**.
   6. View the interactive 3D deliverable carousel and full artifact results.

---

## 📡 API Reference

### 1. `GET /api/v1/health`
Returns system status, active models, and reachability of local and online engines.

### 2. `POST /api/v1/transform`
Transforms unstructured input into structured executive assets.

**Form Parameters:**
| Parameter | Type | Required | Description |
|---|---|---|---|
| `file` | Binary File | Optional | PDF, DOCX, or text file |
| `prompt_text` | String | Optional | Raw prompt text (if no file) |
| `model_mode` | String | Default: `"offline"` | `"offline"` (Ollama) or `"online"` (Gemini) |
| `document_type`| String | Default: `"Auto-Detect"` | Security Advisory, Incident Report, Policy, etc. |
| `tone` | String | Default: `"Executive Briefing"` | Executive Briefing, Technical Deep-Dive, Public Notice |
| `target_audience` | String | Default: `"Common Public"` | Target audience for language tailoring |
| `classification_tier` | String | Default: `"RESTRICTED"` | RESTRICTED, CONFIDENTIAL, or PUBLIC |
| `deliverable_formats` | String | Default: `"all"` | Comma-separated list of deliverables |

### 3. `GET /api/v1/download/{filename}`
Downloads generated `.pptx` presentation decks or official `.pdf` advisories.

---

## ❓ Troubleshooting & FAQ

### Q1: I get `Error: Local offline LLM (Ollama) is not reachable at http://localhost:11434`
- **Cause:** You selected **Offline Model**, but Ollama is not running on your machine.
- **Fix:** Start Ollama with `ollama serve` or switch the header toggle to **Online Model**.

### Q2: Why did `gemini-3.5-flash` return `503 UNAVAILABLE`?
- **Cause:** Google's preview servers occasionally place `gemini-3.5-flash` under temporary capacity constraints for free-tier developer keys.
- **Fix:** We configured the stable fallback chain with `gemini-3.5-flash-lite`, `gemini-3.6-flash`, and `gemini-flash-latest`, which respond with zero 503 errors.

### Q3: Port 8000 or 3000 is already in use
- Check and terminate existing processes on Linux/macOS:
  ```bash
  lsof -ti :8000 | xargs kill -9
  lsof -ti :3000 | xargs kill -9
  ```

---

Developed with ❤️ by **Team NiTRO+** | CHITRA Content Transformation Platform
