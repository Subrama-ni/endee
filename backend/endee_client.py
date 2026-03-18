import requests

ENDEE_URL = "http://127.0.0.1:8001"

def insert_vector(vector, metadata):
    response = requests.post(f"{ENDEE_URL}/insert", json={
        "vector": vector,
        "metadata": metadata
    })
    return response.json()

def search_vector(query_vector, top_k=3):
    response = requests.post(f"{ENDEE_URL}/search", json={
        "vector": query_vector,
        "top_k": top_k
    })
    return response.json()