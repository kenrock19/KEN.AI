function Sidebar({ onNewChat }) {
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

      <ul>
        <li>Power BI Dashboard</li>
        <li>School Assignment</li>
        <li>Weekly Report</li>
      </ul>
    </div>
  );
}

export default Sidebar;
