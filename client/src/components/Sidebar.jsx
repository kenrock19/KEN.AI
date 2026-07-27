function Sidebar({
  onNewChat,
  conversations,
  onSelectChat,
  onDeleteChat,
}) {
  return (
    <div
      style={{
        width: "280px",
        background: "#081426",
        color: "white",
        padding: "20px",
      }}
    >
      <h2>KEN.AI</h2>

      <button
  onClick={onNewChat}
  style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
        }}
      >
        + New Chat
      </button>

      <hr />

      <h3>Today's Chats</h3>

<ul style={{ listStyle: "none", padding: 0 }}>
  {conversations.map((chat) => (
    <li
      key={chat.id}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: "8px 0",
      }}
    >
      <span
        onClick={() => onSelectChat(chat.id)}
        style={{
          flex: 1,
          cursor: "pointer",
        }}
      >
        {chat.title}
      </span>

      <button
        type="button"
        onClick={() => onDeleteChat(chat.id)}
        title="Delete chat"
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        🗑️
      </button>
    </li>
  ))}
</ul>
    </div>
  );
}

export default Sidebar;
