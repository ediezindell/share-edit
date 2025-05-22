const ws = new WebSocket("ws://localhost:8789");

const isInputElement = (el) => {
  return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
};

const isEditable = (el) => {
  return el.getAttribute("contenteditable") === "true";
};

ws.addEventListener("open", () => {
  const sendContent = (e) => {
    const el = e.target;
    if (isInputElement(el) || isEditable(el)) {
      const content = el.value || el.innerText || "";
      ws.send(
        JSON.stringify({
          type: "focus",
          content: content,
        }),
      );
    }
  };
  document.addEventListener("focusin", sendContent);
  document.addEventListener("keyup", sendContent);
});

ws.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "update") {
    console.log("update", data);
    const el = document.activeElement;
    if (!el) return;
    if (isInputElement(el)) {
      el.value = data.content;
    } else if (isEditable(el)) {
      el.innerText = data.content;
    }
  }
});
console.log("Content script loaded");
