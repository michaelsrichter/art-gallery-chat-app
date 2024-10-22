// in ActionProvider.jsx
import React from "react";
import { marked } from "marked";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const updateLastMessage = (message) => {
    setState((prev) => {
      return {
        ...prev,
        messages: [
          ...prev.messages.slice(0, -1),
          { ...prev.messages.at(-1), message },
        ],
      };
    });
  };

  const manipulateLastMessage = () => {
    setState((prev) => {
      const lastMessage = prev.messages.at(-1);
      const manipulatedMessage = {
        ...lastMessage,
        message: convertMessageToHtml(lastMessage.message),
      };
      return {
        ...prev,
        messages: [...prev.messages.slice(0, -1), manipulatedMessage],
      };
    });
  };

  const convertMessageToHtml = (message) => {
    const htmlContent = marked.parse(message.trim());
    return  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;

  }

  const addMessageToState = (botMessage) => {
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
    }).then(async (response) => {
      const reader = response.body.getReader();
      let done, value;
      let messageBuffer = "";
      let decoder = new TextDecoder("utf-8");
      let threadIdBuffer = "";
      let threadIdCaptured = false;

      addMessageToState(createChatBotMessage("streaming...")); //You need a dummy message to update
      while (!done) {
        ({ done, value } = await reader.read());
        const chunk = decoder.decode(value);
        if (!threadIdCaptured) {
          for (let char of chunk) {
            if (char === "@") {
              threadIdCaptured = true;
              sessionStorage.setItem("threadId", threadIdBuffer);
              console.log(threadIdBuffer)
            } else if (!threadIdCaptured) {
              threadIdBuffer += char;
            } else {
              messageBuffer += char;
            }
          }
        } else {
          messageBuffer += chunk;
        }

        if (threadIdCaptured) {
          updateLastMessage(messageBuffer);
        }
      }
      manipulateLastMessage();
    });

    /*
      .then((response) => response.text())
      .then((data) => {
        const [threadId, content] = data.split("@START|");
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
      });*/
  };

  // Put the handleHello function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            callAssistant,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
