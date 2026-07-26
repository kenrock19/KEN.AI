function Sidebar({ onNewChat, conversations }) {
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
        padding: "8px 0",
        cursor: "pointer",
      }}
    >
      {chat.title}
    </li>
  ))}
</ul>
    </div>
  );
}

export default Sidebar;
