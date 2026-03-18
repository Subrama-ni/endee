import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [doc, setDoc] = useState("");
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Add manual text
  const addDocument = async () => {
    if (!doc.trim()) return;

    await axios.post("https://endee-yik9.onrender.com/add", { text: doc });
    alert("Knowledge added!");
    setDoc("");
  };

  // File upload with chunking
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const chunks = text.split(".");

    for (let chunk of chunks) {
      if (chunk.trim().length > 20) {
        await axios.post("https://endee-yik9.onrender.com/add", {
          text: chunk.trim(),
        });
      }
    }

    alert("File uploaded and processed!");
  };

  // Ask question
  const askQuestion = async () => {
    if (!question.trim()) return;

    const newChat = [...chat, { type: "user", text: question }];
    setChat(newChat);
    setQuestion("");
    setLoading(true);

    try {
      const res = await axios.post("https://endee-yik9.onrender.com/ask", {
        question,
      });

      const botMessage = {
        type: "bot",
        text: res.data.answer,
        confidence: res.data.confidence,
        sources: res.data.sources,
      };

      simulateTyping(botMessage, newChat);
    } catch {
      setChat([...newChat, { type: "bot", text: "Error fetching response." }]);
    }

    setLoading(false);
  };

  // Typing animation
  const simulateTyping = (message, currentChat) => {
    let i = 0;
    let temp = "";

    const interval = setInterval(() => {
      temp += message.text[i];

      setChat([
        ...currentChat,
        {
          ...message,
          text: temp,
        },
      ]);

      i++;
      if (i >= message.text.length) clearInterval(interval);
    }, 15);
  };

  // Highlight keywords
  const highlight = (text) => {
    if (!question) return text;

    let highlighted = text;
    const words = question.split(" ");

    words.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlighted = highlighted.replace(regex, `<mark>$1</mark>`);
    });

    return highlighted;
  };

  const clearChat = () => setChat([]);

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <h1 style={styles.title}>🤖 AI Knowledge Assistant</h1>

        {/* Knowledge Input */}
        <div style={styles.section}>
          <textarea
            placeholder="Paste knowledge..."
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
            style={styles.textarea}
          />

          <div style={styles.row}>
            <button onClick={addDocument} style={styles.primaryBtn}>
              Add Knowledge
            </button>

            <input type="file" onChange={handleFile} style={styles.file} />
          </div>
        </div>

        {/* Chat Box */}
        <div style={styles.chatContainer}>
          {chat.map((msg, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                background:
                  msg.type === "user"
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : "#334155",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: highlight(msg.text),
                }}
              />

              {/* Confidence */}
              {msg.type === "bot" && msg.confidence && (
                <div style={styles.confidence}>
                  Confidence: {msg.confidence}
                </div>
              )}

              {/* Sources */}
              {msg.type === "bot" && msg.sources && (
                <div style={styles.sources}>
                  <b>Sources:</b>
                  <ul>
                    {msg.sources.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {loading && <div style={styles.loading}>Typing...</div>}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <div style={styles.inputContainer}>
          <input
            placeholder="Ask something..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={styles.input}
          />

          <button onClick={askQuestion} style={styles.primaryBtn}>
            Send
          </button>

          <button onClick={clearChat} style={styles.clearBtn}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  app: {
    background: "#020617",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },
  container: {
    width: "100%",
    maxWidth: "650px",
    background: "#0f172a",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    color: "white",
  },
  title: {
    textAlign: "center",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  textarea: {
    width: "100%",
    height: "70px",
    borderRadius: "10px",
    padding: "10px",
    border: "none",
    outline: "none",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  file: {
    color: "white",
  },
  chatContainer: {
    height: "320px",
    overflowY: "auto",
    background: "#1e293b",
    borderRadius: "10px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "75%",
    wordWrap: "break-word",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },
  primaryBtn: {
    padding: "10px 15px",
    borderRadius: "10px",
    background: "#22c55e",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  clearBtn: {
    padding: "10px 15px",
    borderRadius: "10px",
    background: "#ef4444",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  loading: {
    fontStyle: "italic",
    opacity: 0.6,
  },
  confidence: {
    fontSize: "12px",
    marginTop: "5px",
    opacity: 0.7,
  },
  sources: {
    fontSize: "12px",
    marginTop: "5px",
    opacity: 0.8,
  },
};

export default App;
