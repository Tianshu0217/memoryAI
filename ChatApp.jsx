import { useState, useEffect } from "react";

export default function ChatApp() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setNickname(savedNickname);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, message }),
    });
    const data = await response.json();
    setChatHistory([...chatHistory, { user: nickname, text: message }, { user: "Bot", text: data.reply }]);
    setMessage("");
  };

  return (
    <div className="chat-container">
      {!nickname ? (
        <div>
          <input type="text" placeholder="Enter your nickname" onChange={(e) => setNickname(e.target.value)} />
          <button onClick={() => localStorage.setItem("nickname", nickname)}>Start Chat</button>
        </div>
      ) : (
        <div>
          <div className="chat-box">
            {chatHistory.map((msg, index) => (
              <p key={index}><strong>{msg.user}:</strong> {msg.text}</p>
            ))}
          </div>
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}