from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from rag_pipeline import add_document, retrieve_context

app = FastAPI()

# ✅ Enable CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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


# 🤖 Ask question endpoint (LIGHTWEIGHT RAG)
@app.post("/ask")
def ask_question(q: Query):
    context = retrieve_context(q.question)

    # Split into sentences
    sentences = [s.strip() for s in context.split('.') if s.strip()]

    if not sentences:
        return {
            "question": q.question,
            "answer": "No relevant information found.",
            "confidence": 0,
            "sources": []
        }

    # Select top 2 relevant sentences
    selected = sentences[:2]

    # Format answer
    answer = "\n".join([f"• {s}" for s in selected])

    return {
        "question": q.question,
        "answer": answer,
        "confidence": 0.9,
        "sources": selected
    }


# 🏠 Root endpoint (for quick testing)
@app.get("/")
def home():
    return {"message": "AI Knowledge Assistant is running 🚀"}