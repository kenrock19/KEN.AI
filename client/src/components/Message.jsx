import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Message({ sender, text }) {
  return (
    <div
      style={{
        marginBottom: "20px",
        background: "#183763",
        padding: "15px",
        borderRadius: "10px",
        lineHeight: 1.6,
        color: "white",
      }}
    >
      <strong>{sender}</strong>

      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default Message;