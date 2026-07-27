import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(1);

  function updateChat(title, messages) {
    setConversations((previous) => {
      const existing = previous.find((c) => c.id === currentChat);

      if (existing) {
        return previous.map((c) =>
          c.id === currentChat
            ? { ...c, title, messages }
            : c
        );
      }

      return [
        ...previous,
        {
          id: currentChat,
          title,
          messages,
        },
      ];
    });
  }

  function startNewChat() {
    setCurrentChat((current) => current + 1);
  }

  const activeChat =
    conversations.find((c) => c.id === currentChat) || {
      title: "",
      messages: [],
    };
function deleteChat(id) {
  const updated = conversations.filter((chat) => chat.id !== id);

  setConversations(updated);

  if (updated.length > 0) {
    setCurrentChat(updated[0].id);
  } else {
    setCurrentChat(1);
    setCurrentTitle("");
  }
}
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
  conversations={conversations}
  onNewChat={startNewChat}
  onSelectChat={setCurrentChat}
  onDeleteChat={deleteChat}
/>

      <ChatWindow
        chatId={currentChat}
        initialMessages={activeChat.messages}
        setChatTitle={(title, messages) =>
          updateChat(title, messages)
        }
      />
    </div>
  );
}

export default Chat;