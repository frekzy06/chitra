# Fact Document - Backend Architecture & Workflow

## 1. System Overview & Air-Gapped Operation
The backend operates 100% locally with zero external internet dependencies or public cloud API calls:
- Ingestion, OCR & PDF parsing: Local PyMuPDF (`fitz`) and `python-docx`
- Vector Embeddings: Local `BAAI/bge-small-en-v1.5` embeddings
- Vector Storage: Local embedded `Qdrant` client (`./qdrant_data`)
- LLM Inference: Local **Ollama** endpoint (`http://localhost:11434/v1`) running model `qwen3:8b` (configured in `AirGappedBrain`)
- Slide Synthesis: `python-pptx` generating 16:9 widescreen presentation decks
- PDF Synthesis: `ReportLab` drawing publication-ready CERT-In / NCIIPC style security advisories

## 2. Directory Structure
```
backend/
├── main.py                     # FastAPI application & REST endpoints
├── api/
│   └── schemas.py              # Pydantic models (PresentationDeckSchema, SecurityAdvisorySchema, SocialPostsSchema, TransformResponse)
├── services/
│   ├── parser.py               # Document text extractor (PDF, DOCX, TXT)
│   ├── vector_store.py         # Qdrant client & SentenceTransformers
│   ├── llm_engine.py           # AirGappedBrain calling local Ollama (qwen3:8b) with plain-language generation
│   └── generators/
│       ├── pptx_generator.py   # PPTXPrintingPress (python-pptx engine)
│       └── pdf_generator.py    # PDFPrintingPress (ReportLab engine)
└── requirements.txt            # Python dependencies
```

## 3. Endpoints
- `GET /api/v1/health`: Checks offline engine status, active model, and Ollama endpoint.
- `POST /api/v1/transform`: Receives `file`, `tone`, `target_audience`, `classification_tier`, `deliverable_format` (supports `all`, `social_text`, `pptx`, `pdf`). Returns slide deck, simplified advisory, and Instagram/LinkedIn/Twitter text.
- `GET /api/v1/download/{filename}`: Streams generated `.pptx` or `.pdf` files.


## 4. How to Run Backend Locally
```bash
# 1. Start Ollama with the installed qwen3:8b model (in a separate terminal)
ollama run qwen3:8b

# 2. Install backend dependencies & start FastAPI
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Runs at `http://localhost:8000`.
API documentation is available at `http://localhost:8000/docs`.
