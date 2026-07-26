import { useState } from "react";

function ChatWindow() {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = {
    sender: "You",
    text: input,
  };

  setMessages((prev) => [...prev, userMessage]);

setMessages((prev) => [
  ...prev,
  {
    sender: "KEN.AI",
    text: "Thinking...",
  },
]);

  const currentInput = input;
  setInput("");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: currentInput,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "KEN.AI could not answer.");
    }

    setMessages((prev) => {
  const updated = [...prev];

  updated[updated.length - 1] = {
    sender: "KEN.AI",
    text: data.reply,
  };

  return updated;
});
  } catch (error) {
  setMessages((prev) => {
    const updated = [...prev];

    updated[updated.length - 1] = {
      sender: "KEN.AI",
      text: error.message || "Unable to connect to server.",
    };

    return updated;
  });
}
};

  return (
    <div
      style={{
        flex: 1,
        background: "#09182e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: "30px",
          fontSize: "28px",
          fontWeight: "bold",
        }}
      >
        KEN.AI Chat
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "25px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: "20px",
              background: "#183763",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <strong>{msg.sender}</strong>

            <br />

            {msg.text}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          padding: "20px",
          borderTop: "1px solid #1b2e4b",
        }}
      >
        <textarea
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }}
    placeholder="Ask KEN.AI anything..."
    rows={1}
    style={{
        flex: 1,
        padding: "15px",
        borderRadius: "10px",
        border: "none",
        fontSize: "16px",
        resize: "none",
        minHeight: "50px",
    }}
/>

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "15px",
            padding: "15px 25px",
            borderRadius: "10px",
            background: "#2d8cff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;