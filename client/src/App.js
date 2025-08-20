import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Fetch messages
  useEffect(() => {
    axios.get("http://localhost:5000/api/messages").then(res => {
      setMessages(res.data);
    });
  }, []);

  // Add message
  const addMessage = async () => {
    if (!input.trim()) return;
    const res = await axios.post("http://localhost:5000/api/messages", { text: input });
    setMessages([...messages, res.data]);
    setInput("");
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
