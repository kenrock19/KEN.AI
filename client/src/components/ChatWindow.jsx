import { useEffect, useState } from "react";
import Message from "./Message";

function ChatWindow({
  chatId,
  initialMessages = [],
  setChatTitle,
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMessages(initialMessages || []);
    setInput("");
  }, [chatId, initialMessages]);

  async function sendMessage() {
    const currentInput = input.trim();

    if (!currentInput || isLoading) {
  return;
}

    const userMessage = {
      sender: "You",
      text: currentInput,
    };

    const title =
      messages.find((message) => message.sender === "You")?.text ||
      currentInput;

    const messagesWithThinking = [
      ...messages,
      userMessage,
      {
        sender: "KEN.AI",
        text: "Thinking...",
      },
    ];

    setMessages(messagesWithThinking);
    setChatTitle?.(title, messagesWithThinking);
    setInput("");
    setIsLoading(true);

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
        throw new Error(
          data.error || "KEN.AI could not answer."
        );
      }

      setMessages((previous) => {
        const updated = [...previous];

        updated[updated.length - 1] = {
          sender: "KEN.AI",
          text: data.reply,
        };

        setChatTitle?.(title, updated);
        return updated;
      });
    } catch (error) {
      setMessages((previous) => {
        const updated = [...previous];

        updated[updated.length - 1] = {
          sender: "KEN.AI",
          text:
            error.message ||
            "Unable to connect to the KEN.AI server.",
        };

        setChatTitle?.(title, updated);
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }

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
        {messages.map((message, index) => (
  <Message
    key={`${message.sender}-${index}`}
    sender={message.sender}
    text={message.text}
  />
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
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask KEN.AI anything..."
          rows={1}
          disabled={isLoading}
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
          disabled={isLoading}
          style={{
            marginLeft: "15px",
            padding: "15px 25px",
            borderRadius: "10px",
            background: "#2d8cff",
            color: "white",
            border: "none",
            cursor: isLoading ? "wait" : "pointer",
            opacity: isLoading ? 0.65 : 1,
          }}
        >
          {isLoading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
