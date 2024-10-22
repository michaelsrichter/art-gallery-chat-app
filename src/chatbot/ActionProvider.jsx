// in ActionProvider.jsx
import React from "react";
import { marked } from "marked";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage("Hello. Nice to meet you.");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const callAssistant = (message) => {
    // Get threadId from sessionStorage
    const threadId = sessionStorage.getItem("threadId");
    let url = "/api/art-assistant";

    if (threadId && threadId.trim() !== "") {
      url += `?threadId=${encodeURIComponent(threadId.trim())}`;
    }

    // HTTP call to the backend
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: message,
    })
      .then((response) => response.text())
      .then((data) => {
        const [threadId, content] = data.split("--START--");
        const htmlContent = marked.parse(content.trim());
        console.log(threadId)
        sessionStorage.setItem("threadId", threadId.trim());

        const botMessage = createChatBotMessage(
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        );
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      });
  };

  // Put the handleHello function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            callAssistant,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
