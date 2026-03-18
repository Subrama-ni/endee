from sentence_transformers import SentenceTransformer
from endee_client import insert_vector, search_vector

model = SentenceTransformer('all-MiniLM-L6-v2')


def add_document(text):
    embedding = model.encode(text).tolist()
    insert_vector(embedding, {"text": text})


def retrieve_context(query):
    query_embedding = model.encode(query).tolist()
    results = search_vector(query_embedding, top_k=3)

    if not results or "results" not in results:
        return ""

    texts = []

    for item in results["results"]:
        if "metadata" in item and "text" in item["metadata"]:
            texts.append(item["metadata"]["text"])

    return " ".join(texts)