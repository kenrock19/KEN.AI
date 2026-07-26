import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(1);
  const [currentTitle, setCurrentTitle] = useState("");

  function startNewChat() {
    if (currentTitle.trim()) {
      setConversations((previous) => [
        ...previous,
        {
          id: currentChat,
          title: currentTitle,
        },
      ]);
    }

    localStorage.removeItem("kenai-current-chat");

    setCurrentTitle("");
    setCurrentChat((current) => current + 1);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        onNewChat={startNewChat}
        conversations={conversations}
      />

      <ChatWindow
        key={currentChat}
        setChatTitle={setCurrentTitle}
      />
    </div>
  );
}

export default Chat;