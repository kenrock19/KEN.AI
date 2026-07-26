import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {
  const [chatNumber, setChatNumber] = useState(1);

  function startNewChat() {
    setChatNumber((current) => current + 1);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar onNewChat={startNewChat} />

      <ChatWindow key={chatNumber} />
    </div>
  );
}

export default Chat;