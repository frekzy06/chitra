import uuid
from typing import List
import os

class LocalVectorMemory:
    def __init__(self, storage_path: str = "./qdrant_data"):
        self.storage_path = storage_path
        self.collection_name = "active_advisory"
        self.chunks: List[str] = []
        self._init_backend()

    def _init_backend(self):
        try:
            from qdrant_client import QdrantClient
            from qdrant_client.models import Distance, VectorParams
            from sentence_transformers import SentenceTransformer
            
            os.makedirs(self.storage_path, exist_ok=True)
            self.client = QdrantClient(path=self.storage_path)
            
            # Prioritize local offline cached model first
            try:
                self.embedder = SentenceTransformer("BAAI/bge-small-en-v1.5", local_files_only=True)
            except Exception:
                try:
                    self.embedder = SentenceTransformer("BAAI/bge-small-en-v1.5")
                except Exception:
                    self.embedder = None
            
            self.has_qdrant = self.client is not None and self.embedder is not None
            
            if self.has_qdrant:
                try:
                    self.client.recreate_collection(
                        collection_name=self.collection_name,
                        vectors_config=VectorParams(size=384, distance=Distance.COSINE),
                    )
                except Exception:
                    pass
        except Exception:
            # Fallback lightweight memory for instant resilience
            self.client = None
            self.embedder = None
            self.has_qdrant = False

    def ingest_chunks(self, text_chunks: List[str]):
        self.chunks = [c.strip() for c in text_chunks if c.strip()]
        if not self.chunks:
            return

        if self.has_qdrant and self.embedder:
            try:
                from qdrant_client.models import PointStruct
                points = []
                embeddings = self.embedder.encode(self.chunks)
                for idx, (chunk, emb) in enumerate(zip(self.chunks, embeddings)):
                    points.append(PointStruct(
                        id=str(uuid.uuid4()),
                        vector=emb.tolist(),
                        payload={"text": chunk}
                    ))
                self.client.upsert(collection_name=self.collection_name, points=points)
                return
            except Exception:
                pass

    def retrieve_context(self, query: str, top_k: int = 4) -> str:
        if not self.chunks:
            return ""

        if self.has_qdrant and self.embedder:
            try:
                query_vector = self.embedder.encode(query).tolist()
                search_results = self.client.search(
                    collection_name=self.collection_name,
                    query_vector=query_vector,
                    limit=min(top_k, len(self.chunks))
                )
                if search_results:
                    return "\n\n---\n\n".join([hit.payload["text"] for hit in search_results if "text" in hit.payload])
            except Exception:
                pass

        # Robust keyword / slice retrieval fallback
        selected = self.chunks[:top_k]
        return "\n\n---\n\n".join(selected)
