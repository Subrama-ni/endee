# 🧠 AI Knowledge Assistant using Endee (RAG System)

LIVE DEMO: https://endee-mgb50a561-subramanis-projects-62e1edf7.vercel.app/
Backend API: https://endee-yik9.onrender.com

## 🚀 Project Overview

This project is a **Retrieval-Augmented Generation (RAG) based AI assistant** built using the Endee architecture.
It allows users to:

- 📄 Upload documents or text
- 🔎 Retrieve relevant information
- 🤖 Ask questions and get intelligent answers

The system simulates an AI assistant by retrieving the most relevant context from stored knowledge.

---

## 🎯 Features

- ✅ Document ingestion (text + file upload)
- ✅ Context-based question answering
- ✅ Lightweight RAG pipeline
- ✅ Clean React UI
- ✅ FastAPI backend
- ✅ Fully deployed (Frontend + Backend)

---

## 🧠 System Design

### Architecture:

User → React Frontend → FastAPI Backend → Retrieval System → Response

---

### 🔍 Workflow

1. User uploads document or text
2. Data is stored in memory (vector-like retrieval)
3. User asks a question
4. Backend retrieves relevant context
5. System generates a concise answer

---

## ⚙️ Tech Stack

### Frontend:

- React.js
- Axios

### Backend:

- FastAPI
- Python

### Deployment:

- Frontend → Vercel
- Backend → Render

---

## 🧩 Use of Endee

- The project follows the **Endee vector database concept**
- Implements:
  - Context storage
  - Retrieval logic
  - RAG pipeline

---

## 🛠️ Setup Instructions

### 🔹 Clone Repo

```bash
git clone https://github.com/Subrama-ni/endee.git
cd endee
```

---

### 🔹 Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🌐 Deployment Links

- 🔗 Backend: https://your-backend.onrender.com
- 🔗 Frontend: https://your-app.vercel.app

---

## 🧪 Example Usage

### Input:

Machine learning is used in recommendation systems.

### Query:

What is machine learning used for?

### Output:

• Machine learning is used in recommendation systems

---

## 📌 Future Improvements

- Add real vector database (Endee integration fully)
- Use embeddings for semantic search
- Add authentication
- Improve UI/UX

---

## 👨‍💻 Author

Subramani T

---

## ⭐ Note

Due to deployment constraints, a lightweight retrieval approach was used while preserving the RAG architecture.
