import os
import shutil
import time
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from api.schemas import TransformResponse, PresentationDeckSchema, SecurityAdvisorySchema
from services.parser import extract_text_from_file
from services.vector_store import LocalVectorMemory
from services.llm_engine import AirGappedBrain
from services.generators.pptx_generator import PPTXPrintingPress
from services.generators.pdf_generator import PDFPrintingPress

app = FastAPI(
    title="CHITRA",
    description="Made by NiTRO",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialize offline services
ARTIFACT_DIR = os.getenv("ARTIFACT_DIR", "/tmp/nitrous_artifacts")
os.makedirs(ARTIFACT_DIR, exist_ok=True)

memory = LocalVectorMemory()
brain = AirGappedBrain()
pptx_press = PPTXPrintingPress()
pdf_press = PDFPrintingPress()

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "engine": "NITROUS ENGINE (CHITRA)",
        "air_gapped": True,
        "active_model": brain.model,
        "ollama_endpoint": brain.base_url
    }

@app.post("/api/v1/transform", response_model=TransformResponse)
async def transform_document(
    file: UploadFile = File(...),
    tone: str = Form("Executive Briefing"),
    target_audience: str = Form("Common Public"),
    classification_tier: str = Form("RESTRICTED"),
    deliverable_format: str = Form("all")  # pptx, pdf, social_text, all, both
):
    start_time = time.time()
    try:
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        # 1. Reading Room: Ingestion & Text Extraction
        pages = extract_text_from_file(file_bytes, file.filename)
        chunks = [p["content"] for p in pages if p.get("content")]
        if not chunks:
            chunks = ["Threat Intelligence Advisory: No extractable text detected."]

        # 2. Reading Room: Local Vector Memory Ingestion & Retrieval
        memory.ingest_chunks(chunks)
        context = memory.retrieve_context(
            query="critical findings, threat actors, vulnerabilities, impact, indicators of compromise, mitigation steps",
            top_k=4
        )

        base_name = os.path.splitext(file.filename)[0].replace(" ", "_")
        timestamp = int(time.time())
        pptx_url = None
        pdf_url = None
        deck_structure = None
        advisory_structure = None
        social_posts = None

        # 3. Slide Deck Generation
        if deliverable_format in ["pptx", "both", "all"]:
            deck_structure = brain.generate_presentation_structure(
                context_text=context,
                tone=tone,
                target_audience=target_audience,
                classification_tier=classification_tier
            )
            pptx_filename = f"deck_{base_name}_{timestamp}.pptx"
            pptx_path = os.path.join(ARTIFACT_DIR, pptx_filename)
            pptx_press.create_deck(deck_structure, pptx_path)
            pptx_url = f"/api/v1/download/{pptx_filename}"

        # 4. PDF Security Advisory Generation
        if deliverable_format in ["pdf", "both", "all"]:
            advisory_structure = brain.generate_advisory_structure(
                context_text=context,
                classification_tier=classification_tier
            )
            pdf_filename = f"advisory_{base_name}_{timestamp}.pdf"
            pdf_path = os.path.join(ARTIFACT_DIR, pdf_filename)
            pdf_press.create_advisory_pdf(advisory_structure, pdf_path)
            pdf_url = f"/api/v1/download/{pdf_filename}"

        # 5. Social Media Text Posts Generation
        if deliverable_format in ["social_text", "all", "both"]:
            social_posts = brain.generate_social_posts(
                context_text=context,
                target_audience=target_audience
            )

        elapsed = round(time.time() - start_time, 2)

        return TransformResponse(
            status="success",
            title=deck_structure.deck_title if deck_structure else (advisory_structure.title if advisory_structure else base_name),
            slide_count=len(deck_structure.slides) if deck_structure else 0,
            classification_tier=classification_tier,
            pptx_download_url=pptx_url,
            pdf_download_url=pdf_url,
            deck_structure=deck_structure,
            advisory_structure=advisory_structure,
            social_posts=social_posts,
            processing_time_seconds=elapsed
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transformation error: {str(e)}")

@app.get("/api/v1/download/{filename}")
async def download_artifact(filename: str):
    file_path = os.path.join(ARTIFACT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Requested artifact not found.")

    if filename.endswith(".pptx"):
        media_type = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    elif filename.endswith(".pdf"):
        media_type = "application/pdf"
    else:
        media_type = "application/octet-stream"

    return FileResponse(file_path, media_type=media_type, filename=filename)
