import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ✅ Use the env var
  const API = process.env.REACT_APP_BACKEND_URL;

  // Fetch messages
  useEffect(() => {
    axios.get(`${API}/api/messages`).then(res => {
      setMessages(res.data);
    }).catch(err => {
      console.error("Error fetching messages:", err);
    });
  }, [API]);

  // Add message
  const addMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${API}/api/messages`, { text: input });
      setMessages([...messages, res.data]);
      setInput("");
    } catch (err) {
      console.error("Error posting message:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📩 MERN Message Board</h1>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={addMessage}>Send</button>

      <ul>
        {messages.map(m => (
          <li key={m._id}>{m.text}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
