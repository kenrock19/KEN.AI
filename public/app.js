const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message");
const chat = document.getElementById("chat");
const sendButton = document.getElementById("send-button");

function addMessage(text, type, options = {}) {
  const message = document.createElement("div");

  message.className = `message ${type}-message`;

  if (options.typing) {
    message.classList.add("typing");
  }

  if (options.error) {
    message.classList.add("error-message");
  }

  const label = document.createElement("div");
  label.className = "message-label";
  label.textContent = type === "user" ? "You" : "KEN.AI";

  const body = document.createElement("div");
  body.className = "message-body";
  body.textContent = text;

  message.append(label, body);
  chat.appendChild(message);

  chat.scrollTop = chat.scrollHeight;

  return message;
}

function resizeTextarea() {
  messageInput.style.height = "auto";
  messageInput.style.height =
    `${Math.min(messageInput.scrollHeight, 170)}px`;
}

messageInput.addEventListener("input", resizeTextarea);

messageInput.addEventListener("keydown", (event) => {
  if (
    event.key === "Enter" &&
    !event.shiftKey
  ) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  addMessage(message, "user");

  messageInput.value = "";
  resizeTextarea();

  sendButton.disabled = true;
  messageInput.disabled = true;

  const typingMessage = addMessage(
    "Thinking...",
    "assistant",
    { typing: true }
  );

  try {
    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    typingMessage.remove();

    if (!response.ok) {
      throw new Error(
        data.error || "KEN.AI could not answer."
      );
    }

    addMessage(data.reply, "assistant");
  } catch (error) {
    typingMessage.remove();

    addMessage(
      error.message ||
        "KEN.AI could not connect to the server.",
      "assistant",
      { error: true }
    );
  } finally {
    sendButton.disabled = false;
    messageInput.disabled = false;

    messageInput.focus();
  }
});

messageInput.focus();
