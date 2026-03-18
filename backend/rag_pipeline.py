documents = []

def add_document(text):
    documents.append(text)

def retrieve_context(query):
    results = []

    for doc in documents:
        if any(word.lower() in doc.lower() for word in query.split()):
            results.append(doc)

    return " ".join(results[:3])