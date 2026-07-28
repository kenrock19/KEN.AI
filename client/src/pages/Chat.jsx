import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const savedTitles = useRef({});

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadMessages(conversationId) {
    const response = await fetch(
      `/api/conversations/${conversationId}/messages`
    );

    if (!response.ok) {
      throw new Error("Unable to load chat messages.");
    }

    return response.json();
  }

  async function createNewConversation() {
    const response = await fetch("/api/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New Chat",
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to create a new chat.");
    }

    const conversation = await response.json();

    savedTitles.current[conversation.id] =
      conversation.title;

    return {
      ...conversation,
      messages: [],
    };
  }

  async function loadConversations() {
    try {
      const response = await fetch("/api/conversations");

      if (!response.ok) {
        throw new Error("Unable to load conversations.");
      }

      const savedConversations = await response.json();

      if (savedConversations.length === 0) {
        const newConversation =
          await createNewConversation();

        setConversations([newConversation]);
        setCurrentChat(newConversation.id);
        return;
      }

      savedConversations.forEach((conversation) => {
        savedTitles.current[conversation.id] =
          conversation.title;
      });

      const firstConversation = savedConversations[0];

      const firstMessages = await loadMessages(
        firstConversation.id
      );

      const conversationsWithMessages =
        savedConversations.map((conversation) => ({
          ...conversation,
          messages:
            conversation.id === firstConversation.id
              ? firstMessages
              : [],
        }));

      setConversations(conversationsWithMessages);
      setCurrentChat(firstConversation.id);
    } catch (error) {
      console.error("Conversation loading error:", error);
    }
  }

  async function startNewChat() {
    try {
      const newConversation =
        await createNewConversation();

      setConversations((previous) => [
        newConversation,
        ...previous,
      ]);

      setCurrentChat(newConversation.id);
    } catch (error) {
      console.error("New chat error:", error);
    }
  }

  async function selectChat(id) {
    try {
      const messages = await loadMessages(id);

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                messages,
              }
            : conversation
        )
      );

      setCurrentChat(id);
    } catch (error) {
      console.error("Chat selection error:", error);
    }
  }

  function updateChat(title, messages) {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation.id === currentChat
          ? {
              ...conversation,
              title,
              messages,
            }
          : conversation
      )
    );

    if (
      title &&
      savedTitles.current[currentChat] !== title
    ) {
      savedTitles.current[currentChat] = title;

      fetch(`/api/conversations/${currentChat}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      }).catch((error) => {
        console.error("Title update error:", error);
      });
    }
  }

  async function deleteChat(id) {
    try {
      const response = await fetch(
        `/api/conversations/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete the chat.");
      }

      const remaining = conversations.filter(
        (conversation) => conversation.id !== id
      );

      delete savedTitles.current[id];

      if (remaining.length === 0) {
        const newConversation =
          await createNewConversation();

        setConversations([newConversation]);
        setCurrentChat(newConversation.id);
        return;
      }

      setConversations(remaining);

      if (currentChat === id) {
        await selectChat(remaining[0].id);
      }
    } catch (error) {
      console.error("Delete chat error:", error);
    }
  }

  const activeChat =
    conversations.find(
      (conversation) => conversation.id === currentChat
    ) || {
      id: currentChat,
      title: "",
      messages: [],
    };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
      }}
    >
      <Sidebar
        conversations={conversations}
        onNewChat={startNewChat}
        onSelectChat={selectChat}
        onDeleteChat={deleteChat}
      />

      {currentChat !== null && (
        <ChatWindow
          chatId={currentChat}
          initialMessages={activeChat.messages}
          setChatTitle={(title, messages) =>
            updateChat(title, messages)
          }
        />
      )}
    </div>
  );
}

export default Chat;