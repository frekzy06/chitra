import os
import shutil
import time
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from api.schemas import (
    TransformResponse,
    PresentationDeckSchema,
    SecurityAdvisorySchema,
    ExecutiveSummarySchema,
    InfographicSchema,
    SocialPostsSchema,
    DocumentAnalysisMetadata
)
from services.parser import extract_text_from_file
from services.vector_store import LocalVectorMemory
from services.llm_engine import HybridBrain
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

# Initialize services
ARTIFACT_DIR = os.getenv("ARTIFACT_DIR", "/tmp/nitrous_artifacts")
os.makedirs(ARTIFACT_DIR, exist_ok=True)

memory = LocalVectorMemory()
brain = HybridBrain()
pptx_press = PPTXPrintingPress()
pdf_press = PDFPrintingPress()

@app.get("/api/v1/health")
async def health_check():
    ollama_ok = brain.offline_brain.is_available()
    gemini_ok = brain.online_brain.is_available()
    return {
        "status": "healthy",
        "engine": "NITROUS ENGINE (CHITRA)",
        "offline_llm": {
            "available": ollama_ok,
            "model": brain.offline_brain.model,
            "endpoint": brain.offline_brain.base_url
        },
        "online_llm": {
            "available": gemini_ok,
            "model": brain.online_brain.last_used_model,
            "models_chain": brain.online_brain.text_models
        }
    }

@app.post("/api/v1/transform", response_model=TransformResponse)
async def transform_document(
    file: Optional[UploadFile] = File(None),
    prompt_text: Optional[str] = Form(None),
    model_mode: str = Form("offline"),
    document_type: str = Form("Auto-Detect"),
    tone: str = Form("Executive Briefing"),
    target_audience: str = Form("Common Public"),
    classification_tier: str = Form("RESTRICTED"),
    deliverable_formats: str = Form("all")
):
    start_time = time.time()
    try:
        context_text = ""
        base_name = "Document"

        if file and file.filename:
            file_bytes = await file.read()
            if file_bytes:
                pages = extract_text_from_file(file_bytes, file.filename)
                chunks = [p["content"] for p in pages if p.get("content")]
                context_text = "\n\n".join(chunks)
                base_name = os.path.splitext(file.filename)[0].replace(" ", "_")

        if not context_text and prompt_text:
            context_text = prompt_text.strip()
            base_name = "Prompt_Analysis"

        if not context_text:
            context_text = "Security advisory: Perimeter network gateways require firmware verification and access credential rotation."

        active_brain = brain.get_brain(model_mode)

        # Document type reasoning & classification
        doc_analysis = active_brain.analyze_document_type(context_text, document_type)

        # Parse requested deliverables
        formats_list = [f.strip().lower() for f in deliverable_formats.split(",")]
        generate_all = "all" in formats_list or not formats_list

        timestamp = int(time.time())
        pptx_url = None
        pdf_url = None
        deck_structure = None
        advisory_structure = None
        exec_summary = None
        infographic_data = None
        social_posts = None

        # 1. Presentation Deck with Speaker Notes
        if generate_all or "presentation" in formats_list or "pptx" in formats_list:
            deck_structure = active_brain.generate_presentation_structure(
                context_text=context_text,
                tone=tone,
                target_audience=target_audience,
                classification_tier=classification_tier,
                doc_type=doc_analysis.detected_type
            )
            pptx_filename = f"deck_{base_name}_{timestamp}.pptx"
            pptx_path = os.path.join(ARTIFACT_DIR, pptx_filename)
            pptx_press.create_deck(deck_structure, pptx_path)
            pptx_url = f"/api/v1/download/{pptx_filename}"

        # 2. Security Advisory PDF
        if generate_all or "advisory" in formats_list or "pdf" in formats_list:
            advisory_structure = active_brain.generate_advisory_structure(
                context_text=context_text,
                classification_tier=classification_tier,
                doc_type=doc_analysis.detected_type
            )
            pdf_filename = f"advisory_{base_name}_{timestamp}.pdf"
            pdf_path = os.path.join(ARTIFACT_DIR, pdf_filename)
            pdf_press.create_advisory_pdf(advisory_structure, pdf_path)
            pdf_url = f"/api/v1/download/{pdf_filename}"

        # 3. Executive Summary
        if generate_all or "executive_summary" in formats_list:
            exec_summary = active_brain.generate_executive_summary(
                context_text=context_text,
                tone=tone
            )

        # 4. Infographic Content
        if generate_all or "infographic" in formats_list or "visual" in formats_list:
            infographic_data = active_brain.generate_infographic_data(
                context_text=context_text
            )

        # 5. Social Posts (LinkedIn & Twitter/X)
        if generate_all or "linkedin" in formats_list or "twitter" in formats_list or "social_text" in formats_list:
            social_posts = active_brain.generate_social_posts(
                context_text=context_text,
                target_audience=target_audience
            )

        elapsed = round(time.time() - start_time, 2)
        primary_title = (
            deck_structure.deck_title if deck_structure
            else (exec_summary.title if exec_summary
            else (advisory_structure.title if advisory_structure else base_name))
        )
        model_name = brain.get_active_model_name(model_mode)

        return TransformResponse(
            status="success",
            title=primary_title,
            slide_count=len(deck_structure.slides) if deck_structure else 0,
            classification_tier=classification_tier,
            pptx_download_url=pptx_url,
            pdf_download_url=pdf_url,
            deck_structure=deck_structure,
            advisory_structure=advisory_structure,
            executive_summary=exec_summary,
            infographic=infographic_data,
            social_posts=social_posts,
            analysis_metadata=doc_analysis,
            processing_time_seconds=elapsed,
            model_used=model_name,
            model_mode=model_mode
        )

    except Exception as e:
        err_msg = str(e)
        if not err_msg.startswith("Error:"):
            err_msg = f"Error: {err_msg}"
        status_code = 503 if "not reachable" in err_msg or "Ollama" in err_msg else 500
        raise HTTPException(status_code=status_code, detail=err_msg)


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
