import io
import fitz  # PyMuPDF
from typing import List, Dict, Any

def extract_clean_text_from_pdf(pdf_bytes: bytes) -> List[Dict[str, Any]]:
    """Extract page-by-page clean text from PDF bytes using PyMuPDF."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages_data = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        if text.strip():
            pages_data.append({
                "page_number": page_num + 1,
                "content": text.strip()
            })
    return pages_data

def extract_text_from_docx(docx_bytes: bytes) -> List[Dict[str, Any]]:
    """Extract paragraph chunks from DOCX bytes."""
    try:
        import docx
        doc = docx.Document(io.BytesIO(docx_bytes))
        paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
        pages_data = []
        chunk_size = 5
        for i in range(0, max(len(paragraphs), 1), chunk_size):
            chunk = "\n\n".join(paragraphs[i:i+chunk_size])
            if chunk.strip():
                pages_data.append({
                    "page_number": (i // chunk_size) + 1,
                    "content": chunk.strip()
                })
        return pages_data
    except Exception:
        import zipfile
        import xml.etree.ElementTree as ET
        z = zipfile.ZipFile(io.BytesIO(docx_bytes))
        tree = ET.fromstring(z.read('word/document.xml'))
        texts = [node.text for node in tree.iter() if node.tag.endswith('t') and node.text]
        full_text = "\n".join(texts)
        return [{"page_number": 1, "content": full_text}]

def extract_text_from_file(file_bytes: bytes, filename: str) -> List[Dict[str, Any]]:
    """Generic text extractor supporting PDF, DOCX, TXT, MD."""
    ext = filename.lower().split('.')[-1]
    if ext == "pdf":
        return extract_clean_text_from_pdf(file_bytes)
    elif ext in ["docx", "doc"]:
        return extract_text_from_docx(file_bytes)
    else:
        text = file_bytes.decode("utf-8", errors="ignore")
        return [{"page_number": 1, "content": text.strip()}]
