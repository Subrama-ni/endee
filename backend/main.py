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
        return {"answer": "No relevant information found.", "confidence": 0, "sources": []}

    question_embedding = get_model().encode(...)(q.question, convert_to_tensor=True)
    sentence_embeddings = get_model().encode(...)(sentences, convert_to_tensor=True)

    scores = util.cos_sim(question_embedding, sentence_embeddings)[0]

    question_words = set(q.question.lower().split())

    ranked = []

    for i, sentence in enumerate(sentences):
        score = scores[i].item()

        sentence_words = set(sentence.lower().split())
        keyword_overlap = len(question_words & sentence_words)

        penalty = -0.2 if len(sentence.split()) < 5 else 0

        final_score = score + (0.1 * keyword_overlap) + penalty

        ranked.append((final_score, sentence))

    ranked.sort(reverse=True, key=lambda x: x[0])

    # Select top diverse sentences
    selected = []
    used_words = set()

    for score, sentence in ranked:
        words = set(sentence.lower().split())

        if len(words & used_words) < 3:
            selected.append(sentence)
            used_words.update(words)

        if len(selected) == 3:
            break

    # Confidence score (average of top scores)
    confidence = round(sum([r[0] for r in ranked[:3]]) / 3, 2)

    # Format as bullet points
    answer = "\n".join([f"• {s}" for s in selected])

    return {
        "question": q.question,
        "answer": answer,
        "confidence": confidence,
        "sources": selected
    }