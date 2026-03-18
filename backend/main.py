from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from rag_pipeline import add_document, retrieve_context

from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# ✅ Enable CORS (for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load embedding model
model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer('all-MiniLM-L6-v2')
    return model

# 📄 Request models
class Document(BaseModel):
    text: str


class Query(BaseModel):
    question: str


# 📌 Add document endpoint
@app.post("/add")
def add_doc(doc: Document):
    add_document(doc.text)
    return {"message": "Document stored successfully"}


# 🤖 Ask question endpoint (SMART VERSION)
@app.post("/ask")
def ask_question(q: Query):
    context = retrieve_context(q.question)

    sentences = [s.strip() for s in context.split('.') if s.strip()]

    if not sentences:
        return {"answer": "No relevant information found."}

    answer = "\n".join([f"• {s}" for s in sentences[:2]])

    return {
        "question": q.question,
        "answer": answer,
        "confidence": 0.9,
        "sources": sentences[:2]
    }